import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { docs } from "@/content/docs";

/** Previous / next links in documentation reading order. */
export function DocPager({ slug }: { slug: string }) {
  const index = docs.findIndex((doc) => doc.slug === slug);
  const previous = index > 0 ? docs[index - 1] : undefined;
  const next = index >= 0 && index < docs.length - 1 ? docs[index + 1] : undefined;

  return (
    <nav
      aria-label="Previous and next pages"
      className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
    >
      {previous ? (
        <Link
          href={`/docs/${previous.slug}/`}
          className="group rounded-lg border border-border p-4 hover:border-border-strong hover:bg-surface"
        >
          <span className="flex items-center gap-1 text-xs text-subtle">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Previous
          </span>
          <span className="mt-1 block font-semibold text-fg">{previous.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/docs/${next.slug}/`}
          className="group rounded-lg border border-border p-4 text-right hover:border-border-strong hover:bg-surface"
        >
          <span className="flex items-center justify-end gap-1 text-xs text-subtle">
            Next
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="mt-1 block font-semibold text-fg">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
