"use client";

import { useEffect, useState } from "react";

/* The Daily Bugle open.

   A folded paper spins in from nothing, unwinds, and settles into the page —
   the shot every newspaper montage in film uses to deliver a headline. It
   runs once per session, not once per navigation, because a title sequence
   you cannot skip is charming exactly one time.

   Rendered client-side and mounted after paint so it never blocks the LCP
   text underneath, and skipped entirely for reduced-motion. */
export function Spinner({ masthead }: { masthead: string }) {
  const [state, setState] = useState<"idle" | "running" | "done">("idle");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("done");
      return;
    }
    // sessionStorage, not localStorage: a fresh visit gets the open, a
    // second page in the same visit does not.
    if (sessionStorage.getItem("seen-open") === "1") {
      setState("done");
      return;
    }
    sessionStorage.setItem("seen-open", "1");
    setState("running");
    const t = window.setTimeout(() => setState("done"), 1750);
    return () => window.clearTimeout(t);
  }, []);

  if (state === "done" || state === "idle") return null;

  return (
    <div
      className="spin-stage fixed inset-0 z-50 grid place-items-center"
      aria-hidden="true"
      style={{ background: "var(--color-parchment)" }}
    >
      <div className="spin-paper">
        <div className="ink w-[min(76vw,40rem)]">
          <svg viewBox="0 0 900 180" className="block w-full" role="presentation">
            <text
              x="450"
              y="140"
              textAnchor="middle"
              textLength="900"
              lengthAdjust="spacing"
              fill="currentColor"
              style={{ fontFamily: "var(--font-display)", fontSize: "180px", fontWeight: 400 }}
            >
              NIRWAN
            </text>
          </svg>
        </div>
        <p className="gothic mt-4 text-center text-[clamp(1.1rem,2.6vw,1.7rem)]">{masthead}</p>
      </div>
    </div>
  );
}
