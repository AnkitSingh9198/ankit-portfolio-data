"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useRef } from "react";
import { principles } from "@/content/portfolio";
import { FadeUp, MaskText } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Approach() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });
  const radius = useTransform(scrollYProgress, [0, 1], [reduce ? 28 : 64, 28]);
  const inset = useTransform(scrollYProgress, [0, 1], [reduce ? "0%" : "4%", "0%"]);

  return (
    <section ref={ref} id="approach" aria-labelledby="approach-title" className="on-paper relative py-2">
      <motion.div
        style={{ borderRadius: radius, marginInline: inset }}
        className="relative overflow-hidden bg-paper text-ink"
      >
        <div className="container-x section-y">
          <SectionHeader id="approach" index="06" label="How I work" title="Quiet engineering," accent="that holds up." tone="light" />

          <div className="grid grid-cols-12 gap-x-6 gap-y-12">
            <div className="col-span-12 lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <p className="serif-accent text-[clamp(2rem,4vw,3.6rem)] leading-[1.02]">
                  <MaskText text="The interesting work lives between the design file and the database." />
                </p>
                <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-ink/70">
                  Most of what makes software feel good is invisible: the error that&apos;s handled, the query that&apos;s
                  indexed, the bundle that&apos;s split. These are the habits I bring to every project.
                </p>
              </div>
            </div>

            <ol className="col-span-12 lg:col-span-7">
              {principles.map((p, i) => (
                <FadeUp as="li" key={p.index} delay={i * 0.04} className="group border-t border-ink/15 last:border-b">
                  <div className="grid grid-cols-[3rem_1fr] gap-4 py-8 md:grid-cols-[4rem_1fr]">
                    <span className="label-mono pt-2 text-ink/50 transition-colors group-hover:text-ink">{p.index}</span>
                    <div>
                      <h3 className="text-3xl font-semibold tracking-[-0.03em] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-2 md:text-4xl">
                        {p.title}
                      </h3>
                      <p className="mt-3 max-w-[52ch] text-lg leading-relaxed text-ink/70">{p.body}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </ol>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/** Infinite marquee of the core stack. */
export function StackMarquee() {
  const core = ["React.js", "TypeScript", "Node.js", "Express.js", "MongoDB", "WebRTC", "Socket.IO", "React Native", "REST APIs", "JWT"];
  const row = [...core, ...core];
  return (
    <div aria-hidden className="overflow-hidden border-y border-line py-6">
      <div className="marquee-track flex w-max whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 pr-10 font-display text-4xl font-semibold tracking-[-0.03em] text-paper/80 md:text-6xl">
            {t}
            <span className="text-lime">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
