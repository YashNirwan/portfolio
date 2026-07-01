"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ<>/\\{}[]#*+=-_$%";

// Decodes to `text` with a terminal-style scramble whenever `text` changes.
// Only runs on change (never idle), so it's essentially free.
export function DecodeText({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);

  useEffect(() => {
    if (reduce) {
      setDisplay(text);
      return;
    }
    frame.current = 0;
    const steps = 14;
    const id = setInterval(() => {
      frame.current += 1;
      const revealed = Math.floor((frame.current / steps) * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (i < revealed || text[i] === " ") out += text[i];
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setDisplay(out);
      if (frame.current >= steps) {
        clearInterval(id);
        setDisplay(text);
      }
    }, 30);
    return () => clearInterval(id);
  }, [text, reduce]);

  return <span className={className}>{display}</span>;
}
