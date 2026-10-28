"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { navItems, profile } from "@/content/portfolio";
import { ease } from "@/lib/motion";
import { asset } from "@/lib/asset";

type SectionId = (typeof navItems)[number]["id"];

function useActiveSection() {
  const [active, setActive] = useState<SectionId | null>(null);
  useEffect(() => {
    const els = navItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id as SectionId);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const top = () => window.scrollY < window.innerHeight * 0.5 && setActive(null);
    window.addEventListener("scroll", top, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", top);
    };
  }, []);
  return active;
}

function LocalClock() {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: profile.timezone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="label-mono hidden text-muted lg:inline" aria-label={`Local time in Noida: ${time}`}>
      Noida <span className="text-paper tabular-nums">{time || "--:--"}</span> IST
    </span>
  );
}

export function Nav() {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 600 && y > prev && !open);
  });

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Mobile menu: lock scroll, focus first link, trap focus, close on Escape
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(menuRef.current?.querySelectorAll<HTMLElement>("a, button") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const f = focusables();
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
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <a
        href="#main"
        className="label-mono fixed left-4 top-4 z-[95] -translate-y-24 bg-lime px-4 py-3 text-ink focus:translate-y-0"
      >
        Skip to content
      </a>

      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: ease.out }}
      >
        <div
          className={`transition-[background-color,border-color,backdrop-filter] duration-500 ${
            scrolled || open
              ? "border-b border-line bg-ink/70 backdrop-blur-xl"
              : "border-b border-transparent bg-transparent"
          }`}
        >
          <nav
            aria-label="Primary"
            className="container-x flex h-[var(--nav-h)] items-center justify-between gap-6"
          >
            <a href="#top" className="group flex items-center gap-3" aria-label={`${profile.name} — back to top`}>
              <BrandMark />
              <span className="hidden text-sm font-semibold tracking-tight sm:inline">
                {profile.name}
                <span className="label-mono ml-2 text-muted group-hover:text-lime">/ dev</span>
              </span>
            </a>

            <ul className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id} className="relative">
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? "location" : undefined}
                      className={`label-mono relative z-10 block px-3 py-2 transition-colors duration-300 ${
                        isActive ? "text-ink" : "text-muted hover:text-paper"
                      }`}
                    >
                      {item.label}
                    </a>
                    {isActive ? (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-lime"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-5">
              <LocalClock />
              {profile.resumeUrl ? (
                <a
                  href={asset(profile.resumeUrl)}
                  download
                  className="label-mono hidden rounded-full border border-line-strong px-4 py-2 transition-colors hover:border-lime hover:text-lime sm:inline-block"
                >
                  Résumé ↓
                </a>
              ) : null}
              <button
                ref={toggleRef}
                type="button"
                className="grid h-11 w-11 place-items-center rounded-full border border-line-strong md:hidden"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((o) => !o)}
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-40 flex flex-col bg-ink pt-[var(--nav-h)] md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: ease.inOut }}
          >
            <ul className="container-x mt-8 flex flex-1 flex-col gap-1">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: ease.out }}
                  className="border-b border-line"
                >
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between py-4"
                  >
                    <span className="display-md">{item.label}</span>
                    <span className="label-mono text-muted">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="container-x label-mono flex items-center justify-between pb-8 pt-6 text-muted">
              <a href={`mailto:${profile.email}`} className="text-paper underline decoration-lime underline-offset-4">
                Email me
              </a>
              {profile.resumeUrl ? (
                <a href={asset(profile.resumeUrl)} download className="text-paper">
                  Résumé ↓
                </a>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden className="shrink-0">
      <rect x="0.5" y="0.5" width="39" height="39" rx="10" fill="#0b0c0a" stroke="#c8ff2e" strokeOpacity="0.5" />
      <path d="M9 29 L15.5 11 L22 29 M11.6 23 H19.4" fill="none" stroke="#f1ede3" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M31.5 13.5 C30 11 24.5 11 24.5 15 C24.5 19 31.5 18.5 31.5 23.5 C31.5 28 25.5 28.5 23.8 25.8" fill="none" stroke="#c8ff2e" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
