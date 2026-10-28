"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { flows, workshopNodes } from "@/content/portfolio";
import type { NodeId } from "@/content/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ease } from "@/lib/motion";

type Layout = {
  w: number;
  h: number;
  nodeW: number;
  nodeH: number;
  pos: Record<NodeId, { x: number; y: number }>;
};

const DESKTOP: Layout = {
  w: 1000,
  h: 580,
  nodeW: 166,
  nodeH: 66,
  pos: {
    user: { x: 92, y: 300 },
    ui: { x: 296, y: 300 },
    api: { x: 500, y: 300 },
    server: { x: 704, y: 300 },
    db: { x: 908, y: 300 },
    socket: { x: 500, y: 95 },
    peer: { x: 908, y: 95 },
    external: { x: 908, y: 490 },
  },
};

const MOBILE: Layout = {
  w: 360,
  h: 640,
  nodeW: 136,
  nodeH: 58,
  pos: {
    user: { x: 90, y: 45 },
    ui: { x: 90, y: 170 },
    api: { x: 90, y: 310 },
    server: { x: 90, y: 450 },
    db: { x: 90, y: 590 },
    peer: { x: 268, y: 100 },
    socket: { x: 268, y: 240 },
    external: { x: 268, y: 520 },
  },
};

const EDGES: [NodeId, NodeId, string?][] = [
  ["user", "ui"],
  ["ui", "api"],
  ["api", "server"],
  ["server", "db"],
  ["ui", "socket", "WS"],
  ["socket", "peer"],
  ["ui", "peer", "P2P media"],
  ["server", "external", "REST"],
];

const STEP_MS = 2300;

function useLayout() {
  const [layout, setLayout] = useState<Layout>(DESKTOP);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setLayout(mq.matches ? MOBILE : DESKTOP);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return layout;
}

export function Workshop() {
  const reduce = useReducedMotion();
  const layout = useLayout();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { amount: 0.35 });

  const [flowIdx, setFlowIdx] = useState(1);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [focusNode, setFocusNode] = useState<NodeId | null>(null);

  const flow = flows[flowIdx];
  const current = flow.steps[step];
  const involved = useMemo(() => new Set(flow.steps.flatMap((s) => [s.from, s.to])), [flow]);
  const inspected = workshopNodes.find((n) => n.id === (focusNode ?? current.to))!;

  // autoplay while visible (never with reduced motion, never after the user pauses)
  useEffect(() => {
    if (reduce || userPaused) return;
    setPlaying(inView);
  }, [inView, reduce, userPaused]);

  useEffect(() => {
    if (!playing) return;
    const last = step >= flow.steps.length - 1;
    const id = window.setTimeout(
      () => {
        if (!last) {
          setStep(step + 1);
        } else {
          // move on to the next scenario after a full run
          setFlowIdx((flowIdx + 1) % flows.length);
          setStep(0);
        }
      },
      last ? STEP_MS * 1.6 : STEP_MS,
    );
    return () => window.clearTimeout(id);
  }, [playing, step, flowIdx, flow.steps.length]);

  const choose = (i: number) => {
    setFlowIdx(i);
    setStep(0);
    setFocusNode(null);
  };
  const go = (d: number) => {
    setUserPaused(true);
    setPlaying(false);
    setFocusNode(null);
    setStep((s) => Math.min(flow.steps.length - 1, Math.max(0, s + d)));
  };
  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      setUserPaused(true);
    } else {
      setUserPaused(false);
      setPlaying(true);
      if (step === flow.steps.length - 1) setStep(0);
    }
  };

  const { pos, nodeW, nodeH } = layout;
  const a = pos[current.from];
  const b = pos[current.to];
  const edgeKey = (x: NodeId, y: NodeId) => [x, y].sort().join("-");
  const activeEdge = edgeKey(current.from, current.to);

  return (
    <section id="workshop" aria-labelledby="workshop-title" className="section-y relative overflow-hidden border-t border-line bg-ink-2">
      <div className="pointer-events-none absolute -right-40 top-20 h-[40rem] w-[40rem] rounded-full bg-lime/[0.05] blur-3xl" />
      <div className="container-x relative" ref={sectionRef}>
        <SectionHeader
          id="workshop"
          index="03"
          label="Inside my digital workshop"
          title="Follow a request"
          accent="through the stack."
        />

        <p className="-mt-6 mb-10 max-w-[60ch] text-lg leading-relaxed text-paper/70">
          Three journeys from real projects I&apos;ve built. Pick one, then play it or step through it — each hop shows what
          actually travels between layers and why it&apos;s there. Select any node to see its job.
        </p>

        {/* scenario tabs */}
        <div role="tablist" aria-label="Request scenarios" className="mb-6 flex flex-wrap gap-2">
          {flows.map((f, i) => (
            <button
              key={f.id}
              role="tab"
              type="button"
              aria-selected={i === flowIdx}
              aria-controls="workshop-panel"
              onClick={() => choose(i)}
              className={`group min-h-11 rounded-full border px-5 py-2.5 text-left transition-colors duration-300 ${
                i === flowIdx ? "border-lime bg-lime text-ink" : "border-line-strong text-paper/80 hover:border-paper/60"
              }`}
            >
              <span className="block text-sm font-semibold">{f.title}</span>
            </button>
          ))}
        </div>

        <div id="workshop-panel" role="tabpanel" aria-label={flow.title} className="grid grid-cols-12 gap-4">
          {/* diagram */}
          <div className="col-span-12 overflow-hidden rounded-3xl border border-line bg-ink lg:col-span-8">
            <div className="label-mono flex items-center justify-between border-b border-line px-5 py-3 text-dim">
              <span>
                <span className="text-lime">●</span> {flow.project}
              </span>
              <span className="tabular-nums">
                hop {String(step + 1).padStart(2, "0")}/{String(flow.steps.length).padStart(2, "0")}
              </span>
            </div>
            <div className="tech-grid relative">
              <svg
                viewBox={`0 0 ${layout.w} ${layout.h}`}
                className="block h-auto w-full"
                role="img"
                aria-label={`Architecture diagram. Current hop: ${current.from} to ${current.to}, ${current.label}`}
              >
                <defs>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* edges */}
                {EDGES.map(([f, t, tag]) => {
                  const p1 = pos[f];
                  const p2 = pos[t];
                  const k = edgeKey(f, t);
                  const live = k === activeEdge;
                  const used = involved.has(f) && involved.has(t);
                  return (
                    <g key={k}>
                      <line
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke={live ? "#c8ff2e" : "rgba(241,237,227,0.22)"}
                        strokeOpacity={live ? 1 : used ? 0.9 : 0.35}
                        strokeWidth={live ? 2 : 1}
                        className={used ? "flow-dash" : undefined}
                        strokeDasharray={used ? undefined : "2 6"}
                      />
                      {tag ? (
                        <text
                          x={(p1.x + p2.x) / 2 + (layout === MOBILE ? 6 : 0)}
                          y={(p1.y + p2.y) / 2 - 8}
                          textAnchor="middle"
                          className="fill-dim font-mono"
                          fontSize={layout === MOBILE ? 9 : 11}
                          letterSpacing="0.1em"
                        >
                          {tag}
                        </text>
                      ) : null}
                    </g>
                  );
                })}

                {/* nodes */}
                {workshopNodes.map((n) => {
                  const p = pos[n.id];
                  const isTarget = n.id === current.to;
                  const isSource = n.id === current.from;
                  const isFocus = n.id === focusNode;
                  const active = isTarget || isSource;
                  const dim = !involved.has(n.id);
                  return (
                    <g
                      key={n.id}
                      transform={`translate(${p.x - nodeW / 2} ${p.y - nodeH / 2})`}
                      role="button"
                      tabIndex={0}
                      aria-label={`${n.label}: ${n.sub}. ${n.role}`}
                      aria-pressed={isFocus}
                      onClick={() => setFocusNode(n.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setFocusNode(n.id);
                        }
                      }}
                      onMouseEnter={() => setFocusNode(n.id)}
                      onMouseLeave={() => setFocusNode(null)}
                      className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-lime"
                      opacity={dim ? 0.38 : 1}
                    >
                      <rect
                        width={nodeW}
                        height={nodeH}
                        rx={14}
                        fill={isTarget ? "#c8ff2e" : "#121410"}
                        stroke={active || isFocus ? "#c8ff2e" : "rgba(241,237,227,0.22)"}
                        strokeWidth={isFocus ? 2 : 1}
                        filter={isTarget ? "url(#glow)" : undefined}
                        style={{ transition: "fill .4s, stroke .4s" }}
                      />
                      <text
                        x={16}
                        y={nodeH / 2 - 4}
                        fontSize={layout === MOBILE ? 14 : 16}
                        fontWeight={650}
                        className="font-display"
                        fill={isTarget ? "#0b0c0a" : "#f1ede3"}
                      >
                        {n.label}
                      </text>
                      <text
                        x={16}
                        y={nodeH / 2 + 15}
                        fontSize={layout === MOBILE ? 9.5 : 10.5}
                        className="font-mono"
                        letterSpacing="0.04em"
                        fill={isTarget ? "#0b0c0a" : "#a19e93"}
                      >
                        {n.sub}
                      </text>
                    </g>
                  );
                })}

                {/* travelling packet */}
                <motion.g
                  key={`${flow.id}-${step}-${layout.w}`}
                  initial={reduce ? { x: b.x, y: b.y } : { x: a.x, y: a.y, opacity: 0 }}
                  animate={{ x: b.x, y: b.y, opacity: 1 }}
                  transition={{ duration: reduce ? 0 : 0.95, ease: ease.inOut }}
                  aria-hidden
                >
                  <circle r={16} fill="#c8ff2e" opacity={0.2} />
                  <circle r={7} fill="#f1ede3" stroke="#0b0c0a" strokeWidth={2} filter="url(#glow)" />
                </motion.g>
              </svg>
            </div>

            {/* controls */}
            <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3">
              <button type="button" onClick={() => go(-1)} disabled={step === 0} aria-label="Previous hop" className="grid h-11 w-11 place-items-center rounded-full border border-line-strong transition-colors hover:border-lime disabled:opacity-30">
                <SkipBack size={16} />
              </button>
              <button type="button" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className="grid h-11 w-11 place-items-center rounded-full bg-lime text-ink transition-transform active:scale-90">
                {playing ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button type="button" onClick={() => go(1)} disabled={step === flow.steps.length - 1} aria-label="Next hop" className="grid h-11 w-11 place-items-center rounded-full border border-line-strong transition-colors hover:border-lime disabled:opacity-30">
                <SkipForward size={16} />
              </button>
              <button type="button" onClick={() => { setStep(0); setFocusNode(null); }} aria-label="Restart scenario" className="grid h-11 w-11 place-items-center rounded-full border border-line-strong transition-colors hover:border-lime">
                <RotateCcw size={16} />
              </button>
              <div className="ml-auto flex h-1 w-28 overflow-hidden rounded-full bg-line-strong sm:w-40" aria-hidden>
                <motion.div className="h-full bg-lime" animate={{ width: `${((step + 1) / flow.steps.length) * 100}%` }} transition={{ duration: 0.5, ease: ease.out }} />
              </div>
            </div>
          </div>

          {/* log + inspector */}
          <div className="col-span-12 flex flex-col gap-4 lg:col-span-4">
            <div className="rounded-3xl border border-line bg-ink p-5">
              <div className="label-mono text-dim">Node</div>
              <motion.div key={inspected.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: ease.out }}>
                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="text-2xl font-semibold">{inspected.label}</span>
                    <span className="label-mono text-lime">{inspected.sub}</span>
                  </div>
                  <p className="mt-2 leading-relaxed text-paper/70">{inspected.role}</p>
              </motion.div>
            </div>

            <ol className="flex-1 overflow-hidden rounded-3xl border border-line bg-ink font-mono text-[13px]" aria-label="Request log">
              <li className="label-mono border-b border-line px-5 py-3 text-dim">~/workshop $ trace --{flow.id}</li>
              {flow.steps.map((s, i) => {
                const isCur = i === step;
                const done = i < step;
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => {
                        setUserPaused(true);
                        setPlaying(false);
                        setFocusNode(null);
                        setStep(i);
                      }}
                      aria-current={isCur ? "step" : undefined}
                      className={`block w-full border-b border-line px-5 py-2.5 text-left transition-colors last:border-b-0 ${
                        isCur ? "bg-lime/10" : "hover:bg-paper/[0.03]"
                      }`}
                    >
                      <span className={`mr-2 ${isCur ? "text-lime" : done ? "text-muted" : "text-dim/60"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={isCur ? "text-paper" : done ? "text-paper/60" : "text-paper/30"}>{s.label}</span>
                      <AnimatePresence initial={false}>
                        {isCur ? (
                          <motion.span
                            className="block overflow-hidden font-sans text-sm leading-snug text-paper/70"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: ease.out }}
                          >
                            <span className="block pt-1.5 pl-7">{s.detail}</span>
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
