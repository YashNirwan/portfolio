"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { links } from "@/lib/data";
import { cn } from "@/lib/utils";

const sections = [
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-line bg-ink/95"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#top"
          className="font-mono text-sm tracking-tight text-text"
          aria-label="Yash Nirwan, home"
        >
          <span className="text-accent">Y</span>N
          <span className="text-text-muted">·</span>
          <span className="text-text-muted">portfolio</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-sm text-text-muted transition-colors hover:text-text"
            >
              {s.label}
            </a>
          ))}
        </div>

        <a
          href={links.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-1.5 text-sm text-text transition-colors hover:border-accent hover:text-accent"
        >
          Résumé
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </nav>
    </header>
  );
}
