"use client";

import { useEffect, useState } from "react";

/* ===========================================================================
   The fore-edge index.

   A table of contents rendered as the edge of a book: one tick per section on
   the far left, the current one at full weight and extended. This is the only
   client-side JavaScript on the homepage, and it exists because a section's
   position relative to the reading zone is not something CSS can name.

   Hidden below lg — on a phone it would be a 44px strip stealing width from
   a 41rem measure, which is a bad trade. Mobile gets the running head instead.
   =========================================================================== */

export function ForeEdge({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => n !== null);

    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        /* Take the entry nearest the top of the reading zone rather than the
           first intersecting one, so scrolling up selects correctly too. */
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-12% 0px -70% 0px", threshold: 0 },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Sections"
      className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="flex flex-col gap-3">
        {sections.map((s) => {
          const on = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={on ? "true" : undefined}
                className="group flex items-center gap-2 py-1"
              >
                <span
                  aria-hidden="true"
                  className={`block h-px bg-ink transition-all duration-200 ${
                    on ? "w-7 opacity-100" : "w-3 opacity-30 group-hover:opacity-60"
                  }`}
                />
                <span
                  className={`font-util uppercase text-ink transition-opacity duration-150 ${
                    on ? "opacity-70" : "opacity-0 group-hover:opacity-50"
                  }`}
                  style={{ fontSize: "0.7rem", letterSpacing: "var(--tracking-label)" }}
                >
                  {s.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
