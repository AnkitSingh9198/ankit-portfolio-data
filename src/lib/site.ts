import { profile } from "@/content/portfolio";

/** Public site URL. Set NEXT_PUBLIC_SITE_URL in production (see .env.example). */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const siteTitle = `${profile.name} — ${profile.role}`;
export const siteDescription =
  "Ankit Singh is a full stack developer in Noida building production web and mobile apps with React.js, TypeScript, Node.js, Express.js and MongoDB — from WebRTC consultations to insurer API integrations.";
