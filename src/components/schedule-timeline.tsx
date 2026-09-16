import {
  Calendar,
  Clock,
  Code,
  Coffee,
  MapPin,
  Mic,
  Users,
} from "lucide-react";
import SpeakerAvatar from "@/components/speaker-avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type ScheduleSpeaker = {
  name: string;
  avatarUrl: string | null;
};

export type ScheduleSession = {
  time: string;
  title: string;
  type: string;
  speaker: string;
  duration: string;
  track?: string;
  speakers?: ScheduleSpeaker[];
};

export type ScheduleDay = {
  date: string;
  sessions: ScheduleSession[];
};

export function getTypeIcon(type: string) {
  switch (type) {
    case "keynote":
      return <Mic className="w-4 h-4" />;
    case "talk":
      return <Code className="w-4 h-4" />;
    case "workshop":
      return <Users className="w-4 h-4" />;
    case "break":
      return <Coffee className="w-4 h-4" />;
    default:
      return <Calendar className="w-4 h-4" />;
  }
}

export function getTypeColor(type: string) {
  switch (type) {
    case "keynote":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "talk":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "workshop":
      return "bg-green-100 text-green-800 border-green-200";
    case "break":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "registration":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "closing":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export default function ScheduleTimeline({
  schedule,
}: {
  schedule: ScheduleDay[];
}) {
  return (
    <div className="space-y-6">
      {schedule.map((day, dayIndex) => (
        <Card key={day.date}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Day {dayIndex + 1} - {day.date}
            </CardTitle>
            <CardDescription>
              Detailed timeline of sessions, workshops, and networking events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Group sessions by time slot */}
              {Object.entries(
                day.sessions.reduce(
                  (acc, session) => {
                    if (!acc[session.time]) {
                      acc[session.time] = [];
                    }
                    acc[session.time].push(session);
                    return acc;
                  },
                  {} as Record<string, ScheduleSession[]>,
                ),
              ).map(([time, sessions]) => (
                <div key={time} className="border rounded-lg p-4 bg-white">
                  <div className="text-sm font-mono text-gray-500 mb-2">
                    {time}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {sessions.map((session) => (
                      <div
                        key={`${day.date}-${session.time}-${session.title}`}
                        className="flex flex-col gap-2 p-3 rounded-md border bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          {getTypeIcon(session.type)}
                          <h3 className="font-semibold">{session.title}</h3>
                          <Badge className={getTypeColor(session.type)}>
                            {session.type}
                          </Badge>
                        </div>
                        {session.speakers && session.speakers.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-3">
                            {session.speakers.map((speaker) => (
                              <div
                                key={speaker.name}
                                className="flex items-center gap-2"
                              >
                                <SpeakerAvatar
                                  name={speaker.name}
                                  avatarUrl={speaker.avatarUrl}
                                  className="size-7 text-xs"
                                />
                                <span className="text-gray-600 text-sm">
                                  {speaker.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          session.speaker && (
                            <p className="text-gray-600 text-sm">
                              Speaker: {session.speaker}
                            </p>
                          )
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Duration: {session.duration}</span>
                          </div>
                          {session.track && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>Track: {session.track}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
