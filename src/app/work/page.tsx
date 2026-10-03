import type { Metadata } from "next";
import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { work, lede, links } from "@/lib/data";
import { Stamp } from "@/components/stamp";
import { Lateral } from "@/components/lateral";

export const metadata: Metadata = {
  title: "All work — Yash Nirwan",
  description: "Six projects, and what each one actually does.",
  alternates: { canonical: "/work" },
};

/* The catalogue reads sideways: an opening panel, then the shelf. Each
   project is a spine, closed until you touch it. */
export default function WorkIndex() {
  return (
    /* One screen tall, header included. Below lg a small header sits above
       the shelf; with the shelf at a full 100svh of its own, the two together
       ran a header's height past the screen and the page scrolled down. The
       shelf now takes whatever height the header leaves. */
    <div className="flex h-svh flex-col">
      {/* The rail. Fixed, so it stays put while the shelf slides past. */}
      <div className="pointer-events-none fixed inset-y-0 left-0 z-20 hidden w-[6.5rem] border-r border-ink bg-bone lg:block">
        <div className="grid h-full grid-rows-[auto_1fr_auto] justify-items-center py-7">
          <Link href="/" className="pointer-events-auto byline no-underline hover:underline">
            ←
          </Link>
          <span
            className="gothic self-center text-[17px]"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            The Second Opinion
          </span>
          <span
            className="byline byline-caps"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            New York, NY
          </span>
        </div>
      </div>

      {/* Narrow screens get an ordinary header; a lateral page on a phone
          fights the back gesture. */}
      <header className="border-b border-ink lg:hidden">
        <div className="sheet flex items-baseline justify-between gap-4 py-3.5">
          <Link href="/" className="byline no-underline hover:underline">
            ← The front page
          </Link>
          <span className="gothic text-[17px]">The Second Opinion</span>
        </div>
      </header>

      {/* Measured on the reference at 1440: body background rgb(205,198,190),
          which is this palette's bone, not parchment. The shelf beyond the
          opening panel then runs on ink — the page is bone up to roughly one
          viewport and near-black for the remaining ~4,200px of its 5,617px
          width. Ours was parchment end to end. */}
      <main id="main" tabIndex={-1} className="min-h-0 flex-1 bg-bone lg:pl-[6.5rem]">
        <Lateral>
          <section className="flex w-[min(92vw,44rem)] shrink-0 flex-col justify-center px-5 md:px-10">
            {/* The reference sets FEATURED and WORK at the SAME size (Canopee
                240px) in boxes of different widths, 608 and 460. So each box
                here is its own word's measured width — Instrument Serif at
                180 units: FEATURED 677, WORK 389, plus 28 a side — and the two
                containers keep the ratio of those viewBoxes (733:445), which
                is what holds the two words at one size on screen. */}
            <div className="ink press w-full max-w-[32rem]">
              <svg viewBox="0 0 733 172" className="block w-full" role="img" aria-label="Featured">
                <text
                  x="366.5"
                  y="152"
                  textAnchor="middle"
                  textLength="677"
                  lengthAdjust="spacing"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2.9"
                  style={{ fontFamily: "var(--font-display)", fontSize: "180px", fontWeight: 400 }}
                >
                  FEATURED
                </text>
              </svg>
            </div>

            <div className="mt-2 flex items-end gap-5">
              <div className="ink press press-2 w-full max-w-[19.43rem]">
                <svg viewBox="0 0 445 172" className="block w-full" role="img" aria-label="Work">
                  <text
                    x="222.5"
                    y="152"
                    textAnchor="middle"
                    textLength="389"
                    lengthAdjust="spacing"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2.9"
                    style={{ fontFamily: "var(--font-display)", fontSize: "180px", fontWeight: 400 }}
                  >
                    WORK
                  </text>
                </svg>
              </div>
              <Stamp className="hidden w-[7rem] shrink-0 sm:block" />
            </div>

            <p className="pretty mt-7 max-w-[38ch] leading-[1.42]">
              <span className="capbox" aria-hidden="true">
                {lede.creed.charAt(0)}
              </span>
              {lede.creed.slice(1)}
            </p>

            <p className="byline mt-7 hidden lg:block">
              <span className="heavy byline-caps mr-1.5 text-[13px]">Tip!</span>
              Scroll to move sideways
            </p>
          </section>

          {work.map((item) => (
            <Spine key={item.slug} item={item} />
          ))}

          {/* The closing panel. The reference ends its shelf on a display-scale
              LET'S TALK! — measured at Canopee 220px, line-height 0.77,
              tracking -0.05em — not on a paragraph. Ours ended on 2.6rem of
              body copy, which reads as the page running out rather than as an
              invitation. Same register as the FEATURED/WORK opening, so the
              shelf is bracketed by two display panels. */}
          <section className="flex w-[min(92vw,34rem)] shrink-0 flex-col justify-center border-l border-parchment/25 bg-ink px-5 text-parchment md:px-10">
            <h2 className="heavy text-[clamp(3rem,7vw,7.2rem)] leading-[0.77]">
              Let’s
              <br />
              talk!
            </h2>
            <p className="pretty mt-6 max-w-[34ch] leading-[1.35]">
              Six things, each with the number that made me keep it. If one of them is the kind of
              problem you have, say so.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${links.email}`}
                className="inline-block border border-parchment px-7 py-3 no-underline"
                style={{ borderRadius: "999px" }}
              >
                <span className="heavy text-[15px]">Email me</span>
              </a>
              <Link href="/" className="tap byline text-bone no-underline hover:underline">
                ← Back to the front page
              </Link>
            </div>
          </section>
        </Lateral>
      </main>
    </div>
  );
}

/* Cut on a word boundary, never mid-word. */
function clip(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:—–-]$/, "").trimEnd() + "…";
}

function Spine({ item }: { item: (typeof work)[number] }) {
  const year = item.kicker.split("·").pop()?.trim();

  /* A spine is a closed book until you touch it: the column fills with the
     work, the ink inverts, the title lifts. The shared view-transition name
     is what lets it fall open into the project page rather than cutting. */
  return (
    <ViewTransition name={`folder-${item.slug}`}>
      <article className="leaf group relative h-full w-[11rem] shrink-0 overflow-hidden border-r border-parchment/25 bg-ink sm:w-[13.5rem]">
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-focus-within:opacity-100 group-hover:opacity-100">
          {item.image ? (
            <Image
              src={item.image.src}
              alt=""
              fill
              sizes="14rem"
              aria-hidden="true"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          ) : null}
          <div className="absolute inset-0 bg-ink/45" />
        </div>

        <Link
          href={`/work/${item.slug}`}
          className="relative flex h-full flex-col items-center justify-between gap-5 px-3 py-10 no-underline"
        >
          <h2 className="heavy text-[30px] text-parchment">
            <span
              className="inline-block [writing-mode:vertical-rl] transition-transform duration-500 ease-out group-hover:-translate-y-1.5"
              style={{ transform: "none" }}
            >
              {item.title}
            </span>
          </h2>

          <p className="pointer-events-none absolute inset-x-4 bottom-24 text-center text-[13px] leading-[1.38] text-parchment opacity-0 transition-opacity duration-500 group-focus-within:opacity-100 group-hover:opacity-100">
            {clip(item.standfirst, 96)}
          </p>

          <div className="relative flex flex-col items-center gap-2.5">
            {item.isNew ? (
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
            ) : null}
            <span className="byline byline-caps tabular text-bone">
              {year}
            </span>
          </div>
        </Link>
      </article>
    </ViewTransition>
  );
}
