import { ArrowLeft, BookOpen, Compass } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { mainNav } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <Container className="py-24 sm:py-32">
      <div className="mx-auto max-w-xl text-center" data-pagefind-ignore="all">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Compass className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="mt-6 font-mono text-sm font-semibold text-accent">404</p>
        <h1 className="mt-2 font-serif text-4xl font-bold">This page could not be found</h1>
        <p className="mt-4 text-lg text-muted">
          The link may be out of date, or the page may have moved. Try one of these instead.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-fg hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <Link
            href="/docs/"
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold hover:bg-surface"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Documentation
          </Link>
        </div>
        <nav aria-label="All pages" className="mt-12">
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted underline-offset-4 hover:text-fg hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Container>
  );
}
