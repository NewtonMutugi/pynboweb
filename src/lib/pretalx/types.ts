export type PretalxPage<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type PretalxEvent = {
  slug: string;
  name: { en: string };
  is_public: boolean;
  date_from: string;
  date_to: string;
  timezone: string;
};

export type PretalxSubmissionType = {
  id: number;
  name: { en: string };
};

export type PretalxSpeaker = {
  code: string;
  name: string;
  biography: string | null;
  avatar_url: string | null;
};

export type PretalxSubmission = {
  code: string;
  title: string;
  speakers: string[];
  submission_type: number;
  state: string;
  duration: number | null;
  abstract: string | null;
};

export type SessionType = "talk" | "workshop";

export type Speaker = {
  code: string;
  name: string;
  biography: string | null;
  avatarUrl: string | null;
};

export type Session = {
  code: string;
  title: string;
  type: SessionType;
  duration: number | null;
  abstract: string | null;
  speakers: Speaker[];
};
