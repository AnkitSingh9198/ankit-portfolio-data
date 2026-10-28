import { IntroOverlay, IntroProvider } from "@/components/Intro";
import { Nav } from "@/components/Nav";
import { Cursor } from "@/components/ui/Cursor";
import { MotionProvider } from "@/components/MotionProvider";
import { Hero } from "@/components/sections/Hero";
import { Profile } from "@/components/sections/Profile";
import { Toolkit } from "@/components/sections/Toolkit";
import { Workshop } from "@/components/sections/Workshop";
import { Work } from "@/components/sections/Work";
import { Experience } from "@/components/sections/Experience";
import { Approach, StackMarquee } from "@/components/sections/Approach";
import { Contact } from "@/components/sections/Contact";
import { education, experience, profile } from "@/content/portfolio";
import { siteDescription, siteUrl } from "@/lib/site";

/** Structured data — only facts present on the resume. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  description: siteDescription,
  url: siteUrl,
  image: `${siteUrl}${profile.photo.src}`,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Noida", addressRegion: "Uttar Pradesh", addressCountry: "IN" },
  worksFor: { "@type": "Organization", name: experience[0]?.company },
  alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.institution })),
  sameAs: profile.socials.map((s) => s.href),
  knowsAbout: ["React.js", "TypeScript", "Node.js", "Express.js", "MongoDB", "WebRTC", "React Native"],
};

export default function Home() {
  return (
    <MotionProvider>
      <IntroProvider>
        <IntroOverlay name={profile.name} role={profile.role} />
        <Cursor />
        <Nav />
        <main id="main">
          <Hero />
          <StackMarquee />
          <Profile />
          <Toolkit />
          <Workshop />
          <Work />
          <Experience />
          <Approach />
          <Contact />
        </main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </IntroProvider>
    </MotionProvider>
  );
}
