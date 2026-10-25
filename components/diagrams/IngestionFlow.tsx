import { ArrowDown, ArrowRight, CheckCircle2, Lock, RotateCcw, XCircle } from "lucide-react";

const READ_ONLY = [
  { state: "QUEUED", text: "Job recorded in PostgreSQL" },
  { state: "EXTRACTING", text: "PyMuPDF text, OCR for scanned pages" },
  { state: "CHUNKING", text: "Structure-aware chunks with provenance" },
  { state: "EMBEDDING", text: "BGE-M3 vectors, cited sections, index metadata" },
];

const WRITES = [
  "Re-check that no document has this checksum",
  "Upsert chunks into Chroma",
  "Upsert into BM25 (temp write, validate, atomic replace)",
  "One PostgreSQL transaction: document, chunks, cited sections, outcomes and job = COMPLETED",
];

const CLEANUP = [
  "Roll back the PostgreSQL transaction",
  "Remove the document's BM25 records and Chroma vectors by key",
  "Mark the job FAILED with a sanitized error code",
];

/** Admin ingestion: read-only stages, then an ordered write phase where PostgreSQL commits last. */
export function IngestionFlow() {
  return (
    <figure aria-labelledby="ingestion-caption">
      <ol className="grid gap-2 md:grid-cols-4 md:gap-6">
        {READ_ONLY.map((step, index) => (
          <li key={step.state} className="relative">
            <div className="h-full rounded-lg border border-border bg-surface p-4">
              <p className="font-mono text-xs font-semibold text-accent">{step.state}</p>
              <p className="mt-1 text-sm text-fg">{step.text}</p>
            </div>
            {index < READ_ONLY.length - 1 ? (
              <ArrowRight
                className="absolute top-1/2 -right-5 hidden h-4 w-4 -translate-y-1/2 text-subtle md:block"
                aria-hidden="true"
              />
            ) : null}
          </li>
        ))}
      </ol>
      <p className="mt-2 text-xs text-subtle">Read-only stages: nothing is written to any store.</p>

      <ArrowDown className="mx-auto my-3 h-5 w-5 text-subtle" aria-hidden="true" />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border-2 border-accent/60 bg-surface p-5">
          <p className="flex items-center gap-2 font-mono text-xs font-semibold text-accent">
            <Lock className="h-4 w-4" aria-hidden="true" />
            INDEXING · under a write lock
          </p>
          <ol className="mt-3 space-y-2">
            {WRITES.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy text-[0.6875rem] font-bold text-navy-fg">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-4 flex items-center gap-2 rounded-md bg-ok-bg px-3 py-2 text-sm font-semibold text-ok">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            COMPLETED: present in all three stores
          </p>
        </div>

        <div className="rounded-xl border-2 border-danger/50 bg-surface p-5">
          <p className="flex items-center gap-2 font-mono text-xs font-semibold text-danger">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Any failure in the write phase
          </p>
          <ol className="mt-3 space-y-2">
            {CLEANUP.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-danger-bg text-[0.6875rem] font-bold text-danger">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-4 flex items-center gap-2 rounded-md bg-danger-bg px-3 py-2 text-sm font-semibold text-danger">
            <XCircle className="h-4 w-4" aria-hidden="true" />
            FAILED: nothing left behind, or flagged for reconciliation
          </p>
        </div>
      </div>
      <figcaption id="ingestion-caption" className="mt-3 text-xs leading-5 text-subtle">
        PostgreSQL commits last, so no reader sees a document whose chunks are missing from an
        index. Jobs stuck past 30 minutes are reaped to FAILED with the same cleanup. Source:
        docs/INGESTION_RELIABILITY.md.
      </figcaption>
    </figure>
  );
}
