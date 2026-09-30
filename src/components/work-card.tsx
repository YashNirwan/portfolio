import Image from "next/image";
import Link from "next/link";
import type { Work } from "@/lib/data";

/* Lived in app/page.tsx, with the catalogue keeping its own copy of the badge
   markup. Both the homepage strip and the project page's next-projects strip
   need the card now, so it is one component with one badge. */

export function NewBadge() {
  return (
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
  );
}

export function WorkCard({ item, wide = true }: { item: Work; wide?: boolean }) {
  return (
    <article className="par-slow relative flex flex-col">
      <figure className="mb-3" style={{ boxShadow: "var(--shadow-sm)" }}>
        {item.image ? (
          <Image
            src={item.image.src}
            alt={item.image.alt}
            width={item.image.w}
            height={item.image.h}
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`block h-auto w-full object-cover ${wide ? "aspect-[16/9]" : "aspect-[5/4]"}`}
            style={{ objectPosition: item.image.position ?? "center" }}
          />
        ) : (
          <div
            className={`flex items-center justify-center bg-bone ${wide ? "aspect-[16/9]" : "aspect-[5/4]"}`}
          >
            <span className="byline">Artwork to come</span>
          </div>
        )}
      </figure>

      <div className="flex flex-wrap items-center gap-x-2">
        <h3 className="heavy tighten text-[19px]">
          <Link
            href={`/work/${item.slug}`}
            className="no-underline after:absolute after:inset-0 after:content-['']"
          >
            {item.title}
          </Link>
        </h3>
        {item.isNew ? <NewBadge /> : null}
      </div>
      <p className="pretty mt-1.5 leading-[1.27]">{item.standfirst}</p>
      <p className="byline mt-2">{item.kicker}</p>
    </article>
  );
}
