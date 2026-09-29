import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="sheet py-24 md:py-36">
      <h1 className="headline max-w-[14ch] text-balance">Nothing here.</h1>
      <p className="pretty mt-6 max-w-[46ch] leading-[1.36]">
        The link was probably mine. Everything that exists is on{" "}
        <Link href="/">the front page</Link> — there is no hidden section.
      </p>
    </main>
  );
}
