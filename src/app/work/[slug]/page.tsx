import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { studies, getStudy, type Block } from "@/lib/studies";
import { work, links } from "@/lib/data";
import { Spread, Note } from "@/components/spread";

export const dynamicParams = false;

export function generateStaticParams() {
  return studies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getStudy(slug);
  if (!study) return {};

  return {
    title: `${study.title} — Yash Nirwan`,
    description: study.standfirst,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: {
      title: `${study.title} — Yash Nirwan`,
      description: study.standfirst,
      type: "article",
      url: `/work/${study.slug}`,
    },
  };
}

export default async function StudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getStudy(slug);
  if (!study) notFound();

  const item = work.find((w) => w.slug === slug);

  return (
    <div className="mx-auto max-w-[72rem] px-5 pb-32 sm:px-8">
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-ink py-4">
        <Link
          href="/"
          className="font-util uppercase no-underline"
          style={{ fontSize: "var(--text-label)", letterSpacing: "var(--tracking-label)" }}
        >
          ← Yash Nirwan
        </Link>
        <span
          className="font-util uppercase text-graphite"
          style={{ fontSize: "var(--text-label)", letterSpacing: "var(--tracking-label)" }}
        >
          {study.meta}
        </span>
      </header>

      <main id="main">
        <section className="pb-12 pt-[10vh] md:pb-16 md:pt-[16vh]">
          <Spread>
            <h1
              className="balance font-display font-normal"
              style={{
                fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
                lineHeight: "var(--leading-display)",
                letterSpacing: "var(--tracking-display)",
              }}
            >
              {study.title}
            </h1>
            <p className="pretty mt-6 text-graphite" style={{ fontSize: "1.2rem" }}>
              {study.standfirst}
            </p>
          </Spread>
        </section>

        <div className="flex flex-col gap-y-5">
          {study.blocks.map((block, i) => (
            <BlockView key={i} block={block} />
          ))}
        </div>

        {item && item.links.length > 0 ? (
          <div className="mt-16 border-t border-ink pt-4">
            <Spread>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {item.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="font-util">
                    {l.label}
                  </a>
                ))}
                <a href={`mailto:${links.email}`} className="font-util text-graphite">
                  Ask me about it
                </a>
              </div>
            </Spread>
          </div>
        ) : null}
      </main>
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  if (block.kind === "h") {
    return (
      <Spread className="mt-10">
        <h2
          className="balance font-display font-normal"
          style={{ fontSize: "1.72rem", lineHeight: "1.1", letterSpacing: "var(--tracking-sub)" }}
        >
          {block.text}
        </h2>
      </Spread>
    );
  }

  if (block.kind === "pull") {
    return (
      <Spread className="my-4">
        <p
          className="balance border-l-2 border-ink pl-5 font-display"
          style={{ fontSize: "1.5rem", lineHeight: "1.2", letterSpacing: "var(--tracking-sub)" }}
        >
          {block.text}
        </p>
      </Spread>
    );
  }

  if (block.kind === "figure") {
    return (
      <figure className="my-8">
        <Image
          src={block.src}
          alt={block.alt}
          width={block.w}
          height={block.h}
          sizes="(max-width: 768px) 100vw, 72rem"
          className="h-auto w-full"
        />
        <figcaption
          className="mt-3 max-w-[41rem] font-util text-graphite"
          style={{ fontSize: "var(--text-note)", lineHeight: "var(--leading-note)" }}
        >
          {block.caption}
        </figcaption>
      </figure>
    );
  }

  return (
    <Spread note={block.note ? <Note {...block.note} /> : undefined}>
      <p className={`pretty hang ${block.lede ? "lede" : ""}`}>{block.text}</p>
    </Spread>
  );
}
