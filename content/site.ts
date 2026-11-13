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
  tagline: "Answers on Indian criminal law, with every citation traced to a retrieved judgment.",
  description:
    "Project documentation for LegalAI, a retrieval-augmented legal assistant and analytics system for Indian criminal law, built as a final-year project at Amrita Vishwa Vidyapeetham.",
  course: "23CSE399 Final Year Project",
  department: "Department of Computer Science and Engineering",
  school: "School of Computing",
  institution: "Amrita Vishwa Vidyapeetham",
  /** Public URL of this site, used for canonical links, the sitemap and share cards. */
  siteUrl: "https://legalai-docs.vercel.app",
  repoUrl: "https://github.com/AnanthaRam-GS/lexintelAI",
  docsRepoUrl: "https://github.com/AnanthaRam-GS/legalai-docs",
  /** YouTube or Google Drive link. Leave empty to show the "coming soon" state. */
  demoVideoUrl: "",
  /** ISO date of the last content review. */
  lastUpdated: "2026-11-13",
  /** Commit of the LegalAI main branch that the facts on this site describe. */
  sourceCommit: "220eb02",
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
    value: 1252,
    detail: "across 99 Python test modules",
    sample: "Test methods defined on main (static count, not a pass count)",
    asOf: "2026-11-13",
    source: "backend/scripts/tests/test_*.py on main @ 220eb02",
    status: "completed",
  },
  {
    id: "frontend-tests",
    label: "Frontend test cases",
    value: 319,
    detail: "across 43 Vitest files",
    sample: "Test cases defined on main (static count, not a pass count)",
    asOf: "2026-11-13",
    source: "frontend/**/*.test.ts(x) on main @ 220eb02",
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
        status: "completed",
        note: "Fine-tuned for NER in a bounded experiment (November 2026): exact F1 0.915 against the rules' 0.788 on held-out gold. The section classifier was not feasible: no open BNS/BNSS data.",
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
        note: "InLegalBERT NER combined with the rules, on by default with a rules-only fallback; a BGE cross-encoder ranks sections. Adopted under the guide's rule; sign-off pending.",
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
        status: "completed",
        note: "30-query benchmark, re-run in October 2026 with matching results.",
      },
      {
        label: "Three-configuration answer evaluation (LLM only, dense RAG, full pipeline)",
        status: "completed",
        note: "30 queries re-run in October 2026; a 15-query sample reviewed by an AI reviewer in two rounds.",
      },
      {
        label: "Evaluation review completed (AI-reviewed, two rounds); human verification pending",
        status: "completed",
        note: "Round 2, with full passages: about two-thirds of citations fully supported and three-quarters at least partly; 7 still state the wrong law.",
      },
      {
        label: "Benchmark expansion by about 70 queries",
        status: "in-progress",
        note: "A labelling kit with the frozen pooling rules is ready; queries and labels are being collected.",
      },
      { label: "AI performance profiling", status: "completed" },
      { label: "Backend hardening and unified error contract", status: "completed" },
      { label: "Frontend error states", status: "completed" },
      {
        label: "Live professional query runs",
        status: "completed",
        note: "Unblocked by prompt v3 and Groq per-mode routing; professional answers use gpt-oss-120b only.",
      },
      {
        label: "Rate-limit resilience and daily capacity",
        status: "completed",
        note: "A paced queue per model, clear busy messages, and a rolling 24-hour token budget.",
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
    note: "InLegalBERT NER integrated and on by default after it passed held-out tests; the multi-label classifier was not feasible (no open BNS data), so BGE section ranking remains. Guide sign-off pending.",
  },
  {
    label: "RAG pipeline: hybrid retrieval + reranker returning grounded results",
    status: "completed",
    note: "Every citation points at retrieved evidence (structural); on AI review, about two-thirds are fully supported by the cited passage (October 2026, human check pending).",
  },
  {
    label: "/query/professional returning sections, citations and a structured case brief",
    status: "completed",
    note: "Covered by tests and run live since prompt v3 (October 2026).",
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
  {
    date: "2026-10-26",
    title: "Serialised model inference",
    description:
      "One lock around every model load and inference ended a crash under concurrent queries on Apple MPS (0 crashes in 225 stress-test requests); a duplicate corpus upload now gets a plain message.",
    refs: "PR #68",
    status: "completed",
  },
  {
    date: "2026-10-26",
    title: "Source-attributed IPC-BNS mapping",
    description:
      "Every pair printed in the NCRB table was cross-checked against the mapping, and the 68 missing correspondences were added with their source and page.",
    refs: "PRs #69, #70",
    status: "completed",
  },
  {
    date: "2026-10-27",
    title: "Reproducible setup and safe defaults",
    description:
      "A README tested from a clean checkout, one index-build command, self-hosted fonts, security upgrades (FastAPI, Starlette, Next.js, PyJWT) and safe configuration defaults.",
    refs: "PRs #71, #72",
    status: "completed",
  },
  {
    date: "2026-10-30",
    title: "Provider bake-off, prompt v3 and Groq routing",
    description:
      "Groq, Gemini, NVIDIA and a local Ollama model were compared on the same cases. Prompt v3 made professional answers and briefs fit Groq's limits, with gpt-oss-120b for professional and gpt-oss-20b for public answers.",
    refs: "PRs #73, #74",
    status: "completed",
  },
  {
    date: "2026-10-30",
    title: "Rate-limit resilience",
    description:
      "A paced first-in, first-out queue per answer model, retry times honoured, and a 'queued' notice in the interface; a sustained check answered 8 of 8 queries.",
    refs: "PR #75",
    status: "completed",
  },
  {
    date: "2026-11-02",
    title: "October 2026 evaluation",
    description:
      "Retrieval re-run and the three-configuration answer evaluation on 30 queries; professional answers wait for gpt-oss-120b, and daily usage is tracked over a rolling 24 hours.",
    refs: "PRs #76–#78",
    status: "completed",
  },
  {
    date: "2026-11-08",
    title: "Verified section labels",
    description:
      "Every section an answer names is resolved against trusted sources: a trusted title is shown, a wrong statute is corrected, and the model's own label is kept for audit and marked unverified when nothing trusted exists.",
    refs: "PR #79",
    status: "completed",
  },
  {
    date: "2026-11-12",
    title: "InLegalBERT experiments",
    description:
      "A bounded experiment with thresholds frozen before training: NER F1 0.915 vs 0.788, no retrieval or brief regression, a failed Parties & Roles step, then a held-out judge passing all six rules. The combined NER is on by default.",
    refs: "PRs #80–#85",
    status: "completed",
  },
  {
    date: "2026-11-13",
    title: "Official section headings",
    description:
      "IPC, Evidence Act, BNS, BNSS and BSA headings from India Code (57 → 214 of 370 cited sections titled), document-evidence statute correction, a larger brief output budget, and official headings with conflict flags in the IPC-BNS dashboard.",
    refs: "PR #86",
    status: "completed",
  },
  {
    date: "2026-11-13",
    title: "Evaluation review, two rounds",
    description:
      "An AI reviewer, blind to configuration, judged the 15 × 3 sample: round 1 on 600-character excerpts, round 2 on full passages. Fully supported citations rose from about 21% to 67%; human verification is pending.",
    refs: "PRs #88–#90",
    status: "completed",
  },
];

export const roadmap: RoadmapItem[] = [
  {
    title: "Human verification of the October 2026 review",
    description:
      "A person checks the AI review of the blinded 15 queries × 3 configurations sample, starting with the 7 citations judged to state the wrong law and the 12 judged not supported.",
    status: "planned",
  },
  {
    title: "InLegalBERT and LlamaIndex scope decision",
    description:
      "InLegalBERT NER was adopted under the guide's rule after a bounded experiment, and the section classifier was dropped for lack of open BNS data; the retriever is hand-built instead of LlamaIndex. Both await the guide's sign-off.",
    status: "pending-approval",
  },
  {
    title: "Benchmark expansion",
    description:
      "Add about 70 retrieval queries with human labels, using the labelling kit and the frozen pooling rules, then recompute the retrieval metrics.",
    status: "in-progress",
  },
  {
    title: "Human check of the InLegalBERT judge and real FIRs",
    description:
      "Have a person verify the 5 AI-labelled judge excerpts, and test the accused-role fix on a held-out set of real FIRs and charge sheets.",
    status: "planned",
  },
  {
    title: "Check case names in answer text",
    description:
      "Detect case names written in an answer's text that match no retrieved evidence, so they are flagged like unsupported citations.",
    status: "planned",
  },
  {
    title: "Deployment",
    description:
      "Deploy the backend, frontend and persistent stores, within the answer provider's daily capacity.",
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
