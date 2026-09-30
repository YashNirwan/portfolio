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

### Network access, and how to inspect the reference

The cloud environment started as a source-control-only allowlist, which
denied both the image Gateway and niccolomiranda.com. The owner opened it on
2026-09-30. If a new environment is back on an allowlist, the symptom is
`curl: (56) CONNECT tunnel failed` and `curl -sS "$HTTPS_PROXY/__agentproxy/status"`
lists the refusals; the fix is the owner's (session title bar → environment →
Edit → Network access), not the agent's.

**Inspecting the reference headless takes two non-obvious steps.**

1. **Trust the proxy CA in Chromium.** The egress proxy re-terminates TLS, so
   a headless browser shows `NET::ERR_CERT_AUTHORITY_INVALID`. Add the CA to
   the NSS store — do NOT pass `--ignore-certificate-errors`:

       apt-get install -y libnss3-tools
       certutil -A -n "CCR Upstream Proxy CA" -t "C,," \
         -i /root/.ccr/agent-proxy-ca.crt -d sql:/root/.pki/nssdb

2. **Unlock Locomotive Scroll.** The reference is Webflow + GSAP + Locomotive,
   and it renders as a flat bone field headless. Locomotive puts
   `[data-scroll-container]` into `position: fixed` under `.has-scroll-smooth`
   and drives it with transforms. Forcing `transform: none` on everything —
   the obvious move — is what BLANKS it. Instead remove the classes and put
   the container back in flow:

       document.documentElement.classList.remove('has-scroll-smooth','has-scroll-init')
       const c = document.querySelector('[data-scroll-container]')
       c.style.position = 'static'; c.style.transform = 'none'

   Computed styles are readable without either step, via CDP
   `Runtime.evaluate`; the screenshots are what need them.

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

### The ten slots are FILLED — generated

Generated with `bfl/flux-2-pro` by `scripts/gen-art.py`, committed as JPEG in
`public/art/`. The authored SVG fallbacks from `scripts/make-art.py` are still
there, unreferenced.

    set -a && . ./.env.local && set +a
    python3 scripts/gen-art.py            # all ten
    python3 scripts/gen-art.py foreman    # one

The Gateway returns PNG; the script's docstring has the one-line `sharp`
command that converts to JPEG (8.4 MB → 4.5 MB, no visible loss). Running all
ten back-to-back hits a 429 around the ninth — space them ~35s apart.

**Every plate is an array of like things with exactly one ember exception.**
That conceit is what makes ten separate generations read as one set, and it
is the site's own argument. Keep it in any rewrite of the prompts.

Three things the prompts had to be forced into, all now in `gen-art.py`:

- "Reversed out" was too weak. Two of six project plates came back
  black-on-white. Naming the ground explicitly ("a solid near-black ink field,
  white-on-black engraving") fixed both.
- A single "no text" clause let garbled rank-and-file letters onto the
  chessboard. The no-text directive is now exhaustive.
- The style directive is concatenated into EVERY prompt. Calls are
  independent; a preamble on the first buys nothing for the other nine.

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

### Done later on 2026-09-30 (second pass, reference measured live)

Everything below was measured off niccolomiranda.com with headless Chromium
over CDP (see "Inspecting the reference headless" above), not guessed.

- **Portrait** (superseded, see third pass) was a linocut of the photo (`/portrait-engraved.jpg`), made
  with `bytedance/seedream-4.5` via `/v1/images/edits`, tones mapped to ink →
  parchment. The owner rejected a duotone photo and then a detailed hedcut
  as "too detailed". flux-kontext changed the face; seedream kept it. The
  model's corner watermark was cropped out. The colour original stays.
- **Identity section** follows the reference's layout: heading + portrait in
  the narrow left column, a plate (Calton Hill, `/art/calton-hill.jpg`) and
  display-caps roles on the right.
- **Accenture mark**: the supplied chevron, traced into an inline SVG
  (`components/org-mark.tsx`), set in ink.
- **Back page**: four equal newspaper columns (`.cols-even`), not 46/54.
- **Menu bar, menu and torn-paper transition** (`components/site-nav.tsx`,
  `components/curtain.tsx`). The curtain lives in the ROOT layout; a
  per-page curtain would unmount mid-transition.
- **Smooth scroll** (Lenis) — the reference runs Locomotive with lerp 0.1;
  its Webflow interactions have no scroll-linked transforms at all.
- **Typeface**: Instrument Serif + a 0.016em stroke replaces Gloock.
  Measured on "INTERACTIVE" at 100px: Canopee ~354px, Instrument 467,
  Gloock 664. Canopée is VJ Type's, commercial licence only.
- **Stats, big type, ticker, footer** rebuilt to the reference's awards row,
  pixel-perfect collage and footer run.
- **Project pages**: centred title with the tear across its tops, 32px
  drop-cap intro beside a large LIVE SITE ellipse, THE / WORK / STORY head.

Still open: the reference's testimonials section has no counterpart and
none should be invented.

### Done on 2026-09-30 (third pass, owner's notes)

- **Portrait**: the owner's own illustrated Calton Hill portrait
  (`/portrait-illustrated.jpg`, cropped from what they supplied). The linocut
  is gone.
- **Figures** render in the reading column, not the rail. In the rail they
  opened an empty row on Foreman between "The failure" and "Honest limits"
  (grid auto-placement put them on a row of their own). Short-form pages
  now render `figures` too: Raivana has its shop screenshot and farewatch
  has its chart. **VibeCheck has no screenshot**: the Streamlit app was
  asleep, then stuck on a loading skeleton, and its stock Streamlit UI
  would clash with the site anyway. Assumption: better none than a bad one.
- **farewatch chart** rebuilt for legibility, after the owner said the
  problem was data visibility, not colour. It is now six small panels, one
  per route, with dollar and date axes, the median, and an alert band at
  anomaly.py's 0.6× median. Each route's low is labelled; spikes are
  clipped and their value written in. It is drawn from the committed
  `scripts/farewatch-series.json` (or the DB when present).
  `scripts/data/farewatch-legacy.svg` was an interim source, used before
  the extract was committed, and can be deleted.
- **Catalogue order**: foreman, raivana, vibecheck, interface-cua,
  farewatch, firesight.
- **Menu** re-laid to the reference's open menu: a centred stack, the
  current page struck through with one ember bar, dot-separated socials,
  and sized by `min(vw, svh)` so it fits any window.
- **/about trimmed**: the status row and the archive are gone (both repeated
  the front page), the record keeps two lines per role, and "Available now"
  sits by the ask.
- **Nameplate** enlarged to 24/32px. Whether "The Second Opinion" is the
  right title for a job-search portfolio is the owner's call; see the chat
  for the trade-off.

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
- `.byline` was un-layered CSS and silently beat every `text-*` utility beside
  it. The skip link asked for parchment on ink and rendered charcoal on black
  (~2:1) to keyboard users on every page. It lives in `@layer components` now;
  measured after a real Tab: 12.63:1. Third instance of the un-layered trap.
  If a utility "does nothing", check for an un-layered rule before anything
  else — and then check for a stale Turbopack chunk, which is what made the
  first attempt at this fix look like it had failed.
- In `make-art.py`, the rule that leaves some rack cells empty ran before the
  ember check, and the flagged pallet's cell was one it emptied — so the one
  thing the foreman plate is about was not drawn at all.

## What is left

1. **The remaining project pages have not been inspected element by element**
   against their counterparts (`/work/prada` etc.). The homepage, `/work` and
   `/about` have.
2. **`/about` was trimmed** (see third pass). It still shares the record
   with the front page, in shorter form.
3. **The homepage is still parchment.** The reference's `/work` and `/about`
   measured bone, and ours now match; the homepage was not re-measured this
   session and was left as it was.
3. **The drop cap is on section openers, not every paragraph.** The measured
   note below says the reference caps every body paragraph. On a
   Foreman-length study that is eight reversed-out squares down one column,
   which reads as a fault rather than as a page. `capOpeners` in
   `work/[slug]/page.tsx` is the switch. Re-measure before changing it.
4. **An independent content review.** Partly done — see "Claims to settle".

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

**Turbopack serves a stale CSS chunk — on nearly every CSS edit.** It
happened repeatedly on 2026-09-30: HMR took one CSS edit and silently
dropped the next. Before believing any visual result after a CSS change,
check the served chunk contains the new rule. Happened again this session: new
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

**The remote had to be attached by hand.** The cloud checkout arrived with no
`origin`, and `git fetch` works on a public repo while `git push` does not:
the session's git proxy only injects a credential for repositories in the
session's authorized source set, and returns

    access denied by the git proxy: ... is not in this session's authorized
    repository set

until the repo is added to the session's sources. If a session starts with an
empty `git remote -v`, sort that out FIRST rather than at the end — otherwise
the work sits in a container that gets reclaimed. Recovery is:

    git remote add origin https://github.com/YashNirwan/portfolio.git
    git fetch origin overhaul-margin
    git push -u origin overhaul-margin

Check `git merge-base --is-ancestor origin/overhaul-margin HEAD` before
pushing, and never force-push this branch.

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
