"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * The intro overlay is pure CSS (see <IntroOverlay/>), so content is never
 * blocked if JavaScript fails. This context only tells animated components
 * when the overlay has cleared, so the hero choreography starts on cue.
 * It plays once per browser session and never with reduced motion.
 */
const IntroContext = createContext<{ ready: boolean }>({ ready: true });

export const INTRO_MS = 1500;

export function IntroProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const seen = document.documentElement.classList.contains("intro-seen");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setReady(true);
      return;
    }
    const t = window.setTimeout(() => setReady(true), INTRO_MS - 250);
    return () => window.clearTimeout(t);
  }, []);

  return <IntroContext.Provider value={{ ready }}>{children}</IntroContext.Provider>;
}

export const useIntro = () => useContext(IntroContext);

export function IntroOverlay({ name, role }: { name: string; role: string }) {
  const letters = name.toUpperCase().split("");
  return (
    <div className="intro-overlay" aria-hidden>
      <div className="intro-inner">
        <div className="intro-name">
          {letters.map((l, i) => (
            <span key={i} style={{ animationDelay: `${i * 35}ms` }}>
              {l === " " ? " " : l}
            </span>
          ))}
        </div>
        <div className="intro-meta label-mono">
          <span>{role}</span>
          <span className="intro-bar" />
          <span>Noida · IN</span>
        </div>
      </div>
      <style>{`
        .intro-overlay {
          position: fixed; inset: 0; z-index: 90;
          background: var(--color-ink);
          display: grid; place-items: center;
          animation: intro-out 0.9s var(--ease-in-out-quart) 1.05s forwards;
        }
        .intro-inner { width: min(92vw, 1100px); }
        .intro-name {
          font-family: var(--font-display); font-weight: 700; font-stretch: 80%;
          font-size: clamp(2.8rem, 11vw, 9.5rem); letter-spacing: -0.05em; line-height: .85;
          display: flex; overflow: hidden; color: var(--color-paper);
        }
        .intro-name span { display: inline-block; transform: translateY(105%); animation: intro-letter .8s var(--ease-out-expo) forwards; }
        .intro-meta { margin-top: 1.25rem; display: flex; align-items: center; gap: 1rem; color: var(--color-muted); }
        .intro-bar { flex: 1; height: 1px; background: var(--color-line-strong); position: relative; overflow: hidden; }
        .intro-bar::after { content: ""; position: absolute; inset: 0; background: var(--color-lime); transform-origin: left; transform: scaleX(0); animation: intro-bar .95s var(--ease-in-out-quart) .1s forwards; }
        @keyframes intro-letter { to { transform: translateY(0); } }
        @keyframes intro-bar { to { transform: scaleX(1); } }
        @keyframes intro-out { to { clip-path: inset(0 0 100% 0); visibility: hidden; } }
        .intro-overlay { clip-path: inset(0 0 0 0); }
        html.intro-seen .intro-overlay { display: none; }
        @media (prefers-reduced-motion: reduce) { .intro-overlay { display: none; } }
      `}</style>
    </div>
  );
}
