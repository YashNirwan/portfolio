"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

// A soft accent glow that trails the cursor across its (relative) parent.
// Listens on the parent element, so it never blocks clicks; single translated
// element, GPU-composited — cheap.
export function Spotlight() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (reduce) return;
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const onMove = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
    };
    const onLeave = () => {
      x.set(-600);
      y.set(-600);
    };
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, [reduce, x, y]);

  if (reduce) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <motion.div
        style={{ x: sx, y: sy }}
        className="absolute -left-64 -top-64 h-[32rem] w-[32rem] rounded-full opacity-60 blur-3xl"
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: "var(--color-accent-soft)" }}
        />
      </motion.div>
    </div>
  );
}
