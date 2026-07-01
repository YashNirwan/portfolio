"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { links } from "@/lib/data";

function ConfettiBurst() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        emoji: ["🎮", "✨", "🎉", "⚡", "🕹️", "🔵"][i % 6],
        left: Math.random() * 100,
        delay: Math.random() * 0.25,
        duration: 1.3 + Math.random() * 1,
        rotate: (Math.random() - 0.5) * 620,
        drift: (Math.random() - 0.5) * 180,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-[65] overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute text-2xl"
          style={{ left: `${p.left}%`, top: -40 }}
          initial={{ y: -40, x: 0, opacity: 0, rotate: 0 }}
          animate={{ y: "112vh", x: p.drift, opacity: [0, 1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}

// ↑ ↑ ↓ ↓ ← → ← → b a
const SEQUENCE = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

export function EasterEgg() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    // A note for whoever opens the console. Recruiters who inspect, take note.
    console.log(
      "%cYou opened the console. Of course you did.",
      "font:600 14px ui-monospace,monospace;color:#3b9eff;",
    );
    console.log(
      "%cSame attention to detail I bring to the work.\npsst: try  ↑ ↑ ↓ ↓ ← → ← → b a",
      "font:12px ui-monospace,monospace;color:#828b98;",
    );

    let index = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === SEQUENCE[index]) {
        index += 1;
        if (index === SEQUENCE.length) {
          setUnlocked(true);
          index = 0;
        }
      } else {
        index = key === SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {unlocked && <ConfettiBurst />}
      <AnimatePresence>
        {unlocked && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 240, damping: 22 }}
          className="fixed inset-x-4 bottom-5 z-[70] mx-auto max-w-md rounded-2xl border border-accent bg-ink-soft/95 p-5 shadow-[0_24px_70px_-20px_var(--color-accent-soft)] backdrop-blur-md"
          role="status"
        >
          <button
            onClick={() => setUnlocked(false)}
            aria-label="Dismiss"
            className="absolute right-3 top-3 rounded-full p-1 text-text-muted transition-colors hover:text-accent"
          >
            <X className="size-4" />
          </button>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            ⌁ Achievement unlocked
          </p>
          <p className="mt-3 font-display text-lg font-semibold text-text">
            You read all the way down here.
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-text-dim">
            Most people skim. You ran the Konami code on a portfolio. That&rsquo;s exactly the
            curiosity I bring to a problem. Let&rsquo;s talk.
          </p>
          <a
            href={`mailto:${links.email}?subject=Found the easter egg`}
            className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            Say hi →
          </a>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
