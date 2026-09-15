import type { SessionType } from "@/lib/pretalx/types";

export const sessionTypeLabel: Record<SessionType, string> = {
  talk: "talk",
  workshop: "workshop",
};

export const sessionTypeColor: Record<SessionType, string> = {
  talk: "bg-blue-100 text-blue-800 border-blue-200",
  workshop: "bg-green-100 text-green-800 border-green-200",
};
