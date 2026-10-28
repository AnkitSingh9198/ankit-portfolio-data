"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ArrowUpRight, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { moreProjects, projects } from "@/content/portfolio";
import type { Project } from "@/content/types";
import { FadeUp, MaskText, WipeReveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectModal } from "./ProjectModal";
import { ProjectVisual } from "./ProjectVisual";

/** Visual panel with a subtle 3D tilt that follows the mouse. */
function TiltPanel({ project, onOpen, className }: { project: Project; onOpen: () => void; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 140, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 140, damping: 18 });

  return (
    <div className={`[perspective:1400px] ${className ?? ""}`}>
      <WipeReveal className="h-full">
        <motion.button
          ref={ref}
          type="button"
          onClick={onOpen}
          data-cursor="View"
          aria-label={`Open the ${project.title} case study`}
          onPointerMove={(e) => {
            if (reduce || e.pointerType !== "mouse" || !ref.current) return;
            const r = ref.current.getBoundingClientRect();
            ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
            rx.set(-((e.clientY - r.top) / r.height - 0.5) * 6);
          }}
          onPointerLeave={() => {
            rx.set(0);
            ry.set(0);
          }}
          style={{ rotateX: rx, rotateY: ry }}
          className="group relative block h-full w-full overflow-hidden rounded-[22px] border border-line text-left"
        >
          <div className="h-full w-full transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]">
            <ProjectVisual kind={project.visual} accent={project.accent} />
          </div>
          <span className="label-mono absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1.5 text-paper backdrop-blur">
            {project.index} / {project.title}
          </span>
          <span className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-lime text-ink opacity-0 transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
            <Plus size={18} />
          </span>
        </motion.button>
      </WipeReveal>
    </div>
  );
}

function ProjectMeta({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <p className="text-lg leading-relaxed text-paper/80">{project.summary}</p>
      <dl className="mt-8 grid grid-cols-3 gap-3 border-y border-line py-5">
        {project.highlights.map((h) => (
          <div key={h.label}>
            <dt className="sr-only">{h.label}</dt>
            <dd>
              <span className="block font-display text-2xl font-bold tracking-tight md:text-3xl" style={{ color: project.accent }}>
                {h.value}
              </span>
              <span className="label-mono mt-1 block normal-case tracking-normal text-dim">{h.label}</span>
            </dd>
          </div>
        ))}
      </dl>
      <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Tech stack">
        {project.stack.map((s) => (
          <li key={s} className="label-mono rounded-full border border-line-strong px-2.5 py-1 text-[10px] text-muted">
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-3 lg:mt-auto lg:pt-8">
        <button
          type="button"
          onClick={onOpen}
          className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-paper px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-lime"
        >
          Read case study
          <Plus size={16} className="transition-transform duration-500 group-hover:rotate-90" />
        </button>
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm font-semibold transition-colors hover:border-lime hover:text-lime"
          >
            Visit live site
            <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}

function ProjectTitle({ project }: { project: Project }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-line pb-6">
      <h3 className="display-lg">
        <span className="label-mono mr-4 align-top text-sm text-lime">{project.index}</span>
        <MaskText text={project.title} />
      </h3>
      <span className="label-mono text-muted">{project.category}</span>
    </div>
  );
}

export function Work() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const pushedRef = useRef(false);

  // Deep links (#work/dr-dermat) and back-button support
  useEffect(() => {
    const sync = () => {
      const m = window.location.hash.match(/^#work\/([\w-]+)$/);
      const slug = m && projects.some((p) => p.slug === m[1]) ? m[1] : null;
      setOpenSlug(slug);
      if (!slug) pushedRef.current = false;
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const open = useCallback((slug: string) => {
    const url = `#work/${slug}`;
    if (openSlug) {
      window.history.replaceState({ project: slug }, "", url);
    } else {
      window.history.pushState({ project: slug }, "", url);
      pushedRef.current = true;
    }
    setOpenSlug(slug);
  }, [openSlug]);

  const close = useCallback(() => {
    if (pushedRef.current) {
      pushedRef.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, "", "#work");
      setOpenSlug(null);
    }
  }, []);

  const [p1, p2, p3] = projects;
  const current = projects.find((p) => p.slug === openSlug) ?? null;

  return (
    <section id="work" aria-labelledby="work-title" className="section-y relative border-t border-line">
      <div className="container-x">
        <SectionHeader
          id="work"
          index="04"
          label="Selected work"
          title="Production systems,"
          accent="shipped & running."
          aside={<span className="hidden sm:inline">{projects.length} case studies</span>}
        />

        <div className="flex flex-col gap-28 md:gap-40">
          {/* 01 — visual left, wide */}
          {p1 ? (
            <article aria-labelledby={`${p1.slug}-h`}>
              <div id={`${p1.slug}-h`}>
                <ProjectTitle project={p1} />
              </div>
              <div className="grid grid-cols-12 gap-x-6 gap-y-8">
                <TiltPanel project={p1} onOpen={() => open(p1.slug)} className="col-span-12 aspect-[16/10] lg:col-span-7" />
                <FadeUp className="col-span-12 lg:col-span-5 lg:pl-6">
                  <ProjectMeta project={p1} onOpen={() => open(p1.slug)} />
                </FadeUp>
              </div>
            </article>
          ) : null}

          {/* 02 — text left, tall visual right, offset */}
          {p2 ? (
            <article aria-labelledby={`${p2.slug}-h`} className="lg:pl-[8%]">
              <div id={`${p2.slug}-h`}>
                <ProjectTitle project={p2} />
              </div>
              <div className="grid grid-cols-12 gap-x-6 gap-y-8">
                <FadeUp className="order-2 col-span-12 lg:order-1 lg:col-span-5 lg:pr-6">
                  <ProjectMeta project={p2} onOpen={() => open(p2.slug)} />
                </FadeUp>
                <TiltPanel project={p2} onOpen={() => open(p2.slug)} className="order-1 col-span-12 aspect-[16/11] lg:order-2 lg:col-span-7 lg:-mt-24" />
              </div>
            </article>
          ) : null}

          {/* 03 — full-bleed panoramic */}
          {p3 ? (
            <article aria-labelledby={`${p3.slug}-h`}>
              <div id={`${p3.slug}-h`}>
                <ProjectTitle project={p3} />
              </div>
              <TiltPanel project={p3} onOpen={() => open(p3.slug)} className="aspect-[4/3] md:aspect-[21/9]" />
              <FadeUp className="mt-8 grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8 lg:col-start-5">
                  <ProjectMeta project={p3} onOpen={() => open(p3.slug)} />
                </div>
              </FadeUp>
            </article>
          ) : null}
        </div>

        {/* more builds */}
        <div className="mt-32">
          <div className="label-mono mb-6 flex items-center gap-4 text-muted">
            <span className="text-lime">+</span> More builds
            <span className="h-px flex-1 bg-line-strong" />
            <span className="hidden normal-case tracking-normal text-dim sm:inline">Client work · live sites linked</span>
          </div>
          <ul>
            {moreProjects.map((p, i) => {
              const row = (
                <>
                  <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-lime transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100" />
                  <span className="label-mono relative col-span-2 text-dim transition-colors group-hover:text-ink md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                  <span className="relative col-span-10 flex items-center gap-3 text-2xl font-semibold tracking-tight transition-colors group-hover:text-ink md:col-span-5 md:text-4xl">
                    {p.title}
                    {p.url ? <ArrowUpRight aria-hidden size={22} className="shrink-0 text-lime transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" /> : null}
                  </span>
                  <span className="relative col-span-10 col-start-3 text-paper/70 transition-colors group-hover:text-ink md:col-span-4 md:col-start-auto">{p.description}</span>
                  <span className="label-mono relative col-span-10 col-start-3 text-muted transition-colors group-hover:text-ink md:col-span-2 md:col-start-auto md:text-right">
                    {p.url ? "Live · " : ""}
                    {p.category}
                  </span>
                </>
              );
              const cls = "group relative grid grid-cols-12 items-baseline gap-4 overflow-hidden border-b border-line py-6";
              return (
                <FadeUp as="li" key={p.title} delay={i * 0.04}>
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className={cls} aria-label={`${p.title}: ${p.description} (opens live site in a new tab)`}>
                      {row}
                    </a>
                  ) : (
                    <div className={cls}>{row}</div>
                  )}
                </FadeUp>
              );
            })}
          </ul>
        </div>
      </div>

      <ProjectModal project={current} onClose={close} onNavigate={open} />
    </section>
  );
}
