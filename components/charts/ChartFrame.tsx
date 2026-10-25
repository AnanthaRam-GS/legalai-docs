import type { ReactNode } from "react";

/** Titled figure for a chart, with its provenance underneath. */
export function ChartFrame({
  title,
  description,
  footnote,
  children,
}: {
  title: string;
  description: string;
  footnote: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="my-6 rounded-xl border border-border bg-surface p-4 shadow-card sm:p-6">
      <p className="font-semibold text-fg">{title}</p>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <div className="mt-4">{children}</div>
      <figcaption className="mt-3 border-t border-border pt-3 text-xs leading-5 text-subtle">
        {footnote}
      </figcaption>
    </figure>
  );
}
