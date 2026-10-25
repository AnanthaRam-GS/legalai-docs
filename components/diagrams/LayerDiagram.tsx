"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Brain, Database, Monitor, Server, type LucideIcon } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent } from "react";

interface Layer {
  id: string;
  name: string;
  tech: string;
  icon: LucideIcon;
  responsibilities: string[];
}

const LAYERS: Layer[] = [
  {
    id: "frontend",
    name: "Frontend",
    tech: "Next.js (App Router) · TypeScript · Tailwind CSS · Recharts",
    icon: Monitor,
    responsibilities: [
      "One application with three interfaces: Public Mode (no login), Professional Mode (lawyers) and Admin.",
      "Calls the backend only through REST with credentials included; the session token stays in an HttpOnly cookie that scripts cannot read.",
      "Renders plain-language answers, professional briefs with precedents, and the five-tab analytics dashboard.",
      "Shows loading, empty and retryable error states, using the backend's plain-language messages for rate limits.",
    ],
  },
  {
    id: "backend",
    name: "Backend",
    tech: "FastAPI · SQLAlchemy · Alembic · PyJWT · bcrypt",
    icon: Server,
    responsibilities: [
      "Routers for authentication, queries, corpus ingestion, analytics, query history and lawyer verification.",
      "Derives the role from the database on every request; JWT in an HttpOnly, SameSite cookie with an Origin check on writes.",
      "Rate limits, login throttling, a cap on concurrent generations, and streamed uploads with size limits.",
      "Runs ingestion as a background task with a persistent job record, and returns every error in one {error, code, detail} shape with a request ID.",
    ],
  },
  {
    id: "ai",
    name: "AI / RAG",
    tech: "BGE-M3 · BM25 · RRF · BGE reranker · Groq / Gemini · Tesseract",
    icon: Brain,
    responsibilities: [
      "Deterministic query understanding: statutes, sections and legal regime (IPC/CrPC or BNS/BNSS).",
      "Hybrid retrieval (BGE-M3 dense + BM25), reciprocal rank fusion and cross-encoder reranking to the top 5.",
      "Builds a bounded evidence packet with IDs, generates structured JSON with the LLM, and validates every citation.",
      "Parses PDFs with PyMuPDF, falls back to Tesseract OCR for scans, and builds a local document map for briefs.",
    ],
  },
  {
    id: "data",
    name: "Data",
    tech: "PostgreSQL · ChromaDB · BM25 index",
    icon: Database,
    responsibilities: [
      "PostgreSQL is canonical: users, documents, chunks, cited sections, query history, ingestion jobs, IPC-BNS mapping and NCRB statistics.",
      "Chroma holds 1024-dimensional BGE-M3 vectors for every chunk with provenance and section metadata.",
      "The BM25 index holds the same chunks for exact legal terms and section numbers.",
      "A store-consistency verifier checks that all three agree chunk for chunk.",
    ],
  },
];

/** Four stacked layers; selecting one shows its responsibilities. Implements the ARIA tabs pattern. */
export function LayerDiagram() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const reduceMotion = useReducedMotion();
  const layer = LAYERS[active] ?? LAYERS[0]!;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: LAYERS.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = ((keys[event.key] ?? 0) + LAYERS.length) % LAYERS.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div
        role="tablist"
        aria-label="System layers"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="flex flex-col"
      >
        {LAYERS.map((item, index) => {
          const selected = index === active;
          const Icon = item.icon;
          return (
            <div key={item.id} className="flex flex-col items-stretch">
              <button
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                id={`${baseId}-tab-${item.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                  selected
                    ? "border-accent bg-navy text-navy-fg shadow-raised"
                    : "border-border bg-surface text-fg hover:border-border-strong hover:bg-surface-2"
                }`}
              >
                <span
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    selected ? "bg-white/10 text-[#e3b65c]" : "bg-accent-soft text-accent"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold tracking-wide uppercase opacity-80">
                    Layer {index + 1}
                  </span>
                  <span className="block text-lg font-semibold">{item.name}</span>
                  <span
                    className={`block truncate text-xs ${selected ? "text-navy-muted" : "text-muted"}`}
                  >
                    {item.tech}
                  </span>
                </span>
              </button>
              {index < LAYERS.length - 1 ? (
                <span className="mx-auto h-4 w-0.5 bg-border-strong" aria-hidden="true" />
              ) : null}
            </div>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${layer.id}`}
        tabIndex={0}
        className="rounded-xl border border-border bg-surface p-6 shadow-card"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={layer.id}
            initial={reduceMotion ? false : { opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm font-semibold tracking-wide text-accent uppercase">
              Layer {active + 1} responsibilities
            </p>
            <h3 className="mt-1 font-serif text-2xl font-bold">{layer.name}</h3>
            <p className="mt-1 text-sm text-muted">{layer.tech}</p>
            <ul className="mt-5 space-y-3">
              {layer.responsibilities.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
        <p className="mt-6 border-t border-border pt-4 text-xs text-subtle">
          Select a layer, or use the arrow keys, to see what it is responsible for.
        </p>
      </div>
    </div>
  );
}
