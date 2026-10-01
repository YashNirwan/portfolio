import type { Metadata } from "next";
import { ViewTransition } from "react";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStudy, type Block, type Note } from "@/lib/studies";
import { work, links } from "@/lib/data";
import { Stamp } from "@/components/stamp";
import { Torn } from "@/components/torn";
import { WorkCard } from "@/components/work-card";
import { SiteNav } from "@/components/site-nav";

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
  /* The thing you can go and use, preferred over the thing you can go and
     read. interface-cua has neither and gets no seal. */
  const live =
    item.links.find((l) => !l.href.includes("github.com")) ?? item.links[0] ?? null;

  /* Indices of the paragraphs that open a section: the first "p" after each
     "h". The lede already carries its own cap and is excluded. */
  const capOpeners = new Set<number>();
  if (study) {
    let awaiting = false;
    study.blocks.forEach((b, i) => {
      if (b.kind === "h") awaiting = true;
      else if (awaiting && b.kind === "p") {
        capOpeners.add(i);
        awaiting = false;
      }
    });
  }

  return (
    /* Project pages sit on bone cream, a darker stock than the front page.
       That is how the reference separates a story from the paper it came
       wrapped in. */
    <div className="bg-bone">
      <SiteNav tone="bone" revealAfter={0.6} />
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

        {/* The tear sits ABOVE the title (z-10), so its ragged lip crosses
            the tops of the letters — measured on the reference, where PRADA
            is set huge and centred with the tear running across the top of
            its caps. An earlier version cut through the WAIST of the title
            ("INTERFACE-CUA" sliced across the middle) and was rightly
            pulled clear; this takes only the tops, which is what the
            reference does, and reads as the title printed on the sheet the
            picture was torn from. */}
        <Torn className="relative z-10 -mt-[46px] h-[48px]" />

        {/* Sized to take ~76% of the sheet: the reference's title block is
            950px of 1440. 0.47em per capital (Instrument Serif, measured),
            so 162/length vw — FOREMAN at 23vw, INTERFACE-CUA at 12.5vw —
            capped at 20rem. */}
        <div className="sheet relative z-0 -mt-[0.2rem] pb-9 text-center md:-mt-[1.6rem]">
          <h1
            className="heavy press mx-auto"
            style={{ fontSize: `min(23vw, 20rem, ${(162 / title.length).toFixed(2)}vw)` }}
          >
            {title}
          </h1>
          <p
            className="mt-4"
            style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1.05rem, 1.6vw, 1.5rem)", letterSpacing: "-0.02em" }}
          >
            {item.kicker.split("·")[0].trim()}
          </p>
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
          <div className="flex items-center gap-4">
            <p className="byline tabular">© {item.kicker.split("·").pop()?.trim()}</p>
            {/* The reference closes its meta bar with a round "explore"
                control that runs the reader down into the story. */}
            <a
              href="#main"
              aria-label="Down to the story"
              className="grid h-9 w-9 place-items-center rounded-full border border-ink no-underline"
            >
              <svg viewBox="0 0 12 14" className="h-3.5 w-3" aria-hidden="true">
                <path d="M6 0v12M1 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </a>
          </div>
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
        {/* The intro row, OUTSIDE the perforated panel, as on the reference:
            the opening paragraph at 32px (2.2vw) with the drop cap on the
            left, and on the right a large outlined LIVE SITE ellipse —
            569x216 on the reference, not the small seal this page used to
            tuck into the hero's corner. The tools and the other links sit
            under it. */}
        <div className="article no-panel mb-16">
          <p
            className="col-main pretty"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "clamp(1.35rem, 2.2vw, 2rem)",
              lineHeight: 1.16,
              letterSpacing: "-0.02em",
            }}
          >
            <span className="capbox capbox-lg" aria-hidden="true">
              {standfirst.charAt(0)}
            </span>
            {standfirst.slice(1)}
          </p>

          <aside className="col-rail mt-8 lg:mt-0">
            {/* interface-cua has nothing live to open, so its ellipse asks
                instead — the one page where asking is all that is left. */}
            <a
              href={live ? live.href : `mailto:${links.email}`}
              target={live ? "_blank" : undefined}
              rel="noreferrer"
              className="cta-ellipse group mx-auto grid aspect-[569/216] w-full max-w-[20rem] place-items-center overflow-clip border border-ink no-underline lg:max-w-[36rem]"
              style={{ borderRadius: "50%" }}
            >
              <span className="cta-text heavy text-[clamp(2rem,3.6vw,3.4rem)]">
                {/* farewatch and FireSight have only their repositories; the
                    ellipse said LIVE SITE and opened GitHub. */}
                {!live ? "Ask me" : live.href.includes("github.com") ? "The code" : "Live site"}
              </span>
              <svg viewBox="0 0 64 20" className="cta-arrow h-[0.9em] w-auto text-[clamp(2rem,3.6vw,3.4rem)]" aria-hidden="true">
                <path d="M0 10h60M50 1l10 9-10 9" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </a>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {item.stack.map((t) => (
                <span key={t} className="byline byline-caps border border-ink/40 px-2.5 py-1">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
              {item.links
                .filter((l) => l.href !== live?.href)
                .map((l) => (
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
              {/* Where the ellipse already asks, this would say it twice. */}
              {live ? (
                <a href={`mailto:${links.email}`} className="tap byline">
                  Ask me about it
                </a>
              ) : null}
            </div>
          </aside>
        </div>

        <div className="article">
          {/* THE / WORK / STORY on one line across the sheet. The reference
              stacks it three lines deep at 274px beside a tall plate, and it
              has the material to fill the column that opens up beside it.
              These pages do not: stacked, the head and a second copy of the
              hero art took a full screen before the first sentence. One line
              keeps the ink block and the stamp at a fifth of the height. */}
          <h2 className="col-full heavy heavy-xl mb-10 flex items-center justify-between gap-4 text-[min(12.5vw,12rem)] leading-none">
            <span className="flex flex-wrap items-baseline gap-x-[0.22em]">
              <span>The</span>
              <span>Work</span>
              <span className="inline-block bg-ink px-[0.06em] pb-[0.02em] pt-[0.08em] text-bone">Story</span>
            </span>
            <Stamp className="w-[clamp(3.5rem,8vw,8.5rem)] shrink-0" />
          </h2>

          {study ? (
            study.blocks.map((block, i) => (
              <BlockView key={i} block={block} capped={capOpeners.has(i)} />
            ))
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
              {(item.figures ?? []).map((f) => (
                <BlockView key={f.src} block={{ kind: "figure", ...f }} />
              ))}
            </>
          )}
        </div>

        <div className="col-main mt-14">
          <Link href="/work" className="tap heavy inline-block text-[17px] no-underline hover:underline">
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

/* HANDOFF.md's measurement of the reference says every body paragraph opens
   with a reversed-out drop cap. Taken literally that is eight black squares
   down a Foreman-length study, which stops reading as a printed page and
   starts reading as a fault. The cap goes on the paragraph that OPENS each
   section instead — the reference's "every body column", one column per
   subhead — so every run of prose starts on one and no run is a queue of
   them. If the owner wants it on all of them, `capOpeners` is the switch.

   This cannot be re-measured from here: niccolomiranda.com is denied by the
   environment's egress policy. Recorded in HANDOFF.md as an open question. */
function BlockView({ block, capped = false }: { block: Block; capped?: boolean }) {
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
    /* Figures run across BOTH columns.

       In the rail they opened an empty row on Foreman (grid auto-placement
       gave the figure a row of its own beside an empty reading column); in
       the reading column they were 37rem wide beside a half-page of nothing,
       which shrank the screenshots past reading. Spanning both, each figure
       takes its own row at the full width of the sheet — a cut across the
       page, as a paper runs a photograph across its columns. */
    return (
      <figure className="col-full my-10">
        <div className="bg-parchment p-3" style={{ boxShadow: "rgba(29, 29, 27, 0.2) -4px 4px 6px 0px" }}>
          {block.narrow ? (
            <ArtDirected block={block} />
          ) : (
            <Image
              src={block.src}
              alt={block.alt}
              width={block.w}
              height={block.h}
              sizes="(max-width: 1024px) 100vw, 90vw"
              className="block h-auto w-full"
            />
          )}
        </div>
        <figcaption className="byline mt-3 max-w-[60ch]">{block.caption}</figcaption>
      </figure>
    );
  }

  return (
    <>
      {/* The lede paragraph carried no bottom margin, so the one paragraph
          with a 62px float in it was also the one with nothing under it. */}
      <p className={`col-main pretty mb-4 leading-[1.36] ${block.lede ? "lede" : ""}`}>
        {block.lede || capped ? (
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

/* A figure with a separate cut for phones, via <picture>: the way Next's
   image docs do art direction (getImageProps for each source). */
function ArtDirected({ block }: { block: Extract<Block, { kind: "figure" }> }) {
  const narrow = block.narrow!;
  const common = { alt: block.alt, sizes: "100vw" };
  const wide = getImageProps({ ...common, src: block.src, width: block.w, height: block.h }).props;
  const { props } = getImageProps({ ...common, src: narrow.src, width: narrow.w, height: narrow.h });
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={wide.srcSet ?? wide.src} width={block.w} height={block.h} />
      <img {...props} alt={block.alt} className="block h-auto w-full" />
    </picture>
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
      className="col-rail mb-6 max-w-[34rem] border-l-2 pl-5"
      style={{ borderColor: cost ? "var(--color-ember)" : "var(--color-ink)" }}
    >
      {note.label ? (
        <p className="byline" style={cost ? { color: "var(--color-ember)" } : undefined}>
          {note.label}
        </p>
      ) : null}
      {/* Set as a sidebar, not a footnote: with the plate gone the rail is
          the notes, and at body size they were specks in a wide column. */}
      <p
        className="pretty mt-2 text-ink"
        style={{ fontFamily: "var(--font-mid)", fontSize: "clamp(1.1rem, 1.45vw, 1.4rem)", lineHeight: 1.28, letterSpacing: "-0.01em" }}
      >
        {note.body}
      </p>
    </div>
  );
}
