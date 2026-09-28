import sqlite3, datetime, os
DB = os.path.expanduser("~/Projects/farewatch/farewatch.db")
con = sqlite3.connect(DB); cur = con.cursor()

routes = [r[0] for r in cur.execute(
  "SELECT origin||'-'||dest FROM observations GROUP BY origin,dest ORDER BY COUNT(*) DESC LIMIT 6")]

series = {}
for r in routes:
    o, d = r.split("-")
    rows = cur.execute("""
      SELECT strftime('%s', observed_at)/10800*10800 AS b, MIN(price)
      FROM observations WHERE origin=? AND dest=? GROUP BY b ORDER BY b""", (o, d)).fetchall()
    if len(rows) > 12: series[r] = rows

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
      f'stroke-width="{2.4 if hot else 1.1}" stroke-opacity="{1 if hot else 0.34}" '
      f'stroke-linejoin="round" stroke-linecap="round"/>')

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="Minimum observed fare over time across six routes out of New York">
<g>{"".join(paths)}</g>
</svg>'''

out = os.path.expanduser("~/Projects/portfolio/public/farewatch.svg")
open(out, "w").write(svg)
span = (datetime.datetime.fromtimestamp(t1) - datetime.datetime.fromtimestamp(t0)).days
print(f"routes plotted: {list(series)}")
print(f"cheapest (hot line): {cheapest}")
print(f"price range: ${p0:.0f}-${p1:.0f} | span: {span} days | bytes: {os.path.getsize(out)}")
