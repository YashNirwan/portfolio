"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { work, type WorkItem } from "@/lib/data";
import { lenses, lensById } from "@/lib/lenses";
import { useLens } from "./lens-context";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { SectionLabel } from "./section-label";

// Header shows which lenses this piece is filed under — a real index into the
// switcher above, color-coded by discipline (not decoration).
function CardHeader({ item, n }: { item: WorkItem; n: number }) {
  const tagged = item.tags.map(lensById);
  return (
    <div className="relative mb-5 flex flex-wrap items-center justify-between gap-3 overflow-hidden rounded-xl border border-line-soft bg-surface/30 px-4 py-3">
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">
        <span className="text-accent">{String(n).padStart(2, "0")}</span>{" "}
        {item.kind === "experience" ? "Experience" : "Project"}
      </span>
      <span className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
          filed under
        </span>
        {tagged.map((l) => (
          <span
            key={l.id}
            title={l.role}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-text-dim"
          >
            <span className="size-1.5 rounded-full" style={{ backgroundColor: l.accent }} />
            {l.label}
          </span>
        ))}
      </span>
    </div>
  );
}

function Card({ item, n }: { item: WorkItem; n: number }) {
  const wide = item.featured;
  const isProject = item.kind === "project";
  const isExternal = !!item.external;
  const href = item.external ?? (isProject ? `/work/${item.id}` : null);
  const clickable = isProject && !!href;
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col rounded-2xl border border-line bg-ink-soft p-6 transition-[border-color,box-shadow] duration-300 hover:border-accent/50 hover:shadow-[0_24px_60px_-30px_var(--color-accent-soft)]",
        wide && "md:col-span-2",
        clickable && "cursor-pointer",
      )}
    >
      {clickable &&
        (isExternal ? (
          <a
            href={href!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${item.title} — visit live site`}
            className="absolute inset-0 z-0 rounded-2xl"
          />
        ) : (
          <Link
            href={href!}
            aria-label={`${item.title} — read case study`}
            className="absolute inset-0 z-0 rounded-2xl"
          />
        ))}

      {item.image && (
        <figure className="mx-auto mb-5 w-full max-w-xl overflow-hidden rounded-xl border border-line bg-surface/30">
          <figcaption className="flex items-center gap-1.5 border-b border-line-soft px-3 py-2">
            <span className="size-2 rounded-full bg-line" aria-hidden />
            <span className="size-2 rounded-full bg-line" aria-hidden />
            <span className="size-2 rounded-full bg-line" aria-hidden />
            {item.imageDomain && (
              <span className="ml-2 truncate font-mono text-[10px] text-text-muted">
                {item.imageDomain}
              </span>
            )}
          </figcaption>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.imageAlt ?? `${item.title} interface`}
            loading="lazy"
            className="block h-auto w-full"
          />
        </figure>
      )}

      <CardHeader item={item} n={n} />

      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-xl font-semibold text-text">{item.title}</h3>
        <span className="shrink-0 font-mono text-xs text-text-muted">{item.meta}</span>
      </div>
      <p className="mt-0.5 text-sm text-accent">{item.subtitle}</p>
      <p className="mt-3 text-sm leading-relaxed text-text-dim">{item.blurb}</p>

      <ul className="mt-4 space-y-2">
        {item.highlights.slice(0, wide ? 3 : 2).map((h) => (
          <li key={h} className="flex gap-2.5 text-sm leading-relaxed text-text-muted">
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
            {h}
          </li>
        ))}
      </ul>

      <div className={cn("mt-auto pt-5", !clickable && "relative z-10")}>
        {item.stack && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {item.stack.map((s) => (
              <span
                key={s}
                className="rounded-md border border-line-soft bg-surface/50 px-2 py-0.5 font-mono text-[11px] text-text-muted"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {clickable ? (
          <div className="flex items-center justify-end">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              {isExternal ? (
                <>
                  Visit live site
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </>
              ) : (
                <>
                  Read case study
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </span>
          </div>
        ) : (
          item.links && (
            <div className="flex flex-wrap gap-4">
              {item.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-text transition-colors hover:text-accent"
                >
                  {l.label}
                  <ArrowUpRight className="size-3.5" />
                </a>
              ))}
            </div>
          )
        )}
      </div>
    </motion.article>
  );
}

// Experiences first, then projects with visuals (screenshot or charts), then
// text-only case studies at the bottom.
const visualRank = (w: WorkItem) =>
  w.kind === "experience" ? 0 : w.image || w.caseStudy?.charts?.length ? 1 : 2;

export function Work() {
  const { active, setActive } = useLens();
  const filtered = (active === "all" ? work : work.filter((w) => w.tags.includes(active)))
    .slice()
    .sort((a, b) => visualRank(a) - visualRank(b));

  return (
    <section id="work" className="relative scroll-mt-20 border-t border-line px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel index="03" title="Selected work" />
          <div className="mt-6 flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl text-balance">
              Proof, filtered by what you need.
            </h2>
            <p className="max-w-sm text-sm text-text-muted">
              {active === "all"
                ? `Everything — ${work.length} pieces across consulting, product, data, and code.`
                : `Showing ${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"} relevant to this lens.`}
            </p>
          </div>
        </Reveal>

        {/* Filter chips mirror the hero lens switcher (shared state). */}
        <div className="mt-8 flex flex-wrap gap-2">
          {lenses.map((l) => {
            const isActive = l.id === active;
            return (
              <button
                key={l.id}
                onClick={() => setActive(l.id)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                  isActive
                    ? "border-accent text-ink"
                    : "border-line bg-surface/40 text-text-muted hover:border-text-muted hover:text-text",
                )}
                style={isActive ? { backgroundColor: "var(--color-accent)" } : undefined}
              >
                {l.label}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <Card key={item.id} item={item} n={i + 1} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
