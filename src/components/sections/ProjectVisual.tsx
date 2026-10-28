"use client";

import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useRef } from "react";
import type { Project } from "@/content/types";

/**
 * Original abstract visuals for each project category.
 * These are illustrations of how each system works — deliberately NOT product
 * screenshots, and labelled as such in the UI.
 */
export function ProjectVisual({ kind, accent }: { kind: Project["visual"]; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const reduce = useReducedMotion();
  // loops only run while visible, and never with reduced motion
  const live = inView && !reduce;
  return (
    <div ref={ref} className="h-full w-full">
      {kind === "realtime" ? (
        <RealtimeVisual accent={accent} live={live} />
      ) : kind === "aggregator" ? (
        <AggregatorVisual accent={accent} live={live} />
      ) : (
        <BookingVisual accent={accent} live={live} />
      )}
    </div>
  );
}

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-ink-2">
      <div className="tech-grid absolute inset-0 opacity-60" />
      {children}
      <span className="label-mono absolute bottom-3 right-4 hidden text-[10px] text-dim sm:block">{label} · abstract illustration</span>
    </div>
  );
}

function RealtimeVisual({ accent, live }: { accent: string; live: boolean }) {
  const bars = Array.from({ length: 28 });
  return (
    <Frame label="WebRTC session">
      <svg viewBox="0 0 800 500" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        {live && [0, 1, 2].map((i) => (
          <g key={i}>
            <motion.circle
              cx={190}
              cy={250}
              r={60}
              fill="none"
              stroke={accent}
              strokeOpacity={0.5}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i, ease: "easeOut" }}
              style={{ transformOrigin: "190px 250px" }}
            />
            <motion.circle
              cx={610}
              cy={250}
              r={60}
              fill="none"
              stroke="#f1ede3"
              strokeOpacity={0.35}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i + 0.5, ease: "easeOut" }}
              style={{ transformOrigin: "610px 250px" }}
            />
          </g>
        ))}
        <circle cx={190} cy={250} r={58} fill="#0b0c0a" stroke={accent} strokeWidth={1.5} />
        <circle cx={610} cy={250} r={58} fill="#0b0c0a" stroke="#f1ede3" strokeOpacity={0.5} strokeWidth={1.5} />
        <text x={190} y={246} textAnchor="middle" fill={accent} fontSize={13} className="font-mono" letterSpacing="0.12em">PATIENT</text>
        <text x={190} y={264} textAnchor="middle" fill="#a19e93" fontSize={10} className="font-mono">peer A</text>
        <text x={610} y={246} textAnchor="middle" fill="#f1ede3" fontSize={13} className="font-mono" letterSpacing="0.12em">DOCTOR</text>
        <text x={610} y={264} textAnchor="middle" fill="#a19e93" fontSize={10} className="font-mono">peer B</text>

        {/* signalling arc */}
        <path d="M190 190 C 300 70, 500 70, 610 190" fill="none" stroke="#f1ede3" strokeOpacity={0.3} className="flow-dash" />
        <text x={400} y={92} textAnchor="middle" fill="#a19e93" fontSize={11} className="font-mono" letterSpacing="0.1em">SIGNALLING · SDP · ICE</text>

        {/* media waveform */}
        {bars.map((_, i) => {
          const x = 270 + i * (260 / bars.length);
          const base = 8 + Math.abs(Math.sin(i * 0.9)) * 34;
          return (
            <motion.rect
              key={i}
              x={x}
              width={4}
              rx={2}
              fill={accent}
              y={250 - base / 2}
              height={base}
              style={{ transformOrigin: `${x + 2}px 250px` }}
              animate={live ? { scaleY: [1, 0.3, 1.15, 1] } : { scaleY: 1 }}
              transition={live ? { duration: 1.4 + (i % 5) * 0.15, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
            />
          );
        })}
        <text x={400} y={330} textAnchor="middle" fill="#a19e93" fontSize={11} className="font-mono" letterSpacing="0.1em">AUDIO · VIDEO · CHAT — PEER-TO-PEER</text>

        {/* state chips */}
        {["ringing", "accepted", "muted", "reconnecting", "ended"].map((s, i) => (
          <g key={s} transform={`translate(${150 + i * 105} 410)`}>
            <rect width={92} height={26} rx={13} fill="none" stroke={i === 1 ? accent : "rgba(241,237,227,.2)"} />
            <text x={46} y={17} textAnchor="middle" fill={i === 1 ? accent : "#a19e93"} fontSize={10} className="font-mono">{s}</text>
          </g>
        ))}
      </svg>
    </Frame>
  );
}

function AggregatorVisual({ accent, live }: { accent: string; live: boolean }) {
  const sources = ["Zuno", "SBI General", "ICICI Lombard", "GoDigit"];
  const rows = [0.82, 0.64, 0.73, 0.55];
  return (
    <Frame label="Quote aggregation">
      <svg viewBox="0 0 800 500" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        {sources.map((s, i) => {
          const y = 95 + i * 105;
          return (
            <g key={s}>
              <rect x={40} y={y - 22} width={170} height={44} rx={10} fill="#0b0c0a" stroke="rgba(241,237,227,.25)" />
              <text x={58} y={y + 4} fill="#f1ede3" fontSize={13} className="font-mono">{s}</text>
              <path d={`M210 ${y} C 300 ${y}, 300 250, 380 250`} fill="none" stroke={accent} strokeOpacity={0.55} className="flow-dash" />
              {live ? (
                <motion.circle
                  r={4}
                  fill={accent}
                  animate={{ offsetDistance: ["0%", "100%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.45, ease: "easeInOut" }}
                  style={{ offsetPath: `path("M210 ${y} C 300 ${y}, 300 250, 380 250")` }}
                />
              ) : null}
            </g>
          );
        })}
        <rect x={380} y={205} width={120} height={90} rx={16} fill={accent} />
        <text x={440} y={245} textAnchor="middle" fill="#0b0c0a" fontSize={14} fontWeight={700} className="font-display">normalise()</text>
        <text x={440} y={266} textAnchor="middle" fill="#0b0c0a" fontSize={10} className="font-mono">unified model</text>
        <path d="M500 250 H 560" stroke={accent} strokeOpacity={0.6} className="flow-dash" />
        <rect x={560} y={110} width={210} height={280} rx={14} fill="#0b0c0a" stroke="rgba(241,237,227,.2)" />
        <text x={580} y={140} fill="#a19e93" fontSize={10} className="font-mono" letterSpacing="0.12em">COMPARE QUOTES</text>
        {rows.map((r, i) => (
          <g key={i}>
            <rect x={580} y={165 + i * 52} width={170} height={36} rx={8} fill="rgba(241,237,227,.04)" />
            <motion.rect
              x={590}
              y={180 + i * 52}
              height={6}
              rx={3}
              fill={i === 0 ? accent : "rgba(241,237,227,.35)"}
              initial={{ width: 0 }}
              whileInView={{ width: 150 * r }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.4 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            />
          </g>
        ))}
      </svg>
    </Frame>
  );
}

function BookingVisual({ accent }: { accent: string; live: boolean }) {
  const cells = Array.from({ length: 35 });
  const OFFSET = 2; // the month starts on the 3rd column
  const booked = new Set([4, 5, 11, 18, 19, 20, 27]);
  const stay = [13, 14, 15, 16]; // four nights, check-out on the 17th
  return (
    <Frame label="Availability engine">
      <svg viewBox="0 0 1000 420" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <text x={80} y={70} fill="#a19e93" fontSize={12} className="font-mono" letterSpacing="0.14em">SELECT DATES · CHECK AVAILABILITY</text>
        {cells.map((_, i) => {
          const day = i - OFFSET + 1;
          const col = i % 7;
          const row = Math.floor(i / 7);
          const x = 80 + col * 62;
          const y = 95 + row * 58;
          if (day < 1 || day > 31) {
            return <rect key={i} x={x} y={y} width={54} height={50} rx={8} fill="none" stroke="rgba(241,237,227,.05)" />;
          }
          const isBooked = booked.has(day);
          const inStay = stay.includes(day);
          return (
            <g key={i}>
              <rect x={x} y={y} width={54} height={50} rx={8} fill={isBooked ? "rgba(241,237,227,.06)" : "transparent"} stroke="rgba(241,237,227,.14)" />
              {inStay ? (
                <motion.rect
                  x={x}
                  y={y}
                  width={54}
                  height={50}
                  rx={8}
                  fill={accent}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.3 + stay.indexOf(day) * 0.18, duration: 0.4 }}
                />
              ) : null}
              <text x={x + 10} y={y + 20} fontSize={12} className="font-mono" fill={inStay ? "#0b0c0a" : isBooked ? "#6d6b63" : "#f1ede3"}>
                {String(day).padStart(2, "0")}
              </text>
              {isBooked ? <line x1={x + 10} y1={y + 36} x2={x + 44} y2={y + 36} stroke="#6d6b63" /> : null}
            </g>
          );
        })}
        <g transform="translate(600 120)">
          <rect width={320} height={220} rx={16} fill="#0b0c0a" stroke="rgba(241,237,227,.2)" />
          <text x={24} y={40} fill="#a19e93" fontSize={11} className="font-mono" letterSpacing="0.12em">ENQUIRY</text>
          <text x={24} y={84} fill="#f1ede3" fontSize={26} fontWeight={650} className="font-display">4 nights</text>
          <text x={24} y={112} fill="#a19e93" fontSize={12} className="font-mono">13 → 17 · room available</text>
          <rect x={24} y={146} width={272} height={46} rx={23} fill={accent} />
          <text x={160} y={175} textAnchor="middle" fill="#0b0c0a" fontSize={14} fontWeight={700} className="font-display">Request booking</text>
        </g>
      </svg>
    </Frame>
  );
}
