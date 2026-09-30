/* A perforated panel — the stamp's edge, scaled up to hold a story.

   The bite marks are a repeating radial-gradient on each edge rather than a
   border image, so the panel takes any width or height and the perforation
   stays the same size. The bites have to be painted in the colour of whatever
   the panel is sitting ON, because they are holes: they eat the panel away to
   show the sheet through.

   Hence `tone`. The homepage is parchment and the panel is bone; a project
   page is bone and the panel is parchment. The first version hardcoded the
   parchment-on-bone pair and was documented as only working over parchment,
   which made it unusable on the one page the reference actually puts a
   perforated panel on. */
export function Perforated({
  children,
  className = "",
  tone = "on-parchment",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "on-parchment" | "on-bone";
}) {
  const bite = "10px";
  const ground = tone === "on-bone" ? "var(--color-bone)" : "var(--color-parchment)";
  const panel = tone === "on-bone" ? "bg-parchment" : "bg-bone";
  const edge = `radial-gradient(circle ${bite} at center, ${ground} ${bite}, transparent ${bite})`;

  return (
    <div className={`relative ${className}`}>
      <div
        className={`${panel} px-6 py-9 md:px-12 md:py-12`}
        style={{ borderRadius: "var(--radius-xl)" }}
      >
        {children}
      </div>

      {/* Four runs of bites, one per edge. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-[10px] h-[20px]"
        style={{ backgroundImage: edge, backgroundSize: "22px 20px", backgroundRepeat: "repeat-x" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-[10px] h-[20px]"
        style={{ backgroundImage: edge, backgroundSize: "22px 20px", backgroundRepeat: "repeat-x" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-[10px] w-[20px]"
        style={{ backgroundImage: edge, backgroundSize: "20px 22px", backgroundRepeat: "repeat-y" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -right-[10px] w-[20px]"
        style={{ backgroundImage: edge, backgroundSize: "20px 22px", backgroundRepeat: "repeat-y" }}
      />
    </div>
  );
}
