"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/portfolio";
import { useIntro } from "@/components/Intro";
import { Magnetic } from "@/components/ui/Magnetic";
import { MaskText } from "@/components/ui/Reveal";
import { ease } from "@/lib/motion";
import { HeroField } from "./HeroField";
import { Portrait } from "./Portrait";

const lineStyle: Record<number, string> = {
  0: "",
  1: "pl-[12vw] lg:pl-[16vw]",
  2: "",
  3: "pl-[6vw] lg:pl-[8vw]",
  4: "",
};

export function Hero() {
  const { ready } = useIntro();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // parallax only on large screens, where the portrait floats beside the headline
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const parallax = wide && !reduce;
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", parallax ? "18%" : "0%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", parallax ? "-12%" : "0%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.2]);

  const appear = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: ready || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: reduce ? { duration: 0 } : { duration: 0.9, ease: ease.out, delay },
  });

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate min-h-[100svh] overflow-hidden pt-[calc(var(--nav-h)+1.5rem)]"
    >
      <div className="absolute inset-0 -z-10">
        <HeroField />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,transparent_0%,var(--color-ink)_75%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="container-x relative">
        {/* meta row */}
        <motion.div
          {...appear(0)}
          className="label-mono flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line pb-4 text-muted"
        >
          <span className="text-paper">
            {profile.name} <span className="text-dim">—</span> {profile.role}
          </span>
          <span className="hidden md:inline">React · TypeScript · Node · Express · MongoDB</span>
          {profile.availability.show ? (
            <span className="flex items-center gap-2 text-paper">
              <span className="relative flex h-2 w-2">
                <span className="pulse-ring absolute inset-0 rounded-full bg-lime" />
                <span className="relative h-2 w-2 rounded-full bg-lime" />
              </span>
              {profile.availability.label}
            </span>
          ) : null}
        </motion.div>

        <div className="relative mt-8 grid grid-cols-12 gap-x-4 lg:mt-8">
          {/* headline */}
          <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 col-span-12 lg:col-span-9">
            <h1 id="hero-title" className="display-hero uppercase" aria-label={profile.headline.join(" ")}>
              {profile.headline.map((line, i) => {
                const isAccent = i === 1;
                const isLast = i === profile.headline.length - 1;
                return (
                  <span key={line} aria-hidden className={`block ${lineStyle[i] ?? ""}`}>
                    {isAccent ? (
                      <MaskText
                        text={line}
                        animateNow={ready}
                        delay={0.1 + i * 0.08}
                        className="serif-accent text-[1.12em] lowercase normal-case tracking-[-0.02em] text-lime"
                      />
                    ) : isLast ? (
                      <MaskText text={line.replace(".", "")} animateNow={ready} delay={0.1 + i * 0.08} />
                    ) : (
                      <MaskText text={line} animateNow={ready} delay={0.1 + i * 0.08} />
                    )}
                    {isLast ? (
                      <motion.span
                        className="inline-block text-lime"
                        initial={{ scale: 0 }}
                        animate={{ scale: ready || reduce ? 1 : 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 14, delay: 0.95 }}
                      >
                        .
                      </motion.span>
                    ) : null}
                  </span>
                );
              })}
            </h1>
          </motion.div>

          {/* portrait */}
          <motion.div
            style={{ y: portraitY }}
            className="relative col-span-10 col-start-2 mt-6 sm:col-span-6 sm:col-start-4 lg:absolute lg:right-0 lg:-top-6 lg:col-auto lg:mt-0 lg:w-[27%] xl:w-[26%]"
          >
            <Portrait ready={ready} />
          </motion.div>
        </div>

        {/* lower row */}
        <div className="mt-12 grid grid-cols-12 items-end gap-x-4 gap-y-10 pb-10 lg:mt-10">
          <motion.p
            {...appear(0.8)}
            className="col-span-12 max-w-[40ch] text-lg leading-snug text-paper/85 md:col-span-6 md:text-xl lg:col-span-5"
          >
            {profile.tagline}
          </motion.p>

          <motion.div {...appear(0.95)} className="col-span-12 flex flex-wrap items-center gap-3 md:col-span-6 lg:col-span-4">
            <Magnetic>
              <a
                href="#work"
                className="group inline-flex items-center gap-3 rounded-full bg-lime px-6 py-4 font-semibold text-ink transition-transform active:scale-95"
              >
                Explore my work
                <ArrowDown size={18} className="transition-transform duration-500 group-hover:translate-y-1" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 rounded-full border border-line-strong px-6 py-4 font-semibold transition-colors hover:border-paper active:scale-95"
              >
                Contact me
                <ArrowUpRight size={18} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
          </motion.div>

          <motion.a
            {...appear(1.1)}
            href="#profile"
            className="label-mono col-span-12 hidden items-center justify-end gap-3 text-muted transition-colors hover:text-lime lg:col-span-3 lg:flex"
            aria-label="Scroll to profile"
          >
            Scroll
            <span className="relative block h-12 w-px overflow-hidden bg-line-strong">
              {!reduce ? (
                <motion.span
                  className="absolute left-0 top-0 block h-1/2 w-px bg-lime"
                  animate={{ y: ["-100%", "200%"] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: ease.inOut }}
                />
              ) : null}
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
