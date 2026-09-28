import Image from "next/image";
import Link from "next/link";
import { profile, links, statement, argument, work, record, archive } from "@/lib/data";
import { Spread, Note, Claim } from "@/components/spread";
import { SectionHead } from "@/components/section-head";
import { ForeEdge } from "@/components/fore-edge";

const SECTIONS = [
  { id: "argument", label: "Argument" },
  { id: "work", label: "Work" },
  { id: "record", label: "Record" },
  { id: "archive", label: "Archive" },
  { id: "contact", label: "Contact" },
];

export default function Home() {
  const spreads = work.filter((w) => w.weight !== "note");
  const asides = work.filter((w) => w.weight === "note");

  return (
    <>
      <ForeEdge sections={SECTIONS} />

      <div className="mx-auto max-w-[72rem] px-5 pb-32 sm:px-8">
        <Masthead />

        <main id="main">
          <Statement />

          <SectionHead n="One" title={argument.heading} id="argument" />
          <Argument />

          <SectionHead n="Two" title="Five things, one instinct" id="work" />
          <div className="mt-8 flex flex-col gap-y-16 md:gap-y-24">
            {spreads.map((w) => (
              <WorkSpread key={w.slug} item={w} />
            ))}
            {asides.map((w) => (
              <WorkAside key={w.slug} item={w} />
            ))}
          </div>

          <SectionHead n="Three" title="The record" id="record" />
          <Record />

          <SectionHead n="Four" title="Everything else" id="archive" />
          <Archive />

          <SectionHead n="Five" title="Currently" id="contact" />
          <Contact />
        </main>

        <Colophon />
      </div>
    </>
  );
}

/* --------------------------------------------------------------------------- */

function Masthead() {
  return (
    <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-ink py-4">
      <span
        className="font-util uppercase tracking-wide text-ink"
        style={{ fontSize: "var(--text-label)", letterSpacing: "var(--tracking-label)" }}
      >
        {profile.name}
      </span>
      <span
        className="font-util uppercase text-graphite"
        style={{ fontSize: "var(--text-label)", letterSpacing: "var(--tracking-label)" }}
      >
        {profile.location}
      </span>
    </header>
  );
}

function Statement() {
  return (
    <section className="pb-16 pt-[14vh] md:pb-24 md:pt-[22vh]">
      <Spread
        note={
          <div
            className="font-util text-graphite"
            style={{ fontSize: "var(--text-note)", lineHeight: "var(--leading-note)" }}
          >
            <p>{statement.provenance}</p>
            <p className="mt-3">
              <a href={links.resume}>Résumé</a> — PDF, one page, current as of September 2026
            </p>
          </div>
        }
      >
        <h1
          className="balance font-display font-normal"
          style={{
            fontSize: "var(--text-display)",
            lineHeight: "var(--leading-display)",
            letterSpacing: "var(--tracking-display)",
          }}
        >
          {statement.line}
        </h1>
        <p className="pretty mt-7 text-graphite" style={{ maxWidth: "34rem" }}>
          {statement.stand}
        </p>
      </Spread>
    </section>
  );
}

function Argument() {
  return (
    <div className="mt-8 flex flex-col gap-y-5">
      {argument.paragraphs.map((p, i) => (
        <Spread key={i} note={i === 1 ? <Note {...argument.note} /> : undefined}>
          <p className={`pretty hang ${i === 0 ? "lede" : ""}`}>{p}</p>
        </Spread>
      ))}
    </div>
  );
}

function WorkSpread({ item }: { item: (typeof work)[number] }) {
  const lead = item.weight === "lead";

  return (
    <article className="scroll-mt-16" id={item.slug}>
      <Spread note={item.note ? <Note {...item.note} /> : undefined}>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3
            className="font-display font-normal"
            style={{
              fontSize: lead ? "var(--text-title)" : "1.72rem",
              lineHeight: "var(--leading-title)",
              letterSpacing: "var(--tracking-title)",
            }}
          >
            {item.title}
          </h3>
          <span
            className="font-util uppercase text-graphite"
            style={{ fontSize: "var(--text-label)", letterSpacing: "var(--tracking-label)" }}
          >
            {item.role} · {item.year}
          </span>
        </div>

        <Claim claim={item.claim} evidence={item.evidence} cost={item.cost} also={item.also} />

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          {item.hasStudy ? (
            <Link href={`/work/${item.slug}`} className="font-util text-ink">
              Read the full study
            </Link>
          ) : null}
          {item.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-util text-graphite"
              style={{ fontSize: "0.95rem" }}
              target="_blank"
              rel="noreferrer"
            >
              {l.label}
            </a>
          ))}
        </div>

        <p
          className="mt-4 font-util text-graphite"
          style={{ fontSize: "var(--text-note)", lineHeight: "var(--leading-note)" }}
        >
          {item.stack.join(" · ")}
        </p>
      </Spread>

      {item.image && lead ? (
        <figure className="mt-8">
          <Image
            src={item.image.src}
            alt={item.image.alt}
            width={item.image.w}
            height={item.image.h}
            sizes="(max-width: 768px) 100vw, 72rem"
            className="h-auto w-full"
            priority={false}
          />
        </figure>
      ) : null}
    </article>
  );
}

function WorkAside({ item }: { item: (typeof work)[number] }) {
  return (
    <article className="scroll-mt-16" id={item.slug}>
      <Spread note={item.note ? <Note {...item.note} /> : undefined}>
        <div className="flex flex-wrap items-baseline gap-x-3">
          <h3
            className="font-display font-normal"
            style={{ fontSize: "1.4rem", letterSpacing: "var(--tracking-sub)" }}
          >
            {item.title}
          </h3>
          <span
            className="font-util uppercase text-graphite"
            style={{ fontSize: "var(--text-label)", letterSpacing: "var(--tracking-label)" }}
          >
            {item.role} · {item.year}
          </span>
        </div>
        <p className="pretty mt-3 font-display" style={{ fontSize: "1.18rem" }}>
          {item.claim}
        </p>
        <p className="pretty mt-2 text-graphite">{item.evidence}</p>
      </Spread>
    </article>
  );
}

function Record() {
  return (
    <div className="mt-8">
      <Spread note={<Note {...record.note} />}>
        <div className="flex flex-col gap-y-8">
          {record.roles.map((r) => (
            <div key={r.org}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-rule pb-1">
                <h3 className="font-display" style={{ fontSize: "1.24rem" }}>
                  {r.org}
                </h3>
                <span
                  className="tabular font-util uppercase text-graphite"
                  style={{ fontSize: "var(--text-label)", letterSpacing: "var(--tracking-label)" }}
                >
                  {r.period}
                </span>
              </div>
              <p className="mt-2 font-util text-graphite" style={{ fontSize: "0.95rem" }}>
                {r.title}
              </p>
              <ul className="mt-2 flex flex-col gap-y-1.5">
                {r.lines.map((l, i) => (
                  <li key={i} className="pretty">
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Spread>

      <div className="mt-10 max-w-[41rem]">
        <h3
          className="font-util uppercase text-graphite"
          style={{ fontSize: "var(--text-label)", letterSpacing: "var(--tracking-label)" }}
        >
          Education
        </h3>
        <dl className="mt-3 flex flex-col gap-y-2">
          {record.education.map((e) => (
            <div key={e.school} className="flex flex-wrap items-baseline justify-between gap-x-4">
              <dt>
                {e.school} — <span className="text-graphite">{e.detail}</span>
              </dt>
              <dd
                className="tabular font-util text-graphite"
                style={{ fontSize: "var(--text-label)" }}
              >
                {e.period}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function Archive() {
  return (
    <div className="mt-8 max-w-[41rem]">
      <ul className="flex flex-col">
        {archive.map((a) => (
          <li key={a.title} className="border-b border-rule py-3">
            <div className="flex flex-wrap items-baseline gap-x-3">
              {a.href ? (
                <a href={a.href} target="_blank" rel="noreferrer" className="font-display"
                   style={{ fontSize: "1.1rem" }}>
                  {a.title}
                </a>
              ) : (
                <span className="font-display" style={{ fontSize: "1.1rem" }}>
                  {a.title}
                </span>
              )}
              <span
                className="tabular font-util uppercase text-graphite"
                style={{ fontSize: "var(--text-label)", letterSpacing: "var(--tracking-label)" }}
              >
                {a.kind === "coursework" ? `Coursework · ${a.year}` : a.year}
              </span>
            </div>
            <p className="pretty mt-1 text-graphite" style={{ fontSize: "1rem" }}>
              {a.line}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Contact() {
  return (
    <div className="mt-8">
      <Spread
        note={
          <Note
            label={`As of ${statement.currentlyDate}`}
            body="This line gets updated or it comes down. A stale 'currently' is worse than none."
          />
        }
      >
        <p className="pretty">{statement.currently}</p>
        <p className="mt-8">
          <a href={`mailto:${links.email}`} className="font-display" style={{ fontSize: "1.5rem" }}>
            {links.email}
          </a>
        </p>
        <p className="mt-2 text-graphite">I reply to specific emails fastest.</p>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
          <a href={links.github} target="_blank" rel="noreferrer" className="font-util">
            GitHub
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer" className="font-util">
            LinkedIn
          </a>
          <a href={links.resume} className="font-util">
            Résumé
          </a>
        </div>
      </Spread>
    </div>
  );
}

function Colophon() {
  return (
    <footer className="mt-28 border-t border-ink pt-4">
      <Spread
        note={
          <p
            className="font-util text-graphite"
            style={{ fontSize: "var(--text-note)", lineHeight: "var(--leading-note)" }}
          >
            If you got here, you read it. Mention the forklift and I&rsquo;ll know.
          </p>
        }
      >
        <p
          className="font-util text-graphite"
          style={{ fontSize: "var(--text-note)", lineHeight: "var(--leading-note)" }}
        >
          Set in Newsreader and Source Serif. Built in New York.
        </p>
      </Spread>
    </footer>
  );
}
