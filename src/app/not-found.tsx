import Link from "next/link";
import { Spread, Note } from "@/components/spread";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[72rem] px-5 pb-32 sm:px-8">
      <header className="border-b border-ink py-4">
        <Link
          href="/"
          className="font-util uppercase no-underline"
          style={{ fontSize: "var(--text-label)", letterSpacing: "var(--tracking-label)" }}
        >
          ← Yash Nirwan
        </Link>
      </header>

      <main id="main" className="pt-[18vh]">
        <Spread
          note={
            <Note body="Everything that exists is linked from the homepage. There is no hidden section." />
          }
        >
          <h1
            className="balance font-display font-normal"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
              lineHeight: "1.02",
              letterSpacing: "var(--tracking-display)",
            }}
          >
            This page isn&rsquo;t in the record.
          </h1>
          <p className="mt-6">
            <Link href="/">Back to the beginning</Link>
          </p>
        </Spread>
      </main>
    </div>
  );
}
