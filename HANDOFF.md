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

### READ THIS BEFORE PLANNING ANYTHING: the network is an allowlist

The cloud environment this branch was last worked in permits **source-control
hosts only**. Everything else is refused by the egress proxy with a 403 on
CONNECT, which surfaces as `curl: (56) CONNECT tunnel failed`. Confirmed
denied on 2026-09-30:

    ai-gateway.vercel.sh     the image generation path below
    niccolomiranda.com       the reference site itself
    placehold.co             the old placeholder artwork
    example.com              i.e. it is an allowlist, not a blocklist

`/root/.ccr/README.md` is explicit that a policy denial gets reported rather
than routed around, and `curl -sS "$HTTPS_PROXY/__agentproxy/status"` lists
the recent refusals with reasons. **Do not burn a session trying to work
around this.** The fix is the owner's, not the agent's: cloud environment menu
in the session title bar, Edit, Network access — either a broader access level
or those hosts added to the allowed domains. Levels are documented at
https://code.claude.com/docs/en/claude-code-on-the-web

Two consequences, both of which shaped what is in the repo now:

- **The ten images were authored, not generated.** See below.
- **The reference cannot be inspected.** Every measured fact in this file
  came from an earlier session that could reach the site. Nothing in it has
  been re-verified since, and nothing new can be measured until the host is
  reachable. Treat the measurements as the best available evidence, and do
  not add to them by guessing.

### Image generation, if the Gateway is ever reachable

`AI_GATEWAY_API_KEY` must be set in the environment. It is NOT in the repo —
`.env.local` is gitignored, so it does not travel. On a cloud session set it
in the environment's variables, or ask the owner to paste it. A key pasted
into the session on 2026-09-30 is in `.env.local`; it was never usable,
because the host is blocked, not the credential.

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

### The ten slots are FILLED — with authored plates

All ten are drawn by `scripts/make-art.py` into `public/art/*.svg`, and wired
into the `image:` keys in `src/lib/data.ts`. Regenerate with:

    python3 scripts/make-art.py

**This is a replaceable decision, not a permanent one.** Generation was the
documented plan and it was blocked, so the plates are authored instead: no
network, no cost, on palette by construction, and editable by changing a
number rather than by re-rolling a prompt. If the Gateway opens up, swapping
any slot is a one-line change in data.ts.

They read as one set because they share a conceit rather than a texture:
**each plate is an array of like things with exactly one ember exception.**
One flagged pallet, one bad field, one window, one fare that broke its own
baseline, one record that does not exist. That is the argument the site
already makes in prose — the work is finding the row worth reading — so the
artwork makes it too. Keep that rule if you redraw them.

    foreman         a warehouse aisle, racking, one flagged pallet
    interface-cua   a terminal form, one flagged field
    raivana         five thrown vessels, one in ember
    vibecheck       fifteen records, one an empty dashed outline
    farewatch       six fare traces, one breaking its baseline band
    firesight       a tenement facade, one window flagged
    back page       marquee / ticket / chessboard / departures

Projects are parchment line on ink at 16:9 — the page's own signature, since
the masthead knocks its letters out of an ink block rather than painting them
on top. Back-page plates invert to ink on bone at 3:2, because they run
four-up and small on parchment where a row of black blocks would shout.

Two things worth knowing before editing the script:

- The project hero crops its plate with `object-cover` to a much taller box,
  which takes roughly 11% off each side at 1440. Keep the ember element well
  inside that. The foreman pallet was in the outer rack cell and got sliced
  off the edge.
- `next/image` needs no `dangerouslyAllowSVG` here. Next 16 applies
  `unoptimized` automatically when `src` ends in `.svg`, which is what a
  vector plate wants anyway. `remotePatterns` is now empty and the site
  fetches no image from a third party at all.

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

### Done on 2026-09-30

- **All ten image slots are filled.** See above. No third-party image host.
- **The homepage portrait gap is closed.** The roles heading moves beside the
  portrait from 1280 up. The photo is an 800px source and the 22rem cap is
  what keeps it sharp, so the ~430px of bare paper took the type that was
  already sitting under it rather than a stretched image.
- **The rail's link pills sit in a row.** The cause was not the flex-wrap —
  that was already there. The reading column was capped at a flat 37rem, so
  at exactly 1024 the rail got 295px of the 938px sheet and had no room to
  wrap into. The column tracks the viewport to the same ceiling now
  (`--main-col`), giving the rail 437px at 1024 and 690px at 1440.
- **Study opening paragraphs take the drop cap** — and so does every section
  opener, and so do the three short-form project pages, which opened on bare
  body text and read as a different template rather than a shorter one.
- **Three measured reference elements are now on the project page**: the body
  in a perforated panel, a LIVE SITE ellipse top-right, the stamp beside the
  title.
- `priority` → `preload` on `next/image`; `priority` is deprecated in Next 16.

## Things that were fixed and are worth not reintroducing

- `<Perforated>` hardcoded a bone panel with parchment bites and its comment
  said it only worked over parchment. The bites are HOLES — they have to be
  the colour of whatever the panel sits on — so it could not go on a project
  page, which is bone, which is the one page the reference puts a perforated
  panel on. It takes a `tone` now.
- The project-page panel is positioned, not grid-placed. As a grid item with
  `grid-row: 1 / -1` it covered exactly one row: `-1` counts back from the end
  of the EXPLICIT grid, and every row in that grid is implicit, created by
  auto-placement. It is absolute against `.article` and sized off the same
  `--main-col` the grid uses, so the two cannot drift.
- The stamp is positioned rather than laid out as a flex sibling of the title.
  As a sibling it shrank the h1's box, and `.press` clips the title to that
  box with `clip-path`, so FOREMAN rendered as FOREMA.
- In `make-art.py`, the rule that leaves some rack cells empty ran before the
  ember check, and the flagged pallet's cell was one it emptied — so the one
  thing the foreman plate is about was not drawn at all.

## What is left

1. **The rest of Miranda's pages, when the site is reachable.** `/work` and
   the remaining project pages have not been inspected element by element.
   The homepage has. This is blocked on network access, not on effort.
2. **There is no `/about` route at all.** Miranda has one; this site 404s.
   Deliberately not invented here: building a page from our own content and
   calling it a mirror of a page nobody in this session could see would be
   fabrication. It needs either the reference or the owner's call on what
   belongs on it. Note that `record`, `archive`, `story` and `stats` all
   currently live on the homepage, so an /about has a duplication question to
   answer before it has a layout question.
3. **The drop cap is on section openers, not every paragraph.** The measured
   note below says the reference caps every body paragraph. On a
   Foreman-length study that is eight reversed-out squares down one column,
   which reads as a fault rather than as a page. `capOpeners` in
   `work/[slug]/page.tsx` is the switch. Re-measure before changing it.
4. **The catalogue spines carry a lot of dead vertical space** — title at the
   top, year at the foot, and the middle empty until hover. That may well be
   correct (a closed book is the stated idea) and was left alone rather than
   redesigned against a reference nobody could load.
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

**There is no git remote.** `git remote -v` is empty in the cloud checkout,
so nothing can be pushed and every commit lives only in that container until
someone adds one. The 2026-09-30 work is four commits on `overhaul-margin`
that have never left the machine they were made on. Check this FIRST in a new
session — the standing instruction to "commit and push after each unit" is
only half-satisfiable without it.

**The artwork is generated by a script, not hand-edited.** Edit
`scripts/make-art.py` and re-run it; do not edit `public/art/*.svg` directly,
because the next run overwrites them.

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
