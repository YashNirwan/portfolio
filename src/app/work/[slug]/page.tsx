import type { Metadata } from "next";
import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStudy, type Block, type Note } from "@/lib/studies";
import { work, links } from "@/lib/data";
import { Torn } from "@/components/torn";
import { WorkCard } from "@/components/work-card";

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
              preload
              sizes="100vw"
              /* `priority` is deprecated in Next 16 in favour of `preload`,
                 which names what it actually does: a <link rel=preload> in
                 the head. Same behaviour, no deprecation warning. */
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
          <span className="heavy text-[13px]">All work</span>
        </Link>

        {/* The tear, pulled up over the base of the image. */}
        <Torn className="relative -mt-[46px] h-[48px]" />

        {/* The title used to be pulled up -6vw INTO the tear, so the ragged
            edge cut straight through the letterforms — "INTERFACE-CUA" was
            sliced across its waist. The reference sets the title clear below
            its tear. A small lift keeps the two locked together without the
            collision.

            The size is capped in ch as well as vw: at 11vw a long slug ran
            into the gutter on both sides. Capping by character count lets
            "Foreman" stay huge and brings "interface-cua" down to fit. */}
        <div className="sheet relative -mt-[1.2vw] pb-8">
          <h1
            className="heavy press"
            style={{ fontSize: `min(11vw, 9rem, ${Math.round(190 / title.length)}vw)` }}
          >
            {title}
          </h1>
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
        {/* Two columns, the way the reference runs a project: the reading
            column on the left and a margin rail on the right carrying the
            evidence — notes, figures, and the link out.

            It used to be a single 38rem column centred in the sheet, which at
            1440 left 416px of empty paper down BOTH sides and made every
            project read as an unfinished page. The notes were the worst of
            it: `Note` exists because the old design had a margin-note system
            (studies.ts still says so, and this branch is called
            overhaul-margin), and they had been folded inline into the column
            where they just interrupted the argument. They belong out here. */}
        <div className="article">
          <p className="col-main lede pretty mb-8">{standfirst}</p>

          {/* The reference puts a LIVE SITE control at exactly this spot. */}
          <aside className="col-rail mb-8">
            <div className="flex flex-wrap gap-2">
              {item.stack.map((t) => (
                <span key={t} className="byline byline-caps border border-ink/40 px-2.5 py-1">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              {item.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block border border-ink px-6 py-2.5 no-underline"
                  style={{ borderRadius: "999px" }}
                >
                  <span className="heavy text-[14px]">{l.label}</span>
                </a>
              ))}
              {/* Outside the links list on purpose. This used to sit inside a
                  `links.length > 0` guard, so interface-cua — the one project
                  with no external links, the one page where asking is all
                  that is left — was the one page with no way to ask. */}
              <a href={`mailto:${links.email}`} className="byline">
                Ask me about it
              </a>
            </div>
          </aside>

          {study ? (
            study.blocks.map((block, i) => <BlockView key={i} block={block} />)
          ) : (
            <>
              {/* The same reversed-out cap the studies open with. Without it
                  Raivana, VibeCheck and farewatch were the three project
                  pages whose reading column started on bare body text, which
                  read as a different template rather than a shorter one. */}
              <p className="col-main lede pretty mb-4 leading-[1.36]">
                <span className="capbox" aria-hidden="true">
                  {item.body.charAt(0)}
                </span>
                {item.body.slice(1)}
              </p>
              <NoteView note={{ label: "The cost", tone: "cost", body: item.turn }} />
            </>
          )}
        </div>

        <div className="col-main mt-14">
          <Link href="/work" className="heavy inline-block text-[17px] no-underline hover:underline">
            ← All work
          </Link>
        </div>
      </main>

      <NextProjects currentSlug={item.slug} />
    </div>
  );
}

/* The reference ends every project with a NEXT PROJECTS! strip rather than a
   dead end: a card, centred display type with a Tip!, and a second card. Same
   shape as the homepage strip, so it is the same component. */
function NextProjects({ currentSlug }: { currentSlug: string }) {
  const start = work.findIndex((w) => w.slug === currentSlug);
  const rest = [...work.slice(start + 1), ...work.slice(0, start)];
  const picks = [rest[0], rest[rest.length - 1]];

  return (
    <section className="sheet border-t border-ink py-10">
      <div className="ruled grid gap-x-7 gap-y-10 md:grid-cols-3">
        <WorkCard item={picks[0]} />

        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="heavy text-[clamp(2rem,3.6vw,3rem)]">
            <Link href="/work" className="tighten inline-block no-underline hover:underline">
              Next projects!
            </Link>
          </h2>
          <p
            className="pretty mt-4 max-w-[18ch]"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "clamp(1.5rem,2.6vw,2.3125rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
            }}
          >
            The rest of it, and what each one cost.
          </p>
          <p className="byline mt-5">
            <span className="heavy mr-1.5 text-[13px]">Tip!</span>
            Or open the whole catalogue
          </p>
        </div>

        <WorkCard item={picks[1]} />
      </div>
    </section>
  );
}

function BlockView({ block }: { block: Block }) {
  if (block.kind === "h") {
    return <h2 className="col-main subhead mb-3 mt-12">{block.text}</h2>;
  }

  if (block.kind === "pull") {
    /* Sized against the body, not against the masthead. At headline scale a
       three-line quote swamped everything around it. */
    return (
      <p
        className="col-main my-9 border-l border-ink pl-6"
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
    /* Figures go in the rail. They are evidence, and the reference runs its
       imagery down the right of the reading column rather than interrupting
       it. */
    return (
      <figure className="col-rail my-4 bg-parchment p-3">
        <Image
          src={block.src}
          alt={block.alt}
          width={block.w}
          height={block.h}
          sizes="(max-width: 1024px) 100vw, 40rem"
          className="block h-auto w-full"
          style={{ boxShadow: "rgba(29, 29, 27, 0.2) -4px 4px 6px 0px" }}
        />
        <figcaption className="byline mt-3">{block.caption}</figcaption>
      </figure>
    );
  }

  return (
    <>
      {/* The lede paragraph carried no bottom margin, so the one paragraph
          with a 62px float in it was also the one with nothing under it. */}
      <p className={`col-main pretty mb-4 leading-[1.36] ${block.lede ? "lede" : ""}`}>
        {block.lede ? (
          <>
            <span className="capbox" aria-hidden="true">
              {block.text.charAt(0)}
            </span>
            {block.text.slice(1)}
          </>
        ) : (
          block.text
        )}
      </p>
      {block.note ? <NoteView note={block.note} /> : null}
    </>
  );
}

/* `tone` was declared on Note, set to "cost" on four of them, and then never
   read — so the paragraph where a project admits what it gave up rendered
   identically to a footnote about tooling. It is the one thing this site is
   actually arguing, so it gets the ember rule. One accent, on the one idea
   that earns it. */
function NoteView({ note }: { note: Note }) {
  const cost = note.tone === "cost";

  return (
    <div
      className="col-rail mb-6 max-w-[30rem] border-l pl-4"
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
