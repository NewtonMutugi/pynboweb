import type {
  PretalxEvent,
  PretalxPage,
  PretalxSpeaker,
  PretalxSubmission,
  PretalxSubmissionType,
  Session,
} from "./types";

const API_URL = process.env.PRETALX_API_URL;
const API_KEY = process.env.PRETALX_API_KEY;

async function fetchJson<T>(url: string): Promise<T> {
  if (!API_KEY) {
    throw new Error("PRETALX_API_KEY is not configured");
  }
  const response = await fetch(url, {
    headers: { Authorization: `Token ${API_KEY}` },
    next: { revalidate: 300 },
  });
  if (!response.ok) {
    throw new Error(`Pretalx request failed (${response.status}): ${url}`);
  }
  return response.json() as Promise<T>;
}

async function fetchAllPages<T>(url: string): Promise<T[]> {
  const results: T[] = [];
  let next: string | null = url;
  while (next) {
    const page: PretalxPage<T> = await fetchJson<PretalxPage<T>>(next);
    results.push(...page.results);
    next = page.next;
  }
  return results;
}

async function getEventBaseUrl(): Promise<string> {
  if (!API_URL) {
    throw new Error("PRETALX_API_URL is not configured");
  }
  const events = await fetchJson<PretalxEvent[]>(API_URL);
  const event = events.find((e) => e.is_public) ?? events[0];
  if (!event) {
    throw new Error("No Pretalx event found");
  }
  return `${API_URL}${event.slug}`;
}

function resolveSessionType(
  submissionTypeId: number,
  typeNameById: Map<number, string>,
): Session["type"] | null {
  const name = typeNameById.get(submissionTypeId)?.toLowerCase();
  if (name === "talk") return "talk";
  if (name === "workshop") return "workshop";
  return null;
}

export async function getConfirmedSessions(): Promise<Session[]> {
  const base = await getEventBaseUrl();

  const [submissionTypes, submissions] = await Promise.all([
    fetchAllPages<PretalxSubmissionType>(`${base}/submission-types/`),
    fetchAllPages<PretalxSubmission>(
      `${base}/submissions/?state=confirmed&limit=100`,
    ),
  ]);
  const typeNameById = new Map(
    submissionTypes.map((type) => [type.id, type.name.en]),
  );

  const speakerCodes = new Set<string>();
  for (const submission of submissions) {
    for (const code of submission.speakers) {
      speakerCodes.add(code);
    }
  }

  const speakers = await Promise.all(
    [...speakerCodes].map((code) =>
      fetchJson<PretalxSpeaker>(`${base}/speakers/${code}/`),
    ),
  );
  const speakerByCode = new Map(speakers.map((s) => [s.code, s]));

  const sessions: Session[] = [];
  for (const submission of submissions) {
    const type = resolveSessionType(submission.submission_type, typeNameById);
    if (!type) continue;

    sessions.push({
      code: submission.code,
      title: submission.title,
      type,
      duration: submission.duration,
      abstract: submission.abstract,
      speakers: submission.speakers
        .map((code) => speakerByCode.get(code))
        .filter((speaker): speaker is PretalxSpeaker => Boolean(speaker))
        .map((speaker) => ({
          code: speaker.code,
          name: speaker.name,
          biography: speaker.biography,
          avatarUrl: speaker.avatar_url,
        })),
    });
  }

  return sessions;
}
