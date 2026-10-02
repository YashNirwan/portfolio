"use client";

import { useEffect, useRef, useState } from "react";

/* A screen recording of the real app, playing only while it is on screen.

   preload="none" so the page pays nothing for a video nobody scrolls to: the
   poster is all that loads until the figure is half in view. Muted, because
   browsers only allow autoplay muted, and because these have no sound.

   Reduced motion gets the poster and a play button, never autoplay — a
   forty-second screen recording starting by itself is exactly the motion
   that setting exists to refuse.

   No native controls. The captions are burned into the bottom of the frame,
   which is precisely where every browser draws its control bar whenever the
   video is paused; on a phone the bar covered the caption outright. With no
   soundtrack, half of that bar (mute, volume) controlled nothing anyway. One
   button in the top corner does the job that is left, and a video the reader
   paused stays paused when they scroll back to it. */
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
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !userPaused.current) v.play().catch(() => {});
        else if (!e.isIntersecting) v.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return (
    <div className="relative">
      <video
        ref={ref}
        className="block h-auto w-full cursor-pointer"
        width={w}
        height={h}
        poster={poster}
        preload="none"
        muted
        loop
        playsInline
        aria-label={label}
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        {webm ? <source src={webm} type="video/webm" /> : null}
        <source src={mp4} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause the recording" : "Play the recording"}
        className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-ink/80 text-parchment"
      >
        <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
          {playing ? (
            <path d="M2.5 1.5h2.2v9H2.5zM7.3 1.5h2.2v9H7.3z" fill="currentColor" />
          ) : (
            <path d="M3 1.2v9.6L10.4 6z" fill="currentColor" />
          )}
        </svg>
      </button>
    </div>
  );
}
