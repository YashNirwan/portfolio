"""The farewatch figure: one small panel per route, drawn to be read.

The first version drew six routes as overlapping lines on one shared scale,
with no axes. One spike set that scale, which squashed every other line into
a band a few pixels tall, and there was nothing to say what a line was worth.
This version fixes what made that unreadable:

  - small multiples: one route per panel, so no line hides behind another
  - each panel has its own scale, clipped at the 98th percentile; anything
    above is pinned to the top edge with its value written beside it
  - a labelled dollar axis, a time axis, and the route's median drawn in
  - the alert threshold from farewatch's anomaly.py (0.6 x median), with
    every window that fell below it marked in ember

Two sources:

  python3 scripts/farewatch-plot.py
      reads ~/Projects/farewatch/farewatch.db (the owner's laptop; the
      database is not in any repo). Real route names, dates and dollars.

  python3 scripts/farewatch-plot.py --from-svg scripts/data/farewatch-legacy.svg
      rebuilds from the first version's SVG, the only copy of the data
      outside that laptop. Its y values are whole dollars on a $684 range
      (checked: every y difference is a multiple of 780/684 px to within
      0.05 px), and each x step is one three-hour window. So differences in
      dollars and elapsed days come back exactly. Absolute prices, route
      names and calendar dates do not, so this version plots dollars
      relative to each route's median and cannot draw the 0.6x threshold.
"""
import os, re, sqlite3, statistics, sys, datetime

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "farewatch.svg")
BUCKET = 10800  # three hours
INK, EMBER = "#1d1d1b", "#c03f13"
FONT = "Georgia, 'Times New Roman', serif"


# ---------------------------------------------------------------- sources --
def from_db():
    db = os.path.expanduser("~/Projects/farewatch/farewatch.db")
    cur = sqlite3.connect(db).cursor()
    routes = cur.execute(
        "SELECT origin, dest FROM observations GROUP BY origin, dest "
        "ORDER BY COUNT(*) DESC LIMIT 6").fetchall()
    out = []
    for o, d in routes:
        rows = cur.execute(
            "SELECT CAST(strftime('%s', observed_at) AS INTEGER) / ? * ? AS b, MIN(price) "
            "FROM observations WHERE origin = ? AND dest = ? GROUP BY b ORDER BY b",
            (BUCKET, BUCKET, o, d)).fetchall()
        if len(rows) > 12:
            out.append({"name": f"{o} → {d}", "pts": [(t, float(p)) for t, p in rows]})
    return out, True


def from_svg(path):
    src = open(path).read()
    W, PAD, RANGE = 2400, 60, 684.0  # the first version's geometry
    per_px = RANGE / (900 - 2 * PAD)
    out = []
    for i, m in enumerate(re.finditer(r'<path d="([^"]+)"', src)):
        pts = []
        for xs, ys in re.findall(r"([\d.]+),([\d.]+)", m.group(1)):
            t = round(float(xs) / 4.5) * BUCKET  # 4.5 px per window
            p = round((900 - PAD - float(ys)) * per_px)  # dollars above the all-route low
            pts.append((t, float(p)))
        out.append({"name": f"Route {i + 1}", "pts": pts})
    return out, False


# ----------------------------------------------------------------- render --
W = 960
COLS, GAP_X, GAP_Y = 2, 48, 44
LEFT, RIGHT, TOP, PH = 84, 16, 58, 210  # axis gutter, right margin, title band, plot height
PW = (W - GAP_X) // COLS - LEFT - RIGHT
FS = 21  # ~12.5px in the 568px reading column at 1440


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;")


def nice_step(span):
    for s in (5, 10, 20, 25, 50, 100, 200, 250, 500):
        if span / s <= 4:
            return s
    return 1000


def panel(route, t0, t1, absolute, ox, oy):
    pts = route["pts"]
    prices = [p for _, p in pts]
    med = statistics.median(prices)
    thresh = 0.6 * med if absolute else None
    # Relative mode: every value becomes dollars against the route's median.
    val = (lambda p: p) if absolute else (lambda p: p - med)
    vs = sorted(val(p) for p in prices)
    lo = min(vs[0], val(thresh) if thresh else vs[0])
    hi = vs[int(0.98 * (len(vs) - 1))]
    pad = (hi - lo) * 0.08 or 10
    lo, hi = lo - pad, hi + pad

    def X(t):
        return ox + LEFT + (t - t0) / (t1 - t0) * PW

    def Y(v):
        return oy + TOP + (1 - (min(v, hi) - lo) / (hi - lo)) * PH

    g = []
    hot = route.get("hot")
    low_v = min(val(p) for p in prices)
    title = route["name"] + ("  ·  lowest fare seen" if hot else "")
    g.append(f'<text x="{ox + LEFT}" y="{oy + 30}" font-size="{FS + 4}" font-weight="bold">{esc(title)}</text>')

    # Gridlines and dollar ticks, recessive.
    step = nice_step(hi - lo)
    v = step * (int(lo // step) + 1)
    while v < hi:
        y = Y(v)
        sign = "+" if v > 0 else "−"
        label = f"${v:,.0f}" if absolute else ("median" if v == 0 else f"{sign}${abs(v):,.0f}")
        g.append(f'<line x1="{ox + LEFT}" x2="{ox + LEFT + PW}" y1="{y:.1f}" y2="{y:.1f}" stroke="{INK}" stroke-opacity="0.12" stroke-width="1"/>')
        g.append(f'<text x="{ox + LEFT - 10}" y="{y + 7:.1f}" text-anchor="end" fill-opacity="0.7">{label}</text>')
        v += step

    # The median, and in absolute mode the alert threshold beneath it.
    ym = Y(val(med))
    g.append(f'<line x1="{ox + LEFT}" x2="{ox + LEFT + PW}" y1="{ym:.1f}" y2="{ym:.1f}" stroke="{INK}" stroke-width="1.5" stroke-dasharray="6 5"/>')
    if absolute:
        g.append(f'<text x="{ox + LEFT + PW}" y="{ym - 8:.1f}" text-anchor="end" fill-opacity="0.7">median ${med:,.0f}</text>')
        yt = Y(thresh)
        g.append(f'<rect x="{ox + LEFT}" y="{yt:.1f}" width="{PW}" height="{oy + TOP + PH - yt:.1f}" fill="{EMBER}" fill-opacity="0.08"/>')
        g.append(f'<text x="{ox + LEFT + PW}" y="{yt + FS + 2:.1f}" text-anchor="end" fill-opacity="0.7">alert below ${thresh:,.0f}</text>')

    # The line, broken wherever there are no observations for 12+ hours.
    segs, cur = [], []
    for i, (t, p) in enumerate(pts):
        if cur and t - pts[i - 1][0] > 4 * BUCKET:
            segs.append(cur); cur = []
        cur.append((t, p))
    segs.append(cur)
    for s in segs:
        if len(s) < 2:
            continue
        d = "M" + " L".join(f"{X(t):.1f},{Y(val(p)):.1f}" for t, p in s)
        g.append(f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="1.75" stroke-linejoin="round" stroke-linecap="round"/>')

    # Spikes that leave the scale: a tick on the top edge and the value.
    over = [(t, val(p)) for t, p in pts if val(p) > hi]
    for t, v in sorted(over, key=lambda q: -q[1])[:1]:
        x = X(t)
        lab = (f"${v:,.0f}" if absolute else f"+${v:,.0f}") + " off scale"
        end = x > ox + LEFT + PW * 0.6
        g.append(f'<path d="M{x - 7:.1f},{oy + TOP + 9} L{x:.1f},{oy + TOP} L{x + 7:.1f},{oy + TOP + 9}" fill="none" stroke="{INK}" stroke-width="2"/>')
        g.append(f'<text x="{x + (-12 if end else 12):.1f}" y="{oy + TOP + 14}" text-anchor="{"end" if end else "start"}" paint-order="stroke" stroke="#efe9de" stroke-width="6" stroke-linejoin="round">{lab}</text>')

    # Windows under the alert threshold, or in relative mode the route's low.
    marks = [(t, val(p)) for t, p in pts if absolute and p <= thresh]
    if not absolute:
        marks = [min(((t, val(p)) for t, p in pts), key=lambda q: q[1])]
    for t, v in marks:
        g.append(f'<circle cx="{X(t):.1f}" cy="{Y(v):.1f}" r="5" fill="{EMBER}" stroke="#efe9de" stroke-width="2"/>')
    t_low = min(pts, key=lambda q: q[1])[0]
    xl, yl = X(t_low), Y(low_v)
    lab = f"${low_v:,.0f}" if absolute else f"−${abs(low_v):,.0f}"
    anchor = "end" if xl > ox + LEFT + PW * 0.7 else "start"
    dx = -12 if anchor == "end" else 12
    g.append(f'<text x="{xl + dx:.1f}" y="{yl + 7:.1f}" text-anchor="{anchor}" font-weight="bold" paint-order="stroke" stroke="#efe9de" stroke-width="6" stroke-linejoin="round">{lab}</text>')

    # Time axis.
    yb = oy + TOP + PH
    g.append(f'<line x1="{ox + LEFT}" x2="{ox + LEFT + PW}" y1="{yb}" y2="{yb}" stroke="{INK}" stroke-width="1.5"/>')
    days = (t1 - t0) / 86400
    dstep = 14 if days <= 100 else 30
    d = 0
    while d <= days:
        x = X(t0 + d * 86400)
        if absolute:
            lab = datetime.datetime.utcfromtimestamp(t0 + d * 86400).strftime("%b %-d")
        else:
            lab = f"day {d}"
        g.append(f'<line x1="{x:.1f}" x2="{x:.1f}" y1="{yb}" y2="{yb + 7}" stroke="{INK}" stroke-width="1.5"/>')
        g.append(f'<text x="{x:.1f}" y="{yb + 7 + FS}" text-anchor="middle" fill-opacity="0.7">{lab}</text>')
        d += dstep
    return "".join(g)


def render(routes, absolute):
    allt = [t for r in routes for t, _ in r["pts"]]
    t0, t1 = min(allt), max(allt)
    cheapest = min(routes, key=lambda r: min(p for _, p in r["pts"]))
    cheapest["hot"] = True
    rows = (len(routes) + COLS - 1) // COLS
    cell_h = TOP + PH + 7 + FS + 10
    H = rows * cell_h + (rows - 1) * GAP_Y
    cw = (W - GAP_X) // COLS
    body = "".join(
        panel(r, t0, t1, absolute, (i % COLS) * (cw + GAP_X), (i // COLS) * (cell_h + GAP_Y))
        for i, r in enumerate(routes))
    what = "cheapest fare in each three-hour window" + ("" if absolute else ", in dollars against the route's median")
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
        f'role="img" aria-label="farewatch: {esc(what)}, one panel for each of its {len(routes)} most-watched routes">'
        f'<g font-family="{FONT}" font-size="{FS}" fill="{INK}" style="font-variant-numeric: tabular-nums">{body}</g></svg>'
    ), (W, H)


if __name__ == "__main__":
    if "--from-svg" in sys.argv:
        routes, absolute = from_svg(sys.argv[sys.argv.index("--from-svg") + 1])
    else:
        routes, absolute = from_db()
    svg, (w, h) = render(routes, absolute)
    open(OUT, "w").write(svg)
    print(f"wrote {os.path.normpath(OUT)}  {w}x{h}  {len(svg):,} bytes")
    print("update the figure's w/h in src/lib/data.ts if they changed")
