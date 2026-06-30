"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";
import { lenses } from "@/lib/lenses";
import { links, profile } from "@/lib/data";
import { GithubIcon, LinkedinIcon } from "./brand-icons";
import { useLens } from "./lens-context";
import { LensRadar } from "./lens-radar";
import { cn } from "@/lib/utils";

function Crosshair({ className }: { className?: string }) {
  return (
    <span className={cn("pointer-events-none absolute text-line", className)} aria-hidden>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 0v18M0 9h18" stroke="currentColor" strokeWidth="1" />
      </svg>
    </span>
  );
}

export function Hero() {
  const { active, lens, setActive } = useLens();
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden px-6 pt-24 pb-16"
    >
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 grid-fade" aria-hidden />
      <div
        className="pointer-events-none absolute right-0 top-1/4 h-[40rem] w-[40rem] translate-x-1/3 rounded-full blur-[140px] opacity-70"
        style={{ background: "var(--color-accent-soft)" }}
        aria-hidden
      />
      <Crosshair className="left-5 top-20" />
      <Crosshair className="right-5 top-20" />
      <Crosshair className="bottom-6 left-5" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: copy */}
        <div className="order-2 lg:order-1">
          {/* Eyebrow */}
          <div className="mb-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
            <span className="text-text-dim">{profile.name}</span>
            <span aria-hidden>/</span>
            <span>{profile.location}</span>
            <span aria-hidden>/</span>
            <span className="inline-flex items-center gap-1.5 text-accent">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              Open to 2026 roles
            </span>
          </div>

          {/* Lens switcher — the signature */}
          <div className="mb-7">
            <p className="mb-3 font-mono text-xs text-text-muted">
              <span className="text-accent">↳</span> hiring for which lens?
            </p>
            <div role="tablist" aria-label="Choose a role lens" className="flex flex-wrap gap-2">
              {lenses.map((l) => {
                const isActive = l.id === active;
                return (
                  <button
                    key={l.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(l.id)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                      isActive
                        ? "border-accent text-ink"
                        : "border-line bg-surface/40 text-text-muted hover:border-text-muted hover:text-text",
                    )}
                    style={isActive ? { backgroundColor: "var(--color-accent)" } : undefined}
                  >
                    {l.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Morphing headline + blurb */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={reduce ? false : { opacity: 0, y: 14, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce ? undefined : { opacity: 0, y: -10, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-3 font-mono text-sm text-accent">{lens.role}</p>
              <h1 className="font-display text-4xl font-semibold leading-[1.04] tracking-tight text-balance text-text sm:text-5xl">
                {lens.headline}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-dim text-balance">
                {lens.blurb}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Proof points */}
          <AnimatePresence mode="wait">
            <motion.dl
              key={`proof-${active}`}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3"
            >
              {lens.proof.map((p) => (
                <div key={p.label} className="bg-ink-soft px-5 py-4">
                  <dd className="font-mono text-xl font-medium text-text">{p.value}</dd>
                  <dt className="mt-1 text-xs leading-snug text-text-muted">{p.label}</dt>
                </div>
              ))}
            </motion.dl>
          </AnimatePresence>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              See the work
              <ArrowDown className="size-4" />
            </a>
            <a
              href={`mailto:${links.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-text transition-colors hover:border-accent hover:text-accent"
            >
              <Mail className="size-4" />
              Get in touch
            </a>

            <div className="ml-auto flex items-center gap-1">
              {[
                { href: links.github, icon: GithubIcon, label: "GitHub" },
                { href: links.linkedin, icon: LinkedinIcon, label: "LinkedIn" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-full border border-line p-2.5 text-text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right: radar */}
        <div className="relative order-1 lg:order-2">
          <LensRadar />
          <div className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
            <AnimatePresence mode="wait">
              <motion.span
                key={lens.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {lens.id === "all" ? "balanced across five disciplines" : `optimized for ${lens.label}`}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
