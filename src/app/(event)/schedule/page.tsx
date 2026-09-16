import { Calendar } from "lucide-react";
import ScheduleTimeline from "@/components/schedule-timeline";
import { getConfirmedSessions, getEventInfo } from "@/lib/pretalx/client";
import { buildSchedule } from "@/lib/schedule-template";

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function SchedulePage() {
  const [event, sessions] = await Promise.all([
    getEventInfo(),
    getConfirmedSessions(),
  ]);

  const schedule = buildSchedule(sessions, [
    formatDate(event.date_from),
    formatDate(event.date_to),
  ]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Schedule</h1>
        <p className="text-xl text-gray-600 mb-4">{event.name.en}</p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>
            {formatDate(event.date_from)} - {formatDate(event.date_to)}
          </span>
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm">
        Keynote speakers and a few sessions are still being confirmed and will
        be announced closer to the event.
      </p>

      <ScheduleTimeline schedule={schedule} />
    </div>
  );
}
