"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { docs } from "@/content/docs";

function DocLinks({ pathname }: { pathname: string }) {
  return (
    <ul className="space-y-1">
      {docs.map((doc) => {
        const href = `/docs/${doc.slug}/`;
        const active = pathname === href || pathname === href.slice(0, -1);
        return (
          <li key={doc.slug}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={`block rounded-md border-l-2 px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "border-accent bg-accent-soft font-semibold text-fg"
                  : "border-transparent text-muted hover:bg-surface-2 hover:text-fg"
              }`}
            >
              {doc.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Documentation navigation: a sticky list on large screens, a disclosure on small ones. */
export function DocsSidebar() {
  const pathname = usePathname();
  const current = docs.find((doc) => pathname.startsWith(`/docs/${doc.slug}`));

  return (
    <>
      <details className="group rounded-lg border border-border bg-surface lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
          <span>
            Documentation
            {current ? <span className="font-normal text-muted">: {current.title}</span> : null}
          </span>
          <ChevronDown
            className="h-4 w-4 transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <nav aria-label="Documentation" className="border-t border-border p-2">
          <DocLinks pathname={pathname} />
        </nav>
      </details>

      <nav aria-label="Documentation" className="sticky top-24 hidden lg:block">
        <p className="mb-3 px-3 text-xs font-semibold tracking-wide text-subtle uppercase">
          Documentation
        </p>
        <DocLinks pathname={pathname} />
      </nav>
    </>
  );
}
