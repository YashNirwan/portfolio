import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="field bg-indigo">
      <div className="hold">
        <Link href="/" className="trim uppercase text-bone/70 no-underline">
          ← Yash Nirwan
        </Link>

        <h1
          className="display mt-10 text-bone"
          style={{ fontSize: "var(--text-field)", lineHeight: "var(--leading-field)" }}
        >
          Nothing here.
        </h1>

        <p className="pretty mt-6 max-w-[32rem] text-bone/80">
          The link was probably mine. Everything that exists is on{" "}
          <Link href="/">the front page</Link> — there is no hidden section.
        </p>
      </div>
    </main>
  );
}
