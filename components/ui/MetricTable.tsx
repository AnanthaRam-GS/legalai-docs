import type { ReactNode } from "react";

export interface MetricColumn {
  key: string;
  label: string;
  /** Numeric columns are right-aligned with tabular figures. */
  numeric?: boolean;
}

export type MetricRow = Record<string, ReactNode> & { highlight?: boolean };

interface MetricTableProps {
  caption: string;
  columns: MetricColumn[];
  rows: MetricRow[];
  /** Provenance printed under the table: sample size, date and source. */
  footnote?: ReactNode;
}

export function MetricTable({ caption, columns, rows, footnote }: MetricTableProps) {
  return (
    <figure className="my-6">
      {/* The wrapper scrolls on narrow screens; it is focusable so keyboard users can scroll it. */}
      <div
        className="overflow-x-auto rounded-lg border border-border bg-surface"
        role="region"
        aria-label={caption}
        tabIndex={0}
      >
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <caption className="border-b border-border px-4 py-3 text-left font-semibold text-fg">
            {caption}
          </caption>
          <thead className="bg-surface-2">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-4 py-2.5 font-semibold text-fg ${column.numeric ? "text-right" : "text-left"}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className={`border-t border-border ${row.highlight ? "bg-accent-soft/60 font-semibold" : ""}`}
              >
                {columns.map((column, columnIndex) => {
                  const Cell = columnIndex === 0 ? "th" : "td";
                  return (
                    <Cell
                      key={column.key}
                      scope={columnIndex === 0 ? "row" : undefined}
                      className={`px-4 py-2.5 align-top ${
                        column.numeric ? "text-right tabular-nums" : "text-left"
                      } ${columnIndex === 0 ? "font-medium text-fg" : "text-muted"}`}
                    >
                      {row[column.key]}
                    </Cell>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footnote ? (
        <figcaption className="mt-2 text-xs leading-5 text-subtle">{footnote}</figcaption>
      ) : null}
    </figure>
  );
}
