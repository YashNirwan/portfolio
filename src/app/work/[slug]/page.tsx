import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { studies, getStudy, type Block } from "@/lib/studies";
import { work, links } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return studies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getStudy(slug);
  if (!study) return {};

  const title = `${study.title} — Yash Nirwan`;

  return {
    title,
    description: study.standfirst,
    alternates: { canonical: `/work/${study.slug}` },
    /* `images` has to be repeated here. Next merges metadata objects between
       segments shallowly, so defining `openGraph` at all replaces the root's
       object wholesale — including the images contributed by the root
       opengraph-image route. Without this line these pages ship a
       summary_large_image card with no image, which renders blank. */
    openGraph: {
      title,
      description: study.standfirst,
      type: "article",
      url: `/work/${study.slug}`,
      images: ["/opengraph-image"],
    },
    /* Same reason, opposite direction: the root's `twitter` block is inherited
       verbatim unless overridden, so these pages were advertising the
       homepage's title and description to every client that prefers
       twitter:* tags. */
    twitter: {
      card: "summary_large_image",
      title,
      description: study.standfirst,
      images: ["/opengraph-image"],
    },
  };
}

export default async function StudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getStudy(slug);
  if (!study) notFound();

  const item = work.find((w) => w.slug === slug);

  return (
    <main id="main" tabIndex={-1}>
      {/* Opens on indigo like the homepage, then runs on iron for the read.
          A study is one long column, not a sequence of plates — the colour
          system says "same site", the single measure says "this is an
          article". */}
      <section className="plate bg-indigo">
        <div className="hold">
          <Link href="/" className="trim uppercase text-bone/70 no-underline">
            ← Yash Nirwan
          </Link>

          <h1
            className="display mt-8 text-bone"
            style={{ fontSize: "var(--text-field)", lineHeight: "var(--leading-field)" }}
          >
            {study.title}
          </h1>

          <p
            className="pretty mt-6 max-w-[36rem] text-bone/85"
            style={{ fontSize: "var(--text-lede)", lineHeight: 1.42 }}
          >
            {study.standfirst}
          </p>

          <p className="trim mt-8 uppercase text-bone/55">{study.meta}</p>
        </div>
      </section>

      <section className="plate bg-iron">
        <div className="hold">
          <div className="flex flex-col gap-5">
            {study.blocks.map((block, i) => (
              <BlockView key={i} block={block} />
            ))}
          </div>

          {item && item.links.length > 0 ? (
            <div className="mt-16 border-t border-bone/15 pt-6">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {item.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="trim text-bone"
                  >
                    {l.label}
                  </a>
                ))}
                <a href={`mailto:${links.email}`} className="trim text-ash">
                  Ask me about it
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

const MEASURE = "max-w-[36rem]";

function BlockView({ block }: { block: Block }) {
  if (block.kind === "h") {
    return (
      <h2
        className={`display mt-12 text-bone ${MEASURE}`}
        style={{ fontSize: "var(--text-row)", lineHeight: 1 }}
      >
        {block.text}
      </h2>
    );
  }

  if (block.kind === "pull") {
    return (
      <p
        className={`pretty my-6 border-l-2 border-turmeric pl-6 text-bone ${MEASURE}`}
        style={{ fontSize: "var(--text-lede)", lineHeight: 1.36 }}
      >
        {block.text}
      </p>
    );
  }

  if (block.kind === "figure") {
    /* Charts out of a notebook are light. On iron they need a mount or they
       read as a hole punched through the page. */
    return (
      <figure className="my-8">
        <div className="bg-bone p-4 md:p-8">
          <Image
            src={block.src}
            alt={block.alt}
            width={block.w}
            height={block.h}
            sizes="(max-width: 768px) 100vw, 72rem"
            className="block h-auto w-full"
          />
        </div>
        <figcaption className={`trim mt-3 text-ash ${MEASURE}`}>{block.caption}</figcaption>
      </figure>
    );
  }

  /* A note is set inside the measure rather than beside it. The old design put
     the asides in a margin, which meant the most specific writing on the page
     sat outside the column people actually read. */
  return (
    <div className={MEASURE}>
      <p className={`pretty text-bone/85 ${block.lede ? "text-[1.2rem] leading-[1.5]" : ""}`}>
        {block.text}
      </p>
      {block.note ? (
        <div className="mt-4 border-l-2 border-bone/25 pl-5">
          {block.note.label ? (
            <p className="trim uppercase text-ash">{block.note.label}</p>
          ) : null}
          <p className="pretty mt-1 text-ash">{block.note.body}</p>
        </div>
      ) : null}
    </div>
  );
}
