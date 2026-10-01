"use client";

import { useEffect, useRef } from "react";

/* The catalogue reads sideways.

   Two things make a lateral page feel right rather than awkward. The first
   is that an ordinary vertical wheel gesture has to drive it, because nobody
   reaches for shift-scroll. The second is that it must not swallow a
   trackpad's genuine horizontal swipe, or back-navigation gestures stop
   working.

   So: vertical wheel deltas are converted to horizontal, horizontal deltas
   are left alone, and once the shelf is at either end the event is released
   back to the page. Keyboard and touch are untouched — a touch drag already
   scrolls a horizontal container natively, and arrow keys still work because
   the container is focusable. */
export function Lateral({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect the OS setting: no wheel remapping for reduced-motion users.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onWheel = (e: WheelEvent) => {
      // A real horizontal gesture is left to the browser.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;

      const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = el.scrollLeft >= max - 1 && e.deltaY > 0;
      // Let the page have the event back at the ends, so the shelf does not
      // trap the scroll.
      if (atStart || atEnd) return;

      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      ref={ref}
      // tabIndex so arrow keys and Home/End reach the container.
      tabIndex={0}
      // Its own wheel remapping drives this shelf; smooth scroll stays out.
      data-lenis-prevent
      aria-label="Project catalogue"
      /* Sideways from lg only. On a phone a sideways shelf showed the opening
         panel and a sliver of the first spine, with nothing to say there was
         more, and its swipe competed with the back gesture. Below lg it is an
         ordinary column; the wheel handler finds nothing to scroll and stands
         aside. */
      className="lg:h-svh lg:overflow-x-auto lg:overflow-y-hidden"
    >
      <div className="shelf flex flex-col lg:h-full lg:w-max lg:flex-row lg:items-stretch">{children}</div>
    </div>
  );
}
