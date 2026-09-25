import type { SessionType } from "@/lib/pretalx/types";

export const sessionTypeLabel: Record<SessionType, string> = {
  talk: "talk",
  workshop: "workshop",
  keynote: "keynote",
  remarks: "remarks",
};

export const sessionTypeColor: Record<SessionType, string> = {
  talk: "bg-blue-100 text-blue-800 border-blue-200",
  workshop: "bg-green-100 text-green-800 border-green-200",
  keynote: "bg-purple-100 text-purple-800 border-purple-200",
  remarks: "bg-gray-100 text-gray-800 border-gray-200",
};
