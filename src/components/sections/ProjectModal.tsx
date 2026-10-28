"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { projects } from "@/content/portfolio";
import type { Project } from "@/content/types";
import { ease } from "@/lib/motion";
import { ProjectVisual } from "./ProjectVisual";

/**
 * Full-screen case study sheet.
 * Accessible dialog: focus moves in, Tab is trapped, Escape closes,
 * focus returns to the element that opened it. URL hash = #work/<slug>.
 */
export function ProjectModal({
  project,
  onClose,
  onNavigate,
}: {
  project: Project | null;
  onClose: () => void;
  onNavigate: (slug: string) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const isOpen = !!project;

  useEffect(() => {
    if (!isOpen) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab" && panelRef.current) {
        const f = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"),
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      returnFocus.current?.focus?.({ preventScroll: true });
    };
  }, [isOpen, onClose]);

  // scroll sheet to top when switching projects inside the modal
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [project?.slug]);

  const idx = project ? projects.findIndex((p) => p.slug === project.slug) : -1;
  const next = idx >= 0 ? projects[(idx + 1) % projects.length] : null;

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-[70] bg-ink/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-title"
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 top-3 overflow-y-auto overscroll-contain rounded-t-[28px] border-t border-line bg-ink md:top-6"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.8, ease: ease.inOut }}
          >
            <div className="sticky top-0 z-10 border-b border-line bg-ink/85 backdrop-blur-xl">
              <div className="container-x flex h-16 items-center justify-between">
                <span className="label-mono text-muted">
                  Case study <span className="text-lime">{project.index}</span> / {String(projects.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  data-autofocus
                  onClick={onClose}
                  className="label-mono inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 transition-colors hover:border-lime hover:text-lime"
                >
                  Close <X size={16} />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.article
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: ease.out, delay: 0.15 }}
                className="container-x pb-24 pt-12"
              >
                <p className="label-mono text-muted">{project.category}</p>
                <h2 id="case-title" className="display-xl mt-4">
                  {project.title}
                  <span style={{ color: project.accent }}>.</span>
                </h2>

                <div className="mt-10 grid grid-cols-12 gap-6">
                  <p className="col-span-12 text-2xl leading-snug tracking-tight text-paper/90 lg:col-span-7 lg:text-3xl">{project.summary}</p>
                  <dl className="col-span-12 grid gap-5 self-end lg:col-span-4 lg:col-start-9">
                    <div>
                      <dt className="label-mono text-dim">Role</dt>
                      <dd className="mt-1 text-paper/85">{project.role}</dd>
                    </div>
                    <div>
                      <dt className="label-mono text-dim">Stack</dt>
                      <dd className="mt-2 flex flex-wrap gap-1.5">
                        {project.stack.map((s) => (
                          <span key={s} className="label-mono rounded-full border border-line-strong px-2.5 py-1 text-[10px] text-muted">
                            {s}
                          </span>
                        ))}
                      </dd>
                    </div>
                    {project.liveUrl || project.repoUrl ? (
                      <div className="flex flex-wrap gap-3">
                        {project.liveUrl ? (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-lime px-5 font-semibold text-ink">
                            Live site <ArrowUpRight size={16} />
                            <span className="sr-only">(opens in a new tab)</span>
                          </a>
                        ) : null}
                        {project.repoUrl ? (
                          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-5 font-semibold">
                            Source <ArrowUpRight size={16} />
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </dl>
                </div>

                <div className="mt-14 aspect-[16/9] overflow-hidden rounded-[22px] border border-line md:aspect-[21/9]">
                  <ProjectVisual kind={project.visual} accent={project.accent} />
                </div>

                <div className="mt-20 grid grid-cols-12 gap-6">
                  <div className="col-span-12 lg:col-span-4">
                    <h3 className="label-mono text-lime">The brief</h3>
                    <p className="mt-4 text-lg leading-relaxed text-paper/75">{project.context}</p>
                  </div>
                  <div className="col-span-12 lg:col-span-7 lg:col-start-6">
                    <h3 className="label-mono text-lime">What I built</h3>
                    <ol className="mt-4">
                      {project.built.map((b, i) => (
                        <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-2 border-b border-line py-4 text-paper/85">
                          <span className="label-mono pt-1 text-dim">{String(i + 1).padStart(2, "0")}</span>
                          <span className="leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="mt-20">
                  <h3 className="label-mono text-lime">Problems solved</h3>
                  <ul className="mt-6 grid gap-4 md:grid-cols-3">
                    {project.challenges.map((c) => (
                      <li key={c.title} className="rounded-2xl border border-line bg-ink-2 p-6">
                        <h4 className="text-xl font-semibold tracking-tight">{c.title}</h4>
                        <p className="mt-3 leading-relaxed text-paper/70">{c.detail}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {next && next.slug !== project.slug ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(next.slug)}
                    className="group mt-24 flex w-full items-end justify-between gap-6 border-t border-line pt-8 text-left"
                  >
                    <span>
                      <span className="label-mono block text-muted">Next case study</span>
                      <span className="display-lg mt-3 block transition-colors group-hover:text-lime">{next.title}</span>
                    </span>
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-line-strong transition-all group-hover:border-lime group-hover:bg-lime group-hover:text-ink">
                      <ArrowRight size={22} />
                    </span>
                  </button>
                ) : null}
              </motion.article>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
