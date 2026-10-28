/** Typed content models. Edit the data in `./portfolio.ts`, not here. */

export type SocialLink = {
  label: string;
  href: string;
  /** Short handle shown in the UI, e.g. "in/ankit-singh" */
  handle: string;
};

export type Profile = {
  name: string;
  firstName: string;
  role: string;
  headline: string[]; // each entry is one line of the hero headline
  tagline: string;
  location: string;
  timezone: string; // IANA zone used for the live clock in the nav
  coordinates: string;
  email: string;
  phone?: string;
  showPhone: boolean;
  availability: { show: boolean; label: string };
  resumeUrl?: string;
  photo: { src: string; alt: string; width: number; height: number };
  /**
   * Layers for the 3D hero portrait, cut from the same photo:
   * `plate` = background with the subject painted out (frame crop),
   * `subject` = transparent cutout, same width, extending above the frame.
   * Ratios are height / width of each image.
   */
  photo3d: { plate: string; subject: string; plateRatio: number; subjectRatio: number };
  intro: string; // large editorial paragraph in the profile section
  summary: string[];
  facts: { label: string; value: string }[];
  numbers: { value: string; label: string; note: string }[];
  socials: SocialLink[];
};

export type SkillLayerId = "client" | "realtime" | "api" | "data" | "ship";

export type Skill = {
  name: string;
  layer: SkillLayerId;
  /** What it is used for in practice — shown on hover / focus / tap */
  use: string;
  /** Where it shows up in real work, from the resume */
  seenIn?: string[];
};

export type SkillLayer = {
  id: SkillLayerId;
  index: string;
  title: string;
  caption: string;
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  category: string;
  year?: string;
  summary: string;
  role: string;
  context: string;
  built: string[];
  challenges: { title: string; detail: string }[];
  stack: string[];
  liveUrl?: string;
  repoUrl?: string;
  /** Picks the abstract generative visual — never presented as a real screenshot */
  visual: "realtime" | "aggregator" | "booking";
  accent: string;
  highlights: { value: string; label: string }[];
};

export type MinorProject = {
  title: string;
  category: string;
  description: string;
  /** Public URL, if the project is live */
  url?: string;
};

export type Role = {
  company: string;
  location: string;
  title: string;
  start: string;
  end: string;
  current?: boolean;
  points: string[];
  stack: string[];
};

export type Education = {
  qualification: string;
  institution: string;
  year: string;
};

export type Principle = {
  index: string;
  title: string;
  body: string;
};

/* ---------- Workshop (interactive architecture lab) ---------- */

export type NodeId =
  | "user"
  | "ui"
  | "api"
  | "server"
  | "db"
  | "socket"
  | "peer"
  | "external";

export type WorkshopNode = {
  id: NodeId;
  label: string;
  sub: string;
  role: string;
};

export type FlowStep = {
  from: NodeId;
  to: NodeId;
  label: string; // short log line, e.g. "POST /api/auth/login"
  detail: string; // human explanation
};

export type Flow = {
  id: string;
  title: string;
  project: string;
  steps: FlowStep[];
};
