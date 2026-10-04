"use client";

/* "You're the 1,204th visitor here." Counts each browser once: the first visit
   asks /api/visitors for a number and keeps it in localStorage; later visits
   only read the total. Mounted invisibly in the layout so a visit counts on
   whichever page someone lands on, and visibly in the home page footer.

   Renders nothing until the count arrives, and nothing at all if the counter
   has no storage connected (the route answers null). */

import { useEffect, useState } from "react";

type Visit = { you: number; total: number; returning: boolean };

const STORE = "visitor-no";
let pending: Promise<Visit | null> | null = null; // one request per page, however many mounts

function load(): Promise<Visit | null> {
  pending ??= (async () => {
    let saved: number | null = null;
    try {
      saved = Number(localStorage.getItem(STORE)) || null;
    } catch {
      // Private mode or blocked storage: count the visit, just don't remember it.
    }
    try {
      if (saved) {
        const { total } = await (await fetch("/api/visitors")).json();
        return total ? { you: saved, total, returning: true } : null;
      }
      const { you, total } = await (await fetch("/api/visitors", { method: "POST" })).json();
      if (!you) return null;
      try {
        localStorage.setItem(STORE, String(you));
      } catch {}
      return { you, total, returning: false };
    } catch {
      return null;
    }
  })();
  return pending;
}

function ordinal(n: number) {
  const s = n % 100 >= 11 && n % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th";
  return `${n.toLocaleString("en-US")}${s}`;
}

export function VisitorCount({ silent = false }: { silent?: boolean }) {
  const [v, setV] = useState<Visit | null>(null);
  useEffect(() => {
    load().then(setV);
  }, []);
  if (silent || !v) return null;
  return (
    <p className="text-[15px] text-charcoal" aria-live="polite">
      {v.returning ? (
        <>
          Welcome back. You were the <span className="text-ember">{ordinal(v.you)}</span>; {v.total.toLocaleString("en-US")} people have found this page so far.
        </>
      ) : (
        <>
          You&rsquo;re the <span className="text-ember">{ordinal(v.you)}</span> visitor here. Welcome.
        </>
      )}
    </p>
  );
}
