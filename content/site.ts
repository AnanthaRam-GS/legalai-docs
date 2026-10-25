/**
 * Editable facts for the LegalAI documentation site.
 *
 * Every number here must trace to a file in the LegalAI repository. The
 * mapping (claim → source path) lives in content/SOURCES.md; update both
 * together.
 */

export type Status =
  "completed" | "in-progress" | "planned" | "pending-approval" | "blocked" | "historical";

export interface Person {
  name: string;
  registrationNumber?: string;
  role: string;
  title?: string;
  responsibilities: string[];
  /** Optional profile links and photo path (relative to /public). Leave empty to hide. */
  linkedin?: string;
  github?: string;
  photo?: string;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  /** Decimal places shown for value. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Short qualifier shown under the value. */
  detail: string;
  /** Sample size and scope, shown in small print. */
  sample: string;
  asOf: string;
  source: string;
  status: Status;
}

export interface PhaseItem {
  label: string;
  status: Status;
  note?: string;
}

export interface Phase {
  id: string;
  name: string;
  summary: string;
  status: Status;
  items: PhaseItem[];
}

export interface Milestone {
  date: string;
  title: string;
  description: string;
  refs: string;
  status: Status;
}

export interface RoadmapItem {
  title: string;
  description: string;
  status: Status;
}

export const site = {
  name: "LegalAI",
  title: "LegalAI: An Intelligent Criminal Legal Assistance and Analytics System",
  tagline:
    "Grounded answers on Indian criminal law, with every citation traced to a retrieved judgment.",
  description:
    "Project documentation for LegalAI, a retrieval-augmented legal assistant and analytics system for Indian criminal law, built as a final-year project at Amrita Vishwa Vidyapeetham.",
  course: "23CSE399 Final Year Project",
  department: "Department of Computer Science and Engineering",
  school: "School of Computing",
  institution: "Amrita Vishwa Vidyapeetham",
  repoUrl: "https://github.com/AnanthaRam-GS/lexintelAI",
  docsRepoUrl: "https://github.com/AnanthaRam-GS/legalai-docs",
  /** YouTube or Google Drive link. Leave empty to show the "coming soon" state. */
  demoVideoUrl: "",
  /** ISO date of the last content review. */
  lastUpdated: "2026-10-25",
  /** Commit of the LegalAI main branch that the facts on this site describe. */
  sourceCommit: "ed3cc76",
  disclaimer:
    "LegalAI is a research prototype built for an academic project. It does not provide legal advice, and its output must not be relied on as a substitute for a qualified lawyer.",
} as const;

export const guide: Person = {
  name: "Dr. Sabarish B A",
  role: "Project Guide",
  title: "Assistant Professor, Department of CSE",
  responsibilities: [
    "Guides the project's scope, architecture and evaluation plan",
    "Reviews phase milestones and approves scope changes",
  ],
};

export const team: Person[] = [
  {
    name: "Anantha Ram G S",
    registrationNumber: "CB.SC.U4CSE23408",
    role: "Backend & AI Pipeline Lead",
    responsibilities: [
      "Repository structure, environment template and API contract freeze",
      "Judgment and statutory corpus acquisition",
      "Shared document processing, chunking, embeddings and vector store",
      "Legal NLP services, hybrid retrieval and reranking",
      "LLM generation layer and query orchestration",
      "RAG evaluation and performance profiling",
    ],
    linkedin: "",
    github: "",
    photo: "",
  },
  {
    name: "Rama Roshinee S V",
    registrationNumber: "CB.SC.U4CSE23645",
    role: "Backend Developer",
    responsibilities: [
      "PostgreSQL schema and migrations",
      "NCRB statistics and IPC-to-BNS mapping datasets",
      "FastAPI foundation, JWT authentication and roles",
      "Corpus ingestion service and persistent job tracking",
      "Analytics, query-history and structured-data services",
      "Backend hardening and integration tests",
    ],
    linkedin: "",
    github: "",
    photo: "",
  },
  {
    name: "Ravindran G",
    registrationNumber: "CB.SC.U4CSE23647",
    role: "Frontend Developer",
    responsibilities: [
      "FIR and case-fact dataset support",
      "Professional Mode frontend foundation and API client",
      "Login and protected-route flow",
      "Professional home, PDF upload and text query pages",
      "Five-tab analytics dashboard and query history",
      "Professional Mode loading, empty and error states",
    ],
    linkedin: "",
    github: "",
    photo: "",
  },
  {
    name: "Gugan S S",
    registrationNumber: "CB.SC.U4CSE23416",
    role: "Frontend Developer",
    responsibilities: [
      "Corpus metadata and data-quality support",
      "Shared UX components (loading, errors, upload, response cards)",
      "Public Mode home and chat-style question page",
      "Admin status and corpus ingestion pages",
      "Responsive layout and plain-language copy",
      "Public and Admin error states",
    ],
    linkedin: "",
    github: "",
    photo: "",
  },
];

export const stats: Stat[] = [
  {
    id: "corpus",
    label: "Trusted judgments",
    value: 70,
    detail: "split into 1,356 indexed chunks",
    sample: "Curated corpus, consistent across PostgreSQL, Chroma and BM25",
    asOf: "2026-10-19",
    source: "docs/INDEX_METADATA.md; docs/reconciliation/INVENTORY_REPORT.md",
    status: "completed",
  },
  {
    id: "p5",
    label: "Precision@5",
    value: 0.873,
    decimals: 3,
    detail: "hybrid retrieval + reranker",
    sample: "30 queries, 695 human relevance judgments (historical)",
    asOf: "2026-09-07",
    source: "docs/RETRIEVAL_EVALUATION_RESULTS.md",
    status: "historical",
  },
  {
    id: "mrr",
    label: "MRR@5",
    value: 0.961,
    decimals: 3,
    detail: "first relevant result near the top",
    sample: "30 queries, 695 human relevance judgments (historical)",
    asOf: "2026-09-07",
    source: "docs/RETRIEVAL_EVALUATION_RESULTS.md",
    status: "historical",
  },
  {
    id: "ndcg",
    label: "nDCG@5",
    value: 0.819,
    decimals: 3,
    detail: "graded ranking quality",
    sample: "30 queries, 695 human relevance judgments (historical)",
    asOf: "2026-09-07",
    source: "docs/RETRIEVAL_EVALUATION_RESULTS.md",
    status: "historical",
  },
  {
    id: "backend-tests",
    label: "Backend test cases",
    value: 951,
    detail: "across 81 Python test modules",
    sample: "Test methods defined on main (static count, not a pass count)",
    asOf: "2026-10-25",
    source: "backend/scripts/tests/test_*.py on main @ ed3cc76",
    status: "completed",
  },
  {
    id: "frontend-tests",
    label: "Frontend test cases",
    value: 291,
    detail: "across 40 Vitest files",
    sample: "Test cases defined on main (static count, not a pass count)",
    asOf: "2026-10-25",
    source: "frontend/**/*.test.ts(x) on main @ ed3cc76",
    status: "completed",
  },
  {
    id: "rerank-speedup",
    label: "Reranker speed-up",
    value: 4.2,
    decimals: 1,
    suffix: "×",
    detail: "p50, Apple MPS fp16 vs CPU fp32",
    sample: "10 queries × 3 passes = 30 samples per configuration",
    asOf: "2026-10-21",
    source: "docs/performance/PERFORMANCE_BASELINE.md",
    status: "completed",
  },
];

export const phases: Phase[] = [
  {
    id: "phase-0",
    name: "Phase 0: Pre-implementation setup",
    summary:
      "Repository, frozen API contracts, database schema, datasets and an initial trusted corpus.",
    status: "completed",
    items: [
      { label: "Repository and project structure", status: "completed" },
      { label: "Environment template and API contract freeze", status: "completed" },
      { label: "PostgreSQL schema and migrations", status: "completed" },
      {
        label: "Development judgment corpus, NCRB and IPC-BNS datasets",
        status: "completed",
        note: "70 trusted judgments; the 8,000–10,000 target was explicitly not required before implementation.",
      },
      {
        label: "InLegalBERT fine-tuning",
        status: "pending-approval",
        note: "Two pretrained candidates did not beat the deterministic NER baseline, so no model was promoted.",
      },
      { label: "Initial corpus ingestion", status: "completed" },
    ],
  },
  {
    id: "phase-1",
    name: "Phase 1: Parallel core implementation",
    summary:
      "Document processing, retrieval, generation, query orchestration, authentication, ingestion and analytics services.",
    status: "completed",
    items: [
      { label: "Document processing and vector services", status: "completed" },
      {
        label: "Legal NLP services",
        status: "pending-approval",
        note: "Deterministic NER and a BGE cross-encoder section ranker in place of InLegalBERT.",
      },
      { label: "Hybrid retrieval and reranking", status: "completed" },
      { label: "LLM generation layer", status: "completed" },
      { label: "Professional and public query orchestration", status: "completed" },
      { label: "FastAPI, database and authentication foundation", status: "completed" },
      { label: "Corpus ingestion and job management", status: "completed" },
      { label: "Analytics, history and structured-data services", status: "completed" },
    ],
  },
  {
    id: "phase-2",
    name: "Phase 2: Professional Mode frontend",
    summary: "Login, protected routes, PDF and text query pages, analytics dashboard and history.",
    status: "completed",
    items: [
      { label: "Professional frontend foundation", status: "completed" },
      { label: "Login and protected-route flow", status: "completed" },
      { label: "Professional home, upload and text query", status: "completed" },
      { label: "Five-tab analytics dashboard", status: "completed" },
      { label: "Query history", status: "completed" },
    ],
  },
  {
    id: "phase-3",
    name: "Phase 3: Public Mode and Admin frontend",
    summary: "Shared UX components, the public question flow and the admin ingestion console.",
    status: "completed",
    items: [
      { label: "Shared UX components", status: "completed" },
      { label: "Public home and chat-style question page", status: "completed" },
      { label: "Admin status and corpus ingestion", status: "completed" },
      { label: "Responsive and plain-language UX", status: "completed" },
    ],
  },
  {
    id: "phase-4",
    name: "Phase 4: Integration, evaluation and deployment",
    summary:
      "System-wide evaluation, profiling, hardening, deployment and user acceptance testing.",
    status: "in-progress",
    items: [
      {
        label: "Retrieval evaluation",
        status: "in-progress",
        note: "30-query benchmark done; expansion towards about 100 queries is planned.",
      },
      { label: "AI performance profiling", status: "completed" },
      { label: "Backend hardening and unified error contract", status: "completed" },
      { label: "Frontend error states", status: "completed" },
      {
        label: "Live professional query runs",
        status: "blocked",
        note: "Blocked by LLM provider capacity: the professional answer does not fit the current token limits.",
      },
      { label: "Continuous integration and end-to-end tests", status: "completed" },
      { label: "Deployment", status: "planned" },
      { label: "User acceptance testing", status: "planned" },
    ],
  },
];

/** The build plan's "Phase 1 Review: 60% completion target" checklist. */
export const reviewChecklist: PhaseItem[] = [
  {
    label: "Corpus ingestion pipeline end-to-end (PDF → Chroma + PostgreSQL)",
    status: "completed",
  },
  {
    label: "InLegalBERT NER and section classifier integrated",
    status: "pending-approval",
    note: "Replaced by deterministic NER and a BGE cross-encoder section ranker after evaluation.",
  },
  {
    label: "RAG pipeline: hybrid retrieval + reranker returning grounded results",
    status: "completed",
  },
  {
    label: "/query/professional returning sections, citations and a structured case brief",
    status: "completed",
    note: "Covered by tests; live runs are blocked by provider capacity.",
  },
  { label: "/query/public returning plain-language responses", status: "completed" },
  {
    label: "Authentication and role protection for Professional and Admin routes",
    status: "completed",
  },
  {
    label: "Analytics endpoints returning real PostgreSQL data",
    status: "completed",
    note: "Extracted values are unreviewed pending legal review.",
  },
  { label: "Professional Mode frontend pages", status: "completed" },
  { label: "Plain Language Mode home page", status: "completed" },
];

export const milestones: Milestone[] = [
  {
    date: "2026-09-03",
    title: "Foundations and frozen contracts",
    description:
      "Project structure, shared environment template, API contract models and the initial PostgreSQL schema.",
    refs: "PRs #1–#3",
    status: "completed",
  },
  {
    date: "2026-09-06",
    title: "Development corpus and structured datasets",
    description:
      "Criminal-judgment corpus with filtering, pre-screening and human review; BNS/BNSS transition validation set; NCRB and IPC-BNS datasets.",
    refs: "PRs #4–#13, #15",
    status: "completed",
  },
  {
    date: "2026-09-07",
    title: "Retrieval stack and benchmark",
    description:
      "Document processing, BGE-M3 embeddings, Chroma and BM25 indexes, BGE reranking, and a 30-query human-labelled retrieval benchmark.",
    refs: "PRs #16–#23",
    status: "completed",
  },
  {
    date: "2026-09-09",
    title: "Tuning experiments and model selection",
    description:
      "Regime-aware, query-expansion and metadata reranking experiments were inconclusive, so the untuned hybrid + reranker stack was frozen; section ranking and NER selections recorded.",
    refs: "PRs #24, #25, #27, #28",
    status: "completed",
  },
  {
    date: "2026-09-17",
    title: "Product integration",
    description:
      "Professional and Public Modes wired to live APIs, registration with email OTP, lawyer verification, admin console and error-state hardening.",
    refs: "PRs #14, #20, #26, #29–#46",
    status: "completed",
  },
  {
    date: "2026-09-19",
    title: "Private PDF briefs",
    description:
      "Bounded private-PDF context, context budgeting, single-call professional PDF analysis and the richer legal brief.",
    refs: "PRs #47–#50",
    status: "completed",
  },
  {
    date: "2026-10-17",
    title: "Isolated test database",
    description:
      "Database-backed test suites moved to a dedicated _test database with network and model loading blocked.",
    refs: "PR #51",
    status: "completed",
  },
  {
    date: "2026-10-18",
    title: "Store reconciliation",
    description:
      "Backup tooling, a read-only inventory and a rehearsed cleanup and backfill brought PostgreSQL, Chroma and BM25 into agreement.",
    refs: "PRs #52–#54",
    status: "completed",
  },
  {
    date: "2026-10-18",
    title: "Ingestion reliability",
    description:
      "All-or-nothing admin ingestion across the three stores, duplicate detection, stale-job reaping and sanitized errors.",
    refs: "PR #55",
    status: "completed",
  },
  {
    date: "2026-10-19",
    title: "Analytics data and index metadata",
    description:
      "Validated loaders, cited-section and outcome producers, offence-only defaults, NCRB aggregate flags, and section metadata in both indexes.",
    refs: "PRs #56–#58",
    status: "completed",
  },
  {
    date: "2026-10-19",
    title: "Professional brief fixes",
    description:
      "Document-derived brief fields with page references and reranker-based relative relevance for precedents.",
    refs: "PR #59",
    status: "completed",
  },
  {
    date: "2026-10-21",
    title: "Supervised live runs",
    description:
      "Provider fallback chain, stage timings, prompt v2 and output limits. Public runs answered; professional runs are blocked by provider capacity.",
    refs: "PR #60",
    status: "completed",
  },
  {
    date: "2026-10-21",
    title: "Performance baseline",
    description:
      "Query models moved to Apple MPS with start-up warm-up and non-blocking PDF routes; rankings stayed identical on the 30-query benchmark.",
    refs: "PR #61",
    status: "completed",
  },
  {
    date: "2026-10-22",
    title: "Security hardening",
    description:
      "Rate limits, login throttling, no account enumeration, JWT secret and seed-password checks, CSRF origin checks and streamed uploads.",
    refs: "PR #62",
    status: "completed",
  },
  {
    date: "2026-10-23",
    title: "OCR for scanned PDFs",
    description: "Tesseract fallback for pages without a text layer, with confidence warnings.",
    refs: "PR #63",
    status: "completed",
  },
  {
    date: "2026-10-24",
    title: "NCRB re-extraction",
    description:
      "NCRB Table 1A.4 re-extracted from the official PDF and validated against its own arithmetic and an independent summary table.",
    refs: "PRs #64, #65",
    status: "completed",
  },
  {
    date: "2026-10-24",
    title: "Unified error contract",
    description: "Every error response shares one {error, code, detail} shape with a request ID.",
    refs: "PR #66",
    status: "completed",
  },
  {
    date: "2026-10-25",
    title: "Continuous integration and end-to-end tests",
    description:
      "GitHub Actions runs the backend, database, frontend and Playwright end-to-end suites on every pull request, with no secrets; the 15 browser journeys use test-only fake providers.",
    refs: "PR #67",
    status: "completed",
  },
];

export const roadmap: RoadmapItem[] = [
  {
    title: "Live professional answers",
    description:
      "Unblock professional and PDF-brief runs: a higher provider tier, a working Gemini fallback, or a shorter professional output schema.",
    status: "blocked",
  },
  {
    title: "InLegalBERT and LlamaIndex scope decision",
    description:
      "The implementation uses deterministic NER and a hand-built hybrid retriever instead of the planned InLegalBERT and LlamaIndex. This change awaits the guide's approval.",
    status: "pending-approval",
  },
  {
    title: "Evaluation expansion",
    description:
      "Grow the retrieval benchmark from 30 towards about 100 queries and compare LLM-only, semantic-only and full-pipeline configurations.",
    status: "planned",
  },
  {
    title: "Serialise model inference on Apple MPS",
    description:
      "When start-up warm-up overlapped the first request, the backend crashed in the embedding model on MPS. Inference on one MPS model is not yet serialised, so the end-to-end real mode runs with warm-up off until this is fixed.",
    status: "planned",
  },
  {
    title: "Deployment",
    description: "Deploy the backend, frontend and persistent stores.",
    status: "planned",
  },
  {
    title: "User acceptance testing",
    description:
      "Structured sessions with 2–3 law students or practitioners for Professional Mode and 3–5 non-technical users for Public Mode.",
    status: "planned",
  },
  {
    title: "Legal review of extracted data",
    description:
      "Qualified review of rule-extracted judgment outcomes and the IPC-BNS mapping, which are currently unreviewed.",
    status: "planned",
  },
];
