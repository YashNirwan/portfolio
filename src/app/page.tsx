import Image from "next/image";
import { statement, forklift, bio, notWork, links } from "@/lib/data";

export const metadata = { alternates: { canonical: "/" } };

/* VERTICAL SLICE — four plates, for review before the rest is built.
   Work, record and archive follow once the structure is agreed. */
export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <Masthead />
      <Forklift />
      <Bio />
      <NotWork />
    </main>
  );
}

/* --- Plate one: indigo --------------------------------------------------- */
function Masthead() {
  return (
    <section className="field bg-indigo">
      <div className="hold">
        <Trim tone="bone">{statement.trim}</Trim>
      </div>

      <div className="hold mt-auto pt-14">
        <h1>
          <span
            className="display display-hold press block text-bone"
            style={{ fontSize: "var(--text-hero)", lineHeight: "var(--leading-hero)" }}
          >
            {statement.first}
          </span>
          {/* Indented to roughly the width of the line above — a register
              offset borrowed from block printing, and the only ornament in
              the system. */}
          <span
            className="display display-hold press press-2 block text-bone"
            style={{
              fontSize: "var(--text-hero)",
              lineHeight: "var(--leading-hero)",
              paddingLeft: "0.42em",
            }}
          >
            {statement.last}
          </span>
        </h1>

        <div className="mt-8 max-w-[36rem]">
          <p
            className="pretty text-bone/90"
            style={{ fontSize: "var(--text-lede)", lineHeight: 1.44 }}
          >
            {statement.lede}
          </p>
          <p className="pretty mt-3 text-bone/65">{statement.ledeAfter}</p>
        </div>
      </div>

      <div className="hold mt-auto flex items-center justify-between pt-12">
        <a href={`mailto:${links.email}`} className="trim text-bone/80">
          {links.email}
        </a>
        {/* The only warm pixel on the screen. */}
        <span aria-hidden="true" className="block h-2.5 w-2.5 bg-turmeric" />
      </div>
    </section>
  );
}

/* --- Plate two: bone ------------------------------------------------------
   The page goes light exactly once. A reversal in a run of saturated colour
   is a surprise you can only spend a single time, so it is spent on the best
   thing in the material. */
function Forklift() {
  return (
    <section className="plate bg-bone text-iron">
      <div className="hold">
        <Trim tone="iron">The one that changed the design</Trim>

        {/* No max-width here. `ch` would resolve against this paragraph's own
            font size rather than the display spans inside it, clamping 100px
            type to a ~180px column and breaking every authored line. The
            lines are short by construction; let them set. */}
        <p className="mt-7">
          {forklift.lines.map((line) => (
            <span
              key={line}
              className="display block"
              style={{ fontSize: "var(--text-field)", lineHeight: "var(--leading-field)" }}
            >
              {line}
            </span>
          ))}
        </p>

        <p className="trim mt-6 text-iron/55">{forklift.attribution}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-14">
          <p className="pretty text-iron/85">{forklift.body}</p>
          <p className="pretty text-iron/85">{forklift.after}</p>
        </div>
      </div>
    </section>
  );
}

/* --- Plate three: madder ------------------------------------------------- */
function Bio() {
  return (
    <section className="plate bg-madder">
      <div className="hold">
        <Trim tone="bone">Who</Trim>

        {/* Both tracks are capped, so the pair sits as one block rather than
            a small photo marooned beside a narrow column of text. */}
        <div className="mt-8 grid items-start gap-8 md:grid-cols-[minmax(0,22rem)_minmax(0,30rem)] md:gap-14">
          <Image
            src={bio.portrait.src}
            alt={bio.portrait.alt}
            width={bio.portrait.w}
            height={bio.portrait.h}
            sizes="(max-width: 768px) 100vw, 22rem"
            priority
            className="block h-auto w-full max-w-[22rem]"
            style={{ boxShadow: "14px 14px 0 var(--color-madder-deep)" }}
          />

          <div>
            {bio.paragraphs.map((p, i) => (
              <p key={i} className="pretty mb-4 text-bone last:mb-0">
                {p}
              </p>
            ))}
            <p className="trim mt-8 text-bone/70">{bio.trim}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- Plate four: iron -----------------------------------------------------
   Hobbies get display-scale typography. Giving the thing nobody asked for
   the same weight as the employment is the argument, and it makes it without
   saying anything about itself. */
function NotWork() {
  return (
    <section className="plate bg-iron">
      <div className="hold">
        <Trim tone="ash">Not work</Trim>

        <dl className="mt-8">
          {notWork.map((item) => (
            <div
              key={item.term}
              className="grid items-baseline gap-x-10 gap-y-1 border-t border-bone/12 py-5 md:grid-cols-[minmax(0,17rem)_minmax(0,30rem)]"
            >
              <dt
                className={`display min-w-0 ${item.hot ? "tabular text-turmeric" : "text-bone"}`}
                style={{ fontSize: "var(--text-row)", lineHeight: 0.95 }}
              >
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noreferrer">
                    {item.term}
                  </a>
                ) : (
                  item.term
                )}
              </dt>
              <dd className="pretty text-ash">{item.line}</dd>
            </div>
          ))}
        </dl>

        {/* Drawn straight from the database the first row is about. */}
        <figure className="mt-10">
          <Image
            src="/farewatch.svg"
            alt="Minimum observed fare over time across the six most watched routes out of New York"
            width={2400}
            height={900}
            className="h-auto w-full"
          />
          <figcaption className="trim mt-3 text-ash">
            Six routes out of New York. The gold line is whichever is cheapest — currently
            LaGuardia to Houston, which started being watched later than the rest.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function Trim({ children, tone }: { children: React.ReactNode; tone: "bone" | "ash" | "iron" }) {
  const color =
    tone === "bone" ? "text-bone/60" : tone === "iron" ? "text-iron/55" : "text-ash";
  return <p className={`trim uppercase ${color}`}>{children}</p>;
}
