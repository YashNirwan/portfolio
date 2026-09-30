import type { Metadata } from "next";
import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { work, lede } from "@/lib/data";
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
    <>
      {/* The rail. Fixed, so it stays put while the shelf slides past. */}
      <div className="pointer-events-none fixed inset-y-0 left-0 z-20 hidden w-[6.5rem] border-r border-ink bg-parchment lg:block">
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

      <main id="main" tabIndex={-1} className="lg:pl-[6.5rem]">
        <Lateral>
          <section className="flex w-[min(92vw,44rem)] shrink-0 flex-col justify-center px-5 md:px-10">
            <div className="ink press w-full max-w-[32rem]">
              <svg viewBox="0 0 620 150" className="block w-full" role="img" aria-label="Featured">
                <text
                  x="310"
                  y="118"
                  textAnchor="middle"
                  textLength="586"
                  lengthAdjust="spacing"
                  fill="currentColor"
                  style={{ fontFamily: "var(--font-display)", fontSize: "150px", fontWeight: 400 }}
                >
                  FEATURED
                </text>
              </svg>
            </div>

            <div className="mt-2 flex items-end gap-5">
              <div className="ink press press-2 w-full max-w-[21rem]">
                <svg viewBox="0 0 420 150" className="block w-full" role="img" aria-label="Work">
                  <text
                    x="210"
                    y="118"
                    textAnchor="middle"
                    textLength="397"
                    lengthAdjust="spacing"
                    fill="currentColor"
                    style={{ fontFamily: "var(--font-display)", fontSize: "150px", fontWeight: 400 }}
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

          {/* A closing panel, so the shelf ends on something rather than air. */}
          <section className="flex w-[min(86vw,26rem)] shrink-0 flex-col justify-center border-l border-ink px-5 md:px-10">
            <p className="heavy text-[clamp(1.8rem,3vw,2.6rem)]">That is all of it.</p>
            <p className="pretty mt-4 leading-[1.42]">
              Six things, each with the number that made me keep it. If one of them is the kind of
              problem you have, say so.
            </p>
            <Link
              href="/"
              className="heavy mt-7 inline-block text-[16px] no-underline hover:underline"
            >
              ← Back to the front page
            </Link>
          </section>
        </Lateral>
      </main>
    </>
  );
}

function Spine({ item }: { item: (typeof work)[number] }) {
  const year = item.kicker.split("·").pop()?.trim();

  /* A spine is a closed book until you touch it: the column fills with the
     work, the ink inverts, the title lifts. The shared view-transition name
     is what lets it fall open into the project page rather than cutting. */
  return (
    <ViewTransition name={`folder-${item.slug}`}>
      <article className="leaf group relative h-full w-[11rem] shrink-0 overflow-hidden border-r border-ink bg-parchment sm:w-[13.5rem]">
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
          <div className="absolute inset-0 bg-ink/60" />
        </div>

        <Link
          href={`/work/${item.slug}`}
          className="relative flex h-full flex-col items-center justify-between gap-5 px-3 py-10 no-underline"
        >
          <h2 className="heavy text-[30px] transition-colors duration-300 group-focus-within:text-parchment group-hover:text-parchment">
            <span
              className="inline-block [writing-mode:vertical-rl] transition-transform duration-500 ease-out group-hover:-translate-y-1.5"
              style={{ transform: "none" }}
            >
              {item.title}
            </span>
          </h2>

          <p className="pointer-events-none absolute inset-x-4 bottom-24 text-center text-[13px] leading-[1.38] text-parchment opacity-0 transition-opacity duration-500 group-focus-within:opacity-100 group-hover:opacity-100">
            {item.standfirst.length > 96
              ? item.standfirst.slice(0, 96).trimEnd() + "…"
              : item.standfirst}
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
            <span className="byline byline-caps tabular transition-colors duration-300 group-focus-within:text-parchment group-hover:text-parchment">
              {year}
            </span>
          </div>
        </Link>
      </article>
    </ViewTransition>
  );
}
