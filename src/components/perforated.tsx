/* A perforated panel — the stamp's edge, scaled up to hold a story.

   The bite marks are a repeating radial-gradient on each edge rather than a
   border image, so the panel takes any width or height and the perforation
   stays the same size. Parchment-coloured bites eat into the panel, which
   means this only works over a parchment ground — which is where it sits. */
export function Perforated({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const bite = "10px";
  const edge = `radial-gradient(circle ${bite} at center, var(--color-parchment) ${bite}, transparent ${bite})`;

  return (
    <div className={`relative ${className}`}>
      <div
        className="bg-bone px-6 py-9 md:px-12 md:py-12"
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
