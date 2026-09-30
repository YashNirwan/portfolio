import Image from "next/image";
import Link from "next/link";
import {
  links,
  lede,
  dispatch,
  work,
  backPage,
  record,
  archive,
  archiveNote,
  stats,
  story,
  classified,
  portrait,
  identityPlate,
} from "@/lib/data";
import { Stamp } from "@/components/stamp";
import { Perforated } from "@/components/perforated";
import { Opening } from "@/components/opening";
import { WorkCard } from "@/components/work-card";
import { SiteNav } from "@/components/site-nav";
import { OrgMark } from "@/components/org-mark";

export const metadata = { alternates: { canonical: "/" } };

/* Page order follows the reference: the work bookends the page in two
   three-column strips, and the whole middle is identity — who this is, what
   he does, the numbers, the record. The previous build had that inverted,
   with a thin intro on top and a work grid filling the middle. */
export default function Home() {
  return (
    <Opening>
      <SiteNav />
      <main id="main" tabIndex={-1}>
        <WorkStrip
          items={[work[0], work[1]]}
          sub="Six pieces — the ones I would defend in review."
          tip="Every card opens the full write-up"
        />
        <Banner word={lede.banner} />
        <Identity />
        <Second />
        <Stats />
        <Story />
        <RecordSection />
        {/* Directly after the record, because it is the appendix to it: the
            recruiter material stays in one run. `archive` was written, given
            a comment explaining exactly where it belonged, and then never
            rendered by any component — four entries lost in a restructure. */}
        <Archive />
        <BigType />
        <Dispatch />
        <BackPage />
        <WorkStrip
          items={[work[3], work[2]]}
          sub="Handpicked from the last two years."
          tip="Or open the whole catalogue"
        />
      </main>
      <Classified />
      <Colophon />
    </Opening>
  );
}

/* --- The work strip -------------------------------------------------------
   Card, centred display type, card, hairlines between. This is where the
   reference puts its projects: top and bottom, not in a grid in the middle. */
function WorkStrip({
  items,
  sub,
  tip,
}: {
  items: (typeof work)[number][];
  sub: string;
  tip: string;
}) {
  return (
    <section className="sheet border-b border-ink py-9">
      <div className="ruled grid gap-x-7 gap-y-10 md:grid-cols-3">
        <WorkCard item={items[0]} />

        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="heavy text-[clamp(2rem,3.6vw,3rem)]" style={{ transform: "none" }}>
            <Link href="/work" className="tighten inline-block no-underline hover:underline">
              All work!
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
            {sub}
          </p>
          <p className="byline mt-5">
            <span className="heavy mr-1.5 text-[13px]">Tip!</span>
            {tip}
          </p>
        </div>

        <WorkCard item={items[1]} />
      </div>
    </section>
  );
}

function Banner({ word, bare = false }: { word: string; bare?: boolean }) {
  const text = word.toUpperCase();
  const BOX = 1000;
  /* Sized so the word's natural width slightly exceeds the box, which means
     lengthAdjust only ever tightens. Hardcoding a size instead is what made
     MEASURED collide with itself. */
  /* The display face carries a tall cap height for its em (0.734em in
     Instrument Serif, measured), so a viewBox sized at 0.86em clipped the
     letters top and bottom. Sized from
     the cap box instead, with the type scaled down to keep the same optical
     weight inside a taller block. */
  const size = BOX / (0.47 * text.length);
  /* 0.47em per capital: Instrument Serif measures 0.47-0.50 on these words,
     so the natural width just meets or overshoots the box and textLength
     only ever tightens — by ~1%. 0.45 tightened NIRWAN ~5% and, in a face
     already set tight, ran N-I-R into one shape. (0.62 was Gloock's.) */
  /* Capitals only, so no descender room: cap height (0.734em, measured) plus
     0.06em of ink above and below. The old 1.02em left a band of empty ink
     under the letters that the reference's block does not have — its MIRANDA
     hugs the box top and bottom. */
  const height = size * 0.854;

  /* The letters are KNOCKED OUT of the ink, not painted on top of it. That is
     why the reference's banner type carries the paper texture: you are seeing
     the sheet through a hole in the block. Painting parchment-coloured glyphs
     over the ink gives flat letters that sit on the page instead of in it.

     Weight 700 rather than 400: at display size Bodoni's hairline strokes
     nearly vanish, and the reference's letters are heavy enough to almost
     touch each other. */
  /* Painted, not knocked out. A <mask> knockout is the more faithful way to
     get the paper texture showing through the letters, and the mask renders
     correctly in isolation — but the composite came out solid, and chasing it
     further was not worth the time against the change that actually matters:
     weight. Bodoni at 400 is hairline at display size; the reference's letters
     are heavy enough to nearly touch. */
  const inner = (
    <div className="ink press">
      <svg viewBox={`0 0 ${BOX} ${height}`} className="block w-full" role="img" aria-label={word}>
        <text
          x={BOX / 2}
          y={size * 0.794}
          textAnchor="middle"
          textLength={BOX * 0.985}
          lengthAdjust="spacing"
          fill="var(--color-bone)"
          stroke="var(--color-bone)"
          strokeWidth={size * 0.01}
          style={{ fontFamily: "var(--font-display)", fontSize: `${size}px`, fontWeight: 400 }}
        >
          {text}
        </text>
      </svg>
    </div>
  );

  return bare ? inner : <div className="sheet py-9">{inner}</div>;
}

/* --- Identity: the centre of the page -------------------------------------
   Measured off the reference at 1440, element by element:

     left column   418px (29% of the sheet): display heading, then the
                   portrait directly under it, 416x533 — a 4:5 photo filling
                   the column
     right column  877px (61%): a large landscape image (875x596), then the
                   description set as DISPLAY CAPS at 122px (8.5vw), not as
                   body text

   Ours had it the other way round — paragraphs on the left, a 22rem portrait
   stranded in the 61% column — which is where the bare paper beside the photo
   came from. Moving the portrait into the narrow column also settles the
   resolution question the old cap was guarding: at 1440 the column is ~420px,
   so the 800px source lands at exactly 2x.

   The paragraphs have nowhere in the reference's version of this section;
   they stay, under the display type, set in two newspaper columns. */
function Identity() {
  return (
    <section className="sheet border-b border-ink pb-12">
      <div className="ruled grid gap-x-10 gap-y-10 md:grid-cols-[30fr_63fr]">
        <div>
          {/* 12vw against the reference's 14vw. Instrument Serif is 1.32x
              Canopee's width, so PROVE at 14vw would just overrun the ~420px
              column; Gloock, at 1.88x, had held this to 8.2vw. */}
          <h1 className="guide heavy heavy-xl text-[clamp(3.4rem,12vw,11rem)]">
            <span>{lede.kicker.split(" ")[0]}</span>
            <span>{lede.kicker.split(" ").slice(1).join(" ")}</span>
          </h1>
          {/* `portrait.caption` was written and then never rendered for a
              while; the caption travels with the figure, not the image. */}
          {/* No width cap. The old 22rem/26rem caps existed because the
              source was an 800px photo; the engraving is 1200px, so the
              portrait fills its column at 2x up past 1920. */}
          <figure className="mt-7">
            {/* No frame parallax on the portrait: it scales the image 1.16x to
                have room to travel, and the crop took the top of the head. */}
            <div className="par-frame" style={{ boxShadow: "var(--shadow-sm-2)" }}>
              <Image
                src={portrait.src}
                alt={portrait.alt}
                width={portrait.w}
                height={portrait.h}
                sizes="(max-width: 768px) 100vw, 30vw"
                preload
                className="block h-auto w-full"
              />
            </div>
            <figcaption className="byline mt-2">{portrait.caption}</figcaption>
          </figure>
        </div>

        <div>
          <figure className="par-frame" style={{ boxShadow: "var(--shadow-sm)" }}>
            <Image
              src={identityPlate.src}
              alt={identityPlate.alt}
              width={identityPlate.w}
              height={identityPlate.h}
              sizes="(max-width: 768px) 100vw, 62vw"
              className="par-img block aspect-[1456/816] h-auto w-full object-cover"
            />
          </figure>

          {/* The reference's description is display caps at 8.5vw. 6.6vw here:
              the longest line, NOT JUST THE THING., is 19 characters and has
              to fit ~850px. (It was 4.8vw in Gloock.) */}
          <h2 className="guide heavy mt-8 text-[clamp(2.3rem,6.6vw,6rem)] leading-[0.86]">
            {lede.roles.map((r) => (
              <span key={r}>{r}</span>
            ))}
          </h2>

          <div className="mt-9 gap-9 lg:columns-2">
            <p className="pretty mb-3.5 break-inside-avoid leading-[1.32]">
              <span className="capbox" aria-hidden="true">
                {lede.paragraphs[0].charAt(0)}
              </span>
              {lede.paragraphs[0].slice(1)}
            </p>
            {lede.paragraphs.slice(1).map((p, i) => (
              <p key={i} className="pretty mb-3.5 break-inside-avoid leading-[1.32]">
                {p}
              </p>
            ))}
            <p className="byline mt-5">{lede.meta}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Second() {
  return (
    <section className="sheet py-9">
      <div className="grid items-end gap-7 md:grid-cols-[78fr_22fr]">
        <Banner word="Measured" bare />
        <Stamp className="par-slow w-full max-w-[15rem] justify-self-end" />
      </div>
    </section>
  );
}

/* --- The figures ----------------------------------------------------------
   Set the way the reference sets its awards row, measured at 1440: a label
   in the text face (24.5px, caps, centred) over a display word (72px caps),
   and beside the pair a numeral in the BLACKLETTER at 158px — the reference
   uses its nameplate face (Germgoth) for these; ours is Pirata One, the
   masthead's. Four items spread across the sheet at their natural widths, no
   rules between them. Ours had the word at 19px and the numeral at 42px,
   which set the figures as a footnote to the page instead of a row of it.

   The labels are longer than the reference's ("Site of the day") and are
   capped to wrap under their word rather than widening the item. The
   figures and labels themselves are untouched: two of them are flagged in
   HANDOFF.md for the owner to settle. */
function Stats() {
  return (
    <section className="sheet border-y border-ink py-9 md:py-12">
      <span className="draw sr-only" aria-hidden="true" />
      {/* One-up on phones: COUNTRIES plus a two-digit blackletter numeral
          needs ~212px, and two-up at 390 gives each ~170 — it overran the
          viewport by a pixel. */}
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:flex lg:items-start lg:justify-between">
        {stats.map((s) => (
          <div key={s.label} className="flex items-start gap-2.5">
            <div className="text-center">
              <p
                className="mx-auto max-w-[19ch] uppercase text-charcoal"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(0.9rem, 1.35vw, 1.3rem)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                }}
              >
                {s.label}
              </p>
              <p className="heavy mt-1.5 text-[clamp(2rem,3.9vw,4.5rem)] leading-[0.9]">{s.unit}</p>
            </div>
            <span
              className="gothic tabular"
              style={{ fontSize: "clamp(4.2rem, 9vw, 10rem)", lineHeight: 0.55, marginTop: "0.08em" }}
            >
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --- The big type ---------------------------------------------------------
   The reference's THE / PIXEL / PERFECT / ARTISAN block, measured: display
   words at 446px (31vw) set into a grid with images slotted between them —
   a small upright crop beside the first word, a large near-square spanning
   the first two rows on the right, a landscape crop leading the third row,
   and a closing line with a small label. Ours was 118px of type with the
   creed beside it and no images at all.

   Same shape here, with our own plates in the image slots: the three
   measurement projects, cropped to keep each plate's ember exception in
   frame. One size for every word rather than fitting each word to its
   cell: in a face that is still 1.32x Canopee's width, fitted sizes would
   range widely and read as three separate headlines. */
function BigType() {
  const plate = (slug: string) => work.find((w) => w.slug === slug)!.image!;
  const cut = (
    slug: string,
    position: string,
    cls: string,
    sizes: string,
  ) => {
    const img = plate(slug);
    return (
      <div className={`par-frame ${cls}`}>
        <Image
          src={img.src}
          alt=""
          aria-hidden="true"
          width={img.w}
          height={img.h}
          sizes={sizes}
          className="par-img block h-full w-full object-cover"
          style={{ objectPosition: position }}
        />
      </div>
    );
  };

  return (
    <section className="sheet py-12">
      <h2 className="sr-only">Measure the thing you built</h2>
      {/* Three lines, one rule for all of them: each runs the full width of
          the sheet, and its plate is a strip exactly one capital tall that
          fills whatever the words leave, alternating sides. The first
          version slotted three plates of three unrelated shapes around the
          words — a sliver, a floating landscape and a square that stretched
          its row — which left dead space above YOU BUILT. and under the
          landscape, and no line reached the edge. On phones the strips drop
          out and the words stack. */}
      <div aria-hidden="true" className="heavy heavy-xl text-[clamp(3.2rem,11.6vw,11.6rem)]">
        <div className="big-line">
          <span>Measure</span>
          {cut("foreman", "50% 62%", "big-strip", "55vw")}
        </div>
        <div className="big-line">
          {cut("farewatch", "70% 42%", "big-strip", "45vw")}
          <span>The thing</span>
        </div>
        <div className="big-line">
          <span>You built.</span>
          {cut("vibecheck", "50% 24%", "big-strip", "40vw")}
        </div>
      </div>

      {/* The closing line — where the reference sets ARTISAN with a small
          Awwwards label — carries the creed and the way on. */}
      <div className="mt-10 flex flex-wrap items-end justify-between gap-8 border-t border-ink pt-7">
        <p className="pretty max-w-[52ch] leading-[1.32]">{lede.creed}</p>
        <Link
          href="/work"
          className="inline-block border border-ink px-7 py-3 no-underline"
          style={{ borderRadius: "999px" }}
        >
          <span className="heavy text-[15px]">All work</span>
        </Link>
      </div>
    </section>
  );
}

function Dispatch() {
  return (
    <section className="sheet pb-11">
      <div className="bg-bone px-6 py-8 md:px-10 md:py-10">
        <p className="byline">{dispatch.kicker}</p>
        <h2 className="heavy mt-3 text-[clamp(1.9rem,4.4vw,3.2rem)]">{dispatch.headline}</h2>
        <div className="mt-6 columns-1 gap-7 md:columns-2 lg:columns-3">
          {dispatch.paragraphs.map((p, i) => (
            <p key={i} className="pretty mb-3.5 break-inside-avoid leading-[1.32]">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- The back page ---------------------------------------------------------
   Set the way a paper sets its back page: four equal columns of short items,
   hairlines between, small cuts at the head of each.

   It used to be a 46/54 two-column grid — asymmetric for no reason the
   content supplied — with each hobby's image half the sheet wide (~650px at
   1440) and a full-width ink banner above it as big as the masthead name.
   That gave the lightest material on the page the heaviest setting on it.
   The section head is now the same size as THE RECORD and THE ARCHIVE, which
   is what it is: a section, not a front page. */
function BackPage() {
  return (
    <section className="sheet border-y border-ink py-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h2 className="heavy text-[32px]">The back page</h2>
        <p className="byline max-w-[60ch]">{backPage.standfirst}</p>
      </div>
      <dl className="cols-even -mx-[14px] mt-7 grid gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
        {backPage.items.map((item) => (
          <div key={item.term}>
            {item.image ? (
              <div className="par-frame mb-3.5">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  width={item.image.w}
                  height={item.image.h}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 22vw"
                  className="par-img block aspect-[3/2] h-auto w-full object-cover"
                />
              </div>
            ) : null}
            <dt>
              <span className="heavy block text-[19px] leading-[0.95]">
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="no-underline hover:underline">
                    {item.term}
                  </a>
                ) : (
                  item.term
                )}
              </span>
              <span className="byline byline-caps mt-1.5 block">{item.unit}</span>
            </dt>
            <dd className="pretty mt-2.5 text-[16px] leading-[1.36]">{item.line}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* --- The story, in a perforated panel ------------------------------------- */
function Story() {
  return (
    <section className="sheet py-12">
      <Perforated className="mx-auto max-w-[62rem]">
        <p className="byline byline-caps">{story.kicker}</p>
        <h2 className="heavy mt-3 text-[clamp(1.9rem,4.4vw,3.2rem)]">{story.headline}</h2>
        <div className="mt-7 columns-1 gap-9 md:columns-2">
          {story.paragraphs.map((p, i) => (
            <p key={i} className="pretty mb-4 break-inside-avoid leading-[1.45]">
              {p}
            </p>
          ))}
        </div>
        <p className="mt-5 text-right italic">{story.signoff}</p>
      </Perforated>
    </section>
  );
}

/* --- The classified strip -------------------------------------------------
   A paper runs adverts; this one advertises the author. Two identical runs
   slide past a clipped window so the loop is seamless with no JavaScript,
   and it pauses on hover so the text can actually be read. */
function Classified() {
  /* The reference's version of this is not a stock ticker: it runs on
     parchment between two hairlines, sets the line large in regular-weight
     serif rather than small heavy caps, and repeats an ink EMAIL ME block
     inline as part of the scroll. Mine was a black bar of shouting, which
     is a different object entirely.

     Two identical runs slide past a clipped window, so the moment the first
     has travelled its own width the second is exactly where it started. */
  const unit = (key: string, hidden: boolean) => (
    <div className="flex shrink-0 items-center" key={key} aria-hidden={hidden || undefined}>
      {classified.map((c) => (
        <span key={c} className="flex shrink-0 items-center">
          {/* Measured on the reference's footer run: 86.4px (6vw), line
              height 1.33, tracking -0.04em, sentence case, in its narrow
              text face (Editorial New). Newsreader is too wide to stand in
              at this size — it read spread out — so the run is set in the
              condensed display face at its natural weight, unstroked. */}
          <span
            className="whitespace-nowrap px-7"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.4rem,6vw,5.4rem)",
              lineHeight: 1.33,
              letterSpacing: "-0.02em",
            }}
          >
            {c}
          </span>
          {/* EMAIL ME is display caps at the SAME 86px as the run, in an
              ink block that hugs the caps (238x65 on the reference). */}
          <a
            href={`mailto:${links.email}`}
            className="shrink-0 px-4 pb-1.5 pt-2.5 no-underline"
            style={{ background: "var(--color-ink)", color: "var(--color-parchment)" }}
            tabIndex={hidden ? -1 : 0}
          >
            <span className="heavy block text-[clamp(2.4rem,6vw,5.4rem)] leading-[0.67]">Email me</span>
          </a>
        </span>
      ))}
    </div>
  );

  return (
    <section
      className="overflow-hidden border-y border-ink py-5"
      aria-label="Let’s work together"
    >
      <div className="ticker">
        {unit("a", false)}
        {unit("b", true)}
      </div>
    </section>
  );
}

function RecordSection() {
  return (
    <section className="sheet border-b border-ink py-10">
      <h2 className="heavy text-[32px]">The record</h2>
      <div className="ruled mt-7 grid gap-x-7 gap-y-8 md:grid-cols-[55fr_45fr]">
        {record.roles.map((r) => (
          <div key={r.org}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="heavy flex items-center gap-2 text-[21px]">
                <OrgMark org={r.org} className="h-[0.72em] w-auto" />
                {r.org}
              </h3>
              <span className="byline byline-caps tabular">{r.period}</span>
            </div>
            <p className="byline mt-1">{r.title}</p>
            <ul className="mt-2.5 max-w-[46ch]">
              {r.lines.map((l, i) => (
                <li key={i} className="pretty mb-1.5 leading-[1.3]">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 max-w-[46ch]">
        <p className="byline">Education</p>
        <dl>
          {record.education.map((e) => (
            <div
              key={e.school}
              className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4"
            >
              <dt>
                {e.school} — <span className="text-charcoal">{e.detail}</span>
              </dt>
              <dd className="byline byline-caps tabular">{e.period}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* --- The archive ----------------------------------------------------------
   Set deliberately plainer than the record above it: no images, no badges,
   hairlines between the rows. Coursework should look like coursework on the
   page as well as being called it. */
function Archive() {
  return (
    <section className="sheet border-b border-ink py-10">
      <h2 className="heavy text-[32px]">The archive</h2>
      <p className="byline mt-2 max-w-[52ch]">{archiveNote}</p>
      <ul className="mt-6 grid gap-x-9 md:grid-cols-2">
        {archive.map((a) => (
          <li key={a.href} className="border-t border-ink/30 py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="heavy text-[19px]">
                <a href={a.href} target="_blank" rel="noreferrer" className="no-underline hover:underline">
                  {a.title}
                </a>
              </h3>
              <span className="byline byline-caps tabular">{a.year}</span>
            </div>
            <p className="pretty mt-1.5 max-w-[46ch] leading-[1.3]">{a.line}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* The footer line, measured on the reference: the name in display caps at
   23px left; the links right in display caps at 21.6px, separated by
   middle dots. */
function Colophon() {
  const out = [
    { label: "GitHub", href: links.github },
    { label: "LinkedIn", href: links.linkedin },
    { label: "Résumé", href: links.resume },
  ];
  return (
    <footer>
      <div className="border-t border-ink">
        <div className="sheet flex flex-wrap items-center justify-between gap-3 py-5">
          <span className="heavy text-[23px]">Yash Nirwan</span>
          <ul className="flex flex-wrap items-center">
            {out.map((l, i) => (
              <li key={l.label} className="flex items-center">
                {i > 0 ? (
                  <span aria-hidden="true" className="heavy px-2 text-[21.6px]">
                    ·
                  </span>
                ) : null}
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="heavy text-[21.6px] no-underline hover:underline"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
