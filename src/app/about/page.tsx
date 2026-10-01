import type { Metadata } from "next";
import Image from "next/image";
import { lede, record, portrait, graduation, situationWanted, classified, links } from "@/lib/data";
import { OrgMark } from "@/components/org-mark";
import { SiteNav } from "@/components/site-nav";

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

   Canopee is more condensed than any free stand-in (Instrument Serif sets
   1.32x its width), so display sizes are fitted to the sheet rather than
   copied in px — copying 475px would run "ABOUT ME" off the page where
   Canopee sits exactly edge to edge.

   The reference fills its slots with awards and publications. There are none
   here and none are invented: each slot takes the nearest real material
   already in data.ts. The record stands where the awards stand, because both
   are the credentials block; the publications slot is left empty,
   since the only candidate was coursework already on the front page. Nothing
   on this page is a claim that is not already made, and sourced, on the
   front page.

   Trimmed on the owner's note ("trim the /about"). The status row and the
   archive are gone: both repeated the front page almost word for word, and the
   archive is coursework. The record keeps each role's first two lines — the
   rest are on the front page and the résumé. What is left is the portrait,
   the three paragraphs that say what the work is, the record, and the ask.
   =========================================================================== */
export default function About() {
  // Verbatim from the classified; the one line of the old status row a
  // recruiter needs, kept where the page asks them to get in touch.
  const available = classified.find((c) => c.startsWith("Available")) ?? "Available now";

  return (
    <div className="min-h-svh bg-bone">
      <SiteNav tone="bone" />

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

        {/* Portrait, the opening, and the ask: a triptych. The two photos
            stand either side at the same 3:4, and the column between them is
            filled top to bottom: the classified at the head, the paragraphs
            at the foot. It was one photo beside a text column pinned to the
            bottom, which left a photo's height of empty paper above the text
            and a strip of it down the right. */}
        <section className="sheet mt-14 border-t border-ink pt-10">
          <div className="grid gap-x-10 gap-y-10 md:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)_20rem]">
            <div className="flex flex-col gap-8">
              <Photo {...portrait} position="50% 34%" />
              {/* Under the portrait while there are two columns, where the
                  left one has room to spare; its own column from 1280. */}
              <div className="max-md:hidden xl:hidden">
                <Photo {...graduation} />
              </div>
            </div>

            <div className="flex flex-col justify-between gap-10">
              {/* The classified, boxed and ruled the way a paper sets one. */}
              <aside className="border border-ink p-6 md:p-7" aria-labelledby="situation">
                <p className="byline byline-caps">{situationWanted.kicker}</p>
                <h2 id="situation" className="heavy mt-2 text-[clamp(1.9rem,3.2vw,2.9rem)] leading-[0.95]">
                  {situationWanted.headline}
                </h2>
                {situationWanted.paragraphs.map((p, i) => (
                  <p key={i} className="pretty mt-4 leading-[1.36]">
                    {p}
                  </p>
                ))}
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <a
                    href={`mailto:${links.email}`}
                    className="inline-block border border-ink px-6 py-2.5 no-underline"
                    style={{ borderRadius: "999px" }}
                  >
                    <span className="heavy text-[15px]">Hire me, please</span>
                  </a>
                  <a href={links.resume} className="tap byline">
                    Or read the résumé first
                  </a>
                </div>
              </aside>

              <div>
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

            {/* Third column from 1280 up, set to the foot of the row so the
                two photos stagger — the portrait at the head of its column,
                this one at the foot of its own — rather than both stopping
                at the same height above the same empty band. On phones it
                closes the stack. */}
            <div className="md:hidden xl:block xl:self-end">
              <Photo {...graduation} />
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
                    <h3 className="heavy flex items-center gap-3 text-[clamp(1.4rem,2.2vw,2rem)]">
                      <OrgMark org={r.org} className="h-[0.72em] w-auto" />
                      {r.org}
                    </h3>
                    <span className="byline byline-caps tabular">{r.period}</span>
                  </div>
                  <p className="byline mt-1">{r.title}</p>
                  <ul className="mt-3 max-w-[52ch]">
                    {r.lines.slice(0, 2).map((l, i) => (
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

        <div className="pb-16" />
      </main>

      {/* The reference closes its pages on LET'S TALK!, and so does the
          catalogue now. Same close here, so the two inner pages end alike. */}
      <section className="bg-ink text-parchment">
        <div className="sheet flex flex-wrap items-end justify-between gap-8 py-14">
          <div>
            <h2 className="heavy heavy-xl text-[clamp(3.4rem,10vw,9rem)]">
              Let’s
              <br />
              talk!
            </h2>
            <p className="byline mt-4 text-bone">{available}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${links.email}`}
              className="inline-block border border-parchment px-7 py-3 no-underline"
              style={{ borderRadius: "999px" }}
            >
              <span className="heavy text-[15px]">Email me</span>
            </a>
            <a href={links.resume} className="tap byline text-bone no-underline hover:underline">
              Résumé
            </a>
            <a
              href={links.github}
              target="_blank"
              rel="noreferrer"
              className="tap byline text-bone no-underline hover:underline"
            >
              GitHub
            </a>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="tap byline text-bone no-underline hover:underline"
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
  const size = BOX / (0.47 * t.length);
  /* 0.47em per capital: Instrument Serif measures 0.47-0.50 on these words,
     so the natural width just meets or overshoots the box and textLength
     only ever tightens — by ~1%. 0.45 tightened NIRWAN ~5% and, in a face
     already set tight, ran N-I-R into one shape. (0.62 was Gloock's.) */
  const height = size * 0.854;
  return (
    <svg viewBox={`0 0 ${BOX} ${height}`} className="block w-full" role="img" aria-label={text}>
      <text
        x={BOX / 2}
        y={size * 0.794}
        textAnchor="middle"
        textLength={BOX * 0.995}
        lengthAdjust="spacing"
        fill="var(--color-ink)"
        stroke="var(--color-ink)"
        strokeWidth={size * 0.01}
        style={{ fontFamily: "var(--font-display)", fontSize: `${size}px`, fontWeight: 400 }}
      >
        {t}
      </text>
    </svg>
  );
}

/* One photo of the pair, at a shared 3:4 so the two stand level. */
function Photo({
  src,
  alt,
  w,
  h,
  caption,
  position = "50% 50%",
}: {
  src: string;
  alt: string;
  w: number;
  h: number;
  caption: string;
  position?: string;
}) {
  return (
    <figure className="par-slow">
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        sizes="(max-width: 768px) 100vw, 20rem"
        className="block aspect-[3/4] h-auto w-full object-cover"
        style={{ boxShadow: "var(--shadow-sm-2)", objectPosition: position }}
      />
      <figcaption className="byline mt-2">{caption}</figcaption>
    </figure>
  );
}
