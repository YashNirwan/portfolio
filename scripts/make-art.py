#!/usr/bin/env python3
"""Draw the project and back-page artwork.

    python3 scripts/make-art.py            # writes public/art/*.svg

Ten slots, one visual world. The world is a 19th-century newspaper engraving:
flat shapes, parallel hatching for shade, a halftone dot screen for mid-tone,
and no colour except the one ember accent the palette allows.

WHY THIS IS AUTHORED RATHER THAN GENERATED
The documented plan was ten diffusion renders through the Vercel AI Gateway.
That host is denied by the cloud environment's egress policy, so it was not
available. Authoring the artwork is the fallback that needs no network, costs
nothing, stays on palette by construction, and — unlike a render — can be
edited later by changing a number. If the Gateway is ever reachable, these are
replaceable: every slot is one `image:` key in src/lib/data.ts.

THE CONCEIT, WHICH IS THE SITE'S OWN ARGUMENT
Every drawing is an array of like things with exactly one ember exception: one
flagged pallet, one bad field, one window, one fare that broke its baseline.
The whole site argues that the work is finding the one row worth reading, so
the artwork argues it too. It is also what makes ten separate drawings read as
one set — the ember is the through-line, not a shared texture.

Project slots are parchment line on ink, which is the page's own signature:
the masthead banners knock their letters out of an ink block rather than
painting them on top. Back-page slots invert to ink on bone, because they run
small and four-up on parchment where a row of black blocks would shout.
"""

import math
import os
import pathlib

# The palette, and nothing else. These are the four values in globals.css.
INK = "#1d1d1b"
PARCHMENT = "#e2dedb"
BONE = "#cdc6be"
EMBER = "#c03f13"

OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "art"

PROJECT = (1200, 675)  # 16:9, the work cards and the project hero
BACKPAGE = (900, 600)  # 3:2, the back-page dl


# --------------------------------------------------------------------------
# Style module. Every drawing is built from these, which is what keeps the ten
# in one world without restating a style directive per drawing.
# --------------------------------------------------------------------------
def defs(fg, accent=EMBER):
    """Hatch and halftone screens, in the drawing's own foreground colour.

    Patterns rather than emitted line paths: a 1200x675 field of 6px hatching
    is ~200 lines as geometry and four lines as a pattern, and the file stays
    small enough to inline if it ever needs to be.
    """
    return f"""<defs>
    <pattern id="h45" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="7" stroke="{fg}" stroke-width="1" opacity="0.55"/>
    </pattern>
    <pattern id="h45f" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4" stroke="{fg}" stroke-width="1" opacity="0.7"/>
    </pattern>
    <pattern id="hv" width="6" height="6" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="6" stroke="{fg}" stroke-width="1" opacity="0.45"/>
    </pattern>
    <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.35" fill="{fg}" opacity="0.5"/>
      <circle cx="6" cy="6" r="1.35" fill="{fg}" opacity="0.5"/>
    </pattern>
    <pattern id="dotsf" width="5" height="5" patternUnits="userSpaceOnUse">
      <circle cx="1.6" cy="1.6" r="1" fill="{fg}" opacity="0.62"/>
    </pattern>
    <pattern id="emberdots" width="7" height="7" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="{accent}" opacity="0.85"/>
      <circle cx="5.5" cy="5.5" r="1.5" fill="{accent}" opacity="0.85"/>
    </pattern>
  </defs>"""


def open_svg(w, h, bg, fg, label):
    """Width and height as well as a viewBox.

    next/image needs an intrinsic size to reason about, and `object-fit: cover`
    on the hero crops from that size — an SVG with a viewBox alone gets sized
    by the container instead and the crop lands somewhere else.
    """
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
        f'width="{w}" height="{h}" role="img" aria-label="{label}">'
        f"{defs(fg)}"
        f'<rect width="{w}" height="{h}" fill="{bg}"/>'
    )


def keyline(w, h, fg, inset=18):
    """The hairline rectangle inside the block.

    `.ink` in globals.css draws exactly this inside every banner — a 1px
    parchment rule held off the edge. The artwork carries it so a card reads as
    the same printed object as a banner.
    """
    return (
        f'<rect x="{inset}" y="{inset}" width="{w - 2 * inset}" height="{h - 2 * inset}" '
        f'fill="none" stroke="{fg}" stroke-width="1" opacity="0.38"/>'
    )


def hatch_rect(x, y, w, h, pattern="h45"):
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" fill="url(#{pattern})"/>'


def rule(x1, y1, x2, y2, fg, width=1, opacity=1.0, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return (
        f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
        f'stroke="{fg}" stroke-width="{width}" opacity="{opacity}"{d}/>'
    )


def box(x, y, w, h, fg, fill="none", width=1.6, opacity=1.0):
    return (
        f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" '
        f'fill="{fill}" stroke="{fg}" stroke-width="{width}" opacity="{opacity}"/>'
    )


def flag(x, y, w, h, accent=EMBER):
    """The ember exception. One per drawing, and it is always the same object:
    a solid accent block with a heavier keyline, so it reads as marked rather
    than as merely a different colour."""
    return (
        f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" fill="{accent}"/>'
        f'<rect x="{x - 4:.1f}" y="{y - 4:.1f}" width="{w + 8:.1f}" height="{h + 8:.1f}" '
        f'fill="none" stroke="{accent}" stroke-width="2"/>'
    )


def write(name, body):
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"{name}.svg"
    path.write_text(body + "</svg>\n", encoding="utf-8")
    print(f"  {path.relative_to(OUT.parent.parent)}  {len(path.read_bytes()):>6} B")


# --------------------------------------------------------------------------
# The six project slots — parchment line on ink, 16:9.
#
# The hero crops these to 46-58svh with object-cover, so the subject sits in
# the middle band and nothing load-bearing goes near the top or bottom edge.
# --------------------------------------------------------------------------
def foreman():
    """A warehouse floor. Racking in one-point perspective, a forklift, and one
    flagged pallet in the aisle — the alert that turned out to be real."""
    w, h = PROJECT
    fg = PARCHMENT
    s = [open_svg(w, h, INK, fg, "Engraving of a warehouse floor, racking receding to a vanishing point, one pallet flagged in the aisle")]
    vx, vy = w * 0.50, h * 0.44  # vanishing point, on the aisle's centre line

    # Bays are drawn as whole racks in elevation, scaled down by depth, rather
    # than as shelf lines running to the vanishing point. The first attempt did
    # the latter and every rack came out as a flag on a pole: converging lines
    # alone do not read as racking, closed bays do.
    def bay(side, k, ember_level=None):
        """One rack, `k` of the way to the horizon. side -1 left, +1 right."""
        sc = 1 - k
        inner = vx + side * sc * w * 0.13   # aisle edge
        outer = vx + side * sc * w * 0.60   # wall edge
        top = vy - sc * h * 0.46
        bot = vy + sc * h * 0.30
        x0, x1 = min(inner, outer), max(inner, outer)
        lw = 0.9 + sc * 2.3
        # An opaque ground first. Without it every rack behind this one showed
        # straight through its open cells and the aisle became a thicket of
        # overlapping rectangles with the flagged pallet lost inside it.
        out = [
            f'<rect x="{x0:.1f}" y="{top:.1f}" width="{x1 - x0:.1f}" height="{bot - top:.1f}" fill="{INK}"/>',
            box(x0, top, x1 - x0, bot - top, fg, "none", lw, 0.9),
        ]
        # Three beams, and the uprights that carry them.
        levels = (0.0, 0.33, 0.66, 1.0)
        for lv in levels:
            y = top + (bot - top) * lv
            out.append(rule(x0, y, x1, y, fg, lw, 0.85))
        for u in (0.33, 0.66):
            ux = x0 + (x1 - x0) * u
            out.append(rule(ux, top, ux, bot, fg, lw * 0.6, 0.55))
        # Palletised stock in the cells, left hollow here and there so the rack
        # reads as worked rather than as a filled grid.
        for li in range(3):
            for ci in range(3):
                # The ember cell is checked BEFORE the gap rule. It was checked
                # after, and (1,1) on the near rack happened to be one of the
                # cells the gap rule empties — so the flagged pallet, the one
                # thing the drawing is about, was never drawn at all.
                if ember_level != (li, ci) and (li * 3 + ci + int(k * 10)) % 4 == 0:
                    continue
                cy0 = top + (bot - top) * levels[li]
                cy1 = top + (bot - top) * levels[li + 1]
                cx0 = x0 + (x1 - x0) * (ci / 3) + (x1 - x0) * 0.035
                cw_ = (x1 - x0) / 3 - (x1 - x0) * 0.07
                ph = (cy1 - cy0) * 0.62
                py = cy1 - ph - (cy1 - cy0) * 0.06
                if ember_level == (li, ci):
                    out.append(flag(cx0, py, cw_, ph))
                else:
                    out.append(hatch_rect(cx0, py, cw_, ph, "h45"))
                    out.append(box(cx0, py, cw_, ph, fg, "none", lw * 0.55, 0.8))
                    out.append(rule(cx0, py + ph * 0.5, cx0 + cw_, py + ph * 0.5, fg, lw * 0.45, 0.45))
        return "".join(out)

    # Roof trusses. Two lines to the vanishing point plus the cross-members is
    # what actually says "warehouse" rather than "corridor".
    s.append(rule(0, 22, w, 22, fg, 2.4, 0.8))
    for side in (-1, 1):
        s.append(rule(vx + side * w * 0.62, 30, vx + side * w * 0.05, vy - h * 0.10, fg, 1.6, 0.5))
    for k in (0.0, 0.30, 0.55, 0.74):
        sc = 1 - k
        x0 = vx - sc * w * 0.62
        x1 = vx + sc * w * 0.62
        y = 30 + (vy - h * 0.10 - 30) * k
        s.append(rule(x0, y, x1, y, fg, 1.6 * sc + 0.4, 0.4))
        # A shallow truss zigzag between this tie and the roof line. Nine bays
        # of it on five ties turned the roof into a hatched band.
        if k < 0.4:
            for i in range(7):
                t0, t1 = i / 7, (i + 1) / 7
                s.append(rule(x0 + (x1 - x0) * t0, y, x0 + (x1 - x0) * t1, y - 14 * sc - 3, fg, 1, 0.24))

    # Floor: a dot screen, a handful of converging joint lines, and painted
    # aisle edges. Nineteen converging lines read as graph paper, not concrete.
    s.append(f'<rect x="0" y="{vy:.0f}" width="{w}" height="{h - vy:.0f}" fill="url(#dots)" opacity="0.7"/>')
    for i in (-3, -2, -1, 1, 2, 3):
        s.append(rule(vx + i * 210, h, vx + i * 9, vy, fg, 1.2, 0.26))
    for t in (0.16, 0.34, 0.56, 0.82):
        y = vy + (h - vy) * t
        s.append(rule(0, y, w, y, fg, 1, 0.2))
    # The marked aisle, in ember, running to the horizon.
    for side in (-1, 1):
        s.append(rule(vx + side * w * 0.12, vy, vx + side * w * 0.40, h, fg, 2.6, 0.55, dash="18 12"))

    # Far bays first, so the near ones overlap them. The flagged pallet sits in
    # the near-left rack's AISLE-side cell: the project hero crops this plate to
    # a taller box with object-cover, which takes ~11% off each side, and in the
    # outer cell the one ember element was sliced off the edge.
    for k in (0.62, 0.38, 0.0):
        for side in (-1, 1):
            s.append(bay(side, k, ember_level=(1, 2) if (k == 0.0 and side == -1) else None))

    # A forklift in the aisle, near-side and large enough to be read.
    fx, fy = w * 0.60, h * 0.90
    s.append(box(fx, fy - 84, 132, 84, fg, "url(#h45f)", 2.6))        # body
    s.append(box(fx + 84, fy - 150, 46, 66, fg, "url(#hv)", 2))       # cab
    s.append(rule(fx + 6, fy - 168, fx + 6, fy - 6, fg, 4, 0.95))     # mast
    s.append(rule(fx + 22, fy - 168, fx + 22, fy - 6, fg, 2.6, 0.7))
    s.append(rule(fx - 52, fy - 18, fx + 6, fy - 18, fg, 4, 0.95))    # forks
    s.append(rule(fx - 52, fy - 18, fx - 52, fy - 4, fg, 3, 0.9))
    for cx in (fx + 28, fx + 112):
        s.append(f'<circle cx="{cx:.0f}" cy="{fy:.0f}" r="19" fill="{INK}" stroke="{fg}" stroke-width="3"/>')
        s.append(f'<circle cx="{cx:.0f}" cy="{fy:.0f}" r="6" fill="{fg}"/>')

    s.append(keyline(w, h, fg))
    return "".join(s)


def interface_cua():
    """A legacy terminal. A CRT bezel, a form of ruled fields with no labels,
    and one field flagged — the member lookup that returns an answer rather
    than a malfunction."""
    w, h = PROJECT
    fg = PARCHMENT
    s = [open_svg(w, h, INK, fg, "Engraving of an old computer terminal showing a ruled form, one field flagged")]

    # The screen, inset in a hatched bezel.
    bx, by, bw, bh = 150, 74, w - 300, h - 190
    s.append(hatch_rect(bx - 26, by - 26, bw + 52, bh + 52, "h45"))
    s.append(box(bx - 26, by - 26, bw + 52, bh + 52, fg, "none", 2.4))
    s.append(box(bx, by, bw, bh, fg, INK, 2))

    # Scanlines, and the raster's brighter middle.
    s.append(f'<rect x="{bx}" y="{by}" width="{bw}" height="{bh}" fill="url(#hv)" opacity="0.5"/>')

    # A frameset: a menu rail, then a field grid. The reference target for this
    # project is a table-laid-out bank back-office, so the form is tables.
    railw = 168
    s.append(rule(bx + railw, by, bx + railw, by + bh, fg, 1.6, 0.8))
    for i in range(7):
        y = by + 34 + i * 40
        s.append(rule(bx + 18, y, bx + railw - 20, y, fg, 5, 0.34))

    # Field rows: a short label rule, a long value rule.
    rows, top, gap = 8, by + 30, 42
    for i in range(rows):
        y = top + i * gap
        if y > by + bh - 30:
            break
        s.append(rule(bx + railw + 26, y, bx + railw + 118, y, fg, 4, 0.34))
        s.append(box(bx + railw + 138, y - 15, bw - railw - 190, 24, fg, "none", 1.2, 0.5))
        s.append(rule(bx + railw + 148, y - 2, bx + railw + 148 + (58 + (i * 37) % 210), y - 2, fg, 4, 0.5))

    # The flagged field. Row four, because the drift always shows up in the
    # one field nobody thought to check.
    fy = top + 3 * gap
    s.append(flag(bx + railw + 138, fy - 15, bw - railw - 190, 24))

    # A caret, and the keyboard's leading edge along the bottom.
    s.append(f'<rect x="{bx + railw + 150}" y="{by + bh - 44}" width="11" height="22" fill="{fg}"/>')
    s.append(rule(bx + railw + 26, by + bh - 22, bx + railw + 140, by + bh - 22, fg, 4, 0.34))
    s.append(hatch_rect(bx - 84, h - 84, bw + 168, 42, "h45f"))
    s.append(box(bx - 84, h - 84, bw + 168, 42, fg, "none", 2))
    for i in range(22):
        kx = bx - 70 + i * ((bw + 140) / 22)
        s.append(box(kx, h - 74, (bw + 140) / 22 - 8, 22, fg, "none", 1, 0.55))

    s.append(keyline(w, h, fg))
    return "".join(s)


def raivana():
    """Rajasthani homeware. A shelf of turned vessels, block-print border, one
    piece in ember — the order that must be recorded exactly once."""
    w, h = PROJECT
    fg = PARCHMENT
    s = [open_svg(w, h, INK, fg, "Engraving of handmade Rajasthani vessels on a shelf, one picked out in ember")]

    # A block-printed border, top and bottom: the repeat is the point.
    for y in (46, h - 74):
        s.append(rule(60, y, w - 60, y, fg, 1.4, 0.55))
        s.append(rule(60, y + 28, w - 60, y + 28, fg, 1.4, 0.55))
        n = 19
        for i in range(n):
            cx = 60 + (w - 120) * (i + 0.5) / n
            s.append(
                f'<path d="M{cx - 11:.1f} {y + 14} L{cx:.1f} {y + 3} L{cx + 11:.1f} {y + 14} '
                f'L{cx:.1f} {y + 25} Z" fill="none" stroke="{fg}" stroke-width="1.3" opacity="0.7"/>'
            )
            s.append(f'<circle cx="{cx:.1f}" cy="{y + 14}" r="3" fill="{fg}" opacity="0.7"/>')

    shelf = h * 0.74
    s.append(rule(70, shelf, w - 70, shelf, fg, 3, 0.9))
    s.append(hatch_rect(70, shelf, w - 140, 16, "h45"))

    # Five vessels, each a silhouette of revolution built from four widths up
    # the height: foot, belly, shoulder, rim. The first pass drove them off an
    # ellipse plus a neck, which gave every pot the same flat-bottomed onion
    # and made the widest one read as a lampshade.
    forms = [
        # (cx, height, foot, belly, shoulder, rim, belly height, ember)
        (w * 0.155, 186, 46, 88, 40, 56, 0.44, False),
        (w * 0.325, 218, 34, 58, 44, 38, 0.52, False),
        (w * 0.500, 246, 52, 96, 46, 72, 0.40, True),
        (w * 0.675, 168, 40, 52, 30, 44, 0.58, False),
        (w * 0.845, 204, 44, 80, 66, 50, 0.46, False),
    ]
    for cx, ht, foot, belly, shoulder, rim, bk, ember in forms:
        col = EMBER if ember else fg
        base = shelf
        fill = "url(#emberdots)" if ember else "url(#dots)"
        yb = base - ht * bk          # belly
        ys = base - ht * 0.84        # shoulder
        yr = base - ht               # rim
        # Right side down, left side up, so one path closes the silhouette.
        s.append(
            f'<path d="M{cx + rim / 2:.1f} {yr:.1f} '
            f'C{cx + rim / 2 + 6:.1f} {yr + (ys - yr) * 0.6:.1f} {cx + shoulder / 2:.1f} {ys - 10:.1f} {cx + shoulder / 2:.1f} {ys:.1f} '
            f'C{cx + shoulder / 2:.1f} {ys + (yb - ys) * 0.55:.1f} {cx + belly / 2:.1f} {yb - 18:.1f} {cx + belly / 2:.1f} {yb:.1f} '
            f'C{cx + belly / 2:.1f} {yb + (base - yb) * 0.62:.1f} {cx + foot / 2 + 8:.1f} {base - 12:.1f} {cx + foot / 2:.1f} {base:.1f} '
            f'L{cx - foot / 2:.1f} {base:.1f} '
            f'C{cx - foot / 2 - 8:.1f} {base - 12:.1f} {cx - belly / 2:.1f} {yb + (base - yb) * 0.62:.1f} {cx - belly / 2:.1f} {yb:.1f} '
            f'C{cx - belly / 2:.1f} {yb - 18:.1f} {cx - shoulder / 2:.1f} {ys + (yb - ys) * 0.55:.1f} {cx - shoulder / 2:.1f} {ys:.1f} '
            f'C{cx - shoulder / 2:.1f} {ys - 10:.1f} {cx - rim / 2 - 6:.1f} {yr + (ys - yr) * 0.6:.1f} {cx - rim / 2:.1f} {yr:.1f} Z" '
            f'fill="{fill}" stroke="{col}" stroke-width="{3 if ember else 2.2}"/>'
        )
        # The rim, seen slightly from above, and two incised tool bands.
        s.append(
            f'<ellipse cx="{cx:.1f}" cy="{yr:.1f}" rx="{rim / 2:.1f}" ry="{rim * 0.17:.1f}" '
            f'fill="none" stroke="{col}" stroke-width="{2.2 if ember else 1.8}"/>'
        )
        for k, ww in ((0.30, belly * 0.46), (0.52, belly * 0.40)):
            yy = base - ht * k
            s.append(rule(cx - ww, yy, cx + ww, yy, col, 1.4, 0.75))
        # A foot ring, so the pot stands on the shelf rather than floating.
        s.append(rule(cx - foot / 2 - 5, base, cx + foot / 2 + 5, base, col, 2.6, 0.9))
        if ember:
            # The marked one gets the same heavier keyline every other ember
            # exception in the set gets.
            s.append(box(cx - belly / 2 - 20, yr - 20, belly + 40, ht + 30, EMBER, "none", 2))

    s.append(keyline(w, h, fg))
    return "".join(s)


def vibecheck():
    """A record that may not exist. A grid of discs; the flagged one is an
    outline with nothing in it — the track the model invented."""
    w, h = PROJECT
    fg = PARCHMENT
    s = [open_svg(w, h, INK, fg, "Engraving of a grid of records, one of them an empty outline")]

    cols, rows = 5, 3
    cw, ch = (w - 200) / cols, (h - 230) / rows
    ghost = (1, 1)  # the one that does not exist

    for r in range(rows):
        for c in range(cols):
            cx = 100 + cw * (c + 0.5)
            cy = 120 + ch * (r + 0.5)
            rad = min(cw, ch) * 0.40
            if (r, c) == ghost:
                # Drawn as a dashed void: the shape is claimed, the content is
                # not there. This is the only ember element.
                s.append(
                    f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rad:.1f}" fill="none" '
                    f'stroke="{EMBER}" stroke-width="2.6" stroke-dasharray="9 7"/>'
                )
                s.append(
                    f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rad * 0.34:.1f}" fill="none" '
                    f'stroke="{EMBER}" stroke-width="2" stroke-dasharray="6 5"/>'
                )
                s.append(rule(cx - rad * 0.7, cy - rad * 0.7, cx + rad * 0.7, cy + rad * 0.7, EMBER, 2.4, 0.95))
                s.append(box(cx - rad - 16, cy - rad - 16, rad * 2 + 32, rad * 2 + 32, EMBER, "none", 2))
            else:
                s.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rad:.1f}" fill="url(#dotsf)"/>')
                s.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rad:.1f}" fill="none" stroke="{fg}" stroke-width="2"/>')
                # Grooves.
                for k in (0.86, 0.72, 0.58):
                    s.append(
                        f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rad * k:.1f}" fill="none" '
                        f'stroke="{fg}" stroke-width="1" opacity="0.5"/>'
                    )
                s.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rad * 0.34:.1f}" fill="{INK}" stroke="{fg}" stroke-width="1.6"/>')
                s.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="3.2" fill="{fg}"/>')
            # A catalogue rule under each sleeve, as on a shelf label.
            s.append(rule(cx - rad, cy + rad + 20, cx - rad + rad * (1.1 + ((r * 5 + c) % 4) * 0.22), cy + rad + 20, fg, 3, 0.4))

    s.append(keyline(w, h, fg))
    return "".join(s)


def farewatch():
    """A fare that will not settle. Six route traces, a baseline band, and one
    fare that breaks below it — which is the alert, not a fixed threshold."""
    w, h = PROJECT
    fg = PARCHMENT
    s = [open_svg(w, h, INK, fg, "Engraving of six fare traces against a baseline band, one dropping below it")]

    L, R, T, B = 110, w - 90, 96, h - 110

    # Plate frame and grid.
    s.append(box(L, T, R - L, B - T, fg, "none", 2))
    for i in range(1, 8):
        y = T + (B - T) * i / 8
        s.append(rule(L, y, R, y, fg, 1, 0.18))
    for i in range(1, 12):
        x = L + (R - L) * i / 12
        s.append(rule(x, T, x, B, fg, 1, 0.14))
    # Tick marks, so it reads as a plate rather than a chart widget.
    for i in range(13):
        x = L + (R - L) * i / 12
        s.append(rule(x, B, x, B + 9, fg, 1.4, 0.6))

    # The baseline band: each route is judged against its own recent normal.
    s.append(f'<rect x="{L}" y="{T + (B - T) * 0.30:.1f}" width="{R - L}" height="{(B - T) * 0.26:.1f}" fill="url(#h45)" opacity="0.55"/>')
    s.append(rule(L, T + (B - T) * 0.30, R, T + (B - T) * 0.30, fg, 1.4, 0.7, dash="10 6"))
    s.append(rule(L, T + (B - T) * 0.56, R, T + (B - T) * 0.56, fg, 1.4, 0.7, dash="10 6"))

    # Six traces. Deterministic wobble so the file is reproducible.
    n = 84
    for k in range(6):
        pts = []
        for i in range(n + 1):
            t = i / n
            x = L + (R - L) * t
            base = 0.30 + 0.05 * k
            y = T + (B - T) * (
                base
                + 0.055 * math.sin(t * 7.3 + k * 1.9)
                + 0.030 * math.sin(t * 19.1 + k * 3.1)
                + 0.016 * math.sin(t * 41.7 + k)
            )
            pts.append(f"{x:.1f},{y:.1f}")
        s.append(f'<polyline points="{" ".join(pts)}" fill="none" stroke="{fg}" stroke-width="1.6" opacity="{0.42 + k * 0.07:.2f}"/>')

    # The one that broke its baseline, and the drop that fired the alert.
    pts = []
    for i in range(n + 1):
        t = i / n
        x = L + (R - L) * t
        y = T + (B - T) * (0.40 + 0.05 * math.sin(t * 8.1) + 0.02 * math.sin(t * 23.0))
        if t > 0.70:
            y += (B - T) * 0.40 * min(1.0, (t - 0.70) / 0.13)
        pts.append((x, y))
    s.append(
        f'<polyline points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in pts)}" fill="none" '
        f'stroke="{EMBER}" stroke-width="3.4"/>'
    )
    ex, ey = pts[-1]
    s.append(f'<circle cx="{ex:.1f}" cy="{ey:.1f}" r="9" fill="{EMBER}"/>')
    s.append(f'<circle cx="{ex:.1f}" cy="{ey:.1f}" r="19" fill="none" stroke="{EMBER}" stroke-width="2"/>')
    s.append(rule(ex, ey + 26, ex, B, EMBER, 2, 0.8, dash="6 5"))
    s.append(box(ex - 52, ey - 34, 104, 68, EMBER, "none", 2))

    s.append(keyline(w, h, fg))
    return "".join(s)


def firesight():
    """A Bronx tenement. A facade of windows on a fire-escape lattice, and one
    window flagged — top of a queue nobody was running."""
    w, h = PROJECT
    fg = PARCHMENT
    s = [open_svg(w, h, INK, fg, "Engraving of a tenement facade, one window flagged on the fire-escape lattice")]

    L, R, T = 176, w - 176, 54
    B = h - 46
    s.append(hatch_rect(L, T, R - L, B - T, "h45"))
    s.append(box(L, T, R - L, B - T, fg, "none", 2.6))

    cols, rows = 5, 4
    pad_x, pad_y = 44, 34
    cw = (R - L - pad_x * 2) / cols
    chh = (B - T - pad_y * 2) / rows
    marked = (1, 3)  # third window, second floor
    escape_col = 2   # the bay the fire escape runs up; no windows in it

    for r in range(rows):
        # Course line between storeys.
        y0 = T + pad_y + chh * r
        s.append(rule(L + 12, y0 - 12, R - 12, y0 - 12, fg, 1.4, 0.35))
        for c in range(cols):
            if c == escape_col:
                continue
            x = L + pad_x + cw * c + cw * 0.16
            y = y0 + chh * 0.12
            ww, wh = cw * 0.68, chh * 0.62
            if (r, c) == marked:
                s.append(flag(x, y, ww, wh))
                # Sash bars stay visible through the flag.
                s.append(rule(x + ww / 2, y, x + ww / 2, y + wh, INK, 2, 0.8))
                s.append(rule(x, y + wh * 0.46, x + ww, y + wh * 0.46, INK, 2.4, 0.9))
            else:
                s.append(box(x, y, ww, wh, fg, INK, 2))
                s.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{ww:.1f}" height="{wh * 0.46:.1f}" fill="url(#dotsf)" opacity="0.8"/>')
                s.append(rule(x + ww / 2, y, x + ww / 2, y + wh, fg, 1.2, 0.6))
                s.append(rule(x, y + wh * 0.46, x + ww, y + wh * 0.46, fg, 1.8, 0.85))
                # Lintel.
                s.append(rule(x - 6, y - 7, x + ww + 6, y - 7, fg, 2.2, 0.75))

    # Fire escape, in its own bay. It used to be drawn over the centre of the
    # window grid, where the stair runs crossed three windows and read as
    # scratches on the plate rather than as ironwork.
    ex0 = L + pad_x + cw * escape_col + cw * 0.06
    ex1 = ex0 + cw * 0.88
    # An ink panel behind the bay. The facade hatch runs under the whole
    # elevation, and the ironwork drawn straight onto it read as texture.
    s.append(f'<rect x="{ex0 - 14:.1f}" y="{T + 6:.1f}" width="{ex1 - ex0 + 28:.1f}" height="{B - T - 12:.1f}" fill="{INK}"/>')
    s.append(rule(ex0, T + 14, ex0, B - 10, fg, 2.4, 0.7))
    s.append(rule(ex1, T + 14, ex1, B - 10, fg, 2.4, 0.7))
    for r in range(rows):
        y = T + pad_y + chh * (r + 0.92)
        # A landing, its railing, and the balusters under it.
        s.append(rule(ex0 - 8, y, ex1 + 8, y, fg, 3, 0.9))
        s.append(rule(ex0 - 8, y - 26, ex1 + 8, y - 26, fg, 1.8, 0.7))
        nb = 11
        for i in range(nb):
            lx = ex0 + (ex1 - ex0) * (i / (nb - 1))
            s.append(rule(lx, y - 26, lx, y, fg, 1.1, 0.5))
        # One stair run down to the next landing, with its treads. A second
        # parallel stringer and a doorway box read as loose geometry floating
        # in the bay rather than as ironwork, so the run carries it alone.
        if r < rows - 1:
            y2 = T + pad_y + chh * (r + 1.92)
            sx0, sy0 = ex0 + 12, y + 6
            sx1, sy1 = ex1 - 12, y2 - 28
            s.append(rule(sx0, sy0, sx1, sy1, fg, 2.4, 0.65))
            for i in range(1, 7):
                t = i / 7
                tx_ = sx0 + (sx1 - sx0) * t
                ty_ = sy0 + (sy1 - sy0) * t
                s.append(rule(tx_ - 7, ty_ - 4, tx_ + 7, ty_ + 4, fg, 1.2, 0.4))

    # Street and kerb, so the building stands on something.
    s.append(rule(40, B + 1, w - 40, B + 1, fg, 3, 0.9))
    s.append(hatch_rect(40, B + 4, w - 80, 22, "h45f"))

    s.append(keyline(w, h, fg))
    return "".join(s)


# --------------------------------------------------------------------------
# The four back-page slots — ink line on bone, 3:2.
# --------------------------------------------------------------------------
def marquee():
    """A cinema marquee. Bulbs around a blank bill, one ember."""
    w, h = BACKPAGE
    fg = INK
    s = [open_svg(w, h, BONE, fg, "Engraving of a cinema marquee, one bulb lit in ember")]

    # The marquee wedge, in elevation.
    s.append(f'<path d="M70 {h * 0.30:.0f} L{w - 70} {h * 0.30:.0f} L{w - 120} {h * 0.74:.0f} L120 {h * 0.74:.0f} Z" fill="none" stroke="{fg}" stroke-width="2.6"/>')
    s.append(f'<path d="M104 {h * 0.37:.0f} L{w - 104} {h * 0.37:.0f} L{w - 142} {h * 0.67:.0f} L142 {h * 0.67:.0f} Z" fill="url(#dots)" stroke="{fg}" stroke-width="1.6"/>')

    # Three blank bill lines — a marquee with no film named on it.
    for i, k in enumerate((0.44, 0.52, 0.60)):
        inset = 170 + i * 16
        s.append(rule(inset, h * k, w - inset, h * k, fg, 7 - i * 1.6, 0.5))

    # Bulbs around the lower edge. One is ember, and it is the only one filled.
    n = 17
    for i in range(n):
        t = (i + 0.5) / n
        x = 120 + (w - 240) * t
        y = h * 0.74 + 16
        if i == 5:
            s.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="7.5" fill="{EMBER}"/>')
            s.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="15" fill="none" stroke="{EMBER}" stroke-width="2"/>')
        else:
            s.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="7" fill="none" stroke="{fg}" stroke-width="1.8"/>')
    # And a run up each raker.
    for side in (0, 1):
        for i in range(5):
            t = (i + 0.5) / 5
            x = (70 + (120 - 70) * t) if side == 0 else (w - 70 - (120 - 70) * t)
            y = h * 0.30 + (h * 0.74 - h * 0.30) * t
            s.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="6" fill="none" stroke="{fg}" stroke-width="1.6"/>')

    # The building above: a hatched storey with sash windows in it, not the
    # blank slab the first pass left sitting across the top third.
    bh_ = h * 0.30 - 46
    s.append(hatch_rect(70, 40, w - 140, bh_, "h45"))
    s.append(box(70, 40, w - 140, bh_, fg, "none", 2))
    for i in range(6):
        wx = 70 + (w - 140) * (i + 0.5) / 6 - 26
        s.append(box(wx, 40 + bh_ * 0.24, 52, bh_ * 0.5, fg, BONE, 1.8))
        s.append(rule(wx + 26, 40 + bh_ * 0.24, wx + 26, 40 + bh_ * 0.74, fg, 1.1, 0.6))
        s.append(rule(wx, 40 + bh_ * 0.49, wx + 52, 40 + bh_ * 0.49, fg, 1.6, 0.8))
    s.append(rule(70, 40 + bh_, w - 70, 40 + bh_, fg, 2.6, 0.9))
    s.append(rule(40, h - 58, w - 40, h - 58, fg, 3, 0.9))
    s.append(hatch_rect(40, h - 55, w - 80, 18, "h45f"))

    s.append(keyline(w, h, fg, 14))
    return "".join(s)


def ticket():
    """A ticket stub, torn along its perforation. The serial is ember: the one
    score that disagrees with everyone else's."""
    w, h = BACKPAGE
    fg = INK
    s = [open_svg(w, h, BONE, fg, "Engraving of a torn ticket stub with an ember serial number")]

    tx, ty, tw, th = 90, h * 0.24, w - 180, h * 0.46
    perf = tx + tw * 0.66

    # The stub, with a ragged tear where the perforation ran.
    tear = [f"M{perf:.1f} {ty:.1f}"]
    steps = 15
    for i in range(1, steps + 1):
        yy = ty + th * i / steps
        dx = 9 if i % 2 else -9
        tear.append(f"L{perf + dx:.1f} {yy:.1f}")
    s.append(f'<path d="M{tx} {ty} L{perf:.1f} {ty:.1f} {" ".join(tear[1:])} L{tx} {ty + th:.1f} Z" fill="url(#dotsf)" stroke="{fg}" stroke-width="2.4"/>')
    # The counterfoil, kept. The tear runs top-to-bottom, so the rectangle has
    # to close bottom-right then top-right: closing top-right first drew a
    # diagonal straight back across the stub.
    s.append(
        f'<path d="{" ".join(tear)} L{tx + tw:.1f} {ty + th:.1f} '
        f'L{tx + tw:.1f} {ty:.1f} Z" fill="none" stroke="{fg}" stroke-width="2.4"/>'
    )

    # Printed matter on the stub: a row of rules and a small ruled box.
    for i, k in enumerate((0.22, 0.36, 0.50)):
        s.append(rule(tx + 34, ty + th * k, tx + 34 + (tw * 0.44) * (1 - i * 0.22), ty + th * k, fg, 6 - i * 1.4, 0.55))
    s.append(box(tx + 34, ty + th * 0.64, 120, 40, fg, "url(#h45)", 1.8))

    # The serial, set as five figure blocks. The last is ember.
    for i in range(5):
        bx = perf + 34 + i * 40
        if i == 4:
            s.append(f'<rect x="{bx:.1f}" y="{ty + th * 0.30:.1f}" width="28" height="40" fill="{EMBER}"/>')
            s.append(f'<rect x="{bx - 5:.1f}" y="{ty + th * 0.30 - 5:.1f}" width="38" height="50" fill="none" stroke="{EMBER}" stroke-width="2"/>')
        else:
            s.append(box(bx, ty + th * 0.30, 28, 40, fg, "none", 1.8, 0.8))
    s.append(rule(perf + 34, ty + th * 0.74, perf + 34 + 190, ty + th * 0.74, fg, 5, 0.45))

    # Two punch holes, and a rule under the whole thing like a paste-up.
    for cy in (ty + 14, ty + th - 14):
        s.append(f'<circle cx="{tx + tw - 26:.1f}" cy="{cy:.1f}" r="7" fill="{BONE}" stroke="{fg}" stroke-width="1.8"/>')
    s.append(rule(70, ty + th + 54, w - 70, ty + th + 54, fg, 1.4, 0.4))

    s.append(keyline(w, h, fg, 14))
    return "".join(s)


def chessboard():
    """A board, move four. The London: d4, Bf4, and Black's reply. The ember
    square is the one that was worked out at the board rather than learned."""
    w, h = BACKPAGE
    fg = INK
    s = [open_svg(w, h, BONE, fg, "Engraving of a chessboard four moves in, one square marked in ember")]

    n = 8
    # 0.088 put a 420px board in the middle of a 900x600 plate and left the
    # pieces too small to tell apart at card size. The board is the subject, so
    # it takes the plate.
    sq = min(w, h) * 0.108
    ox, oy = (w - sq * n) / 2, (h - sq * n) / 2 + 4

    for r in range(n):
        for c in range(n):
            x, y = ox + c * sq, oy + r * sq
            if (r + c) % 2:
                # h45f over a dot screen: a single 7px hatch washed out to
                # nothing once the board was reproduced at card width.
                s.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{sq:.1f}" height="{sq:.1f}" fill="url(#dotsf)"/>')
                s.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{sq:.1f}" height="{sq:.1f}" fill="url(#h45f)"/>')
    s.append(box(ox, oy, sq * n, sq * n, fg, "none", 2.6))
    s.append(box(ox - 12, oy - 12, sq * n + 24, sq * n + 24, fg, "none", 1.4, 0.6))

    # File and rank ticks outside the frame, the way a diagram is labelled.
    for i in range(n):
        s.append(rule(ox + sq * (i + 0.5), oy + sq * n + 16, ox + sq * (i + 0.5), oy + sq * n + 24, fg, 1.6, 0.6))
        s.append(rule(ox - 24, oy + sq * (i + 0.5), ox - 16, oy + sq * (i + 0.5), fg, 1.6, 0.6))

    def cell(file_, rank):
        """Algebraic to canvas centre. Rank 1 at the bottom, White below."""
        return ox + sq * (file_ + 0.5), oy + sq * (7 - rank + 0.5)

    def pawn(fx, rk, black=False):
        cx, cy = cell(fx, rk)
        col = fg
        f_ = "url(#h45f)" if black else BONE
        s.append(f'<circle cx="{cx:.1f}" cy="{cy - sq * 0.10:.1f}" r="{sq * 0.17:.1f}" fill="{f_}" stroke="{col}" stroke-width="2.8"/>')
        s.append(f'<path d="M{cx - sq * 0.22:.1f} {cy + sq * 0.24:.1f} Q{cx:.1f} {cy - sq * 0.02:.1f} {cx + sq * 0.22:.1f} {cy + sq * 0.24:.1f} Z" fill="{f_}" stroke="{col}" stroke-width="2.8"/>')

    def bishop(fx, rk, black=False):
        cx, cy = cell(fx, rk)
        f_ = "url(#h45f)" if black else BONE
        s.append(f'<path d="M{cx:.1f} {cy - sq * 0.30:.1f} Q{cx + sq * 0.22:.1f} {cy:.1f} {cx:.1f} {cy + sq * 0.26:.1f} Q{cx - sq * 0.22:.1f} {cy:.1f} {cx:.1f} {cy - sq * 0.30:.1f} Z" fill="{f_}" stroke="{fg}" stroke-width="2.8"/>')
        s.append(rule(cx - sq * 0.26, cy + sq * 0.30, cx + sq * 0.26, cy + sq * 0.30, fg, 2.4))

    def knight(fx, rk, black=False):
        cx, cy = cell(fx, rk)
        f_ = "url(#h45f)" if black else BONE
        s.append(
            f'<path d="M{cx - sq * 0.20:.1f} {cy + sq * 0.28:.1f} '
            f'L{cx - sq * 0.14:.1f} {cy - sq * 0.06:.1f} '
            f'Q{cx - sq * 0.04:.1f} {cy - sq * 0.32:.1f} {cx + sq * 0.20:.1f} {cy - sq * 0.22:.1f} '
            f'L{cx + sq * 0.10:.1f} {cy - sq * 0.02:.1f} '
            f'L{cx + sq * 0.22:.1f} {cy + sq * 0.28:.1f} Z" fill="{f_}" stroke="{fg}" stroke-width="2.8"/>'
        )

    # White: d4 and Bf4 played, the rest of the pawns home. Black: d5, Nf6.
    for f in range(8):
        if f != 3:
            pawn(f, 2)
        if f != 3:
            pawn(f, 7, black=True)
    pawn(3, 4)              # d4
    pawn(3, 5, black=True)  # d5
    bishop(5, 4)            # Bf4
    knight(5, 6, black=True)  # Nf6

    # The marked square is f4 — the bishop's post, and the last move anybody
    # in this game had a book for.
    mx, my = cell(5, 4)
    s.append(box(mx - sq / 2, my - sq / 2, sq, sq, EMBER, "none", 3))
    s.append(f'<circle cx="{mx:.1f}" cy="{my:.1f}" r="{sq * 0.06:.1f}" fill="{EMBER}"/>')

    s.append(keyline(w, h, fg, 14))
    return "".join(s)


def departures():
    """A departure board. Split-flap rows, one ember — the fare that dropped
    far enough below its own baseline to be worth taking."""
    w, h = BACKPAGE
    fg = INK
    s = [open_svg(w, h, BONE, fg, "Engraving of a split-flap departure board with one row picked out in ember")]

    L, R, T = 64, w - 64, 62
    B = h - 62
    s.append(box(L, T, R - L, B - T, fg, "none", 2.6))
    s.append(rule(L, T + 46, R, T + 46, fg, 2, 0.8))

    # The header: four column heads, as blocks rather than lettering.
    heads = (0.06, 0.34, 0.58, 0.80)
    widths = (0.20, 0.18, 0.14, 0.12)
    for k, ww in zip(heads, widths):
        s.append(rule(L + (R - L) * k, T + 30, L + (R - L) * (k + ww), T + 30, fg, 6, 0.75))

    rows = 7
    rh = (B - T - 60) / rows
    marked = 2
    for i in range(rows):
        y = T + 52 + rh * i
        # The flap seam across every row is what makes it a split-flap board.
        s.append(rule(L + 6, y + rh * 0.52, R - 6, y + rh * 0.52, fg, 1, 0.3))
        if i == marked:
            s.append(f'<rect x="{L + 4:.1f}" y="{y + 3:.1f}" width="{R - L - 8:.1f}" height="{rh - 8:.1f}" fill="{EMBER}"/>')
            col, op = BONE, 1.0
        else:
            col, op = fg, 0.62
        for k, ww in zip(heads, widths):
            # Deterministic variation, so no two rows read as the same entry.
            f = 0.55 + ((i * 7 + int(k * 100)) % 5) * 0.09
            s.append(rule(L + (R - L) * k, y + rh * 0.42, L + (R - L) * (k + ww * f), y + rh * 0.42, col, 7, op))
        if i == marked:
            s.append(f'<rect x="{L - 1:.1f}" y="{y:.1f}" width="{R - L + 2:.1f}" height="{rh - 2:.1f}" fill="none" stroke="{EMBER}" stroke-width="2.4"/>')
        if i != rows - 1:
            s.append(rule(L, y + rh, R, y + rh, fg, 1, 0.22))

    # The case: a hatched housing and two mounting arms above.
    s.append(hatch_rect(L - 18, T - 22, R - L + 36, 22, "h45f"))
    s.append(box(L - 18, T - 22, R - L + 36, 22, fg, "none", 2))
    for x in (w * 0.3, w * 0.7):
        s.append(rule(x, 22, x, T - 22, fg, 2.6, 0.7))
    s.append(hatch_rect(L - 18, B, R - L + 36, 16, "h45f"))
    s.append(box(L - 18, B, R - L + 36, 16, fg, "none", 2))

    s.append(keyline(w, h, fg, 14))
    return "".join(s)


DRAWINGS = {
    "foreman": foreman,
    "interface-cua": interface_cua,
    "raivana": raivana,
    "vibecheck": vibecheck,
    "farewatch": farewatch,
    "firesight": firesight,
    "marquee": marquee,
    "ticket": ticket,
    "chessboard": chessboard,
    "departures": departures,
}

if __name__ == "__main__":
    print(f"Drawing {len(DRAWINGS)} plates into {OUT.relative_to(OUT.parent.parent)}/")
    for name, fn in DRAWINGS.items():
        write(name, fn())
    total = sum(os.path.getsize(OUT / f"{n}.svg") for n in DRAWINGS)
    print(f"{total / 1024:.1f} KB total")
