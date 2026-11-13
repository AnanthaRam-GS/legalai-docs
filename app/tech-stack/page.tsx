import { Brain, Database, Monitor, Server, Wrench, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
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
  alternates: { canonical: "/tech-stack/" },
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
      { name: "Playwright", detail: "End-to-end browser journeys" },
    ],
  },
  {
    name: "Backend",
    icon: Server,
    items: [
      { name: "FastAPI 0.133", detail: "Single process, six routers" },
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
      {
        name: "law-ai/InLegalBERT (fine-tuned)",
        detail: "NER combined with the rules, on by default; rules-only fallback",
      },
      { name: "Groq · openai/gpt-oss-120b", detail: "Professional answers and PDF briefs" },
      {
        name: "Groq · openai/gpt-oss-20b",
        detail: "Public answers (120b when 20b is at capacity)",
      },
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
      { name: "GitHub Actions", detail: "CI: backend, database, frontend and e2e jobs" },
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
  status: Status | "as-planned" | "no-record" | "not-adopted" | "not-feasible" | "adopted-pending";
}

const DEVIATIONS: Deviation[] = [
  {
    component: "Answer LLM",
    planned: "Google Gemini Flash",
    implemented:
      "Groq, routed by mode: openai/gpt-oss-120b for professional answers, openai/gpt-oss-20b for public answers",
    reason:
      "Gemini returned HTTP 503 or 429, or timed out, on every live attempt between 19 and 30 October 2026. NVIDIA's hosted DeepSeek and gpt-oss-20b listed the models but never returned a token, and a local Ollama model cited no evidence validly. Groq is a recorded owner decision, to be revisited if Gemini becomes reliable.",
    status: "in-progress",
  },
  {
    component: "Legal NER",
    planned: "Fine-tuned InLegalBERT",
    implemented:
      "InLegalBERT fine-tuned on InLegalNER, combined with the rule-based NER; on by default, falling back to the rules",
    reason: (
      <>
        Adopted through a bounded experiment with thresholds frozen before training: exact F1 0.915
        against the rules&rsquo; 0.788 on held-out gold, no retrieval or brief regression, and a
        held-out Parties &amp; Roles judge passed after an earlier step failed. Details on the{" "}
        <Link href="/experiments/" className="font-medium text-accent underline">
          Experiments
        </Link>{" "}
        page.
      </>
    ),
    status: "adopted-pending",
  },
  {
    component: "Section classifier",
    planned: "Multi-label InLegalBERT IPC/BNS classifier",
    implemented: "BGE cross-encoder ranking over a bounded section catalog",
    reason:
      "Not feasible: no open BNS or BNSS training data exists, and the only open set (ILSI, IPC-only) covers 22 of the 60 gold labels, where the ranker is already near its ceiling. Skipped by decision; nothing was trained.",
    status: "not-feasible",
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
    implemented: "Supported through an OpenAI-compatible profile, but not configured",
    reason:
      "An OpenAI-compatible Ollama profile exists and was tried in the October 2026 provider bake-off (gemma4 12B): schema-valid on 4 of 5 cases but with no valid citation and 1–4.5 minutes per answer, so it is not configured. Development and tests use mocked adapters.",
    status: "not-adopted",
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
            Versions as pinned in the LegalAI repository at commit b11249b: frontend/package.json
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
                      {row.component}{" "}
                    </th>
                    <td className="px-4 py-3 text-muted">{row.planned} </td>
                    <td className="px-4 py-3 text-fg">{row.implemented} </td>
                    <td className="px-4 py-3 text-muted">{row.reason} </td>
                    <td className="px-4 py-3">
                      {row.status === "as-planned" ? (
                        <StatusBadge status="completed" label="As planned" />
                      ) : row.status === "in-progress" ? (
                        <StatusBadge status="in-progress" label="Temporary" />
                      ) : row.status === "no-record" ? (
                        <StatusBadge status="planned" label="No decision record" />
                      ) : row.status === "adopted-pending" ? (
                        <StatusBadge status="pending-approval" label="Adopted, sign-off pending" />
                      ) : row.status === "not-feasible" ? (
                        <StatusBadge status="historical" label="Not feasible" />
                      ) : row.status === "not-adopted" ? (
                        <StatusBadge status="historical" label="Not adopted" />
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
            docs/LLM_PROVIDER_CONFIGURATION.md, docs/experiments/INLEGALBERT_DECISION.md,
            docs/LEGAL_NER_SELECTION_DECISION.md, docs/LEGAL_SECTION_RANKING_SELECTION_DECISION.md,
            docs/JUDGMENT_DOCUMENT_PROCESSING.md and docs/performance/PERFORMANCE_BASELINE.md.
          </Callout>
        </section>
      </Container>
    </>
  );
}
