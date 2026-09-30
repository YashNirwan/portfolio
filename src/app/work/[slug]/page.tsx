import type { Metadata } from "next";
import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStudy, type Block, type Note } from "@/lib/studies";
import { work, links } from "@/lib/data";
import { Torn } from "@/components/torn";

export const dynamicParams = false;

/* Derived from `work`, not from `studies`.

   Generating only the slugs that have a long-form study is what made three
   of the six projects 404: both the homepage strip and the catalogue shelf
   link every project to /work/<slug>, and Raivana, VibeCheck and farewatch
   had no page at the other end. Three dead links out of six, on the only
   path into the work.

   Every project has a page now. The three with studies get the long form;
   the rest get the short form already written in data.ts — `standfirst`,
   `body`, `turn` — which until now rendered nowhere at all. */
export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = work.find((w) => w.slug === slug);
  if (!item) return {};

  const study = getStudy(slug);
  const title = `${item.title} — Yash Nirwan`;
  /* The study's standfirst is the more considered sentence where there is
     one; the card's standfirst is the fallback, and it is written to stand
     alone anyway because it has to work on the shelf. */
  const description = study?.standfirst ?? item.standfirst;

  return {
    title,
    description,
    alternates: { canonical: `/work/${item.slug}` },
    /* `images` has to be repeated here. Next merges metadata between segments
       shallowly, so defining `openGraph` at all replaces the root's object
       wholesale, including the images the root opengraph-image route
       contributes. Without this these pages ship a summary_large_image card
       with no image, which renders blank. */
    openGraph: {
      title,
      description,
      type: "article",
      url: `/work/${item.slug}`,
      images: ["/opengraph-image"],
    },
    /* Same reason, opposite direction: the root's `twitter` block is
       inherited verbatim unless overridden, so these pages were advertising
       the homepage's title to any client that prefers twitter:* tags. */
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function StudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = work.find((w) => w.slug === slug);
  if (!item) notFound();

  const study = getStudy(slug);
  const title = study?.title ?? item.title;
  const standfirst = study?.standfirst ?? item.standfirst;

  return (
    /* Project pages sit on bone cream, a darker stock than the front page.
       That is how the reference separates a story from the paper it came
       wrapped in. */
    <div className="bg-bone">
      {/* Hero: full-bleed image, a torn edge, and the title straddling it. */}
      <section className="relative">
        <ViewTransition name={`folder-${slug}`}>
        <div className="unfold relative h-[46svh] min-h-[320px] w-full overflow-hidden md:h-[58svh]">
          {item.image ? (
            <Image
              src={item.image.src}
              alt={item.image.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: item.image.position ?? "center" }}
            />
          ) : (
            <div className="h-full w-full bg-ink" />
          )}
        </div>
        </ViewTransition>

        <Link
          href="/work"
          className="absolute left-5 top-5 inline-flex items-center gap-2 border border-ink bg-parchment px-4 py-2 no-underline md:left-10"
          style={{ borderRadius: "var(--radius-sm)" }}
        >
          <span aria-hidden="true">←</span>
          <span className="heavy text-[13px]">Back all</span>
        </Link>

        {/* The tear, pulled up over the base of the image. */}
        <Torn className="relative -mt-[46px] h-[48px]" />

        <div className="sheet relative -mt-[6vw] pb-8 md:-mt-[5vw]">
          <h1 className="heavy press text-[clamp(3rem,11vw,9rem)]">{title}</h1>
        </div>
      </section>

      {/* Meta bar: what it was, what it is tagged, when. */}
      <div className="sheet">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink py-4">
          <p className="byline">
            <span className="heavy mr-2 text-[13px]">Role</span>
            {item.kicker}
          </p>
          <div className="flex flex-wrap gap-2">
            {item.stack.slice(0, 3).map((t) => (
              <span
                key={t}
                className="inline-block px-2.5 py-1"
                style={{
                  background: "var(--color-ink)",
                  color: "var(--color-parchment)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <span className="heavy text-[12px]">{t}</span>
              </span>
            ))}
          </div>
          <p className="byline tabular">{item.kicker.split("·").pop()?.trim()}</p>
        </div>
      </div>

      <main id="main" tabIndex={-1} className="sheet pb-16 pt-10">
        <p className="lede pretty mx-auto mb-10 max-w-[38rem]">{standfirst}</p>

        <div className="flex flex-col">
          {study ? (
            study.blocks.map((block, i) => <BlockView key={i} block={block} />)
          ) : (
            <ShortForm body={item.body} turn={item.turn} />
          )}
        </div>

        {/* Outside the links block on purpose. This used to live inside it,
            which meant the one project with no external links — the one page
            where asking is the only thing left to do — was also the one page
            with no way to ask. */}
        <div className={`mt-14 border-t border-ink pt-4 ${MEASURE}`}>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {item.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            ))}
            <a href={`mailto:${links.email}`}>Ask me about it</a>
          </div>
        </div>

        <div className={`mt-12 ${MEASURE}`}>
          <Link href="/work" className="heavy inline-block text-[17px] no-underline hover:underline">
            ← All work
          </Link>
        </div>
      </main>
    </div>
  );
}

const MEASURE = "mx-auto w-full max-w-[38rem]";

/* The short form, for a project without a long-form study: what it does,
   then what it cost. Both strings already existed in data.ts and were being
   rendered nowhere — the catalogue card shows only the standfirst. */
function ShortForm({ body, turn }: { body: string; turn: string }) {
  return (
    <div className={MEASURE}>
      <p className="pretty mb-4 leading-[1.36]">{body}</p>
      <NoteView note={{ label: "The cost", tone: "cost", body: turn }} />
    </div>
  );
}

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
      <figure className="my-9 bg-parchment p-3">
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
      {block.note ? <NoteView note={block.note} /> : null}
    </div>
  );
}

/* `tone` was declared on Note, set to "cost" on four of them, and then never
   read — so the paragraph where a project admits what it gave up rendered
   identically to a footnote about tooling. It is the one thing this site is
   actually arguing, so it gets the ember rule. One accent, used on the one
   idea that earns it. */
function NoteView({ note }: { note: Note }) {
  const cost = note.tone === "cost";

  return (
    <div
      className="mb-4 mt-3 border-l pl-4"
      style={{ borderColor: cost ? "var(--color-ember)" : "var(--color-ink)" }}
    >
      {note.label ? (
        <p className="byline" style={cost ? { color: "var(--color-ember)" } : undefined}>
          {note.label}
        </p>
      ) : null}
      <p className="pretty mt-1 leading-[1.32] text-charcoal">{note.body}</p>
    </div>
  );
}
