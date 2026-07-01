import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Mail } from "lucide-react";
import { work } from "@/lib/data";
import { lensById } from "@/lib/lenses";
import { links } from "@/lib/data";

type Params = { params: Promise<{ slug: string }> };

const detailItems = work.filter((w) => w.caseStudy);

export function generateStaticParams() {
  return detailItems.map((w) => ({ slug: w.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = work.find((w) => w.id === slug);
  if (!item) return {};
  return {
    title: `${item.title} — Yash Nirwan`,
    description: item.blurb,
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const item = work.find((w) => w.id === slug && w.caseStudy);
  if (!item || !item.caseStudy) notFound();

  const cs = item.caseStudy;
  const tags = item.tags.map(lensById);
  const accent = tags[0]?.accent ?? "#3b9eff";

  return (
    <div
      className="accent-root min-h-screen"
      style={{ ["--accent" as string]: accent } as React.CSSProperties}
    >
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-line bg-ink/95">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 font-mono text-sm text-text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-4" />
            All work
          </Link>
          <a
            href={`mailto:${links.email}`}
            className="inline-flex items-center gap-2 font-mono text-sm text-text-muted transition-colors hover:text-accent"
          >
            <Mail className="size-3.5" />
            Get in touch
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Eyebrow + tags */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-[0.18em] text-text-muted">
          <span className="text-accent">{item.kind === "experience" ? "Experience" : "Project"}</span>
          <span aria-hidden>/</span>
          <span>{item.meta}</span>
        </div>

        <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-text sm:text-6xl">
          {item.title}
        </h1>
        <p className="mt-3 text-lg text-accent">{item.subtitle}</p>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-dim">{item.blurb}</p>

        {/* Filed under */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted">
            Filed under
          </span>
          {tags.map((l) => (
            <span key={l.id} className="inline-flex items-center gap-1.5 font-mono text-xs text-text-dim">
              <span className="size-1.5 rounded-full" style={{ backgroundColor: l.accent }} />
              {l.label}
            </span>
          ))}
        </div>

        {/* Links */}
        {item.links && (
          <div className="mt-7 flex flex-wrap gap-3">
            {item.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-text transition-colors hover:border-accent hover:text-accent"
              >
                {l.label}
                <ArrowUpRight className="size-3.5" />
              </a>
            ))}
          </div>
        )}

        {/* Image */}
        {item.image && (
          <figure className="mt-12 overflow-hidden rounded-2xl border border-line bg-surface/30">
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
              className="block h-auto w-full"
            />
          </figure>
        )}

        {/* Case study body */}
        <div className="mt-16 space-y-14">
          <Section label="01" title="Context">
            <p className="text-lg leading-relaxed text-text-dim">{cs.context}</p>
          </Section>

          <Section label="02" title="What I did">
            <ul className="space-y-4">
              {cs.whatIDid.map((d) => (
                <li key={d} className="flex gap-3 text-lg leading-relaxed text-text-dim">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  {d}
                </li>
              ))}
            </ul>
          </Section>

          <Section label="03" title="Outcome">
            <ul className="space-y-4">
              {cs.outcome.map((d) => (
                <li key={d} className="flex gap-3 text-lg leading-relaxed text-text-dim">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  {d}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {cs.charts && cs.charts.length > 0 && (
          <div className="mt-16">
            <div className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em]">
              <span className="text-accent">§04</span>
              <span className="h-px w-8 bg-line" aria-hidden />
              <span className="text-text-muted">From the analysis</span>
            </div>
            <div className="grid gap-10">
              {cs.charts.map((c) => (
                <figure key={c.src}>
                  <div className="overflow-hidden rounded-xl border border-line bg-white p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.src}
                      alt={c.caption}
                      loading="lazy"
                      className="mx-auto block h-auto w-full max-w-2xl rounded"
                    />
                  </div>
                  <figcaption className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted">
                    {c.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}

        {cs.closing && (
          <p className="mt-16 border-l-2 border-accent pl-6 font-display text-2xl leading-snug text-text text-balance">
            {cs.closing}
          </p>
        )}

        {/* Footer nav */}
        <div className="mt-20 border-t border-line pt-8">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 font-mono text-sm text-text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-4" />
            Back to all work
          </Link>
        </div>
      </main>
    </div>
  );
}

function Section({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em]">
        <span className="text-accent">§{label}</span>
        <span className="h-px w-8 bg-line" aria-hidden />
        <span className="text-text-muted">{title}</span>
      </div>
      {children}
    </section>
  );
}
