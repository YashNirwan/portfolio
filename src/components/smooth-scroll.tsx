"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/* The reference's scroll.

   Read out of its source: `new LocomotiveScroll({ smooth: true })`, on
   non-touch devices only. The page glides behind the wheel with inertia, and
   that lag — not any per-element effect — is most of what reads as depth
   there. Its Webflow interactions carry no scroll-linked transforms at all;
   they were decoded and checked.

   Lenis rather than Locomotive: it is the same studio's successor, ~4 KB, and
   it moves the document's REAL scroll position. Locomotive v4 fakes scrolling
   by translating a fixed container, which would leave every CSS
   `animation-timeline: view()` on this site — the parallax, the rules that
   draw themselves — reading a scroll position that never changes.

   Off for reduced motion, and off for touch (Lenis leaves touch native unless
   syncTouch is set), matching the reference's own `is_touch_device()` guard.
   The catalogue's sideways shelf opts out with `data-lenis-prevent` so its own
   wheel remapping keeps working. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      // Locomotive's default lerp, which is what the reference runs on.
      lerp: 0.1,
      smoothWheel: true,
      autoRaf: true,
      // In-page links (the skip link, #main) glide instead of jumping.
      anchors: true,
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
