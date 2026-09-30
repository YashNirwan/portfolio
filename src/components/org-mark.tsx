/* Employer marks for the record.

   Accenture's mark is its chevron — the ">" — traced vertex for vertex from
   the owner-supplied PNG (freelogovectors.net, 640x480, bbox 111..528 x
   20..459) and normalised to its own bounding box. Seven points; an inline
   path renders crisp at any size and takes `currentColor`, where the PNG would
   have been a 640x480 raster of one polygon.

   Set in ink, not Accenture purple (#A100FF). A broadsheet prints marks in a
   single ink, this palette admits one accent and it is ember, and Accenture's
   own identity provides a one-colour version for exactly this use. */
export function OrgMark({ org, className = "" }: { org: string; className?: string }) {
  if (org !== "Accenture") return null;
  return (
    <svg
      viewBox="0 0 417 439"
      className={`inline-block shrink-0 ${className}`}
      role="img"
      aria-label="Accenture logo"
    >
      <path d="M0 0 L417 167 L417 271 L0 439 L0 309 L243 220 L0 126 Z" fill="currentColor" />
    </svg>
  );
}
