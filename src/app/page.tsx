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
  stats,
  story,
  classified,
  portrait,
} from "@/lib/data";
import { Stamp } from "@/components/stamp";
import { Perforated } from "@/components/perforated";
import { Spinner } from "@/components/spinner";

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
        <BigType />
        <Dispatch />
        <Banner word="Back page" />
        <BackPage />
        <Classified />
        <WorkStrip
          items={[work[3], work[2]]}
          sub="Handpicked from the last two years."
          tip="Or open the whole catalogue"
        />
      </main>
      <Colophon />
    </>
  );
}

function Masthead() {
  return (
    <header className="border-b border-ink">
      <div className="sheet flex items-baseline justify-between gap-4 py-3.5">
        <span className="byline byline-caps">{profile.location}</span>
        <span className="gothic hidden text-[19px] sm:block">The Second Opinion</span>
        <Link href="/work" className="byline no-underline hover:underline">
          All work
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
          <p className="lede pretty mt-3 max-w-[24ch]">{sub}</p>
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

function WorkCard({ item }: { item: (typeof work)[number] }) {
  return (
    <article className="par-slow relative flex flex-col">
      <figure className="mb-3" style={{ boxShadow: "var(--shadow-sm)" }}>
        {item.image ? (
          <Image
            src={item.image.src}
            alt={item.image.alt}
            width={item.image.w}
            height={item.image.h}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="block aspect-[16/9] h-auto w-full object-cover"
            style={{ objectPosition: item.image.position ?? "center" }}
          />
        ) : (
          /* PLACEHOLDER — the reference runs commissioned artwork here. Drop
             an image into the data file and this slot takes it. */
          <div className="flex aspect-[16/9] items-center justify-center bg-bone">
            <span className="byline">Artwork to come</span>
          </div>
        )}
      </figure>

      <div className="flex flex-wrap items-center gap-x-2">
        <h3 className="heavy tighten text-[19px]">
          <Link
            href={`/work/${item.slug}`}
            className="no-underline after:absolute after:inset-0 after:content-[''] hover:underline"
          >
            {item.title}
          </Link>
        </h3>
        {item.isNew ? <NewBadge /> : null}
      </div>
      <p className="pretty mt-1.5 leading-[1.27]">{item.standfirst}</p>
      <p className="byline mt-2">{item.kicker}</p>
    </article>
  );
}

export function NewBadge() {
  return (
    <span
      className="px-1.5 py-[1px]"
      style={{
        borderRadius: "var(--radius-sm)",
        background: "var(--color-ember)",
        color: "#fff",
        fontSize: "11px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      New
    </span>
  );
}

function Banner({ word, bare = false }: { word: string; bare?: boolean }) {
  const text = word.toUpperCase();
  const BOX = 1000;
  /* Sized so the word's natural width slightly exceeds the box, which means
     lengthAdjust only ever tightens. Hardcoding a size instead is what made
     MEASURED collide with itself. */
  const size = BOX / (0.54 * text.length);
  const height = size * 0.9;

  const inner = (
      <div className="ink press">
        <svg viewBox={`0 0 ${BOX} ${height}`} className="block w-full" role="img" aria-label={word}>
          <text
            x={BOX / 2}
            y={size * 0.78}
            textAnchor="middle"
            textLength={BOX}
            lengthAdjust="spacing"
            fill="currentColor"
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
      <div className="ruled grid gap-x-7 gap-y-9 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
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

        <div>
          {/* Kept at its own 4:5 and capped at 22rem. Cropping it to 4:3
              across a 46rem column meant asking an 800px file to cover
              1400px on a retina screen, which is what made it soft. */}
          <Image
            src={portrait.src}
            alt={portrait.alt}
            width={portrait.w}
            height={portrait.h}
            sizes="(max-width: 768px) 100vw, 22rem"
            priority
            className="par-slow block h-auto w-full max-w-[22rem]"
            style={{ boxShadow: "var(--shadow-sm-2)" }}
          />
          <h2 className="heavy mt-5 text-[clamp(1.8rem,3.4vw,2.9rem)]">
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
      <div className="grid items-end gap-7 md:grid-cols-[minmax(0,1fr)_13rem]">
        <Banner word="Measured" bare />
        <Stamp className="par-slow w-[13rem]" />
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
        <h2 className="heavy press text-[clamp(3rem,9vw,7.4rem)]">
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
      <dl className="mt-8 grid gap-x-9 gap-y-10 md:grid-cols-2">
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
  /* Two identical runs slide past a clipped window, so the moment the first
     one has travelled its own width the second is exactly where it started.

     Both copies are built by the same map rather than one being wrapped in a
     <span>: a <div> inside a <span> is invalid nesting, the parser hoists it
     out, and the two runs end up side by side as static text instead of a
     loop. That was the bug. */
  const run = (key: string, hidden: boolean) => (
    <div className="flex shrink-0 items-center" key={key} aria-hidden={hidden || undefined}>
      {classified.map((c) => (
        <span key={c} className="flex shrink-0 items-center">
          <span className="heavy byline-caps px-6 text-[clamp(1rem,1.7vw,1.5rem)]">{c}</span>
          <span aria-hidden="true" className="text-ember">
            &#10035;
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <section
      className="overflow-hidden border-y border-ink py-3.5"
      style={{ background: "var(--color-ink)", color: "var(--color-parchment)" }}
      aria-label="Classified advertisements"
    >
      <div className="ticker">
        {run("a", false)}
        {run("b", true)}
      </div>
    </section>
  );
}

function RecordSection() {
  return (
    <section className="sheet border-b border-ink py-10">
      <h2 className="heavy text-[32px]">The record</h2>
      <div className="ruled mt-7 grid gap-x-7 gap-y-8 md:grid-cols-2">
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

function Colophon() {
  return (
    <footer>
      <div className="sheet grid items-center gap-5 py-11 md:grid-cols-[auto_1fr_auto]">
        <a
          href={`mailto:${links.email}`}
          className="tighten inline-block px-5 py-2.5 no-underline"
          style={{
            background: "var(--color-ink)",
            color: "var(--color-parchment)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <span className="heavy text-[17px]">Email me</span>
        </a>
        <p
          className="heavy text-center text-[clamp(1.4rem,3vw,2.4rem)]"
          style={{ transform: "none" }}
        >
          Let&rsquo;s build something that checks itself
        </p>
        <a
          href={`mailto:${links.email}`}
          className="tighten inline-block px-5 py-2.5 no-underline"
          style={{
            background: "var(--color-ink)",
            color: "var(--color-parchment)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <span className="heavy text-[17px]">Email me</span>
        </a>
      </div>

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
