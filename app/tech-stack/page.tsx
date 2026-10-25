import { Brain, Database, Monitor, Server, Wrench, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Callout } from "@/components/ui/Callout";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Status } from "@/content/site";

export const metadata: Metadata = {
  title: "Tech stack",
  description:
    "LegalAI's technology by layer, and where the implementation deviates from the build plan and why.",
};

interface Tech {
  name: string;
  detail: string;
}

const LAYERS: { name: string; icon: LucideIcon; items: Tech[] }[] = [
  {
    name: "Frontend",
    icon: Monitor,
    items: [
      { name: "Next.js 16 (App Router)", detail: "One app for Public, Professional and Admin" },
      { name: "React 19 + TypeScript 6", detail: "Strict mode" },
      { name: "Tailwind CSS 4", detail: "Styling" },
      { name: "Recharts 3", detail: "Analytics dashboard" },
      { name: "Vitest + Testing Library", detail: "Component and page tests" },
    ],
  },
  {
    name: "Backend",
    icon: Server,
    items: [
      { name: "FastAPI 0.115", detail: "Single process, six routers" },
      { name: "SQLAlchemy + Alembic", detail: "ORM and migrations" },
      { name: "Pydantic", detail: "Request, response and settings models" },
      { name: "PyJWT + bcrypt", detail: "HttpOnly-cookie sessions, hashed passwords" },
      { name: "unittest", detail: "Backend and database-backed suites" },
    ],
  },
  {
    name: "AI / RAG",
    icon: Brain,
    items: [
      { name: "BAAI/bge-m3", detail: "1024-d dense embeddings (FlagEmbedding)" },
      { name: "BM25", detail: "Project-built keyword index, k1 1.5, b 0.75" },
      { name: "BAAI/bge-reranker-v2-m3", detail: "Cross-encoder reranker, fp16 on Apple MPS" },
      { name: "Groq · openai/gpt-oss-120b", detail: "Primary answer model" },
      { name: "Google Gemini Flash", detail: "Fallback answer model" },
      { name: "PyMuPDF + Tesseract 5", detail: "PDF text and OCR" },
    ],
  },
  {
    name: "Data",
    icon: Database,
    items: [
      { name: "PostgreSQL", detail: "Canonical store" },
      { name: "ChromaDB (embedded)", detail: "Vector index" },
      { name: "BM25 index file", detail: "Keyword index, atomic rewrites" },
      { name: "pandas", detail: "Structured-data loading" },
    ],
  },
  {
    name: "Engineering",
    icon: Wrench,
    items: [
      { name: "GitHub pull requests", detail: "Feature branches into main" },
      { name: "ESLint + Prettier", detail: "Frontend lint and format" },
      { name: "npm audit + pip-audit", detail: "Dependency scanning" },
      { name: "PyTorch on MPS", detail: "Local model inference on Apple silicon" },
    ],
  },
];

interface Deviation {
  component: string;
  planned: string;
  implemented: string;
  reason: ReactNode;
  status: Status | "as-planned" | "no-record";
}

const DEVIATIONS: Deviation[] = [
  {
    component: "Primary LLM",
    planned: "Google Gemini Flash",
    implemented: "Groq (openai/gpt-oss-120b) primary, Gemini fallback",
    reason:
      "In live runs Gemini returned HTTP 503 or timed out on every call. Recorded as a temporary owner decision, to be reverted when Gemini is reliable.",
    status: "in-progress",
  },
  {
    component: "Legal NLP model",
    planned: "Fine-tuned InLegalBERT for NER and section classification",
    implemented: "Deterministic NER; BGE cross-encoder for section ranking",
    reason:
      "Neither pretrained NER candidate improved F1 over the deterministic baseline (0.788) on a 36-example gold set, which is too small for responsible fine-tuning. The cross-encoder ranked sections best.",
    status: "pending-approval",
  },
  {
    component: "Retrieval orchestration",
    planned: "LlamaIndex hybrid retrieval",
    implemented: "A project-built retrieval service (Chroma + BM25 + RRF + reranker)",
    reason:
      "The planned pipeline (dense + BM25, fusion, reranking, top 20 to top 5) is implemented directly. The decision documents do not record a reason for dropping LlamaIndex.",
    status: "pending-approval",
  },
  {
    component: "Local development LLM",
    planned: "Ollama + Mistral 7B",
    implemented: "Not used: the adapter is a deliberate stub",
    reason:
      "Any provider other than Groq or Gemini returns a controlled 503. Development and tests use mocked adapters instead.",
    status: "no-record",
  },
  {
    component: "Chunk size",
    planned: "400–600 tokens, 50-token overlap",
    implemented: "Target 650, maximum 900, overlap 100 (estimated tokens)",
    reason:
      "Chunks follow paragraph boundaries; the retrieval benchmark was measured with these settings. The decision documents do not record a separate rationale.",
    status: "no-record",
  },
  {
    component: "Reranker hardware",
    planned: "BGE reranker running locally",
    implemented: "Apple MPS in fp16 (CPU fallback)",
    reason:
      "4.2× faster at the median than CPU, with identical top-5 rankings on all 30 benchmark queries.",
    status: "completed",
  },
  {
    component: "Embeddings, vector store, database, PDF parsing, OCR, frontend, charts, auth",
    planned: "BGE-M3, ChromaDB, PostgreSQL, PyMuPDF, Tesseract, Next.js, Recharts, JWT",
    implemented: "As planned",
    reason: "—",
    status: "as-planned",
  },
];

export default function TechStackPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tech stack"
        title="What LegalAI is built with"
        description="The stack follows the build plan closely. Where it differs, the table below says how and why, and which changes still need the guide's approval."
      />
      <Container className="py-16">
        <section aria-labelledby="stack">
          <SectionHeader id="stack" eyebrow="By layer" title="Technology by layer" />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {LAYERS.map((layer, index) => (
              <Reveal key={layer.name} delay={index * 50}>
                <div className="h-full rounded-xl border border-border bg-surface p-6 shadow-card">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <layer.icon className="h-5 w-5 text-accent" aria-hidden="true" />
                    {layer.name}
                  </h3>
                  <ul className="mt-4 divide-y divide-border">
                    {layer.items.map((item) => (
                      <li key={item.name} className="py-2.5">
                        <p className="text-sm font-semibold text-fg">{item.name}</p>
                        <p className="text-xs text-muted">{item.detail}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-xs text-subtle">
            Versions as pinned in the LegalAI repository at commit 28b23d9: frontend/package.json
            and requirements.txt.
          </p>
        </section>

        <section aria-labelledby="deviations" className="mt-24">
          <SectionHeader
            id="deviations"
            eyebrow="Planned vs implemented"
            title="Deviations from the build plan"
            description="Scope decisions marked “Pending approval” await the project guide's sign-off."
          />
          <div
            className="mt-10 overflow-x-auto rounded-lg border border-border bg-surface"
            role="region"
            aria-label="Planned versus implemented"
            tabIndex={0}
          >
            <table className="w-full min-w-[56rem] border-collapse text-sm">
              <caption className="sr-only">
                Planned technology, implemented technology, reason and status
              </caption>
              <thead className="bg-surface-2 text-left">
                <tr>
                  {["Component", "Planned", "Implemented", "Reason", "Status"].map((heading) => (
                    <th key={heading} scope="col" className="px-4 py-3 font-semibold">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEVIATIONS.map((row) => (
                  <tr key={row.component} className="border-t border-border align-top">
                    <th scope="row" className="px-4 py-3 text-left font-semibold">
                      {row.component}
                    </th>
                    <td className="px-4 py-3 text-muted">{row.planned}</td>
                    <td className="px-4 py-3 text-fg">{row.implemented}</td>
                    <td className="px-4 py-3 text-muted">{row.reason}</td>
                    <td className="px-4 py-3">
                      {row.status === "as-planned" ? (
                        <StatusBadge status="completed" label="As planned" />
                      ) : row.status === "in-progress" ? (
                        <StatusBadge status="in-progress" label="Temporary" />
                      ) : row.status === "no-record" ? (
                        <StatusBadge status="planned" label="No decision record" />
                      ) : row.status === "completed" ? (
                        <StatusBadge status="completed" label="Adopted" />
                      ) : (
                        <StatusBadge status={row.status} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Callout kind="info" title="Sources">
            Build plan (Confirmed Technology Stack and System Flow),
            docs/LLM_PROVIDER_CONFIGURATION.md, docs/LEGAL_NER_SELECTION_DECISION.md,
            docs/LEGAL_SECTION_RANKING_SELECTION_DECISION.md, docs/JUDGMENT_DOCUMENT_PROCESSING.md
            and docs/performance/PERFORMANCE_BASELINE.md.
          </Callout>
        </section>
      </Container>
    </>
  );
}
