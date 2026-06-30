"use client";

import { skillGroups } from "@/lib/data";
import { Reveal } from "./reveal";
import { SectionLabel } from "./section-label";

export function Skills() {
  return (
    <section id="skills" className="relative scroll-mt-20 border-t border-line px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel index="04" title="Toolkit" />
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl text-balance">
            Fluent from the strategy deck to the production deploy.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.06}>
              <div className="h-full bg-ink-soft p-6">
                <h3 className="font-mono text-sm text-text">
                  <span className="text-accent">0{i + 1}</span> {group.title}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-line-soft bg-surface/40 px-2.5 py-1 text-sm text-text-dim"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
