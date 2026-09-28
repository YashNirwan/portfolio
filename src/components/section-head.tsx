/* A rule, a numeral, a title. The numerals earn their place here because the
   page genuinely is a sequence — the argument only works if you have read the
   statement, and the work only lands if you have read the argument. */
export function SectionHead({
  n,
  title,
  id,
}: {
  n: string;
  title: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className="mt-24 flex scroll-mt-16 flex-col gap-1 border-t border-ink pt-3 sm:flex-row sm:items-baseline sm:gap-4 md:mt-32"
    >
      <span
        className="shrink-0 font-util uppercase text-graphite sm:pt-[0.4rem]"
        style={{ fontSize: "var(--text-label)", letterSpacing: "var(--tracking-label)" }}
      >
        {n}
      </span>
      <h2
        className="balance font-display font-normal"
        style={{
          fontSize: "var(--text-title)",
          lineHeight: "var(--leading-title)",
          letterSpacing: "var(--tracking-title)",
        }}
      >
        {title}
      </h2>
    </div>
  );
}
