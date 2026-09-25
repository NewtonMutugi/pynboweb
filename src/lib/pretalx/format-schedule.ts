import type {
  ScheduleDay,
  ScheduleSession,
} from "@/components/schedule-timeline";
import type { PretalxSchedule } from "@/lib/pretalx/types";

function formatTime(iso: string, timeZone: string): string {
  return new Date(iso)
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone,
    })
    .replace(/\s/g, "")
    .toLowerCase();
}

// dateKey is a plain "YYYY-MM-DD" already local to the event (Pretalx
// returns start/end with the event's UTC offset baked in), so it's
// formatted directly rather than re-parsed against any timezone.
function formatDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatPublishedSchedule(
  schedule: PretalxSchedule,
  timeZone: string,
): ScheduleDay[] {
  const scheduledSlots = schedule.slots
    .filter((slot) => slot.start && slot.end && slot.room)
    .sort((a, b) => (a.start as string).localeCompare(b.start as string));

  const sessionsByDate = new Map<string, ScheduleSession[]>();

  for (const slot of scheduledSlots) {
    const start = slot.start as string;
    const end = slot.end as string;
    const dateKey = start.slice(0, 10);
    const time = `${formatTime(start, timeZone)} - ${formatTime(end, timeZone)}`;

    const session: ScheduleSession = slot.submission
      ? {
          time,
          title: slot.submission.title,
          type: slot.submission.submission_type.name.en.toLowerCase(),
          speaker: slot.submission.speakers.map((s) => s.name).join(", "),
          duration: `${slot.duration} min`,
          speakers: slot.submission.speakers.map((s) => ({
            name: s.name,
            avatarUrl: s.avatar_url,
          })),
        }
      : {
          time,
          title: slot.description?.en || "Break",
          type: "break",
          speaker: "",
          duration: `${slot.duration} min`,
        };

    const existing = sessionsByDate.get(dateKey);
    if (existing) {
      existing.push(session);
    } else {
      sessionsByDate.set(dateKey, [session]);
    }
  }

  return [...sessionsByDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, sessions]) => ({
      date: formatDateKey(dateKey),
      sessions,
    }));
}
