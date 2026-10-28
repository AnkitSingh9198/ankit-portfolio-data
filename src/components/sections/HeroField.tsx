"use client";

import { useEffect, useRef } from "react";

/**
 * Procedural dot-matrix field for the hero.
 * - Dots breathe with a slow travelling wave.
 * - A soft "flashlight" follows the pointer and tints nearby dots lime.
 * - On touch devices the light drifts on its own along a lissajous path.
 * Performance: one 2D canvas, DPR capped at 2, paused when off-screen or tab hidden,
 * a single static frame when the user prefers reduced motion.
 */
export function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let gap = 26;
    let raf = 0;
    let running = false;
    let visible = true;
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
    const start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      gap = w < 640 ? 22 : 26;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!running) draw(performance.now());
    };

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);

      if (!finePointer || !pointer.active) {
        // autonomous drift so the light is alive on touch screens too
        pointer.tx = w * (0.62 + 0.25 * Math.sin(t * 0.21));
        pointer.ty = h * (0.45 + 0.28 * Math.sin(t * 0.33 + 1.2));
      }
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      if (pointer.x < -5000) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }

      const radius = Math.max(220, Math.min(w, h) * 0.42);
      const cols = Math.ceil(w / gap) + 1;
      const rows = Math.ceil(h / gap) + 1;
      const ox = (w - (cols - 1) * gap) / 2;
      const oy = (h - (rows - 1) * gap) / 2;

      for (let r = 0; r < rows; r++) {
        const y = oy + r * gap;
        for (let c = 0; c < cols; c++) {
          const x = ox + c * gap;
          const wave = reduce ? 0.5 : 0.5 + 0.5 * Math.sin(x * 0.012 + y * 0.008 - t * 0.9);
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const light = Math.max(0, 1 - d / radius);
          const l2 = light * light;

          const size = 0.7 + wave * 0.5 + l2 * 1.8;
          if (l2 > 0.02) {
            ctx.fillStyle = `rgba(200,255,46,${0.12 + l2 * 0.75})`;
          } else {
            ctx.fillStyle = `rgba(241,237,227,${0.06 + wave * 0.07})`;
          }
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }

      // soft glow under the light
      const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius * 1.1);
      g.addColorStop(0, "rgba(200,255,46,0.07)");
      g.addColorStop(1, "rgba(200,255,46,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (running || reduce || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => (pointer.active = false);
    const onVis = () => (document.hidden ? pause() : play());

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else pause();
    });
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    play();

    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}
