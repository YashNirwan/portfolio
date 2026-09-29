import Image from "next/image";
import Link from "next/link";
import { profile, links, lede, dispatch, work, backPage, record, archive, portrait } from "@/lib/data";

export const metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <Masthead />
      <main id="main" tabIndex={-1}>
        <Lede />
        <Banner word={lede.banner} />
        <Work />
        <Dispatch />
        <Banner word="Back page" />
        <BackPage />
        <RecordSection />
        <ArchiveSection />
      </main>
      <Colophon />
    </>
  );
}

/* --- Editorial header bar -------------------------------------------------
   Location left, title centred, contact right, hairline underneath. The
   newspaper's nameplate strip. */
function Masthead() {
  return (
    <header className="border-b border-ink">
      <div className="sheet flex items-baseline justify-between gap-4 py-3.5">
        <span className="byline">{profile.location}</span>
        <span className="byline hidden sm:block">The Yash Nirwan Portfolio</span>
        <a href={`mailto:${links.email}`} className="byline no-underline hover:underline">
          Get in touch
        </a>
      </div>
    </header>
  );
}

/* --- The lede -------------------------------------------------------------
   Two columns: a Playfair headline left, drop-capped body right. The drop
   cap is the only flourish permitted in running text. */
function Lede() {
  return (
    <section className="sheet pb-10 pt-12 md:pb-14 md:pt-20">
      <div className="grid gap-x-11 gap-y-8 md:grid-cols-[1.05fr_1fr]">
        <div>
          <h1 className="headline press max-w-[13ch] text-balance">{lede.headline}</h1>
          <figure className="mt-8 hidden max-w-[19rem] md:block">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              width={portrait.w}
              height={portrait.h}
              sizes="19rem"
              priority
              className="block h-auto w-full"
              style={{ boxShadow: "rgba(29, 29, 27, 0.2) -5px 3px 6px 0px" }}
            />
            <figcaption className="byline mt-2.5">{portrait.caption}</figcaption>
          </figure>
        </div>

        <div className="max-w-[46ch]">
          <figure className="mb-6 md:hidden">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              width={portrait.w}
              height={portrait.h}
              sizes="100vw"
              priority
              className="block h-auto w-full"
            />
            <figcaption className="byline mt-2">{portrait.caption}</figcaption>
          </figure>
          <p className="dropcap pretty mb-4 leading-[1.36]">{lede.paragraphs[0]}</p>
          {lede.paragraphs.slice(1).map((p, i) => (
            <p key={i} className="pretty mb-4 leading-[1.36] last:mb-0">
              {p}
            </p>
          ))}
          <p className="byline mt-7">{lede.meta}</p>
        </div>
      </div>
    </section>
  );
}

/* --- Full-bleed ink banner ------------------------------------------------
   The system's most recognisable pattern, and the thing the previous attempt
   never built. One word, ink ground, parchment type, letters nearly
   touching. Sized in vw so it always spans the page, rather than being a
   large heading that happens to sit on a dark box. */
function Banner({ word }: { word: string }) {
  const text = word.toUpperCase();

  /* Sizing a banner in vw cannot work: vw knows the viewport width but not
     how wide the word is, so a six-letter word fits and a nine-letter word
     gets its ends sliced off. SVG textLength pins the type to exactly the
     box width at any viewport instead.

     The size is set so the word's natural width slightly EXCEEDS the box,
     which means lengthAdjust only ever tightens. That matters: spreading
     letters apart would be positive tracking, which the spec forbids, while
     tightening produces the near-collision the look depends on. */
  const BOX = 1000;
  const size = BOX / (0.54 * text.length);
  const height = size * 0.8;

  return (
    <div className="ink">
      <svg
        viewBox={`0 0 ${BOX} ${height}`}
        className="block w-full"
        role="img"
        aria-label={word}
        preserveAspectRatio="xMidYMid meet"
      >
        <text
          x={BOX / 2}
          y={size * 0.72}
          textAnchor="middle"
          textLength={BOX}
          lengthAdjust="spacing"
          fill="currentColor"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: `${size}px`,
            fontWeight: 400,
          }}
        >
          {text}
        </text>
      </svg>
    </div>
  );
}

/* --- Work -----------------------------------------------------------------
   Three columns at the top tier. Each card: image at 0px radius, title, a
   NEW badge in the one accent colour, then the plain explanation. Separation
   is whitespace and hairlines, never borders. */
function Work() {
  return (
    <section className="sheet py-11 md:py-14">
      <div className="rule flex flex-wrap items-baseline justify-between gap-3 pt-3">
        <h2 className="subhead">Selected work</h2>
        <p className="byline">Six of them · 2024–2026</p>
      </div>

      {/* Four stories in three columns leaves an orphan on a second row. The
          first runs as the lead across two columns with a wider crop, the
          way a front page carries one story above the others. */}
      <div className="mt-9 grid gap-x-11 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {work.map((item, i) => (
          <article
            key={item.slug}
            id={item.slug}
            className={`relative flex flex-col ${i === 0 ? "lg:col-span-2" : ""}`}
          >
            {item.image ? (
              <figure className="mb-4 bg-bone">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  width={item.image.w}
                  height={item.image.h}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={`block h-auto w-full object-cover ${
                    i === 0 ? "aspect-[16/7]" : "aspect-[4/3]"
                  }`}
                  style={{
                    boxShadow: "rgba(29, 29, 27, 0.2) -4px 4px 6px 0px",
                    objectPosition: item.image.position ?? "center",
                  }}
                />
              </figure>
            ) : null}

            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <h3 className="subhead">
                {item.hasStudy ? (
                  /* The whole card is the link. The heading anchor is
                     stretched over the article so a click lands anywhere on
                     it, while the anchor text stays the accessible name
                     rather than becoming "read more" repeated four times. */
                  <Link
                    href={`/work/${item.slug}`}
                    className="no-underline after:absolute after:inset-0 after:content-[''] hover:underline"
                  >
                    {item.title}
                  </Link>
                ) : (
                  item.title
                )}
              </h3>
              {item.isNew ? (
                <span
                  className="byline bg-ember px-1.5 py-0.5 text-parchment"
                  style={{ borderRadius: "2.88px" }}
                >
                  New
                </span>
              ) : null}
            </div>

            <p className="byline mt-1.5">{item.kicker}</p>

            <p className="pretty mt-3 italic leading-[1.32]">{item.standfirst}</p>
            <p className="pretty mt-3 leading-[1.32]">{item.body}</p>
            <p className="pretty mt-3 leading-[1.32] text-charcoal">{item.turn}</p>

            <div className="mt-auto pt-5">
              <div className="relative z-10 flex flex-wrap gap-x-4 gap-y-1">
                {item.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                    {l.label}
                  </a>
                ))}
              </div>
              <p className="byline mt-2.5">{item.stack.join(" · ")}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* --- The dispatch ---------------------------------------------------------
   A boxed feature on bone cream, set in newspaper columns. Set up, then
   delivered — the previous version led with the punchline. */
function Dispatch() {
  return (
    <section className="sheet pb-12 md:pb-16">
      <div className="bg-bone px-6 py-9 md:px-11 md:py-12">
        <p className="byline">{dispatch.kicker}</p>
        <h2 className="headline mt-3 max-w-[16ch] text-balance">{dispatch.headline}</h2>

        <div className="mt-7 columns-1 gap-11 md:columns-2 lg:columns-3">
          {dispatch.paragraphs.map((p, i) => (
            <p key={i} className="pretty mb-4 break-inside-avoid leading-[1.36]">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- The back page -------------------------------------------------------- */
function BackPage() {
  return (
    <section className="sheet py-11 md:py-14">
      <p className="lede pretty max-w-[52ch]">{backPage.standfirst}</p>

      <dl className="mt-9 grid gap-x-11 gap-y-9 md:grid-cols-2">
        {backPage.items.map((item) => (
          <div key={item.term} className="rule pt-3.5">
            <dt className="flex flex-wrap items-baseline gap-x-2.5">
              <span
                className="subhead"
                style={{ fontSize: "clamp(2.4rem, 5vw, 3.4rem)", lineHeight: 0.9 }}
              >
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="no-underline">
                    {item.term}
                  </a>
                ) : (
                  item.term
                )}
              </span>
              <span className="byline">{item.unit}</span>
            </dt>
            <dd className="pretty mt-2.5 max-w-[46ch] leading-[1.32]">{item.line}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* --- The record -----------------------------------------------------------
   Plain, complete, and deliberately unstyled. Somebody scanning for dates
   and titles should be able to reconstruct a CV here without reading a word
   of the prose above. */
function RecordSection() {
  return (
    <section className="sheet py-11 md:py-14">
      <div className="rule flex flex-wrap items-baseline justify-between gap-3 pt-3">
        <h2 className="subhead">The record</h2>
        <p className="byline">Where I have actually worked</p>
      </div>

      <div className="mt-8 grid gap-x-11 gap-y-9 md:grid-cols-2">
        {record.roles.map((r) => (
          <div key={r.org}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="subhead">{r.org}</h3>
              <span className="byline tabular">{r.period}</span>
            </div>
            <p className="byline mt-1">{r.title}</p>
            <ul className="mt-3 max-w-[46ch] list-none">
              {r.lines.map((l, i) => (
                <li key={i} className="pretty mb-2 leading-[1.32]">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-9 max-w-[46ch]">
        <p className="byline">Education</p>
        <dl className="mt-2.5">
          {record.education.map((e) => (
            <div key={e.school} className="flex flex-wrap items-baseline justify-between gap-x-4">
              <dt>
                {e.school} — <span className="text-charcoal">{e.detail}</span>
              </dt>
              <dd className="byline tabular">{e.period}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* --- The archive ----------------------------------------------------------
   Coursework, labelled as coursework, one line each. Volume is evidence of
   practice; it is not the argument, which is why it lives down here. */
function ArchiveSection() {
  return (
    <section className="sheet pb-14">
      <div className="rule flex flex-wrap items-baseline justify-between gap-3 pt-3">
        <h2 className="subhead">Also on the shelf</h2>
        <p className="byline">Coursework · 2025</p>
      </div>

      <ul className="mt-6 grid gap-x-11 gap-y-5 md:grid-cols-2">
        {archive.map((a) => (
          <li key={a.title} className="max-w-[46ch]">
            <a href={a.href} target="_blank" rel="noreferrer" className="no-underline">
              <span className="underline">{a.title}</span>{" "}
              <span className="byline">{a.year}</span>
            </a>
            <p className="pretty mt-1 leading-[1.32] text-charcoal">{a.line}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* --- Footer, two-column plain text ---------------------------------------- */
function Colophon() {
  return (
    <footer className="rule">
      <div className="sheet grid gap-x-11 gap-y-6 py-9 md:grid-cols-2">
        <div>
          <p className="subhead">
            <a href={`mailto:${links.email}`} className="no-underline hover:underline">
              {links.email}
            </a>
          </p>
          <p className="pretty mt-2 text-charcoal">I reply to specific emails fastest.</p>
        </div>

        <div className="md:text-right">
          <div className="flex flex-wrap gap-x-5 gap-y-1 md:justify-end">
            <a href={links.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={links.resume}>Résumé</a>
          </div>
          <p className="byline mt-3">Set in Bodoni, Playfair and Source Serif · New York</p>
        </div>
      </div>
    </footer>
  );
}
