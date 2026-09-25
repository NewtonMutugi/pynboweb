import { Calendar } from "lucide-react";
import ScheduleTimeline, {
  type ScheduleDay,
} from "@/components/schedule-timeline";
import {
  getPublishedSchedule,
  PretalxRequestError,
} from "@/lib/pretalx/client";
import { formatPublishedSchedule } from "@/lib/pretalx/format-schedule";
import type { PretalxEvent } from "@/lib/pretalx/types";

// The schedule depends on live Pretalx data, so it can't be prerendered
// at build time (e.g. Pretalx credentials aren't available in CI).
export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function SchedulePage() {
  let event: PretalxEvent | null = null;
  let schedule: ScheduleDay[] = [];
  let loadError = false;

  try {
    const data = await getPublishedSchedule();
    event = data.event;
    schedule = formatPublishedSchedule(data.schedule, data.event.timezone);
  } catch (error) {
    // A 404 here just means Pretalx hasn't released a schedule yet, which
    // is an expected, normal state. Anything else (auth, network, 5xx) is
    // a real failure and shouldn't be shown as "not released yet".
    if (!(error instanceof PretalxRequestError && error.status === 404)) {
      loadError = true;
    }
    console.error("Failed to load Pretalx schedule data", error);
  }

  if (loadError) {
    return (
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Schedule</h1>
        <p className="text-gray-500">
          We couldn't load the schedule right now. Please try again shortly.
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Schedule</h1>
        <p className="text-gray-500">
          The schedule will be published here once it's released.
        </p>
      </div>
    );
  }

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

      {schedule.length === 0 ? (
        <p className="text-center text-gray-500">
          The schedule will be published here once it's released.
        </p>
      ) : (
        <ScheduleTimeline schedule={schedule} />
      )}
    </div>
  );
}
