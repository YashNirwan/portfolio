import type { ReactNode } from "react";
import type { Note as NoteData } from "@/lib/data";

/* ===========================================================================
   The two-track measure.

   Desktop: a reading column and a working margin, side by side, top-aligned.
   Below 900px the margin does not shrink — it changes state, becoming an
   interlinear block directly after the paragraph it annotates. The mobile
   reading is arguably the better one, because the note lands where it is
   relevant rather than beside it.
   =========================================================================== */

export function Spread({
  children,
  note,
  className = "",
}: {
  children: ReactNode;
  note?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-1 items-start gap-4 md:grid-cols-[minmax(0,1fr)_17rem] md:gap-12 ${className}`}
    >
      <div className="min-w-0 max-w-[41rem]">{children}</div>
      {note ? <div className="md:pt-1">{note}</div> : <div aria-hidden="true" />}
    </div>
  );
}

/* A margin note. `cost` tone is reserved for things that got worse — a lost
   metric, a retraction, a disclosure. It is the only red on the page. */
export function Note({ label, body, tone = "default" }: NoteData) {
  const accent = tone === "cost" ? "border-strike" : "border-pencil";
  return (
    <aside
      className={`note-sets ml-3 border-l-2 pl-3 font-util md:ml-0 ${accent}`}
      style={{ fontSize: "var(--text-note)", lineHeight: "var(--leading-note)" }}
    >
      {label ? <b className="mb-1 block font-semibold text-ink">{label}</b> : null}
      <p className={tone === "cost" ? "text-strike" : "text-graphite"}>{body}</p>
    </aside>
  );
}

/* ===========================================================================
   Claim / Evidence / Cost.

   Every piece of work is presented in this grammar, and the Cost line is
   mandatory. A format that forces you to state what your win cost is a
   different kind of argument than a format that lets you list wins.
   =========================================================================== */

export function Claim({
  claim,
  evidence,
  cost,
  also,
}: {
  claim: string;
  evidence: string;
  cost?: string;
  also?: string;
}) {
  return (
    <div className="mt-5">
      <p
        className="balance font-display text-ink"
        style={{
          fontSize: "var(--text-sub)",
          lineHeight: "var(--leading-sub)",
          letterSpacing: "var(--tracking-sub)",
        }}
      >
        {claim}
      </p>
      <dl className="mt-4 space-y-2">
        <Line term="Evidence" tone="default">
          {evidence}
        </Line>
        {cost ? (
          <Line term="Cost" tone="cost">
            {cost}
          </Line>
        ) : null}
        {also ? (
          <Line term="Also" tone="cost">
            {also}
          </Line>
        ) : null}
      </dl>
    </div>
  );
}

function Line({
  term,
  tone,
  children,
}: {
  term: string;
  tone: "default" | "cost";
  children: ReactNode;
}) {
  const color = tone === "cost" ? "text-strike" : "text-ink";
  return (
    <div className="flex flex-col gap-x-3 sm:flex-row">
      <dt
        className={`shrink-0 pt-[0.28rem] font-util font-semibold uppercase sm:w-20 ${color}`}
        style={{ fontSize: "var(--text-label)", letterSpacing: "var(--tracking-label)" }}
      >
        {term}
      </dt>
      <dd className={`pretty ${color}`}>{children}</dd>
    </div>
  );
}
