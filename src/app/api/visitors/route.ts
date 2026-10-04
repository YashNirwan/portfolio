/* One number in Redis: how many browsers have opened this site.

   The client decides whether it is new (it keeps its own visitor number in
   localStorage), so this route stores nothing about anyone: no IP, no cookie,
   no user agent. POST counts a new visitor and returns their number; GET
   returns the total.

   Storage is Upstash Redis from the Vercel Marketplace, spoken to over its REST
   API so the site takes on no dependency. Until that integration is connected
   the env vars are missing, the route answers `null`, and the footer line
   simply does not render. */

const KEY = "portfolio:visitors";
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|lighthouse|headless/i;

export const dynamic = "force-dynamic";

function redis() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return async (...cmd: string[]): Promise<number | null> => {
    const res = await fetch(`${url}/${cmd.map(encodeURIComponent).join("/")}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const { result } = (await res.json()) as { result: string | number | null };
    return result === null ? 0 : Number(result);
  };
}

export async function GET() {
  const run = redis();
  const total = run ? await run("get", KEY).catch(() => null) : null;
  return Response.json({ total });
}

export async function POST(req: Request) {
  const run = redis();
  if (!run) return Response.json({ you: null, total: null });
  // Link previews and crawlers are not visitors; give them the total, count nothing.
  if (BOT.test(req.headers.get("user-agent") ?? "")) {
    const total = await run("get", KEY).catch(() => null);
    return Response.json({ you: null, total });
  }
  const you = await run("incr", KEY).catch(() => null);
  return Response.json({ you, total: you });
}
