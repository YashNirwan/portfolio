import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.25em] text-accent">Error 404</p>
      <h1 className="mt-6 font-display text-6xl font-semibold tracking-tight text-text sm:text-8xl">
        Shipped to the
        <br />
        wrong environment.
      </h1>
      <p className="mt-6 max-w-md text-lg text-text-dim">
        This page doesn&rsquo;t exist, or it&rsquo;s still in my backlog. Either way, the work is
        back home.
      </p>
      <Link
        href="/"
        className="mt-9 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
        style={{ backgroundColor: "var(--color-accent)" }}
      >
        <ArrowLeft className="size-4" />
        Back to the portfolio
      </Link>
    </main>
  );
}
