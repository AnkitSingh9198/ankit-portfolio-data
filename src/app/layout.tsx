import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/wdth.css";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { profile } from "@/content/portfolio";
import { siteDescription, siteTitle, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: `%s · ${profile.name}` },
  description: siteDescription,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name }],
  creator: profile.name,
  keywords: [
    "Ankit Singh",
    "Full Stack Developer",
    "React.js developer",
    "TypeScript",
    "Node.js",
    "Express.js",
    "MongoDB",
    "WebRTC",
    "React Native",
    "Noida",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: `${profile.name} — Portfolio`,
    title: siteTitle,
    description: siteDescription,
    firstName: "Ankit",
    lastName: "Singh",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${profile.name} — ${profile.role}` }],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/** Plays the intro once per browser session — runs before paint to avoid a flash. */
const introScript = `try{if(sessionStorage.getItem('as-intro')){document.documentElement.classList.add('intro-seen')}else{sessionStorage.setItem('as-intro','1')}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="grain">{children}</body>
    </html>
  );
}
