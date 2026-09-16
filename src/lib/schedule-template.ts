import type {
  ScheduleDay,
  ScheduleSession,
} from "@/components/schedule-timeline";
import type { Session } from "@/lib/pretalx/types";

type StaticEntry = {
  kind: "static";
  item: Omit<ScheduleSession, "speakers">;
};

type ContentEntry = {
  kind: "content";
  time: string;
  duration: string;
  tracks: number;
};

type TemplateEntry = StaticEntry | ContentEntry;

function staticEntry(item: Omit<ScheduleSession, "speakers">): StaticEntry {
  return { kind: "static", item };
}

// Mirrors the timeslot structure used for PyCon Kenya 2025 (see
// src/app/(report)/2025/page.tsx), so the live schedule keeps the same
// rhythm of arrival, keynote, talk/workshop blocks, breaks and lunch.
const day1Template: TemplateEntry[] = [
  staticEntry({
    time: "08:00am - 09:15am",
    title: "Arrival",
    type: "registration",
    speaker: "",
    duration: "1hr 15 min",
  }),
  staticEntry({
    time: "09:15am - 09:45am",
    title: "Warm Up",
    type: "opening",
    speaker: "",
    duration: "30 min",
  }),
  staticEntry({
    time: "09:45am - 10:15am",
    title: "Keynote",
    type: "keynote",
    speaker: "To be announced",
    duration: "30 min",
  }),
  staticEntry({
    time: "10:15am - 10:30am",
    title: "Breakout",
    type: "break",
    speaker: "",
    duration: "15 min",
  }),
  { kind: "content", time: "10:30am - 11:30am", duration: "60 min", tracks: 1 },
  staticEntry({
    time: "11:30am - 11:40am",
    title: "Breakout",
    type: "break",
    speaker: "",
    duration: "10 min",
  }),
  { kind: "content", time: "11:40am - 12:40pm", duration: "60 min", tracks: 2 },
  staticEntry({
    time: "12:40pm - 12:50pm",
    title: "Breakout",
    type: "break",
    speaker: "",
    duration: "10 min",
  }),
  { kind: "content", time: "12:50pm - 1:35pm", duration: "45 min", tracks: 2 },
  staticEntry({
    time: "1:35pm - 2:50pm",
    title: "Lunch",
    type: "break",
    speaker: "",
    duration: "1hr 15 min",
  }),
  { kind: "content", time: "2:50pm - 3:35pm", duration: "45 min", tracks: 2 },
  staticEntry({
    time: "3:35pm - 3:50pm",
    title: "Break",
    type: "break",
    speaker: "",
    duration: "15 min",
  }),
  { kind: "content", time: "3:50pm - 4:35pm", duration: "45 min", tracks: 2 },
  staticEntry({
    time: "4:35pm - 4:50pm",
    title: "Breakout",
    type: "break",
    speaker: "",
    duration: "15 min",
  }),
];

const day2Template: TemplateEntry[] = [
  staticEntry({
    time: "08:00am - 09:00am",
    title: "Arrival",
    type: "registration",
    speaker: "",
    duration: "1hr",
  }),
  staticEntry({
    time: "09:00am - 09:30am",
    title: "Warm Up",
    type: "opening",
    speaker: "",
    duration: "30 min",
  }),
  staticEntry({
    time: "09:30am - 10:30am",
    title: "Lightning Talks",
    type: "opening",
    speaker: "",
    duration: "60 min",
  }),
  staticEntry({
    time: "10:30am - 10:45am",
    title: "Breakout",
    type: "break",
    speaker: "",
    duration: "15 min",
  }),
  { kind: "content", time: "10:45am - 11:45am", duration: "60 min", tracks: 2 },
  staticEntry({
    time: "11:45am - 11:55am",
    title: "Breakout",
    type: "break",
    speaker: "",
    duration: "10 min",
  }),
  { kind: "content", time: "11:55am - 12:55pm", duration: "60 min", tracks: 2 },
  staticEntry({
    time: "12:55pm - 1:05pm",
    title: "Breakout",
    type: "break",
    speaker: "",
    duration: "10 min",
  }),
  { kind: "content", time: "1:05pm - 1:50pm", duration: "45 min", tracks: 2 },
  staticEntry({
    time: "1:50pm - 3:05pm",
    title: "Lunch",
    type: "break",
    speaker: "",
    duration: "1hr 15 min",
  }),
  { kind: "content", time: "3:05pm - 3:50pm", duration: "45 min", tracks: 2 },
  staticEntry({
    time: "3:50pm - 4:00pm",
    title: "Break",
    type: "break",
    speaker: "",
    duration: "10 min",
  }),
  staticEntry({
    time: "4:00pm - 5:00pm",
    title: "Lightning Talks & Community",
    type: "talk",
    speaker: "",
    duration: "60 min",
  }),
  staticEntry({
    time: "5:00pm - 5:30pm",
    title: "Closing Remarks",
    type: "closing",
    speaker: "PyCon Kenya Organizers",
    duration: "30 min",
  }),
];

function fillDay(
  template: TemplateEntry[],
  date: string,
  queue: Session[],
): ScheduleDay {
  const sessions: ScheduleSession[] = [];

  for (const entry of template) {
    if (entry.kind === "static") {
      sessions.push({ ...entry.item });
      continue;
    }

    for (let i = 0; i < entry.tracks; i++) {
      const session = queue.shift();
      if (session) {
        sessions.push({
          time: entry.time,
          title: session.title,
          type: session.type,
          speaker: session.speakers.map((s) => s.name).join(", "),
          duration: session.duration
            ? `${session.duration} min`
            : entry.duration,
          speakers: session.speakers.map((s) => ({
            name: s.name,
            avatarUrl: s.avatarUrl,
          })),
        });
      } else {
        sessions.push({
          time: entry.time,
          title: "To be announced",
          type: "talk",
          speaker: "",
          duration: entry.duration,
        });
      }
    }
  }

  return { date, sessions };
}

export function buildSchedule(
  sessions: Session[],
  dayDates: [string, string],
): ScheduleDay[] {
  // Fill talks and workshops in a stable, deterministic order.
  const queue = [...sessions].sort((a, b) => a.title.localeCompare(b.title));

  const day1 = fillDay(day1Template, dayDates[0], queue);
  const day2 = fillDay(day2Template, dayDates[1], queue);

  // If there are more confirmed sessions than timeslots, surface them
  // instead of silently dropping them from the schedule.
  if (queue.length > 0) {
    day2.sessions.push(
      ...queue.map((session) => ({
        time: "Additional sessions (time to be announced)",
        title: session.title,
        type: session.type,
        speaker: session.speakers.map((s) => s.name).join(", "),
        duration: session.duration ? `${session.duration} min` : "",
        speakers: session.speakers.map((s) => ({
          name: s.name,
          avatarUrl: s.avatarUrl,
        })),
      })),
    );
  }

  return [day1, day2];
}
