import type { Metadata } from "next";
import Link from "next/link";
import { work, lede } from "@/lib/data";
import { Stamp } from "@/components/stamp";

export const metadata: Metadata = {
  title: "All work — Yash Nirwan",
  description: "Six projects, and what each one actually does.",
  alternates: { canonical: "/work" },
};

/* The catalogue.

   Projects are vertical spines, like books stood on a shelf: the title reads
   bottom-to-top, the badge and year sit at the foot, a hairline divides each
   from the next. The reference scrolls this horizontally; here it scrolls
   horizontally on a wide screen and stacks into ordinary cards on a narrow
   one, because a horizontal scroll on a phone fights the gesture people
   already use to go back. */
export default function WorkIndex() {
  return (
    <>
      <header className="border-b border-ink">
        <div className="sheet flex items-baseline justify-between gap-4 py-3.5">
          <Link href="/" className="byline no-underline hover:underline">
            ← The front page
          </Link>
          <span className="gothic hidden text-[19px] sm:block">The Paper Portfolio</span>
          <span className="byline">New York, NY</span>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <div>
          <section className="sheet py-10 md:py-14">
            <div className="ink inline-block w-full max-w-[34rem]">
              <svg
                viewBox="0 0 620 150"
                className="block w-full"
                role="img"
                aria-label="Featured"
              >
                <text
                  x="310"
                  y="118"
                  textAnchor="middle"
                  textLength="620"
                  lengthAdjust="spacing"
                  fill="currentColor"
                  style={{ fontFamily: "var(--font-display)", fontSize: "150px", fontWeight: 400 }}
                >
                  FEATURED
                </text>
              </svg>
            </div>

            <div className="mt-2 flex items-end gap-5">
              <div className="ink inline-block w-full max-w-[23rem]">
                <svg
                  viewBox="0 0 420 150"
                  className="block w-full"
                  role="img"
                  aria-label="Work"
                >
                  <text
                    x="210"
                    y="118"
                    textAnchor="middle"
                    textLength="420"
                    lengthAdjust="spacing"
                    fill="currentColor"
                    style={{ fontFamily: "var(--font-display)", fontSize: "150px", fontWeight: 400 }}
                  >
                    WORK
                  </text>
                </svg>
              </div>
              <Stamp className="hidden w-[7.5rem] sm:block" />
            </div>

            <p className="pretty mt-8 max-w-[40ch] leading-[1.32]">
              <span className="capbox" aria-hidden="true">
                {lede.creed.charAt(0)}
              </span>
              {lede.creed.slice(1)}
            </p>

            <p className="byline mt-8 hidden">
              <span className="heavy mr-1.5 text-[13px]">Tip!</span>
              Scroll sideways
            </p>
          </section>

          {/* The shelf. A bounded strip that scrolls sideways with snap
              points, rather than turning the whole document into a
              horizontal scroller — which breaks the scrollbar's meaning,
              find-in-page and keyboard paging. */}
          <div
            className="flex snap-x snap-mandatory overflow-x-auto border-y border-ink"
            style={{ scrollbarWidth: "thin" }}
          >
            {work.map((item) => (
              <Spine key={item.slug} item={item} />
            ))}
          </div>

          <p className="sheet byline py-5">
            <span className="heavy mr-1.5 text-[13px]">Tip!</span>
            Drag the shelf sideways
          </p>
        </div>
      </main>
    </>
  );
}

function Spine({ item }: { item: (typeof work)[number] }) {
  return (
    <article className="relative h-[22rem] w-[11rem] shrink-0 snap-start border-r border-ink sm:h-[26rem] sm:w-[13rem]">
      <Link
        href={`/work/${item.slug}`}
        className="flex h-full flex-col items-center justify-between gap-5 px-3 py-8 no-underline"
      >
        {/* Stood on its side above lg, flat below it. */}
        <h2 className="heavy text-[30px]">
          <span
            className="[writing-mode:vertical-rl]"
            style={{ transform: "none", display: "inline-block" }}
          >
            {item.title}
          </span>
        </h2>

        <div className="flex flex-col items-center gap-2.5">
          {item.isNew ? (
            <span
              className="px-1.5 py-[1px]"
              style={{
                borderRadius: "var(--radius-sm)",
                background: "var(--color-ember)",
                color: "var(--color-parchment)",
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              New
            </span>
          ) : null}
          <span
            className="byline tabular"
            style={{ writingMode: "horizontal-tb" }}
          >
            {item.kicker.split("·").pop()?.trim()}
          </span>
        </div>
      </Link>
    </article>
  );
}
