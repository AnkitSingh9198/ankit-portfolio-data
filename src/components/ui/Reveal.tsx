"use client";

import { motion, useInView, type HTMLMotionProps } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useRef, type ElementType, type ReactNode } from "react";
import { ease } from "@/lib/motion";

/**
 * MaskText — splits text into words and slides each one up from behind a mask
 * when it enters the viewport. Falls back to plain text with reduced motion.
 */
export function MaskText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 0.045,
  wordClassName,
  once = true,
  animateNow,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  wordClassName?: string;
  once?: boolean;
  /** When defined, animation is driven by this flag instead of viewport entry */
  animateNow?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  const trigger =
    animateNow === undefined
      ? { initial: "hidden", whileInView: "show", viewport: { once, amount: 0.4 } }
      : { initial: "hidden", animate: animateNow ? "show" : "hidden" };

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden
        className="inline"
        {...trigger}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
      >
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
            <motion.span
              className={`inline-block will-change-transform ${wordClassName ?? ""}`}
              variants={{
                hidden: { y: "110%", rotate: 4 },
                show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: ease.out } },
              }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** FadeUp — a restrained reveal for blocks of content. */
export function FadeUp({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "p" | "span";
} & Omit<HTMLMotionProps<"div">, "children">) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={reduce ? { duration: 0 } : { duration: 0.9, ease: ease.out, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/**
 * WipeReveal — a clip-path wipe used for images and visual panels.
 * The observer watches an unclipped wrapper: Chromium's IntersectionObserver
 * honours the target's own clip-path, so a fully clipped target never "enters".
 */
export function WipeReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left";
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const hidden = direction === "up" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";
  return (
    <div ref={ref} className={className}>
      <motion.div
        className="h-full w-full"
        initial={{ clipPath: hidden }}
        animate={{ clipPath: inView || reduce ? "inset(0% 0% 0% 0%)" : hidden }}
        transition={reduce ? { duration: 0 } : { duration: 1.2, ease: ease.inOut, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}
