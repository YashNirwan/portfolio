# yashnirwan.com

A personal site set like a technical book with the marginalia left in: the main
column makes the claim, the margin volunteers the doubt.

## Running it

```bash
npm install
npm run dev     # localhost:3000
npm run build
npm run lint
npx tsc --noEmit
```

## Where things live

| Path | What |
| --- | --- |
| `src/lib/data.ts` | Everything on the homepage — statement, argument, work, record, archive |
| `src/lib/studies.ts` | Long-form case studies as typed blocks |
| `src/components/spread.tsx` | The two-track measure, margin notes, and the Claim/Evidence/Cost grammar |
| `src/components/fore-edge.tsx` | The left rail index. The only client component in the app |
| `src/app/globals.css` | Design tokens. Read the comments before changing colours |

## House rules

These exist because the site argues a specific thing, and breaking them makes
it argue something else.

**Every piece of work states its cost.** The `cost` field is not decorative.
A win presented without what it cost is the kind of claim this site is
supposed to be against. If a project has no honest cost line, that is a signal
the project does not belong on the homepage.

**Numbers must be traceable.** Every figure in `data.ts` and `studies.ts` came
from a repo, a database or a file on disk — not from a résumé. If a number
moves over time (farewatch is still running), it carries the date it was read.
Do not round a number up because it reads better.

**Two accents, both load-bearing.** Indigo (`--color-pencil`) marks an
annotation. Red (`--color-strike`) marks something that got worse — a cost, a
retraction, a disclosure. Nothing else on the site is allowed to be coloured.
Adding a third accent breaks the encoding.

**Nothing animates on load.** The page is typeset; it arrives finished. The
only motion in the site is a margin note setting as it enters view, and it is
gated behind both `prefers-reduced-motion: no-preference` and
`@supports (animation-timeline: view())`.

**The margin must be readable alone.** Someone skimming only the margin column
should get the whole story in about forty seconds. If a note needs the main
column to make sense, it is a footnote, not a margin note.

## Adding a project

Add an entry to `work` in `src/lib/data.ts`. Set `weight` to control how much
room it gets (`lead` > `major` > `minor` > `note`). If it deserves a long-form
study, set `hasStudy: true` and add a matching entry to `studies` in
`src/lib/studies.ts` — the route and sitemap pick it up automatically.

Content is typed TS rather than MDX on purpose: same expressiveness where it
matters, no loader configuration against Turbopack, and zero client-side
JavaScript for the prose.

## Stack

Next 16 App Router, React 19, Tailwind v4 (CSS-first, tokens in `@theme`),
TypeScript strict. Fully static — every route is prerendered at build. The only
dependencies are `next`, `react` and `react-dom`; keep it that way unless
something genuinely earns its bytes.

Deployed on Vercel from `main`.
