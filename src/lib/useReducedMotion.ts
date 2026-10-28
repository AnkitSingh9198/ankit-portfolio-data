"use client";

import { useReducedMotion as useMotionReduced } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Hydration-safe reduced-motion flag.
 * Returns `false` for the server render and the first client render (so markup
 * matches), then the user's real preference once mounted.
 */
export function useReducedMotion(): boolean {
  const pref = useMotionReduced();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? !!pref : false;
}
