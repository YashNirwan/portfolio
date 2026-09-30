"""Redraws public/farewatch.svg from farewatch's own observations.

The source database lives outside this repo at ~/Projects/farewatch and is
~19 MB of scraped fares, so it is not committed and is not present on CI or
in a cloud session. What is committed is the derived slice this chart
actually plots — six routes, the cheapest fare seen in each three-hour
bucket — which is 37 KB and reproduces the figure exactly.

So: run it where the database exists and it refreshes both the extract and
the SVG. Run it anywhere else and it redraws from the extract.
"""
import sqlite3, datetime, json, os

DB = os.path.expanduser("~/Projects/farewatch/farewatch.db")
EXTRACT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "farewatch-series.json")

if os.path.exists(DB):
    con = sqlite3.connect(f"file:{DB}?mode=ro", uri=True); cur = con.cursor()
    routes = [r[0] for r in cur.execute(
      "SELECT origin||'-'||dest FROM observations GROUP BY origin,dest ORDER BY COUNT(*) DESC LIMIT 6")]

    series = {}
    for r in routes:
        o, d = r.split("-")
        rows = cur.execute("""
          SELECT strftime('%s', observed_at)/10800*10800 AS b, MIN(price)
          FROM observations WHERE origin=? AND dest=? GROUP BY b ORDER BY b""", (o, d)).fetchall()
        if len(rows) > 12: series[r] = [[int(t), round(p, 2)] for t, p in rows]

    with open(EXTRACT, "w") as f:
        json.dump(series, f, separators=(",", ":"))
    print(f"read {DB} and refreshed {os.path.basename(EXTRACT)}")
else:
    with open(EXTRACT) as f:
        series = json.load(f)
    print(f"no local database; redrawing from {os.path.basename(EXTRACT)}")

allpts = [p for s in series.values() for _, p in s]
allt   = [t for s in series.values() for t, _ in s]
t0, t1 = min(allt), max(allt)
p0, p1 = min(allpts), max(allpts)

W, H = 2400, 900
PAD_X, PAD_T, PAD_B = 0, 60, 60
def x(t): return PAD_X + (t - t0) / (t1 - t0) * (W - 2*PAD_X)
def y(p): return PAD_T + (1 - (p - p0) / (p1 - p0)) * (H - PAD_T - PAD_B)

BONE, TURMERIC = "#EFE9DE", "#E0A82E"
# The cheapest route overall gets the hot colour; everything else recedes.
cheapest = min(series, key=lambda r: min(p for _, p in series[r]))

paths = []
for r, s in series.items():
    d = "M" + " L".join(f"{x(t):.1f},{y(p):.1f}" for t, p in s)
    hot = r == cheapest
    paths.append(
      f'<path d="{d}" fill="none" stroke="{TURMERIC if hot else BONE}" '
      f'stroke-width="{3.0 if hot else 1.5}" stroke-opacity="{1 if hot else 0.52}" '
      f'stroke-linejoin="round" stroke-linecap="round"/>')

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="Minimum observed fare over time across six routes out of New York">
<g>{"".join(paths)}</g>
</svg>'''

# Relative to this file, not to $HOME: the repo is not at ~/Projects/portfolio
# on CI or in a cloud session.
out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "public", "farewatch.svg")
open(out, "w").write(svg)
span = (datetime.datetime.fromtimestamp(t1) - datetime.datetime.fromtimestamp(t0)).days
print(f"routes plotted: {list(series)}")
print(f"cheapest (hot line): {cheapest}")
print(f"price range: ${p0:.0f}-${p1:.0f} | span: {span} days | bytes: {os.path.getsize(out)}")
