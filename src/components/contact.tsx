"use client";

import { ArrowUpRight, Mail } from "lucide-react";
import { links, profile } from "@/lib/data";
import { GithubIcon, LinkedinIcon } from "./brand-icons";
import { Reveal } from "./reveal";
import { SectionLabel } from "./section-label";

const channels = [
  { label: "Email", value: links.email, href: `mailto:${links.email}`, icon: Mail },
  { label: "LinkedIn", value: "in/yash-nirwan", href: links.linkedin, icon: LinkedinIcon },
  { label: "GitHub", value: "@yashnirwan", href: links.github, icon: GithubIcon },
];

export function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-20 border-t border-line px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel index="06" title="Contact" />
          <h2 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-text sm:text-6xl text-balance">
            Let&rsquo;s find the seam between the technical and the commercial.
          </h2>
          <p className="mt-5 max-w-xl text-lg text-text-dim">
            Open to PM, PMM, analyst, consulting, and solutions-engineering roles for 2026.
            The fastest way to reach me is email.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          {channels.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.06}>
              <a
                href={c.href}
                target={c.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="group flex h-full items-center justify-between gap-4 bg-ink-soft p-6 transition-colors hover:bg-surface"
              >
                <span>
                  <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-text-muted">
                    <c.icon className="size-3.5" />
                    {c.label}
                  </span>
                  <span className="mt-2 block text-text transition-colors group-hover:text-accent">
                    {c.value}
                  </span>
                </span>
                <ArrowUpRight className="size-4 text-text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10">
            <a
              href={links.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              Download résumé
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </Reveal>
      </div>

      <footer className="mx-auto mt-24 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-line pt-8 font-mono text-xs text-text-muted sm:flex-row">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Vibe-coded, not templated · Next.js</span>
      </footer>
    </section>
  );
}
