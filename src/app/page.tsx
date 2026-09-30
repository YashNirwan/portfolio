import Image from "next/image";
import Link from "next/link";
import {
  profile,
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
} from "@/lib/data";
import { Stamp } from "@/components/stamp";
import { Perforated } from "@/components/perforated";
import { Spinner } from "@/components/spinner";
import { WorkCard } from "@/components/work-card";

export const metadata = { alternates: { canonical: "/" } };

/* Page order follows the reference: the work bookends the page in two
   three-column strips, and the whole middle is identity — who this is, what
   he does, the numbers, the record. The previous build had that inverted,
   with a thin intro on top and a work grid filling the middle. */
export default function Home() {
  return (
    <>
      <Spinner masthead="The Second Opinion" />
      <Masthead />
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
        <Banner word="Back page" />
        <BackPage />
        <WorkStrip
          items={[work[3], work[2]]}
          sub="Handpicked from the last two years."
          tip="Or open the whole catalogue"
        />
      </main>
      <Classified />
      <Colophon />
    </>
  );
}

function Masthead() {
  return (
    <header className="border-b border-ink">
      <div className="sheet flex items-center justify-between gap-4 py-5">
        <span className="plate-row">{profile.location}</span>
        <span className="gothic hidden text-[22px] sm:block">The Second Opinion</span>
        <Link href="/work" aria-label="All work" className="group no-underline">
          <span aria-hidden="true" className="flex w-8 flex-col gap-[5px]">
            <span className="block h-[2px] w-full bg-ink" />
            <span className="block h-[2px] w-full bg-ink" />
          </span>
        </Link>
      </div>
    </header>
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
  /* Gloock carries a tall cap height and long ascenders for its em, so a
     viewBox sized at 0.86em clipped the letters top and bottom. Sized from
     the cap box instead, with the type scaled down to keep the same optical
     weight inside a taller block. */
  const size = BOX / (0.62 * text.length);
  const height = size * 1.02;

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
          y={size * 0.82}
          textAnchor="middle"
          textLength={BOX * 0.985}
          lengthAdjust="spacing"
          fill="var(--color-bone)"
          style={{ fontFamily: "var(--font-display)", fontSize: `${size}px`, fontWeight: 400 }}
        >
          {text}
        </text>
      </svg>
    </div>
  );

  return bare ? inner : <div className="sheet py-9">{inner}</div>;
}

/* --- Identity: the centre of the page ------------------------------------- */
function Identity() {
  return (
    <section className="sheet border-b border-ink pb-10">
      <div className="ruled grid gap-x-7 gap-y-9 md:grid-cols-[39fr_61fr]">
        <div>
          <h1 className="heavy text-[clamp(2.4rem,4.6vw,3.6rem)]">{lede.kicker}</h1>
          <p className="pretty mt-5 leading-[1.32]">
            <span className="capbox" aria-hidden="true">
              {lede.paragraphs[0].charAt(0)}
            </span>
            {lede.paragraphs[0].slice(1)}
          </p>
          {lede.paragraphs.slice(1).map((p, i) => (
            <p key={i} className="pretty mt-3.5 leading-[1.32]">
              {p}
            </p>
          ))}
          <p className="byline mt-6">{lede.meta}</p>
        </div>

        {/* The roles heading sits BESIDE the portrait from 1280 up.
            Stacked under it, the 22rem photo left ~430px of bare paper down
            the right of this column at 1440 — the gap the owner flagged. The
            photo itself is not the fix: it is an 800px source and the cap
            below is what keeps it sharp, so the space gets filled with the
            type that was already sitting under it.

            1280 is where the split starts earning its place. Below it this
            column is under 700px, the roles would get ~300px beside a 352px
            photo, and stacked is the better reading — which is also the gap's
            smallest at those widths. */}
        <div className="grid gap-x-7 gap-y-6 xl:grid-cols-[22rem_minmax(0,1fr)] xl:items-end">
          {/* Kept at its own 4:5 and capped at 22rem. Cropping it to 4:3
              across a 46rem column meant asking an 800px file to cover
              1400px on a retina screen, which is what made it soft. */}
          {/* `portrait.caption` was written and then never rendered, which
              left the one photograph on a newspaper pastiche as the only
              picture on the site with no caption under it. The parallax
              belongs on the figure, not the image, so the caption travels
              with the photo instead of sliding away from it. */}
          <figure className="par-slow max-w-[22rem]">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              width={portrait.w}
              height={portrait.h}
              sizes="(max-width: 768px) 100vw, 22rem"
              preload
              className="block h-auto w-full"
              style={{ boxShadow: "var(--shadow-sm-2)" }}
            />
            <figcaption className="byline mt-2">{portrait.caption}</figcaption>
          </figure>
          {/* 2.1vw rather than 3.4vw: beside the photo the longest role line
              has ~300px at 1280 and ~400px at 1440, and 3.4vw overflowed
              both. It keeps the stacked size below the split. */}
          <h2 className="heavy mt-5 text-[clamp(1.8rem,3.4vw,2.9rem)] xl:mt-0 xl:text-[clamp(1.5rem,2.1vw,2.2rem)]">
            {lede.roles.map((r) => (
              <span key={r} className="block">
                {r}
              </span>
            ))}
          </h2>
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

/* Small-caps label, then the word and a large numeral. Every figure here is
   one a reader can go and check. */
function Stats() {
  return (
    <section className="sheet border-y border-ink py-7"><span className="draw sr-only" aria-hidden="true" />
      <div className="ruled grid gap-x-7 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="byline byline-caps">{s.label}</p>
            <p className="flex items-baseline gap-2.5">
              <span className="heavy tighten text-[19px]">{s.unit}</span>
              <span
                className="tabular"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "42px",
                  lineHeight: 0.9,
                  letterSpacing: "-0.03em",
                }}
              >
                {s.value}
              </span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BigType() {
  return (
    <section className="sheet py-11">
      <div className="grid gap-x-7 gap-y-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <h2 className="heavy heavy-xl press text-[clamp(3rem,9vw,7.4rem)]">
          Measure
          <br />
          the thing
          <br />
          you built
        </h2>
        <div className="self-end">
          <p className="pretty leading-[1.32]">{lede.creed}</p>
          <Link
            href="/work"
            className="mt-6 inline-block border border-ink px-7 py-3 no-underline"
            style={{ borderRadius: "999px" }}
          >
            <span className="heavy text-[15px]">All work</span>
          </Link>
        </div>
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

function BackPage() {
  return (
    <section className="sheet border-b border-ink py-10">
      <p className="lede pretty max-w-[52ch]">{backPage.standfirst}</p>
      <dl className="mt-8 grid gap-x-9 gap-y-10 md:grid-cols-[46fr_54fr]">
        {backPage.items.map((item) => (
          <div key={item.term} className="par-slow">
            {item.image ? (
              <Image
                src={item.image.src}
                alt={item.image.alt}
                width={item.image.w}
                height={item.image.h}
                sizes="(max-width: 768px) 100vw, 34rem"
                className="mb-4 block aspect-[3/2] h-auto w-full object-cover"
                style={{ boxShadow: "var(--shadow-sm)" }}
              />
            ) : null}
            <dt className="flex flex-wrap items-baseline gap-x-2.5">
              <span className="heavy text-[25px]">
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="no-underline">
                    {item.term}
                  </a>
                ) : (
                  item.term
                )}
              </span>
              <span className="byline byline-caps">{item.unit}</span>
            </dt>
            <dd className="pretty mt-2 max-w-[46ch] leading-[1.3]">{item.line}</dd>
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
          <span
            className="whitespace-nowrap px-7"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "clamp(2.2rem,5.6vw,5.375rem)",
              lineHeight: 1.33,
              letterSpacing: "-0.04em",
            }}
          >
            {c}
          </span>
          <a
            href={`mailto:${links.email}`}
            className="shrink-0 px-4 py-1.5 no-underline"
            style={{ background: "var(--color-ink)", color: "var(--color-parchment)" }}
            tabIndex={hidden ? -1 : 0}
          >
            <span className="heavy text-[clamp(1.1rem,2.2vw,1.8rem)]">Email me</span>
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
              <h3 className="heavy text-[21px]">{r.org}</h3>
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

function Colophon() {
  return (
    <footer>
      <div className="border-t border-ink">
        <div className="sheet flex flex-wrap items-baseline justify-between gap-3 py-3.5">
          <span className="gothic text-[16px]">Yash Nirwan</span>
          <div className="flex flex-wrap gap-x-5">
            <a href={links.github} target="_blank" rel="noreferrer" className="byline">
              GitHub
            </a>
            <a href={links.linkedin} target="_blank" rel="noreferrer" className="byline">
              LinkedIn
            </a>
            <a href={links.resume} className="byline">
              Résumé
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
