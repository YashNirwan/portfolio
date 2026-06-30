"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionTemplate,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { radarAxes } from "@/lib/lenses";
import { useLens } from "./lens-context";

const SIZE = 320;
const C = SIZE / 2;
const R = 118;

// Vertex position for axis i (clockwise from top) at radius factor v (0–1).
function pt(i: number, v: number) {
  const a = (-90 + i * 72) * (Math.PI / 180);
  return [C + Math.cos(a) * R * v, C + Math.sin(a) * R * v] as const;
}

function ring(v: number) {
  return radarAxes.map((_, i) => pt(i, v).join(",")).join(" ");
}

export function LensRadar() {
  const { lens } = useLens();
  const reduce = useReducedMotion();
  const cfg = { stiffness: 120, damping: 18, mass: 0.6 };

  // One spring per axis so the polygon morphs smoothly between lenses.
  const s0 = useSpring(lens.radar[0], cfg);
  const s1 = useSpring(lens.radar[1], cfg);
  const s2 = useSpring(lens.radar[2], cfg);
  const s3 = useSpring(lens.radar[3], cfg);
  const s4 = useSpring(lens.radar[4], cfg);
  const springs = [s0, s1, s2, s3, s4];

  useEffect(() => {
    lens.radar.forEach((v, i) => springs[i].set(reduce ? v : v));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lens]);

  const points = useTransform(springs, (vals) =>
    vals.map((v, i) => pt(i, v as number).join(",")).join(" "),
  );

  // Per-vertex coordinates for the dots (explicit to satisfy rules-of-hooks).
  const vx0 = useTransform(s0, (v) => pt(0, v)[0]);
  const vy0 = useTransform(s0, (v) => pt(0, v)[1]);
  const vx1 = useTransform(s1, (v) => pt(1, v)[0]);
  const vy1 = useTransform(s1, (v) => pt(1, v)[1]);
  const vx2 = useTransform(s2, (v) => pt(2, v)[0]);
  const vy2 = useTransform(s2, (v) => pt(2, v)[1]);
  const vx3 = useTransform(s3, (v) => pt(3, v)[0]);
  const vy3 = useTransform(s3, (v) => pt(3, v)[1]);
  const vx4 = useTransform(s4, (v) => pt(4, v)[0]);
  const vy4 = useTransform(s4, (v) => pt(4, v)[1]);
  const vx = [vx0, vx1, vx2, vx3, vx4];
  const vy = [vy0, vy1, vy2, vy3, vy4];

  const fillStr = useMotionTemplate`${points}`;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[360px]">
      {/* Ambient accent wash + slow rotation behind the chart */}
      <motion.div
        className="absolute inset-6 rounded-full blur-2xl"
        style={{ background: "var(--color-accent-soft)" }}
        animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="relative h-full w-full overflow-visible"
        role="img"
        aria-label={`Skill radar emphasizing ${lens.role}`}
      >
        {/* Concentric web */}
        {[0.25, 0.5, 0.75, 1].map((v) => (
          <polygon
            key={v}
            points={ring(v)}
            fill="none"
            stroke="var(--color-line)"
            strokeWidth={1}
          />
        ))}

        {/* Spokes */}
        {radarAxes.map((_, i) => {
          const [x, y] = pt(i, 1);
          return (
            <line
              key={i}
              x1={C}
              y1={C}
              x2={x}
              y2={y}
              stroke="var(--color-line)"
              strokeWidth={1}
            />
          );
        })}

        {/* Animated value polygon */}
        <motion.polygon
          points={fillStr}
          fill="color-mix(in oklab, var(--color-accent) 16%, transparent)"
          stroke="var(--color-accent)"
          strokeWidth={1.75}
          strokeLinejoin="round"
        />

        {/* Vertex dots */}
        {radarAxes.map((_, i) => (
          <motion.circle
            key={i}
            cx={vx[i]}
            cy={vy[i]}
            r={lens.axis === i ? 4.5 : 2.5}
            fill={lens.axis === i ? "var(--color-accent)" : "var(--color-ink)"}
            stroke="var(--color-accent)"
            strokeWidth={1.5}
          />
        ))}

        {/* Axis labels */}
        {radarAxes.map((label, i) => {
          const [x, y] = pt(i, 1.24);
          const anchor = x < C - 6 ? "end" : x > C + 6 ? "start" : "middle";
          const active = lens.axis === i;
          return (
            <text
              key={label}
              x={x}
              y={y}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="font-mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.06em",
                fill: active ? "var(--color-accent)" : "var(--color-text-muted)",
                fontWeight: active ? 600 : 400,
                transition: "fill 0.4s ease",
              }}
            >
              {label.toUpperCase()}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
