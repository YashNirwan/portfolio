import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { studies, getStudy, type Block } from "@/lib/studies";
import { work, links } from "@/lib/data";

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

  const title = `${study.title} — Yash Nirwan`;

  return {
    title,
    description: study.standfirst,
    alternates: { canonical: `/work/${study.slug}` },
    /* `images` has to be repeated here. Next merges metadata between segments
       shallowly, so defining `openGraph` at all replaces the root's object
       wholesale, including the images the root opengraph-image route
       contributes. Without this these pages ship a summary_large_image card
       with no image, which renders blank. */
    openGraph: {
      title,
      description: study.standfirst,
      type: "article",
      url: `/work/${study.slug}`,
      images: ["/opengraph-image"],
    },
    /* Same reason, opposite direction: the root's `twitter` block is
       inherited verbatim unless overridden, so these pages were advertising
       the homepage's title to any client that prefers twitter:* tags. */
    twitter: {
      card: "summary_large_image",
      title,
      description: study.standfirst,
      images: ["/opengraph-image"],
    },
  };
}

export default async function StudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getStudy(slug);
  if (!study) notFound();

  const item = work.find((w) => w.slug === slug);

  return (
    <>
      <header className="border-b border-ink">
        <div className="sheet flex items-baseline justify-between gap-4 py-3.5">
          <Link href="/" className="byline no-underline hover:underline">
            ← The front page
          </Link>
          <span className="byline">{study.meta}</span>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <section className="sheet pb-9 pt-12 md:pb-12 md:pt-16">
          <h1 className="display max-w-[12ch]">{study.title}</h1>
          <p className="lede pretty mt-6 max-w-[54ch]">{study.standfirst}</p>
        </section>

        {/* A study runs as one measure rather than in columns: newspaper
            columns work for a 300-word box and fight a 1,500-word read. */}
        <section className="sheet pb-16">
          <div className="flex flex-col">
            {study.blocks.map((block, i) => (
              <BlockView key={i} block={block} />
            ))}
          </div>

          {item && item.links.length > 0 ? (
            <div className="rule mt-14 max-w-[58ch] pt-4">
              <div className="flex flex-wrap gap-x-5 gap-y-1">
                {item.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                    {l.label}
                  </a>
                ))}
                <a href={`mailto:${links.email}`}>Ask me about it</a>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </>
  );
}

const MEASURE = "mx-auto w-full max-w-[38rem]";

function BlockView({ block }: { block: Block }) {
  if (block.kind === "h") {
    return <h2 className={`subhead mb-3 mt-12 ${MEASURE}`}>{block.text}</h2>;
  }

  if (block.kind === "pull") {
    /* Sized against the body, not against the masthead. At headline scale a
       three-line quote swamped everything around it. */
    return (
      <p
        className={`my-9 border-l border-ink pl-6 ${MEASURE}`}
        style={{
          fontFamily: "var(--font-mid)",
          fontSize: "1.5rem",
          lineHeight: 1.22,
          letterSpacing: "-0.02em",
        }}
      >
        {block.text}
      </p>
    );
  }

  if (block.kind === "figure") {
    return (
      <figure className="my-9">
        <Image
          src={block.src}
          alt={block.alt}
          width={block.w}
          height={block.h}
          sizes="(max-width: 768px) 100vw, 90rem"
          className="block h-auto w-full"
          style={{ boxShadow: "rgba(29, 29, 27, 0.2) -4px 4px 6px 0px" }}
        />
        <figcaption className={`byline mt-3 ${MEASURE}`}>{block.caption}</figcaption>
      </figure>
    );
  }

  return (
    <div className={MEASURE}>
      <p className={`pretty leading-[1.36] ${block.lede ? "lede" : "mb-4"}`}>{block.text}</p>
      {block.note ? (
        <div className="mb-4 mt-3 border-l border-ink pl-4">
          {block.note.label ? <p className="byline">{block.note.label}</p> : null}
          <p className="pretty mt-1 leading-[1.32] text-charcoal">{block.note.body}</p>
        </div>
      ) : null}
    </div>
  );
}
