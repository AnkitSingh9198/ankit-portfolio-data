"use client";

import { MotionConfig } from "motion/react";

/** Respect the OS "reduce motion" setting for every Motion animation on the site. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
