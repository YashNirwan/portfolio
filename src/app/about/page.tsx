import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { lede, record, archive, archiveNote, portrait, classified, links } from "@/lib/data";

export const metadata: Metadata = {
  title: "About — Yash Nirwan",
  description: lede.standfirst,
  alternates: { canonical: "/about" },
};

/* ===========================================================================
   About.

   Built against the reference's /about, measured live at 1440 with its
   Locomotive scroll container unlocked so the layout could be read:

     ground        rgb(205,198,190) — bone, not parchment
     ABOUT ME      Canopee 475px, line-height 0.70, -0.05em, full sheet width
     standfirst    Editorial New 105px, weight 300, line-height 1.03, -0.05em
     SELECTED      Canopee ~200px, two stacked lines, left column (503px)
     AWARDS!
     status row    three columns, Editorial New 60px, weight 300
     PUBLICATIONS  Canopee 158px, then a three-column grid at 43px / 500
     gutter        29px

   Canopee is a condensed face and Gloock is not, so display sizes are fitted
   to the sheet rather than copied in px — "ABOUT ME" at 33vw in Gloock would
   run off the page where Canopee sits exactly edge to edge.

   The reference fills its slots with awards and publications. There are none
   here and none are invented: each slot takes the nearest real material
   already in data.ts. The record stands where the awards stand, because both
   are the credentials block; the archive stands where the publications do,
   because both are a list of titled things with a line and a link. Nothing
   on this page is a claim that is not already made, and sourced, on the
   front page.

   That also means this page repeats the front page's record and archive.
   Deliberately left as a question for the owner rather than resolved by
   deleting content from the homepage: see HANDOFF.md.
   =========================================================================== */
export default function About() {
  const nyu = record.education[0];
  const status = [
    /* Each of these is verbatim or near-verbatim from data.ts: the
       classified's "Available now", the roles line "Based in New York.", and
       the education entry. No new claims. */
    classified.find((c) => c.startsWith("Available")) ?? "Available now",
    lede.roles[lede.roles.length - 1],
    `NYU, ${nyu.detail.split(",")[0]} ${nyu.period.split("–").pop()?.trim()}`,
  ];

  return (
    <div className="min-h-svh bg-bone">
      <header className="border-b border-ink">
        <div className="sheet flex items-baseline justify-between gap-4 py-5">
          <Link href="/" className="plate-row no-underline hover:underline">
            ← The front page
          </Link>
          <span className="gothic hidden text-[22px] sm:block">The Second Opinion</span>
          <Link href="/work" className="plate-row no-underline hover:underline">
            All work
          </Link>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        {/* ABOUT ME. Fitted with textLength so it spans the sheet exactly,
            which is what the reference's 475px Canopee does at 1440 (1382px
            wide in a 1440 viewport with a 29px gutter). */}
        <section className="sheet pt-8">
          <h1 className="press">
            <FitLine text="About me" />
          </h1>
        </section>

        {/* The standfirst. Measured 105px / 300 / 1.03 / -0.05em at 1440,
            i.e. 7.3vw. A stance rather than a job title — the site gives the
            owner none, on purpose. */}
        <section className="sheet mt-8 md:mt-12">
          <p
            className="pretty"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "clamp(2.1rem, 7.3vw, 6.5625rem)",
              lineHeight: 1.03,
              letterSpacing: "-0.05em",
            }}
          >
            {lede.headline}
          </p>
        </section>

        {/* Portrait and the opening paragraphs. The 22rem cap on the photo is
            the same one the front page keeps: it is an 800px source. */}
        <section className="sheet mt-14 border-t border-ink pt-10">
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-[22rem_minmax(0,1fr)]">
            <figure className="par-slow max-w-[22rem]">
              <Image
                src={portrait.src}
                alt={portrait.alt}
                width={portrait.w}
                height={portrait.h}
                sizes="(max-width: 768px) 100vw, 22rem"
                className="block h-auto w-full"
                style={{ boxShadow: "var(--shadow-sm-2)" }}
              />
              <figcaption className="byline mt-2">{portrait.caption}</figcaption>
            </figure>
            <div className="max-w-[40rem] md:self-end">
              <p className="pretty leading-[1.36]">
                <span className="capbox" aria-hidden="true">
                  {lede.paragraphs[0].charAt(0)}
                </span>
                {lede.paragraphs[0].slice(1)}
              </p>
              {lede.paragraphs.slice(1).map((p, i) => (
                <p key={i} className="pretty mt-4 leading-[1.36]">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* The credentials block. The reference sets SELECTED / AWARDS! as two
            stacked display lines in a left column (503px of 1382 — 36%) with
            the entries beside it. The record takes the same shape. */}
        <section className="sheet mt-16 border-t border-ink pt-10">
          <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[36fr_64fr]">
            <h2 className="heavy heavy-xl text-[clamp(3.4rem,9vw,8rem)]">
              The
              <br />
              record!
            </h2>
            <div>
              {record.roles.map((r) => (
                <div key={r.org} className="border-t border-ink/30 py-5 first:border-t-0 first:pt-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="heavy text-[clamp(1.4rem,2.2vw,2rem)]">{r.org}</h3>
                    <span className="byline byline-caps tabular">{r.period}</span>
                  </div>
                  <p className="byline mt-1">{r.title}</p>
                  <ul className="mt-3 max-w-[52ch]">
                    {r.lines.map((l, i) => (
                      <li key={i} className="pretty mb-1.5 leading-[1.3]">
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="border-t border-ink/30 pt-5">
                <p className="byline byline-caps">Education</p>
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
            </div>
          </div>
        </section>

        {/* The status row. Three columns at 60px / 300 on the reference —
            4.2vw at 1440. Hairlines between, the way a paper separates
            stories. */}
        <section className="sheet mt-16 border-y border-ink py-10">
          <ul className="ruled grid gap-x-7 gap-y-6 md:grid-cols-3">
            {status.map((s) => (
              <li
                key={s}
                className="pretty"
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: "clamp(1.9rem, 4.2vw, 3.75rem)",
                  lineHeight: 1.03,
                  letterSpacing: "-0.04em",
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        </section>

        {/* The list block. The reference's PUBLICATIONS: a display heading,
            then a three-column grid of titles at 43px / 500. The archive is
            the same shape — titled items with a line and a link — and is
            labelled as coursework, which it is. */}
        <section className="sheet mt-16 pb-16">
          <h2 className="heavy heavy-xl text-[clamp(3.2rem,11vw,9.9rem)]">The archive</h2>
          <p className="byline mt-4 max-w-[52ch]">{archiveNote}</p>
          <ul className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {archive.map((a) => (
              <li key={a.href} className="border-t border-ink pt-4">
                <span className="byline byline-caps tabular">{a.year}</span>
                <h3
                  className="mt-2"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    fontSize: "clamp(1.6rem, 3vw, 2.6875rem)",
                    lineHeight: 1.0,
                    letterSpacing: "-0.04em",
                  }}
                >
                  <a href={a.href} target="_blank" rel="noreferrer" className="no-underline hover:underline">
                    {a.title}
                  </a>
                </h3>
                <p className="pretty mt-3 max-w-[40ch] leading-[1.3]">{a.line}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* The reference closes its pages on LET'S TALK!, and so does the
          catalogue now. Same close here, so the two inner pages end alike. */}
      <section className="bg-ink text-parchment">
        <div className="sheet flex flex-wrap items-end justify-between gap-8 py-14">
          <h2 className="heavy heavy-xl text-[clamp(3.4rem,10vw,9rem)]">
            Let’s
            <br />
            talk!
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${links.email}`}
              className="inline-block border border-parchment px-7 py-3 no-underline"
              style={{ borderRadius: "999px" }}
            >
              <span className="heavy text-[15px]">Email me</span>
            </a>
            <a href={links.resume} className="byline text-bone no-underline hover:underline">
              Résumé
            </a>
            <a
              href={links.github}
              target="_blank"
              rel="noreferrer"
              className="byline text-bone no-underline hover:underline"
            >
              GitHub
            </a>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="byline text-bone no-underline hover:underline"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/* One line of display type fitted edge to edge. Same technique as the
   homepage Banner — textLength with lengthAdjust="spacing", sized so the
   natural width slightly exceeds the box and the adjustment only ever
   tightens — but painted straight onto the page in ink, with no block
   behind it, because the reference's ABOUT ME sits directly on the stock. */
function FitLine({ text }: { text: string }) {
  const t = text.toUpperCase();
  const BOX = 1000;
  const size = BOX / (0.62 * t.length);
  const height = size * 0.86;
  return (
    <svg viewBox={`0 0 ${BOX} ${height}`} className="block w-full" role="img" aria-label={text}>
      <text
        x={BOX / 2}
        y={size * 0.8}
        textAnchor="middle"
        textLength={BOX * 0.995}
        lengthAdjust="spacing"
        fill="var(--color-ink)"
        style={{ fontFamily: "var(--font-display)", fontSize: `${size}px`, fontWeight: 400 }}
      >
        {t}
      </text>
    </svg>
  );
}
