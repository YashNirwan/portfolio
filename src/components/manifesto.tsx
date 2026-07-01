"use client";

import { motion, useReducedMotion } from "framer-motion";

const proofs = ["A strategy deck.", "A churn model.", "A payments system in production."];

export function Manifesto() {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.18, delayChildren: 0.05 } },
  };
  const line = {
    hidden: reduce ? {} : { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className="relative overflow-hidden px-6 py-28 sm:py-40">
      {/* Static accent wash — no scroll-linked transform, so it stays cheap. */}
      <div
        className="pointer-events-none absolute right-[-8%] top-1/2 h-[24rem] w-[24rem] -translate-y-1/2 rounded-full blur-[120px]"
        style={{ background: "var(--color-accent-soft)" }}
        aria-hidden
      />

      <motion.div
        className="relative mx-auto max-w-4xl"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-120px" }}
      >
        <motion.p
          variants={line}
          className="font-mono text-xs uppercase tracking-[0.25em] text-text-muted"
        >
          The through-line
        </motion.p>

        <h2 className="mt-8 font-display text-3xl font-medium leading-[1.22] tracking-tight sm:text-5xl sm:leading-[1.18]">
          <motion.span variants={line} className="block text-text-dim">
            I take something <span className="text-text">ambiguous</span> —
          </motion.span>
          <motion.span variants={line} className="block text-text-muted">
            a vague ask, a messy dataset, a half-formed idea —
          </motion.span>
          <motion.span variants={line} className="block text-text-dim">
            and turn it into something <span className="text-accent">shipped</span>.
          </motion.span>
        </h2>

        <motion.div variants={line} className="mt-12 flex flex-wrap gap-2.5">
          {proofs.map((p) => (
            <span
              key={p}
              className="rounded-full border border-line bg-surface/40 px-4 py-2 font-mono text-sm text-text-dim"
            >
              {p}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
