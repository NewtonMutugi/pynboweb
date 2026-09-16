import type {
  ScheduleDay,
  ScheduleSession,
} from "@/components/schedule-timeline";
import type { Session } from "@/lib/pretalx/types";

// The event has a single room, so sessions run back to back rather than
// in parallel tracks. Each day opens with a keynote, talks fill the
// morning, and workshops fill the afternoon.
const DAY_START_MINUTES = 8 * 60; // 08:00am
const ARRIVAL_MINUTES = 60;
const WARMUP_MINUTES = 30;
const KEYNOTE_MINUTES = 30;
const SHORT_BREAK_MINUTES = 15;
const SESSION_BREAK_MINUTES = 10;
const LUNCH_MINUTES = 60;
const CLOSING_MINUTES = 30;
const DEFAULT_TALK_MINUTES = 45;
const DEFAULT_WORKSHOP_MINUTES = 60;

function formatClock(totalMinutes: number): string {
  const hour24 = Math.floor(totalMinutes / 60) % 24;
  const minute = totalMinutes % 60;
  const period = hour24 >= 12 ? "pm" : "am";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")}${period}`;
}

function formatRange(startMinutes: number, endMinutes: number): string {
  return `${formatClock(startMinutes)} - ${formatClock(endMinutes)}`;
}

class DayBuilder {
  private cursor = DAY_START_MINUTES;
  private readonly sessions: ScheduleSession[] = [];

  addStatic(
    durationMinutes: number,
    title: string,
    type: string,
    speaker = "",
  ) {
    const start = this.cursor;
    this.cursor += durationMinutes;
    this.sessions.push({
      time: formatRange(start, this.cursor),
      title,
      type,
      speaker,
      duration: `${durationMinutes} min`,
    });
  }

  addSession(session: Session, fallbackMinutes: number) {
    const durationMinutes = session.duration ?? fallbackMinutes;
    const start = this.cursor;
    this.cursor += durationMinutes;
    this.sessions.push({
      time: formatRange(start, this.cursor),
      title: session.title,
      type: session.type,
      speaker: session.speakers.map((s) => s.name).join(", "),
      duration: `${durationMinutes} min`,
      speakers: session.speakers.map((s) => ({
        name: s.name,
        avatarUrl: s.avatarUrl,
      })),
    });
  }

  build(date: string): ScheduleDay {
    return { date, sessions: this.sessions };
  }
}

function addSessionsWithBreaks(
  day: DayBuilder,
  sessions: Session[],
  fallbackMinutes: number,
) {
  sessions.forEach((session, index) => {
    day.addSession(session, fallbackMinutes);
    if (index < sessions.length - 1) {
      day.addStatic(SESSION_BREAK_MINUTES, "Breakout", "break");
    }
  });
}

function buildDay({
  date,
  talks,
  workshops,
  isLastDay,
}: {
  date: string;
  talks: Session[];
  workshops: Session[];
  isLastDay: boolean;
}): ScheduleDay {
  const day = new DayBuilder();

  day.addStatic(ARRIVAL_MINUTES, "Arrival", "registration");
  day.addStatic(WARMUP_MINUTES, "Warm Up", "opening");
  day.addStatic(KEYNOTE_MINUTES, "Keynote", "keynote", "To be announced");
  day.addStatic(SHORT_BREAK_MINUTES, "Breakout", "break");

  addSessionsWithBreaks(day, talks, DEFAULT_TALK_MINUTES);

  day.addStatic(LUNCH_MINUTES, "Lunch", "break");

  addSessionsWithBreaks(day, workshops, DEFAULT_WORKSHOP_MINUTES);

  day.addStatic(SHORT_BREAK_MINUTES, "Breakout", "break");
  if (isLastDay) {
    day.addStatic(
      CLOSING_MINUTES,
      "Closing Remarks",
      "closing",
      "PyCon Kenya Organizers",
    );
  }

  return day.build(date);
}

function splitInHalf<T>(items: T[]): [T[], T[]] {
  const mid = Math.ceil(items.length / 2);
  return [items.slice(0, mid), items.slice(mid)];
}

export function buildSchedule(
  sessions: Session[],
  dayDates: [string, string],
): ScheduleDay[] {
  const talks = sessions
    .filter((session) => session.type === "talk")
    .sort((a, b) => a.title.localeCompare(b.title));
  const workshops = sessions
    .filter((session) => session.type === "workshop")
    .sort((a, b) => a.title.localeCompare(b.title));

  const [talksDay1, talksDay2] = splitInHalf(talks);
  const [workshopsDay1, workshopsDay2] = splitInHalf(workshops);

  return [
    buildDay({
      date: dayDates[0],
      talks: talksDay1,
      workshops: workshopsDay1,
      isLastDay: false,
    }),
    buildDay({
      date: dayDates[1],
      talks: talksDay2,
      workshops: workshopsDay2,
      isLastDay: true,
    }),
  ];
}
