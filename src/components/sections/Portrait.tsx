"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { profile } from "@/content/portfolio";
import { asset } from "@/lib/asset";
import { ease } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Camera distance for the 3D stage (px). */
const PERSPECTIVE = 1100;
/** How far the cutout floats in front of the frame (px). */
const SUBJECT_Z = 70;
const MAX_TILT_Y = 15; // degrees, left/right
const MAX_TILT_X = 10; // degrees, up/down

/**
 * 3D photo: the real photograph split into two layers.
 *  - a background plate (you painted out), clipped to the frame, which counter-shifts
 *  - your cutout, floating SUBJECT_Z px in front and breaking out above the frame
 * The card tilts toward the mouse anywhere on the page; on touch screens it sways
 * gently and follows a finger drag. Reduced motion keeps it still.
 */
export function Portrait({ ready }: { ready: boolean }) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const tx = useMotionValue(0); // target rotateX
  const ty = useMotionValue(0); // target rotateY
  const rx = useSpring(tx, { stiffness: 90, damping: 16, mass: 0.6 });
  const ry = useSpring(ty, { stiffness: 90, damping: 16, mass: 0.6 });

  // background plate parallax (opposite to tilt) and moving glare
  const plateX = useTransform(ry, (v) => -v * 1.3);
  const plateY = useTransform(rx, (v) => v * 1.3);
  const glareX = useTransform(ry, (v) => 50 + v * 3.2);
  const glareY = useTransform(rx, (v) => 40 - v * 4);
  const glare = useMotionTemplate`radial-gradient(60% 50% at ${glareX}% ${glareY}%, rgba(200,255,46,0.16), transparent 70%)`;
  
  useEffect(() => {
    if (reduce) {
      tx.set(0);
      ty.set(0);
      return;
    }
    const card = cardRef.current;
    if (!card) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let raf = 0;
    let visible = true;
    let dragUntil = 0;
    const start = performance.now();

    const aim = (clientX: number, clientY: number, spanX: number, spanY: number) => {
      const r = card.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, (clientX - (r.left + r.width / 2)) / spanX));
      const ny = Math.max(-1, Math.min(1, (clientY - (r.top + r.height / 2)) / spanY));
      ty.set(nx * MAX_TILT_Y);
      tx.set(-ny * MAX_TILT_X);
    };

    // mouse: the whole window steers the card
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      aim(e.clientX, e.clientY, window.innerWidth / 2, window.innerHeight / 2);
    };
    const onLeave = () => {
      tx.set(0);
      ty.set(0);
    };

    // touch: drag on the photo steers it for a moment, otherwise it sways
    const onTouch = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      dragUntil = performance.now() + 1800;
      const r = card.getBoundingClientRect();
      aim(e.clientX, e.clientY, r.width / 2, r.height / 2);
    };

    const sway = (now: number) => {
      if (now > dragUntil) {
        const t = (now - start) / 1000;
        ty.set(Math.sin(t * 0.55) * 9);
        tx.set(Math.sin(t * 0.4 + 1) * 4);
      }
      raf = requestAnimationFrame(sway);
    };
    const play = () => {
      cancelAnimationFrame(raf);
      if (!fine && visible && !document.hidden) raf = requestAnimationFrame(sway);
    };
    const onVis = () => (document.hidden ? cancelAnimationFrame(raf) : play());

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else cancelAnimationFrame(raf);
    });
    io.observe(card);

    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    card.addEventListener("pointermove", onTouch, { passive: true });
    card.addEventListener("pointerdown", onTouch, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    play();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      card.removeEventListener("pointermove", onTouch);
      card.removeEventListener("pointerdown", onTouch);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce, tx, ty]);

  const { photo, photo3d } = profile;
  // the cutout is taller than the frame; reserve that headroom above the card
  const headroom = (photo3d.subjectRatio - photo3d.plateRatio) * 100; // % of width
  // keep the cutout the same apparent size as the plate despite sitting closer to the camera,
  // scaling around the card centre (the perspective origin)
  const compensate = (PERSPECTIVE - SUBJECT_Z) / PERSPECTIVE;
  const originY = ((photo3d.subjectRatio - photo3d.plateRatio / 2) / photo3d.subjectRatio) * 100;

  const show = ready || reduce;

  return (
    <figure className="relative m-0 select-none" style={{ paddingTop: `${headroom}%` }}>
      <div style={{ perspective: `${PERSPECTIVE}px`, perspectiveOrigin: "50% 50%" }}>
        <motion.div
          ref={cardRef}
          className="relative w-full touch-pan-y"
          style={{
            aspectRatio: `1 / ${photo3d.plateRatio}`,
            rotateX: rx,
            rotateY: ry,
            transformStyle: "preserve-3d",
          }}
        >
          {/* back: the scene, clipped to the frame */}
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-[20px] border border-line-strong bg-ink-2"
            initial={{ clipPath: "inset(100% 0% 0% 0% round 20px)" }}
            animate={{ clipPath: show ? "inset(0% 0% 0% 0% round 20px)" : "inset(100% 0% 0% 0% round 20px)" }}
            transition={reduce ? { duration: 0 } : { duration: 1.2, ease: ease.inOut, delay: 0.3 }}
          >
            <motion.div className="absolute -inset-[8%]" style={{ x: plateX, y: plateY }}>
              <Image
                src={asset(photo3d.plate)}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 30vw, 85vw"
                className="object-cover brightness-[0.62] saturate-[0.85]"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/30" />
            <div className="tech-grid absolute inset-0 opacity-30 mix-blend-screen" />
            <motion.div className="absolute inset-0" style={{ backgroundImage: glare }} />
          </motion.div>

          {/* frame furniture, slightly in front of the scene */}
          <div className="pointer-events-none absolute inset-0" style={{ transform: "translateZ(18px)" }} aria-hidden>
            {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "left-3 bottom-3 border-l border-b", "right-3 bottom-3 border-r border-b"].map(
              (c) => (
                <span key={c} className={`absolute h-5 w-5 border-lime ${c}`} />
              ),
            )}
          </div>

          {/* front: head and shoulders, floating forward and breaking out of the frame */}
          <motion.div
            className="pointer-events-none absolute bottom-0 left-0 w-full"
            style={{
              aspectRatio: `1 / ${photo3d.subjectRatio}`,
              z: SUBJECT_Z,
              scale: compensate,
              transformOrigin: `50% ${originY}%`,
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={reduce ? { duration: 0 } : { duration: 1.4, ease: ease.out, delay: 0.75 }}
          >
            <Image
              src={asset(photo3d.subject)}
              alt={photo.alt}
              fill
              priority
              sizes="(min-width: 1024px) 30vw, 85vw"
              className="object-contain object-bottom drop-shadow-[0_20px_28px_rgba(0,0,0,0.6)] [mask-image:linear-gradient(to_bottom,black_86%,transparent)]"
            />
          </motion.div>

          {/* floating name tag, closest to the camera */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-3 bottom-[9%] rounded-xl border border-lime/50 bg-ink/85 px-3.5 py-2.5 backdrop-blur-md sm:-left-6"
            style={{ z: 120 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: show ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 1.3 }}
          >
            <span className="label-mono block text-[10px] text-lime">Fig. 01</span>
            <span className="mt-0.5 block text-sm font-semibold tracking-tight text-paper">{profile.name}</span>
            <span className="label-mono block text-[9px] text-muted">{profile.role}</span>
          </motion.div>
        </motion.div>
      </div>

      <figcaption className="label-mono mt-4 flex justify-between gap-4 text-dim">
        <span>
          <span className="hidden [@media(hover:hover)]:inline">Move your cursor</span>
          <span className="[@media(hover:hover)]:hidden">Drag the photo</span> · 3D
        </span>
        <span>{profile.coordinates.split(",")[0]}</span>
      </figcaption>
    </figure>
  );
}
