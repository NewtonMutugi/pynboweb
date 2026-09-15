import { Clock, Code, Users } from "lucide-react";
import type React from "react";
import SpeakerAvatar from "@/components/speaker-avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getConfirmedSessions } from "@/lib/pretalx/client";
import type { Session, SessionType } from "@/lib/pretalx/types";
import { sessionTypeColor } from "@/lib/session-style";

const sectionIcon: Record<SessionType, React.ReactNode> = {
  talk: <Code className="w-5 h-5" />,
  workshop: <Users className="w-5 h-5" />,
};

const sectionTitle: Record<SessionType, string> = {
  talk: "Talks",
  workshop: "Workshops",
};

function SessionCard({ session }: { session: Session }) {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-md border bg-gray-50">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">{session.title}</h3>
        <Badge className={sessionTypeColor[session.type]}>{session.type}</Badge>
      </div>
      {session.speakers.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          {session.speakers.map((speaker) => (
            <div key={speaker.code} className="flex items-center gap-2">
              <SpeakerAvatar
                name={speaker.name}
                avatarUrl={speaker.avatarUrl}
                className="size-8 text-xs"
              />
              <span className="text-gray-600 text-sm">{speaker.name}</span>
            </div>
          ))}
        </div>
      )}
      {session.duration != null && (
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Duration: {session.duration} min</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default async function SchedulePage() {
  const sessions = await getConfirmedSessions();
  const talks = sessions.filter((session) => session.type === "talk");
  const workshops = sessions.filter((session) => session.type === "workshop");
  const groups: { type: SessionType; sessions: Session[] }[] = (
    [
      { type: "talk", sessions: talks },
      { type: "workshop", sessions: workshops },
    ] satisfies { type: SessionType; sessions: Session[] }[]
  ).filter((group) => group.sessions.length > 0);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Schedule</h1>
        <p className="text-xl text-gray-600">
          Confirmed talks and workshops for PyCon Kenya
        </p>
      </div>

      {groups.length === 0 && (
        <p className="text-center text-gray-500">
          The schedule will be published here once sessions are confirmed.
        </p>
      )}

      {groups.map((group) => (
        <Card key={group.type}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {sectionIcon[group.type]}
              {sectionTitle[group.type]}
            </CardTitle>
            <CardDescription>
              {group.sessions.length} confirmed{" "}
              {group.sessions.length === 1 ? group.type : `${group.type}s`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {group.sessions.map((session) => (
                <SessionCard key={session.code} session={session} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
