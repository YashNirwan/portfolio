"use client";

import { ArrowUpRight } from "lucide-react";
import { about, profile } from "@/lib/data";
import { Reveal } from "./reveal";
import { SectionLabel } from "./section-label";

export function About() {
  return (
    <section id="about" className="relative scroll-mt-20 border-t border-line px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel index="05" title="About" />
        </Reveal>

        <div className="mt-10 grid gap-12 md:grid-cols-[0.85fr_1.15fr]">
          {/* Portrait */}
          <Reveal>
            <figure className="group relative md:sticky md:top-28">
              <div className="relative overflow-hidden rounded-2xl border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/yash.jpg"
                  alt="Yash Nirwan at NYU's 2026 commencement, Yankee Stadium"
                  width={900}
                  height={1200}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, color-mix(in oklab, var(--color-ink) 92%, transparent) 4%, transparent 38%)",
                  }}
                  aria-hidden
                />
                <figcaption className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-text-dim">
                  <span className="text-accent">NYU &rsquo;26</span>
                  <span>Yankee Stadium · NYC</span>
                </figcaption>
              </div>
            </figure>
          </Reveal>

          {/* Copy */}
          <div>
            <Reveal delay={0.08}>
              <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl text-balance">
                {about.lead}
              </h2>
            </Reveal>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-text-dim">
              {about.paragraphs.map((p, i) => (
                <Reveal key={p.slice(0, 24)} delay={0.12 + i * 0.12}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.45}>
              <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
                {[
                  { dt: "Now", dd: "MS, Management of Technology, NYU" },
                  { dt: "Before", dd: "BE, Computer Science, Ramaiah" },
                  { dt: "Based", dd: profile.location },
                ].map((row) => (
                  <div key={row.dt} className="bg-ink-soft px-5 py-5">
                    <dt className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">
                      {row.dt}
                    </dt>
                    <dd className="mt-2 text-sm text-text-dim">{row.dd}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.55}>
              <div className="mt-8">
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
                  <span className="text-accent">§</span> Beyond the work
                </p>
                <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
                  <a
                    href="https://lichess.org/@/YashNirwan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-ink-soft px-5 py-5 transition-colors hover:bg-surface"
                  >
                    <span className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.16em] text-text-muted">
                      Chess
                      <ArrowUpRight className="size-3.5 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                    </span>
                    <p className="mt-2 text-sm leading-relaxed text-text-dim">
                      I think in trade-offs and long games, on the board and off.
                    </p>
                  </a>

                  <div className="bg-ink-soft px-5 py-5">
                    <span className="font-mono text-xs uppercase tracking-[0.16em] text-text-muted">
                      Film
                    </span>
                    <p className="mt-2 text-sm leading-relaxed text-text-dim">
                      No Letterboxd, on purpose. I&rsquo;d rather form my own take than watch through
                      someone else&rsquo;s rating.
                    </p>
                  </div>

                  <div className="bg-ink-soft px-5 py-5">
                    <span className="font-mono text-xs uppercase tracking-[0.16em] text-text-muted">
                      Writing
                    </span>
                    <p className="mt-2 text-sm leading-relaxed text-text-dim">
                      Essays, published spasmodically. For now, mostly for myself.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
