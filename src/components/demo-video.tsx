"use client";

import { useEffect, useRef } from "react";

/* A screen recording of the real app, playing only while it is on screen.

   preload="none" so the page pays nothing for a video nobody scrolls to: the
   poster is all that loads until the figure is half in view. Muted, because
   browsers only allow autoplay muted, and because these have no sound.

   Reduced motion gets the poster and the controls, never autoplay — a
   forty-second screen recording starting by itself is exactly the motion
   that setting exists to refuse. */
export function DemoVideo({
  mp4,
  webm,
  poster,
  w,
  h,
  label,
}: {
  mp4: string;
  webm?: string;
  poster: string;
  w: number;
  h: number;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="block h-auto w-full"
      width={w}
      height={h}
      poster={poster}
      preload="none"
      muted
      loop
      playsInline
      controls
      aria-label={label}
    >
      {webm ? <source src={webm} type="video/webm" /> : null}
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
