/* A postage stamp with a perforated edge, an ember sunburst, a signature
   line and two metadata rows. It is a signature mark, not a control — the
   reference uses it beside the display banners and on the catalogue page. */
export function Stamp({ className = "" }: { className?: string }) {
  const rays = Array.from({ length: 17 }, (_, i) => {
    const a = (Math.PI * i) / 16;
    const r1 = 16;
    const r2 = 44;
    return {
      x1: 70 + Math.cos(Math.PI - a) * r1,
      y1: 64 - Math.sin(a) * r1,
      x2: 70 + Math.cos(Math.PI - a) * r2,
      y2: 64 - Math.sin(a) * r2,
    };
  });

  return (
    <svg
      viewBox="0 0 140 150"
      className={`block ${className}`}
      role="img"
      aria-label="A postage stamp bearing the name Yash Nirwan"
    >
      {/* Perforation: a run of parchment-coloured bites around a filled
          rectangle, which is cheaper and sharper than a dashed border. */}
      <rect x="4" y="4" width="132" height="142" fill="#e2dedb" rx="3" />
      {Array.from({ length: 13 }).map((_, i) => (
        <g key={i}>
          <circle cx={4 + i * 11} cy="4" r="3.2" fill="var(--color-parchment)" />
          <circle cx={4 + i * 11} cy="146" r="3.2" fill="var(--color-parchment)" />
        </g>
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <g key={i}>
          <circle cx="4" cy={4 + i * 11} r="3.2" fill="var(--color-parchment)" />
          <circle cx="136" cy={4 + i * 11} r="3.2" fill="var(--color-parchment)" />
        </g>
      ))}

      {/* Sunburst */}
      <g stroke="#c03f13" strokeWidth="2.2" strokeLinecap="round">
        {rays.map((r, i) => (
          <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} />
        ))}
      </g>
      <line x1="26" y1="66" x2="114" y2="66" stroke="#c03f13" strokeWidth="2.4" />

      {/* Signature */}
      <path
        d="M40 88 c4 -14 8 -12 9 2 c1 12 4 12 7 0 c3 -11 6 -10 8 4 c2 10 6 8 9 -2 c3 -9 8 -6 10 4 c10 -2 16 -1 22 2"
        fill="none"
        stroke="#1d1d1b"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Metadata rows */}
      <g fontFamily="ui-monospace, Menlo, monospace" fontSize="6.4" fill="#1d1d1b">
        <text x="26" y="116">NAME</text>
        <text x="52" y="116">Yash Nirwan</text>
        <line x1="50" y1="118.5" x2="114" y2="118.5" stroke="#1d1d1b" strokeWidth="0.7" />
        <text x="26" y="130">SINCE</text>
        <text x="52" y="130">New York, 2024</text>
        <line x1="50" y1="132.5" x2="114" y2="132.5" stroke="#1d1d1b" strokeWidth="0.7" />
      </g>
    </svg>
  );
}
