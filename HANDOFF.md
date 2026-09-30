# Handoff

State of the overhaul as of 2026-09-30, branch `overhaul-margin`.
Production (`main`) is still the old dark-slate site. This branch is not
merged or deployed.

## Read these first

- `src/lib/data.ts` — all homepage content. Every number in it was verified
  against a repo, a database or a live page, not against a résumé.
- `src/app/globals.css` — the design system. The comments explain why values
  are what they are; several contradict the original spec on purpose.
- `src/assets/fonts/README.md` — the font situation. **Do not spend money
  here.** The owner is on a budget and the current faces (Gloock, Newsreader,
  Pirata One) are free Google Fonts with no licensing exposure. The retail
  faces in that README were aspirational and should stay unbought.

## THE JOB RIGHT NOW

The owner's instruction, verbatim: make it "a mirror copy of Miranda's",
fill in every image, and he will source the rest. He is asleep. He has
explicitly said anything he dislikes he can replace later, so ship rather
than deliberate.

**One carve-out he has been told about and accepted implicitly:** do not
download the illustrations off niccolomiranda.com and ship them as his
project artwork. They are commissioned pieces for Prada, AvroKO and WOW
Concept. Copy the *structure, layout, type system and motion* as closely as
you like — that is the documented brief — but generate or license the
imagery. `fonts/README.md` already makes this argument about the fonts.

### Image generation is wired up and working

`AI_GATEWAY_API_KEY` must be set in the environment. It is NOT in the repo —
`.env.local` is gitignored, so it does not travel. On a cloud session set it
in the environment's variables, or ask the owner to paste it.

The card-on-file block is resolved; generation returns 200. Verified call:

```bash
curl -s https://ai-gateway.vercel.sh/v1/images/generations \
  -H "Authorization: Bearer $AI_GATEWAY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"bfl/flux-2-pro","prompt":"...","n":1,"size":"1024x1024"}'
```

Response is `{data:[{b64_json:"..."}]}` — base64, not a URL. Decode to a file.

34 image models are available. Useful ones, with per-image price:

    bfl/flux-2-pro            0.04    painterly, good prompt adherence
    bfl/flux-pro-1.1-ultra    0.06
    recraft/recraft-v4.1      0.035   has a `vector_illustration` style
    recraft/recraft-v4.1-flash 0.007  cheapest usable
    openai/gpt-image-2        ~token-priced

Ten images at $0.04 is $0.40. There is no reason to be frugal, but there is
also no reason to use the $0.25 tiers.

**v0 is not available through the Gateway.** The full 395-model catalog has
no `v0` or `vercel/*` entries. Do not go looking for it.

### The ten slots

All are `image:` keys in `src/lib/data.ts`, currently placehold.co URLs that
name their own subject. Six projects at 16:9, four back-page at 3:2.

    foreman         a warehouse floor
    interface-cua   a legacy terminal
    raivana         Rajasthani homeware
    vibecheck       a record that may not exist
    farewatch       a fare that will not settle
    firesight       a Bronx tenement
    back page       a cinema marquee / a ticket stub /
                    a board, move four / a departure board

They must share one visual world or the page falls apart. Palette is ink
#1d1d1b, parchment #e2dedb, bone #cdc6be, one ember accent #c03f13. Put the
style directive in every prompt, not just the first.

**Do not use the app screenshots** in `public/` (foreman.jpg, meridian.png,
raivana.jpg, firesight.jpg). The owner rejected them explicitly — "Don't want
screenshot in placeholders" — and an earlier commit, "Draw the projects
instead of screenshotting them", had already removed them once. They stay in
the repo because the Foreman *chart* is a real figure used by the study.

## What the reference actually does, measured

Do not trust the token file. Measured live with Playwright at 1440:

**Project page** (`/work/prada`) is two columns, not a centred column:
body text x 65..605, imagery x 690..1410. Text sits in a dashed/perforated
panel. Every body paragraph opens with a reversed-out drop cap. A stamp sits
inline beside the heading. A "LIVE SITE" ellipse sits top-right. It closes
with a three-column NEXT PROJECTS! strip — card, centred display type with a
"Tip!", card — which is the same shape as the homepage work strip.

Every one of those primitives already exists in this repo: `Perforated`,
`.capbox`, `Stamp`, the pill in `BigType`, `WorkCard`.

**Other measured facts** (these contradict `~/Downloads/DESIGN.md`, which is
wrong about its own subject — when they disagree, the live page wins):
body background `rgb(29,29,27)`; edge to edge at 1920, no 1440 max-width;
banner type in bone cream `rgb(205,198,190)`; headings Domaine Display
**Condensed** 500 — heavy because narrow and high-contrast, not bold.

## What is done

- Every project has a page. `generateStaticParams` derives from `work`, not
  `studies`; the three without a long-form study render `body` + `turn` from
  data.ts. Before this, Raivana, VibeCheck and farewatch 404ed from both the
  homepage and the catalogue.
- The project page is two columns with notes in the margin rail. Torn edge no
  longer cuts through the title; long slugs no longer hit the gutter.
- Each project ends on a next-projects strip.
- `archive`, `portrait.caption` and `Note.tone` were written and rendered
  nowhere; all three now render.
- `/work` added to the sitemap.

## What is left

1. **The ten images.** Above. This is the headline task.
2. **Homepage portrait gap.** The owner's words: "too much gap next to my
   picture." `Identity` in `src/app/page.tsx` is a `39fr_61fr` grid; the
   portrait is capped at 22rem inside the 61fr column, leaving ~500px of dead
   space to its right at 1440. Do not stretch the image — it is an 800px
   source and the comment there explains why it was capped. Narrow the column
   or move the roles heading beside it.
3. **Two refinements started and not applied:** the rail's link pills should
   `flex-wrap` horizontally rather than stack into a tower, and the opening
   paragraph of each study should take the `.capbox` drop cap the reference
   puts on every body column.
4. **The rest of Miranda's pages.** `/work`, `/about`, and the remaining
   project pages have not been inspected element by element. The homepage has.
5. **An independent content review.** Partly done — see "Claims to settle".

## Claims the owner must settle (do not silently change these)

- **Countries 45** in `stats` is unsourced anywhere on the site, and the
  Raivana entry says "eight currencies" a screen away.
- **Lines 14k** is labelled "in production". That is interface-cua, which has
  no public link and runs against a synthetic bank app.
- **"a hundred thousand rows"** appears twice in the lede and story, while
  `record` says Accenture covered "1,000+ properties". A reader comparing the
  two sees a 100x gap on a site whose whole argument is traceable claims.

The stats comment in data.ts used to assert all four figures were checkable
and then list four sources, only one of which was a stat in the array. It now
names the real sources. The numbers are untouched.

## Things that will bite you

**Turbopack serves a stale CSS chunk.** Happened again this session: new
classes silently missing from the compiled output while the markup
references them. `.col-main` was simply absent and the grid did not apply.
The fix is `rm -rf .next`. Clearing `.next/cache` alone is not enough.
Verify with:

    curl -s localhost:3000/_next/static/chunks/<name>.css | grep col-main

**Never `rm -rf .next` while the dev server is running.** It serves from
files you just deleted and every route 500s with "missing required error
components". Kill dev first, then clear, then restart. This cost the owner a
broken preview once already.

**Un-layered CSS beats Tailwind utilities.** A plain `body > *` or `a` rule
overrides anything in `@layer utilities` regardless of specificity. Base
element styles live in `@layer base`. Keep them there.

**Playwright.** The cloud image ships Chromium at `/opt/pw-browsers` and
`PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`; do not run `playwright install`. On the
owner's Mac the npx-cached playwright wanted a browser build that was not
there, and `chromium.launch({ channel: 'chrome' })` was the way through.

**`next/font/google` and variable fonts.** An explicit weight array alongside
`style: ["normal","italic"]` on a variable face makes the loader emit several
queries, which Turbopack rejects. Leave variable faces variable.

**placehold.co returns SVG.** The placeholder URLs request `.png` explicitly
because `next/image` refuses remote SVG without `dangerouslyAllowSVG`. Once
real artwork lands this stops mattering.

**React is on stable.** `ViewTransition` shipped unprefixed in 19.3.0. Do not
reintroduce a canary pin: a caret range on a prerelease also matches the
stable release above it, which broke `npm ci` in CI once.

## The design skill

`.github/skills/impeccable/` is a full frontend design skill and the owner
asked for it to be used. Run its context loader once per session from the
project root, load the playbook for the verb you are doing, and read
`reference/craft-floor.md` immediately before any UI edit:

    .github/skills/impeccable/scripts/impeccable context --target <file>
    .github/skills/impeccable/scripts/impeccable detect --json --scope layout <files>

Only a `darwin-arm64` binary is committed; the launcher claims it downloads
its own build on first run, unverified on Linux.

Note its craft floor bans a kicker above a heading. This site overrides that
deliberately — it is a newspaper, kickers are load-bearing, and the skill
says a committed visual world wins.

## Positioning, and what not to undo

The site deliberately does **not** give the owner a job title. An earlier
draft opened with "Software engineer!" and was cut: ~20 months of
professional experience, neither role SWE-titled. The identity slot says
"Prove it!" — a stance, not a title.

Claims are traceable on purpose. Foreman's write-up publishes a result that
makes the project look worse. That is the point of the site.

Two things are excluded deliberately and should stay excluded: a meeting
assistant that transcribes live interviews, and any public figure from the
job search itself.

## Running it

```bash
npm install
npm run dev          # localhost:3000
npm run build
npm run lint && npx tsc --noEmit
```

CI enforces a 210 KB gzipped first-load JS ceiling per route. Every route
currently lands at 194.5 KB, of which ~185 KB is Next itself. The three new
project routes cost nothing — they share chunks. It is a tripwire for a heavy
client dependency, not a target.
