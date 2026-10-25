import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { docs } from "@/content/docs";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Setup, API reference, data sources, security, testing, limitations and glossary.",
};

export default function DocsIndexPage() {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold tracking-wide text-accent uppercase">Documentation</p>
      <h1 className="mt-2 font-serif text-4xl font-bold">LegalAI documentation</h1>
      <p className="mt-4 text-lg text-muted">
        A summary of how to run, call and evaluate LegalAI. The LegalAI repository remains the
        authoritative source; each page names the files it draws on.
      </p>
      <ol className="mt-10 space-y-3">
        {docs.map((doc, index) => (
          <li key={doc.slug}>
            <Link
              href={`/docs/${doc.slug}/`}
              className="group flex items-start gap-4 rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-strong hover:bg-surface-2"
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-navy-fg">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 font-semibold text-fg">
                  {doc.title}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-1 block text-sm text-muted">{doc.description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
