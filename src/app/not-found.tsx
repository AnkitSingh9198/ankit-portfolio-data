import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="tech-grid relative grid min-h-[100svh] place-items-center overflow-hidden px-6">
      <div className="max-w-3xl text-center">
        <p className="label-mono text-lime">Error 404 · route not found</p>
        <h1 className="display-xl mt-6">
          Lost in the <span className="serif-accent font-normal text-lime">stack.</span>
        </h1>
        <p className="mx-auto mt-8 max-w-[44ch] text-lg text-paper/70">
          This request didn&apos;t match any route. Let&apos;s send you back to somewhere that responds with a 200.
        </p>
        <pre className="label-mono mx-auto mt-10 w-fit rounded-xl border border-line bg-ink-2 px-5 py-3 text-left normal-case tracking-normal text-dim">
          GET /this-page → <span className="text-[#ff8a7a]">404</span>
          {"\n"}GET / → <span className="text-lime">200 OK</span>
        </pre>
        <Link
          href="/"
          className="mt-10 inline-flex min-h-12 items-center rounded-full bg-lime px-7 font-semibold text-ink"
        >
          Back to the homepage
        </Link>
      </div>
    </main>
  );
}
