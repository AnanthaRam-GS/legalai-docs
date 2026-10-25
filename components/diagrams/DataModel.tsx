import { Database, Search, Waypoints } from "lucide-react";

interface Table {
  name: string;
  columns: string[];
  note: string;
}

const GROUPS: { title: string; tables: Table[] }[] = [
  {
    title: "Corpus",
    tables: [
      {
        name: "documents",
        columns: [
          "case_name, court_level, year",
          "checksum (unique)",
          "outcome fields + evidence",
          "extraction_method, ocr_pages",
          "review_status",
        ],
        note: "One row per trusted judgment.",
      },
      {
        name: "chunks",
        columns: [
          "document_id → documents",
          "chunk_index, text",
          "chroma_id",
          "page / paragraph range",
        ],
        note: "Same IDs as the Chroma and BM25 entries.",
      },
      {
        name: "document_sections",
        columns: [
          "document_id → documents",
          "statute, section",
          "mention_count, chunk_count",
          "evidence_chunk_id",
        ],
        note: "Sections each judgment cites.",
      },
    ],
  },
  {
    title: "Users and activity",
    tables: [
      {
        name: "users",
        columns: [
          "email, hashed_password",
          "role: public / lawyer / admin",
          "email_verified, is_active",
        ],
        note: "Role is read from here on every request.",
      },
      {
        name: "lawyer_verification_applications",
        columns: ["user_id → users", "bar council, enrolment", "status, reviewed_by"],
        note: "Admin approval promotes a user to lawyer.",
      },
      {
        name: "query_history",
        columns: ["user_id → users", "mode, query_text", "response_json", "generation_backend"],
        note: "Professional queries only; no uploaded text.",
      },
      {
        name: "ingestion_jobs",
        columns: [
          "document_id → documents",
          "status, progress",
          "error_code, needs_reconciliation",
        ],
        note: "Persistent, restart-safe job state.",
      },
    ],
  },
  {
    title: "Reference data",
    tables: [
      {
        name: "ipc_bns_mapping",
        columns: ["ipc_section, bns_section", "descriptions", "change_type"],
        note: "370 rows, unreviewed.",
      },
      {
        name: "ncrb_stats",
        columns: [
          "year, state, offense_category",
          "ipc_section, bns_section",
          "case_count (NULL if not reported)",
          "is_aggregate, section labels",
        ],
        note: "6,201 rows from NCRB Table 1A.4.",
      },
    ],
  },
];

function TableCard({ table }: { table: Table }) {
  return (
    <div className="rounded-lg border border-border bg-surface">
      <p className="border-b border-border bg-surface-2 px-3 py-2 font-mono text-xs font-semibold break-all text-fg">
        {table.name}
      </p>
      <ul className="space-y-1 px-3 py-2 font-mono text-[0.6875rem] leading-5 text-muted">
        {table.columns.map((column) => (
          <li key={column}>{column}</li>
        ))}
      </ul>
      <p className="border-t border-border px-3 py-2 text-xs text-subtle">{table.note}</p>
    </div>
  );
}

/** Overview of the PostgreSQL tables and the two derived indexes. */
export function DataModel() {
  return (
    <figure aria-labelledby="data-model-caption">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
        <div className="rounded-xl border border-border bg-bg p-4">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Database className="h-4 w-4 text-accent" aria-hidden="true" />
            PostgreSQL (canonical)
          </p>
          <div className="mt-4 space-y-5">
            {GROUPS.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                  {group.title}
                </p>
                <div className="mt-2 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {group.tables.map((table) => (
                    <TableCard key={table.name} table={table} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Waypoints className="h-4 w-4 text-accent" aria-hidden="true" />
              Chroma (derived)
            </p>
            <p className="mt-2 text-sm text-muted">
              Collection{" "}
              <code className="font-mono text-xs break-all">legalai_trusted_judgments_v1</code>: one
              1024-dimensional BGE-M3 vector per chunk, with provenance, regime and cited-section
              metadata.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Search className="h-4 w-4 text-accent" aria-hidden="true" />
              BM25 index (derived)
            </p>
            <p className="mt-2 text-sm text-muted">
              The same chunks and metadata in a keyword index, rewritten atomically on each
              ingestion.
            </p>
          </div>
          <p className="rounded-lg bg-accent-soft p-3 text-xs leading-5 text-fg">
            Chunk IDs match across all three stores, which is what lets the consistency verifier
            compare them one to one.
          </p>
        </div>
      </div>
      <figcaption id="data-model-caption" className="mt-3 text-xs leading-5 text-subtle">
        Selected columns only. Email verification token and OTP tables are omitted. Source:
        backend/app/db/models.py, docs/INGESTION_RELIABILITY.md, docs/ANALYTICS_DATA.md.
      </figcaption>
    </figure>
  );
}
