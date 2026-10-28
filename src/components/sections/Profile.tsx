"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useRef } from "react";
import { profile } from "@/content/portfolio";
import { FadeUp } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{" "}
    </motion.span>
  );
}

/** Paragraph whose words light up as you scroll through it. */
function ScrollLitParagraph({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");
  if (reduce) return <p className={className}>{text}</p>;
  return (
    <p ref={ref} className={className} aria-label={text}>
      <span aria-hidden>
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </span>
    </p>
  );
}

export function Profile() {
  return (
    <section id="profile" aria-labelledby="profile-title" className="section-y relative">
      <div className="container-x">
        <SectionHeader id="profile" index="01" label="Profile" title="From schema to screen," accent="end to end." />

        <div className="grid grid-cols-12 gap-x-4 gap-y-12">
          <aside className="col-span-12 lg:col-span-3">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-6 border-t border-line pt-6 lg:grid-cols-1 lg:sticky lg:top-28">
              {profile.facts.map((f, i) => (
                <FadeUp key={f.label} delay={i * 0.06}>
                  <dt className="label-mono text-dim">{f.label}</dt>
                  <dd className="mt-1 text-base text-paper">{f.value}</dd>
                </FadeUp>
              ))}
            </dl>
          </aside>

          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            <ScrollLitParagraph
              text={profile.intro}
              className="text-[clamp(1.6rem,3.3vw,3rem)] font-medium leading-[1.12] tracking-[-0.025em] text-paper"
            />

            <div className="mt-14 grid gap-8 md:grid-cols-2">
              {profile.summary.map((p, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <p className="text-lg leading-relaxed text-paper/75">{p}</p>
                </FadeUp>
              ))}
            </div>

            <ul className="mt-16 grid grid-cols-1 border-t border-line sm:grid-cols-3" aria-label="Selected facts">
              {profile.numbers.map((n, i) => (
                <FadeUp
                  as="li"
                  key={n.label}
                  delay={i * 0.08}
                  className="border-b border-line py-6 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0"
                >
                  <div className="font-display text-6xl font-bold tracking-[-0.05em] text-lime md:text-7xl">{n.value}</div>
                  <div className="mt-2 font-semibold">{n.label}</div>
                  <div className="label-mono mt-2 normal-case tracking-normal text-dim">{n.note}</div>
                </FadeUp>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
