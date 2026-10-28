"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useRef } from "react";
import { certifications, education, experience } from "@/content/portfolio";
import { FadeUp } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Experience() {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.75", "end 0.6"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="experience" aria-labelledby="experience-title" className="section-y relative border-t border-line">
      <div className="container-x">
        <SectionHeader id="experience" index="05" label="Experience" title="Where I've" accent="been building." />

        <ol ref={listRef} className="relative">
          {/* timeline rail + scroll-linked progress */}
          <span aria-hidden className="absolute bottom-0 left-[7px] top-2 w-px bg-line-strong md:left-[calc(25%+7px)]" />
          <motion.span
            aria-hidden
            className="absolute left-[7px] top-2 w-px origin-top bg-lime md:left-[calc(25%+7px)]"
            style={{ bottom: 0, scaleY: reduce ? 1 : progress }}
          />

          {experience.map((role, i) => (
            <li key={role.company} className="relative grid grid-cols-1 gap-4 pb-20 pl-10 last:pb-0 md:grid-cols-4 md:gap-0 md:pl-0">
              <FadeUp className="md:pr-12 md:text-right">
                <div className="label-mono text-muted">
                  {role.start} — <span className={role.current ? "text-lime" : ""}>{role.end}</span>
                </div>
                <div className="label-mono mt-1 text-dim">{role.location}</div>
              </FadeUp>

              {/* marker */}
              <span aria-hidden className="absolute left-0 top-1 md:left-[25%]">
                <span className="relative flex h-[15px] w-[15px] items-center justify-center">
                  {role.current ? <span className="pulse-ring absolute inset-0 rounded-full bg-lime/60" /> : null}
                  <motion.span
                    className="relative h-[15px] w-[15px] rounded-full border-2 border-lime bg-ink"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 * i }}
                  />
                </span>
              </span>

              <div className="md:col-span-3 md:pl-12">
                <FadeUp>
                  <h3 className="display-md">
                    {role.company}
                    {role.current ? (
                      <span className="label-mono ml-3 inline-block translate-y-[-0.4em] rounded-full bg-lime px-2.5 py-1 align-middle text-[10px] text-ink">
                        Now
                      </span>
                    ) : null}
                  </h3>
                  <p className="mt-2 text-lg text-paper/70">{role.title}</p>
                </FadeUp>
                <ul className="mt-6 max-w-3xl">
                  {role.points.map((p, j) => (
                    <FadeUp as="li" key={j} delay={0.05 * j} className="flex gap-4 border-t border-line py-4 leading-relaxed text-paper/80">
                      <span aria-hidden className="mt-[0.65em] h-px w-4 shrink-0 bg-lime" />
                      {p}
                    </FadeUp>
                  ))}
                </ul>
                <FadeUp className="mt-5 flex flex-wrap gap-1.5">
                  {role.stack.map((s) => (
                    <span key={s} className="label-mono rounded-full border border-line-strong px-2.5 py-1 text-[10px] text-muted">
                      {s}
                    </span>
                  ))}
                </FadeUp>
              </div>
            </li>
          ))}
        </ol>

        {/* education */}
        <div className="mt-32 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="label-mono text-muted md:pr-12 md:text-right">
            <span className="text-lime">05.1</span> Education &amp; certifications
          </div>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:col-span-3 md:ml-12 md:grid-cols-2">
            {[...education.map((e) => ({ ...e, kind: "Degree" })), ...certifications.map((c) => ({ ...c, kind: "Certification" }))].map(
              (e, i) => (
                <FadeUp key={e.qualification} delay={i * 0.06} className="bg-ink p-6 md:p-8">
                  <div className="label-mono flex justify-between text-dim">
                    <span>{e.kind}</span>
                    <span className="text-lime">{e.year}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold leading-tight tracking-tight md:text-2xl">{e.qualification}</h3>
                  {/* entries whose institution starts with "TODO" are hidden until filled in */}
                  {!e.institution.startsWith("TODO") ? <p className="mt-2 text-paper/60">{e.institution}</p> : null}
                </FadeUp>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
