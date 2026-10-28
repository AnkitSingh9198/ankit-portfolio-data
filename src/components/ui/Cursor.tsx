"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/**
 * A two-part cursor (dot + trailing ring) for mouse users only.
 * The ring expands over links/buttons and shows a label for elements with
 * `data-cursor="View"`. Disabled for touch, coarse pointers and reduced motion,
 * where the native cursor is kept.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduced.matches);
    update();
    fine.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!enabled) {
      root.classList.remove("has-cursor");
      return;
    }
    root.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target as HTMLElement | null;
      const interactive = t?.closest("a, button, [role='button'], input, textarea, select, label, [data-cursor]");
      setHovering(!!interactive);
      setLabel(interactive?.getAttribute("data-cursor") ?? null);
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-lime"
        style={{ x, y, translateX: "-50%", translateY: "-50%", opacity: visible ? 1 : 0 }}
      />
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-lime/70"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%", opacity: visible ? 1 : 0 }}
        animate={{
          width: label ? 88 : hovering ? 52 : 30,
          height: label ? 88 : hovering ? 52 : 30,
          backgroundColor: label ? "rgba(200,255,46,1)" : "rgba(200,255,46,0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        {label ? (
          <span className="label-mono text-[10px] font-semibold text-ink">{label}</span>
        ) : null}
      </motion.div>
    </div>
  );
}
