"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CountUp } from "./count-up";
import { Reveal } from "./reveal";
import { SectionLabel } from "./section-label";

const stats = [
  { to: 40, prefix: "$", suffix: "M", label: "Valuation anomaly I surfaced & escalated" },
  { to: 95, suffix: "%", label: "Peak AI-assisted adoption driven" },
  { to: 45, suffix: "+", label: "Countries on live commerce I built" },
  { to: 20, suffix: "k", label: "User reviews mined for a roadmap" },
];

// Abstract dotted globe — evokes reach without pretending to be an accurate map.
function Globe() {
  const reduce = useReducedMotion();
  const lats = [-44, -22, 0, 22, 44];
  return (
    <motion.svg
      viewBox="0 0 220 220"
      className="h-full w-full"
      aria-hidden
      animate={reduce ? undefined : { rotate: 360 }}
      transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
    >
      <circle cx={110} cy={110} r={92} fill="none" stroke="var(--color-line)" strokeWidth={1} />
      {lats.map((ly) => {
        const ry = Math.sqrt(Math.max(0, 92 * 92 - (ly * 2) ** 2)) / 1;
        const rx = Math.sqrt(Math.max(0, 92 * 92 - ly * ly));
        return (
          <ellipse
            key={ly}
            cx={110}
            cy={110 + ly}
            rx={rx}
            ry={Math.max(6, ry / 7)}
            fill="none"
            stroke="var(--color-line)"
            strokeWidth={1}
          />
        );
      })}
      {[0, 1, 2].map((i) => (
        <ellipse
          key={i}
          cx={110}
          cy={110}
          rx={92 - i * 30}
          ry={92}
          fill="none"
          stroke="var(--color-line-soft)"
          strokeWidth={1}
        />
      ))}
      {/* scattered "presence" dots */}
      {[
        [80, 70],
        [140, 90],
        [110, 60],
        [95, 130],
        [150, 140],
        [70, 110],
        [125, 155],
      ].map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={2.4}
          fill="var(--color-accent)"
          animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
        />
      ))}
    </motion.svg>
  );
}

export function StatsBand() {
  return (
    <section className="relative border-t border-line px-6 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.4fr_1fr]">
        <div>
          <SectionLabel index="02" title="By the numbers" />
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.05}>
                <div className="h-full bg-ink-soft px-5 py-7">
                  <div className="font-mono text-3xl font-semibold text-accent sm:text-4xl">
                    <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} />
                  </div>
                  <p className="mt-2 text-sm leading-snug text-text-muted">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="mx-auto aspect-square w-full max-w-[280px] opacity-90">
            <Globe />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
