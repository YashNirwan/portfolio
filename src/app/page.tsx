import Image from "next/image";
import { statement, bio, links } from "@/lib/data";

export const metadata = { alternates: { canonical: "/" } };

/* VERTICAL SLICE — three plates only, for review before the rest is built.
   Work, record and archive follow once the colour and scale are agreed. */
export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <Masthead />
      <Bio />
      <Farewatch />
    </main>
  );
}

/* --- Plate one: indigo ----------------------------------------------------
   The name at architectural scale, because on a broadsheet the masthead IS
   the name — and then the scene immediately underneath, so the first thing a
   visitor reads is something that happened rather than a claim about who he
   is. */
function Masthead() {
  return (
    <section className="field bg-indigo">
      <Trim tone="bone">{statement.trim}</Trim>

      <h1 className="mt-auto">
        <span
          className="display press block text-bone"
          style={{ fontSize: "var(--text-hero)", lineHeight: "var(--leading-hero)" }}
        >
          {statement.first}
        </span>
        {/* Indented to roughly the width of the line above — a register
            offset borrowed from block printing, and the only ornament in
            the system. */}
        <span
          className="display press press-2 block text-bone"
          style={{
            fontSize: "var(--text-hero)",
            lineHeight: "var(--leading-hero)",
            paddingLeft: "0.42em",
          }}
        >
          {statement.last}
        </span>
      </h1>

      <div className="mb-auto mt-10 max-w-[40rem]">
        <p className="pretty text-bone/90" style={{ fontSize: "var(--text-lede)", lineHeight: 1.42 }}>
          {statement.lede}
        </p>
        <p className="pretty mt-4 text-bone/70">{statement.ledeAfter}</p>
      </div>

      <div className="flex items-center justify-between pb-6">
        <a href={`mailto:${links.email}`} className="trim text-bone/80">
          {links.email}
        </a>
        {/* The only warm pixel on the screen. */}
        <span aria-hidden="true" className="block h-2.5 w-2.5 bg-turmeric" />
      </div>
    </section>
  );
}

/* --- Plate two: madder ----------------------------------------------------
   A hard cut. No rule, no whitespace, no transition — one field's padding
   ends and the next begins, and the colour changes on a single edge. */
function Bio() {
  return (
    <section className="plate bg-madder">
      <Trim tone="bone">Who</Trim>
      <div className="mt-10 grid items-start gap-10 md:grid-cols-[minmax(0,600px)_1fr] md:gap-16">
        <figure className="max-w-[600px]">
          <Image
            src={bio.portrait.src}
            alt={bio.portrait.alt}
            width={bio.portrait.w}
            height={bio.portrait.h}
            sizes="(max-width: 768px) 100vw, 600px"
            priority
            className="block h-auto w-full"
            style={{ boxShadow: "18px 18px 0 var(--color-madder-deep)" }}
          />
        </figure>

        <div className="max-w-[32rem]">
          {bio.paragraphs.map((p, i) => (
            <p key={i} className="pretty mb-5 text-bone last:mb-0">
              {p}
            </p>
          ))}
          <p className="trim mt-10 text-bone/70">{bio.trim}</p>
        </div>
      </div>
    </section>
  );
}

/* --- Plate three: iron ----------------------------------------------------
   Hobbies get display-scale typography. Giving the thing nobody asked for
   the same weight as the employment is the argument, and it is quietly
   funny without saying anything about itself. */
function Farewatch() {
  return (
    <section className="plate bg-iron">
      <Trim tone="ash">Not work</Trim>

      <div className="mt-12 grid items-end gap-8 md:grid-cols-[auto_minmax(0,32rem)] md:gap-16">
        <p
          className="display tabular text-turmeric"
          style={{ fontSize: "var(--text-figure)", lineHeight: 0.86 }}
        >
          213,965
        </p>
        <p className="pretty text-ash">
          flight prices, checked every few minutes since July. I have booked two of them. I look at
          the graph most mornings, which I understand is not normal.
        </p>
      </div>

      {/* Drawn straight from the database this paragraph is about. */}
      <figure className="mt-14">
        <Image
          src="/farewatch.svg"
          alt="Minimum observed fare over time across the six most watched routes out of New York"
          width={2400}
          height={900}
          className="h-auto w-full"
        />
        <figcaption className="trim mt-4 text-ash">
          Six routes out of New York. The gold line is whichever is cheapest — currently LaGuardia
          to Houston, which started being watched later than the rest.
        </figcaption>
      </figure>
    </section>
  );
}

function Trim({ children, tone }: { children: React.ReactNode; tone: "bone" | "ash" }) {
  return (
    <p className={`trim uppercase ${tone === "bone" ? "text-bone/60" : "text-ash"}`}>{children}</p>
  );
}
