#!/usr/bin/env python3
"""Generate the ten plates through the Vercel AI Gateway.

    AI_GATEWAY_API_KEY=... python3 scripts/gen-art.py            # all ten
    AI_GATEWAY_API_KEY=... python3 scripts/gen-art.py foreman    # just one

Writes public/art/<slot>.png — the Gateway returns PNG bytes, so that is what
lands. The committed plates are JPEG: 8.4 MB of PNG is a lot to carry in a
repo for no gain, and `next/image` re-encodes to AVIF/WebP on serve anyway, so
the source format only costs checkout weight. Second step, after generating:

    node -e "const sharp=require('sharp'),fs=require('fs');\
      for (const f of fs.readdirSync('public/art').filter(f=>f.endsWith('.png')))\
        sharp('public/art/'+f).jpeg({quality:88,chromaSubsampling:'4:4:4',mozjpeg:true})\
          .toFile('public/art/'+f.replace(/\.png$/,'.jpg')).then(()=>fs.unlinkSync('public/art/'+f))"

That halves them to ~4.5 MB with no visible loss on a textured engraving.

The authored SVG plates from scripts/make-art.py stay in the repo as the
fallback; whichever set data.ts points at is the one that ships.

TWO THINGS THAT MATTER AND ARE EASY TO GET WRONG

1. The style directive goes in EVERY prompt, not just the first. There is no
   conversation here — each call is independent, so a shared preamble in the
   first request buys nothing for the other nine. STYLE below is concatenated
   into all ten.

2. Every plate is an array of like things with exactly ONE ember exception.
   That is what makes ten separately-generated images read as one set rather
   than ten images that happen to share a palette, and it is also the site's
   own argument: the work is finding the one row worth reading. Keep it if you
   rewrite these.

Response is {data:[{b64_json:...}]} — base64, not a URL.
"""

import base64
import json
import os
import pathlib
import sys
import time
import urllib.error
import urllib.request

ENDPOINT = "https://ai-gateway.vercel.sh/v1/images/generations"
MODEL = "bfl/flux-2-pro"
OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "art"

WIDE = "1456x816"   # the six project slots, ~16:9
TALL = "1216x832"   # the four back-page slots, ~3:2

STYLE = (
    "Nineteenth-century newspaper engraving, printed on warm parchment stock. "
    "Flat hand-engraved linework, parallel hatching for shade, a visible halftone "
    "dot screen for mid-tones, high contrast, no perspective tricks. "
    "Strictly four colours and no others: near-black ink #1d1d1b, warm parchment "
    "#e2dedb, bone grey #cdc6be, and a single burnt-orange ember #c03f13 used on "
    "exactly one element and nowhere else. "
    "ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE: no lettering, no words, no letters, "
    "no numerals, no digits, no labels, no captions, no signature, no watermark, no "
    "rank or file markings, no alphabet characters of any kind. Any writing is a "
    "defect. No photorealism, no gradients, no gloss, no modern UI, no logos."
)

PROMPTS = {
    # --- the six project slots: parchment line on an ink ground -------------
    "foreman": (
        "A warehouse aisle seen head-on. Tall pallet racking down both sides, "
        "loaded with identical crated pallets, receding to a vanishing point. "
        "A forklift stands in the aisle. Exactly one pallet on the left-hand rack "
        "is burnt-orange ember and outlined, flagged among dozens of identical "
        "ink-coloured ones. Reversed out: light parchment linework on a near-black "
        "ink ground."
    ),
    "interface-cua": (
        "The screen of an obsolete cathode-ray computer terminal in a heavy bezel, "
        "showing a dense form of empty ruled entry fields in a rigid grid, with no "
        "readable writing in them. Exactly one field in the middle of the form is "
        "filled solid burnt-orange ember. Reversed out: light parchment linework on "
        "a near-black ink ground."
    ),
    "raivana": (
        "Five hand-thrown Rajasthani clay vessels of different silhouettes standing "
        "in a row on a plain shelf, with a repeating block-printed ornamental border "
        "band above and below them. Exactly one vessel, the centre one, is burnt-orange "
        "ember; the other four are ink. IMPORTANT: the background is a solid near-black "
        "ink field and the drawing is REVERSED OUT of it in pale parchment line — a "
        "white-on-black engraving, not black-on-white."
    ),
    "vibecheck": (
        "A neat grid of fifteen identical vinyl records seen face-on, concentric "
        "grooves and centre labels, five across and three down. Exactly one record in "
        "the grid is missing and drawn only as a hollow burnt-orange ember dashed "
        "outline with nothing inside it. Reversed out: light parchment linework on a "
        "near-black ink ground."
    ),
    "farewatch": (
        "An antique scientific plate: six thin wavering ink lines tracking left to "
        "right across a ruled measurement grid, held inside a horizontal dashed band. "
        "Exactly one line is burnt-orange ember and plunges steeply below the band "
        "near the right edge, ending in a marked dot. Reversed out: light parchment "
        "linework on a near-black ink ground."
    ),
    "firesight": (
        "The flat front elevation of a five-storey New York tenement building, a "
        "regular grid of identical sash windows, with an iron fire escape of landings "
        "and stairs running up the centre bay. Exactly one window is filled solid "
        "burnt-orange ember. IMPORTANT: the background is a solid near-black ink field "
        "and the building is REVERSED OUT of it in pale parchment line — a white-on-black "
        "engraving, not black-on-white."
    ),
    # --- the identity plate: the big landscape in the homepage's right column.
    # The reference puts a large image above its display-caps description;
    # this is the owner's own place — his portrait was taken on Calton Hill —
    # drawn in the same one-exception conceit as every other plate.
    "calton-hill": (
        "The National Monument on Calton Hill in Edinburgh: an unfinished Greek "
        "temple front, a single row of twelve identical Doric columns on a stepped "
        "stone base carrying an architrave, standing alone on a grassy hilltop under "
        "a wide open sky. Every column is the same pale parchment. The ONLY coloured "
        "thing in the whole image is one small lone human figure standing at the foot "
        "of the steps, filled flat burnt-orange ember, crisp and engraved, no glow. "
        "IMPORTANT: the background is a solid near-black ink field and the "
        "drawing is REVERSED OUT of it in pale parchment line — a white-on-black "
        "engraving, not black-on-white."
    ),
    # --- the four back-page slots: ink line on a bone ground ----------------
    "marquee": (
        "An old cinema marquee jutting from a building front, a blank unlettered "
        "signboard ringed with a row of round light bulbs. Exactly one bulb is lit "
        "burnt-orange ember; every other bulb is an empty ink circle. Dark ink "
        "linework on a pale bone-grey paper ground."
    ),
    "ticket": (
        "A paper admission ticket torn in half along its perforated edge, the ragged "
        "tear running down the middle, lying flat. A row of five small empty boxes "
        "sits on the stub; exactly one of them is filled solid burnt-orange ember. "
        "Dark ink linework on a pale bone-grey paper ground."
    ),
    "chessboard": (
        "A chessboard seen straight down from above, eight by eight squares, a handful "
        "of carved pieces in a quiet opening position near the centre, no coordinates or "
        "border markings printed around the board. Exactly ONE single square is marked "
        "burnt-orange ember and no other square is coloured. Dark ink linework on a pale "
        "bone-grey paper ground."
    ),
    # Was a split-flap departure board with every flap blank (no text is
    # allowed), which read as an abstract grid: the owner could not tell what
    # it was. A battered suitcase says travel at a glance, and a budget one.
    # Published as public/art/going-places.jpg (renamed so image caches keyed
    # on the old URL cannot keep serving the board).
    "departures": (
        "A battered old leather suitcase standing upright on a railway platform, "
        "strapped shut with two belts, its sides covered in plain round and oval "
        "travel stickers with no writing on them. A small paper luggage tag hangs "
        "from the handle on a string; the luggage tag is the single burnt-orange "
        "ember element. A small propeller airliner crosses the sky above it; the "
        "aircraft is completely unmarked, plain ink and parchment, with no "
        "registration letters, no roundels and no coloured tail. Dark "
        "ink linework on a pale bone-grey paper ground."
    ),
}

SIZES = {k: (WIDE if k in ("foreman", "interface-cua", "raivana", "vibecheck", "farewatch", "firesight", "calton-hill") else TALL) for k in PROMPTS}


def generate(slot, key, attempt=1):
    body = json.dumps(
        {
            "model": MODEL,
            "prompt": f"{PROMPTS[slot]} {STYLE}",
            "n": 1,
            "size": SIZES[slot],
        }
    ).encode()
    req = urllib.request.Request(
        ENDPOINT,
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            payload = json.load(r)
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as e:
        if attempt < 3:
            time.sleep(4 * attempt)
            return generate(slot, key, attempt + 1)
        raise SystemExit(f"{slot}: giving up after {attempt} attempts — {e}")

    b64 = payload["data"][0]["b64_json"]
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"{slot}.png"
    path.write_bytes(base64.b64decode(b64))
    return path


if __name__ == "__main__":
    key = os.environ.get("AI_GATEWAY_API_KEY")
    if not key:
        raise SystemExit("AI_GATEWAY_API_KEY is not set. It lives in .env.local, which is gitignored.")

    slots = sys.argv[1:] or list(PROMPTS)
    for slot in slots:
        if slot not in PROMPTS:
            raise SystemExit(f"unknown slot {slot!r}; known: {', '.join(PROMPTS)}")
        t0 = time.time()
        path = generate(slot, key)
        print(f"  {slot:<14} {SIZES[slot]:>9}  {path.stat().st_size / 1024:>7.0f} KB  {time.time() - t0:.0f}s", flush=True)
