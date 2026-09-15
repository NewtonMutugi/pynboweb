import SpeakerAvatar from "@/components/speaker-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getConfirmedSessions } from "@/lib/pretalx/client";
import type { Session, Speaker } from "@/lib/pretalx/types";
import { sessionTypeColor } from "@/lib/session-style";

type SpeakerWithSessions = Speaker & { sessions: Session[] };

function buildSpeakers(sessions: Session[]): SpeakerWithSessions[] {
  const bySpeaker = new Map<string, SpeakerWithSessions>();

  for (const session of sessions) {
    for (const speaker of session.speakers) {
      const existing = bySpeaker.get(speaker.code);
      if (existing) {
        existing.sessions.push(session);
      } else {
        bySpeaker.set(speaker.code, { ...speaker, sessions: [session] });
      }
    }
  }

  return [...bySpeaker.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export default async function SpeakersPage() {
  const sessions = await getConfirmedSessions();
  const speakers = buildSpeakers(sessions);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Speakers</h1>
        <p className="text-xl text-gray-600">
          Meet the confirmed speakers for PyCon Kenya
        </p>
      </div>

      {speakers.length === 0 ? (
        <p className="text-center text-gray-500">
          Speakers will be announced here once confirmed.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {speakers.map((speaker) => (
            <Card key={speaker.code}>
              <CardContent className="flex flex-col items-center text-center gap-3 p-6">
                <SpeakerAvatar
                  name={speaker.name}
                  avatarUrl={speaker.avatarUrl}
                  className="size-24 text-lg"
                />
                <h3 className="font-semibold text-lg">{speaker.name}</h3>
                <div className="flex flex-col gap-2 w-full">
                  {speaker.sessions.map((session) => (
                    <div
                      key={session.code}
                      className="flex items-center justify-center gap-2 flex-wrap"
                    >
                      <span className="text-sm text-gray-600">
                        {session.title}
                      </span>
                      <Badge className={sessionTypeColor[session.type]}>
                        {session.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
