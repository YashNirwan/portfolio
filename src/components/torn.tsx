/* The torn-paper edge.

   The reference separates a project's hero image from the sheet below it
   with a ragged tear rather than a straight line, and the title straddles
   it. This draws the tear as one SVG path with a fibrous lip, so it scales
   to any width and needs no image.

   The path is generated from a fixed seed, not Math.random(), because a
   value that changes between server and client is a hydration mismatch. */
function tornPath(seed: number, w = 1200, h = 60) {
  let s = seed;
  const rnd = () => {
    // Mulberry32: small, deterministic, good enough for a paper edge.
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const steps = 26;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = (w / steps) * i;
    const y = h * 0.45 + (rnd() - 0.5) * h * 0.7;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M0,${h} L0,${pts[0].split(",")[1]} L${pts.join(" L")} L${w},${h} Z`;
}

export function Torn({
  seed = 7,
  className = "",
  fill = "var(--color-bone)",
}: {
  seed?: number;
  className?: string;
  fill?: string;
}) {
  const d = tornPath(seed);
  return (
    <svg
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      className={`block w-full ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {/* The lip: a lighter offset copy, so the tear reads as paper with
          thickness rather than as a cut-out shape. */}
      <path d={d} fill="#efeae4" transform="translate(0,-5)" />
      <path d={d} fill={fill} />
    </svg>
  );
}
