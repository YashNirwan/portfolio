# Handoff

State of the overhaul as of 2026-09-29, branch `overhaul-margin`.

## What this is

A rebuild of yashnirwan.com as a broadsheet newspaper, closely following
https://www.niccolomiranda.com at the owner's explicit direction. Production
(`main`) is still the old dark-slate site with a six-lens role switcher; this
branch is not merged or deployed.

## Read these first

- `src/lib/data.ts` — all homepage content. Every number in it was verified
  against a repo, a database or a live page, not against a résumé.
- `src/app/globals.css` — the design system. The comments explain why values
  are what they are; several contradict the original spec on purpose.
- `src/assets/fonts/README.md` — the font situation, which is the largest
  remaining gap.

## Things that will bite you

**Turbopack serves a stale CSS chunk.** It happened four times during this
rebuild: new classes silently vanish from the compiled output while the markup
still references them, or a build fails that passes clean afterwards. The fix
is `rm -rf .next`. Clearing `.next/cache` alone is not enough. If the page
suddenly looks unstyled, this is why.

**Un-layered CSS beats Tailwind utilities.** A plain `body > *` or `a` rule in
`globals.css` overrides anything in `@layer utilities` regardless of
specificity. This bit twice: `body > * { position: relative }` silently
overrode `position: fixed` on the catalogue rail and pushed the whole shelf
330px down the page, and an un-layered `a { text-decoration: underline }`
overrode every `no-underline` on the site. Base element styles now live in
`@layer base`. Keep them there.

**React was on canary and no longer is.** `ViewTransition`, which drives the
folder animation between the catalogue and a project page, shipped unprefixed
in React 19.3.0 stable on 2026-09-30, so the canary pin is gone. Do not
reintroduce it: a caret range on a prerelease (`^19.3.0-canary-…`) also matches
the stable release above it, which is what broke `npm ci` in CI the first time
this branch was pushed.

**`next/font/google` and variable fonts.** Requesting an explicit weight array
alongside `style: ["normal","italic"]` on a variable face makes the loader emit
several queries, which Turbopack rejects with "next/font/google queries have
exactly one entry". Leave variable faces variable.

**placehold.co returns SVG.** `next/image` refuses to optimise remote SVG
unless `dangerouslyAllowSVG` is set, which is not worth doing for a
third-party host. The placeholder URLs request `.png` explicitly. Keep that.

## The spec is wrong about its own subject

`~/Downloads/DESIGN.md` and the refero token files describe the reference but
contradict it in at least four places. Measured live, the reference:

- runs its body background at `rgb(29,29,27)`, ink black, while the spec says
  "theme: light, page background parchment"
- runs edge to edge at a 1920 viewport, while the spec says `max-width: 1440px`
- sets banner type in bone cream `rgb(205,198,190)`, not parchment
- sets headings in Domaine Display **Condensed** at weight 500 — they read
  heavy because they are narrow and high-contrast, not because they are bold

When the spec and the live page disagree, the live page wins. Inspect it with
the browser tools rather than trusting the token file.

## What is outstanding

1. **Artwork.** Every image on the site is a labelled placeholder from
   placehold.co naming what belongs there. The reference is carried by
   commissioned illustration and this is the single biggest difference
   remaining. Six project slots plus four on the back page.
2. **Logos** for Accenture and Amoga in the record section. Official files
   from their brand pages, not scraped copies.
3. **The JS budget is at the framework floor.** Every route loads 194.5 KB of
   gzipped JS; `/_global-error`, which carries essentially no app code, loads
   185.5 KB. Roughly 185 KB of that is Next 16.2 itself and about 9 KB is this
   site. The CI ceiling is 210 KB, which is a tripwire for a heavy client
   dependency rather than a target. There is little to win here without
   dropping framework weight.
4. **Fonts.** The reference loads three retail faces with no free equivalent.
   See `src/assets/fonts/README.md`. The current faces approximate them.
5. **An independent content review.** The copy was written by an agent and
   never reviewed by one that did not write it. That check has not happened.

## Positioning, and what not to undo

The site deliberately does **not** give the owner a job title. An earlier draft
opened with "Software engineer!" and was cut: ~19 months of professional
experience, neither role SWE-titled, and overstating it has already failed in a
live interview. The identity slot says "Prove it!" instead — a stance, not a
title.

Claims are traceable on purpose. Foreman's write-up publishes a result that
makes the project look worse (recall falls, and the cheaper verifier scored
below doing nothing). That is the point of the site, not an oversight.

Two things are excluded deliberately and should stay excluded: a meeting
assistant that transcribes live interviews, and any public figure from the job
search itself.

## Running it

```bash
npm install
npm run dev          # localhost:3000
npm run build
npm run lint && npx tsc --noEmit
```

Design linting, which found real bugs including an `<img>` stuck at opacity 0:

```bash
.github/skills/impeccable/scripts/bin/darwin-arm64/impeccable detect http://localhost:3000
```
