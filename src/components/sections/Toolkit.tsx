"use client";

import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useState } from "react";
import { skillLayers, skills } from "@/content/portfolio";
import type { Skill } from "@/content/types";
import { FadeUp } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ease } from "@/lib/motion";

function Inspector({ skill }: { skill: Skill }) {
  const layer = skillLayers.find((l) => l.id === skill.layer)!;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={skill.name}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: ease.out }}
        aria-live="polite"
      >
        <div className="label-mono flex items-center justify-between text-dim">
          <span>
            <span className="text-lime">{layer.index}</span> · {layer.title}
          </span>
          <span>inspect</span>
        </div>
        <h3 className="display-md mt-5">{skill.name}</h3>
        <p className="mt-4 text-lg leading-relaxed text-paper/80">{skill.use}</p>
        {skill.seenIn?.length ? (
          <div className="mt-6">
            <div className="label-mono text-dim">Used in</div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {skill.seenIn.map((s) => (
                <li key={s} className="label-mono rounded-full border border-lime/40 px-3 py-1.5 text-lime">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}

export function Toolkit() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<Skill>(skills.find((s) => s.name === "WebRTC") ?? skills[0]);

  return (
    <section id="toolkit" aria-labelledby="toolkit-title" className="section-y relative border-t border-line">
      <div className="tech-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
      <div className="container-x relative">
        <SectionHeader
          id="toolkit"
          index="02"
          label="Toolkit"
          title="A full stack, layer"
          accent="by layer."
          aside={<span className="hidden sm:inline">Hover · focus · tap</span>}
        />

        <div className="grid grid-cols-12 gap-x-4 gap-y-10">
          <ol className="relative col-span-12 lg:col-span-8" aria-label="Technical skills by architecture layer">
            {/* vertical request line through the stack */}
            <span aria-hidden className="absolute bottom-0 left-[11px] top-0 w-px bg-line-strong md:left-[15px]">
              {!reduce ? (
                <motion.span
                  className="absolute left-[-1px] h-16 w-[3px] rounded-full bg-gradient-to-b from-transparent via-lime to-transparent"
                  animate={{ top: ["-10%", "100%"] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
                />
              ) : null}
            </span>

            {skillLayers.map((layer, li) => {
              const layerSkills = skills.filter((s) => s.layer === layer.id);
              const isActiveLayer = selected.layer === layer.id;
              return (
                <FadeUp as="li" key={layer.id} delay={li * 0.05} className="relative pb-10 pl-10 md:pl-14">
                  <span
                    aria-hidden
                    className={`absolute left-0 top-1 grid h-6 w-6 place-items-center rounded-full border transition-colors duration-500 md:h-8 md:w-8 ${
                      isActiveLayer ? "border-lime bg-lime text-ink" : "border-line-strong bg-ink text-muted"
                    }`}
                  >
                    <span className="label-mono text-[9px] tracking-normal md:text-[10px]">{layer.index}</span>
                  </span>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{layer.title}</h3>
                    <p className="label-mono normal-case tracking-normal text-dim">{layer.caption}</p>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {layerSkills.map((s) => {
                      const isSel = selected.name === s.name;
                      return (
                        <li key={s.name}>
                          <button
                            type="button"
                            aria-pressed={isSel}
                            onClick={() => setSelected(s)}
                            onMouseEnter={() => setSelected(s)}
                            onFocus={() => setSelected(s)}
                            className={`relative min-h-11 rounded-full border px-4 py-2.5 text-sm font-medium transition-[color,border-color,background-color] duration-300 ${
                              isSel
                                ? "border-lime bg-lime text-ink"
                                : "border-line-strong bg-ink-2/60 text-paper/85 hover:border-paper/60 hover:text-paper"
                            }`}
                          >
                            {s.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {/* inline inspector for small screens */}
                  {isActiveLayer ? (
                    <div className="mt-6 rounded-2xl border border-line bg-ink-2/80 p-5 lg:hidden">
                      <Inspector skill={selected} />
                    </div>
                  ) : null}
                </FadeUp>
              );
            })}
          </ol>

          <aside className="col-span-4 hidden lg:block" aria-label="Skill details">
            <div className="sticky top-28 rounded-3xl border border-line bg-ink-2/80 p-8 backdrop-blur">
              <Inspector skill={selected} />
              <p className="label-mono mt-10 border-t border-line pt-5 normal-case tracking-normal text-dim">
                No proficiency bars here — just where each tool has actually shipped.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
