# Sources for claims on this site

Every number and factual claim on the LegalAI documentation site maps to a file in the
[LegalAI repository](https://github.com/AnanthaRam-GS/lexintelAI). Paths are relative to that
repository and describe `main` at commit **`ed3cc76`** (merge of PR #67, 25 October 2026) unless a
row says otherwise.

"Build plan" means the team's internal _Developer Implementation Plan_ (version 1.1, last updated
2 September 2026). It is an internal document: it is used for facts only and is **not** copied into or
linked from this site.

When you change a number in `content/site.ts`, a page or an MDX file, update its row here.

## Project facts

| Claim                                                                                                       | Source                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title, course 23CSE399, department, school, institution                                                     | Build plan, title page                                                                                                                                              |
| Guide: Dr. Sabarish B A, Assistant Professor, Dept. of CSE                                                  | Build plan, title page                                                                                                                                              |
| Team names, registration numbers and roles                                                                  | Build plan, title page                                                                                                                                              |
| Team responsibilities                                                                                       | Build plan, sections 6–7 (work packages 0.1–0.6, 1.A.x, 1.R.x, 2.V.x, 3.G.x, 4.x)                                                                                   |
| Phases 0–4, Phase 1 review checklist ("60% completion target")                                              | Build plan, sections 6–7                                                                                                                                            |
| UAT target: 2–3 law students or practitioners, 3–5 non-technical users                                      | Build plan, task 4.ALL                                                                                                                                              |
| Evaluation target of about 100 queries; LLM-only / semantic / full-pipeline comparison                      | Build plan, task 4.A.1                                                                                                                                              |
| CourtSim deferred to future work                                                                            | Build plan, section 9                                                                                                                                               |
| 67 merged pull requests; milestone dates and PR numbers                                                     | `git log main --merges`                                                                                                                                             |
| CI: four jobs (`backend-unit`, `backend-db`, `frontend`, `e2e`), no secrets, on every PR and push to `main` | `.github/workflows/ci.yml`; `docs/TESTING.md`, Continuous integration; PR #67                                                                                       |
| InLegalBERT / LlamaIndex scope change awaiting the guide's approval                                         | Status supplied by the project owner; the deviations themselves are in `docs/LEGAL_NER_SELECTION_DECISION.md` and the absence of LlamaIndex from `requirements.txt` |

## Home page stats (`content/site.ts` → `stats`)

| Claim                                                                                                | Source                                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 70 trusted judgments, 1,356 chunks, consistent across PostgreSQL, Chroma and BM25 (as of 2026-10-19) | `docs/INDEX_METADATA.md` (Dev results 2026-10-19); `docs/reconciliation/INVENTORY_REPORT.md`                                                                                                                       |
| P@5 0.873, MRR@5 0.961, nDCG@5 0.819 (Hybrid+Rerank, broad)                                          | `docs/RETRIEVAL_EVALUATION_RESULTS.md`, Overall Metrics                                                                                                                                                            |
| 30 queries, 695 human relevance judgments, corpus 70 / 1,356                                         | `docs/RETRIEVAL_EVALUATION_RESULTS.md`, Benchmark Snapshot                                                                                                                                                         |
| Retrieval results dated 2026-09-07                                                                   | `git log` first commit of `docs/RETRIEVAL_EVALUATION_RESULTS.md`                                                                                                                                                   |
| 951 backend test methods in 81 modules (12 database-backed)                                          | `git grep -E '^[[:space:]]+def test_' main -- 'backend/scripts/tests/*.py'`; `git ls-tree` count of `backend/scripts/tests/test_*.py`; `backend/scripts/dev/db_test_modules.txt` (static counts, not a pass count) |
| 291 frontend test cases in 40 files                                                                  | `git grep -E` for `it(`, `test(` and `test.each(...)(` calls over `frontend/**/*.test.ts(x)` on `main`; 40 `*.test.ts(x)` files                                                                                    |
| 15 Playwright end-to-end tests in 6 spec files; journeys covered; fake mode is test-only             | `frontend/e2e/*.spec.ts` on `main`; `docs/TESTING.md`, End-to-end browser tests                                                                                                                                    |
| 5 local-only tests skipped in CI                                                                     | `docs/TESTING.md`, Local-only tests                                                                                                                                                                                |
| MPS warm-up overlapping the first request crashed the backend; inference not serialised              | `docs/TESTING.md`, Local real mode                                                                                                                                                                                 |
| Reranker speed-up 4.2× at p50, MPS fp16 vs CPU fp32, 10 queries × 3 passes                           | `docs/performance/PERFORMANCE_BASELINE.md`, Latency                                                                                                                                                                |

## Overview

| Claim                                                                             | Source                                                                         |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| BNS/BNSS replaced IPC/CrPC from 1 July 2024                                       | `docs/TRANSITION_VALIDATION_SET.md` ("post-1 July 2024 BNS / BNSS transition") |
| Predicted sections are supplementary signals, not legal conclusions               | Build plan, Layer 3                                                            |
| Corpus of 70 judgments; special Acts supported (Evidence Act, NDPS, POCSO, SC/ST) | `docs/ANALYTICS_DATA.md`, Section producer                                     |
| Uploads are not added to the corpus                                               | `docs/API_CONTRACTS.md`, Professional Query and Public Query                   |

## Features

| Claim                                                                                        | Source                                                                                 |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| No-coverage answer wording; sources are validated citations only                             | `docs/API_CONTRACTS.md`, Public Query; `docs/LLM_PROVIDER_CONFIGURATION.md`, Prompt v2 |
| Public limit 5/min, 100/day per IP; professional 10/min, 300/day per user                    | `docs/SECURITY.md`, Rate limits                                                        |
| Precedent fields, excerpt ≤ 400 characters, relative relevance definition, `cited_in_answer` | `docs/API_CONTRACTS.md`, Professional Query                                            |
| Brief fields (parties, chronology, procedural stages, evidence) with `[P#, p. N]` references | `docs/API_CONTRACTS.md`, Case-brief field sources                                      |
| History stores no uploaded-document text                                                     | `docs/API_CONTRACTS.md`                                                                |
| Live professional runs blocked by provider capacity                                          | `docs/live_runs/LIVE_RUN_SUMMARY.md`, Not run / Open items                             |
| Five dashboards                                                                              | Build plan, Flow 4; `docs/ANALYTICS_DATA.md`                                           |
| Offence-only default; extracted values unreviewed                                            | `docs/ANALYTICS_DATA.md`                                                               |
| Ingestion stages, all-or-nothing writes, duplicate rejection, store health                   | `docs/INGESTION_RELIABILITY.md`                                                        |
| OCR: < 50 characters + image, 300 DPI, confidence threshold 80, caps 10 / 200 pages          | `docs/OCR.md`, How pages are chosen and Limits                                         |

## Architecture

| Claim                                                                                  | Source                                                                                     |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Layer responsibilities                                                                 | Build plan, section 2; `docs/API_CONTRACTS.md`; `docs/SECURITY.md`; `backend/app/api/*.py` |
| BGE-M3 1024-d; BM25 k1 1.5, b 0.75; RRF k 60; depth 20; top 5; reranker max_length 512 | `docs/RETRIEVAL_TUNING_DECISION.md`, Selected Configuration                                |
| Groq `openai/gpt-oss-120b` primary, Gemini fallback only on provider failure           | `docs/LLM_PROVIDER_CONFIGURATION.md`                                                       |
| Evidence IDs E#, private P#                                                            | `docs/RICH_PROFESSIONAL_BRIEF_PIPELINE.md`, Evidence Boundaries                            |
| Ingestion ordering, cleanup, 30-minute stale-job reaper                                | `docs/INGESTION_RELIABILITY.md`                                                            |
| Table and column names                                                                 | `backend/app/db/models.py`                                                                 |
| 370 mapping rows; 6,201 NCRB rows                                                      | `docs/ANALYTICS_DATA.md`; `docs/analytics/NCRB_CORRECTION.md`                              |
| Chroma collection `legalai_trusted_judgments_v1`                                       | `docs/INGESTION_RELIABILITY.md`                                                            |

## Methodology

| Claim                                                                                  | Source                                                                    |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Indian Kanoon API, provenance fields, staged scaling (500 / 2,000 / 8,000–10,000)      | `docs/DATA_SOURCES.md`                                                    |
| 48 High Court, 14 Supreme Court, 8 district/sessions                                   | `docs/ANALYTICS_DATA.md`, Court level                                     |
| 4,195 paragraphs, 1,356 chunks; chunk target 650, max 900, overlap 100                 | `docs/JUDGMENT_DOCUMENT_PROCESSING.md`                                    |
| BM25 312, dense 327, both 171, union 468 of 473 relevant candidates                    | `docs/RETRIEVAL_TUNING_DECISION.md`, Candidate Complementarity            |
| 20-query development set, 474 judgments; three inconclusive experiments                | `docs/RETRIEVAL_TUNING_DECISION.md`                                       |
| Prompt v1/v2, SHA-256 pinning, provider-chain rules                                    | `docs/LLM_PROVIDER_CONFIGURATION.md`                                      |
| 920 section rows, 1,961 / 63 / 20 rejected                                             | `docs/ANALYTICS_DATA.md`, Section producer                                |
| Outcome rule safeguards                                                                | `docs/ANALYTICS_DATA.md`, Outcome producer                                |
| NCRB: about 8,950 checks (8,953), 0 exceptions; 120-cell spot check                    | `docs/analytics/NCRB_CORRECTION.md`, Validation; commit `7103029` message |
| Evaluation: 5 query types, grades 0/1/2, metric definitions, 10,000-resample bootstrap | `docs/RETRIEVAL_EVALUATION_RESULTS.md`                                    |
| NER gold set 36 examples / 89 entities; deterministic F1 0.788                         | `docs/LEGAL_NER_SELECTION_DECISION.md`                                    |
| Section ranking on 36 queries, cross-encoder best                                      | `docs/LEGAL_SECTION_RANKING_SELECTION_DECISION.md`                        |
| Isolated test DB, backups and rehearsal, verifiers                                     | `docs/TESTING.md`; `docs/reconciliation/EXECUTION_RUNBOOK.md`             |
| Error contract and request IDs                                                         | `docs/API_CONTRACTS.md`, Error Format                                     |

## Tech stack

| Claim                                                                                                            | Source                                                                                       |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Frontend versions (Next.js 16, React 19, TypeScript 6, Tailwind 4, Recharts 3, Vitest)                           | `frontend/package.json`                                                                      |
| Backend and AI packages (FastAPI 0.115, SQLAlchemy, Alembic, PyJWT, bcrypt, FlagEmbedding, PyMuPDF, pytesseract) | `requirements.txt`                                                                           |
| Tesseract 5.5.3                                                                                                  | `docs/OCR.md`                                                                                |
| Embedded Chroma `PersistentClient`                                                                               | `docs/SECURITY.md`, Dependency scan                                                          |
| Planned stack                                                                                                    | Build plan, section 3 (Confirmed Technology Stack)                                           |
| Groq deviation and reason                                                                                        | `docs/LLM_PROVIDER_CONFIGURATION.md` (temporary deviation, owner decision)                   |
| InLegalBERT not adopted, reasons                                                                                 | `docs/LEGAL_NER_SELECTION_DECISION.md`; `docs/LLM_PROVIDER_CONFIGURATION.md`, InLegalBERT    |
| Cross-encoder section ranking                                                                                    | `docs/LEGAL_SECTION_RANKING_SELECTION_DECISION.md`                                           |
| Ollama adapter is a stub                                                                                         | `docs/LLM_PROVIDER_CONFIGURATION.md`, Ollama                                                 |
| Chunk-size deviation                                                                                             | Build plan, Flow 1 (400–600, 50) vs `docs/JUDGMENT_DOCUMENT_PROCESSING.md` (650 / 900 / 100) |
| MPS fp16 reranker, identical top-5 on 30 queries                                                                 | `docs/performance/PERFORMANCE_BASELINE.md`                                                   |

## Results

| Claim                                                                                              | Source                                                                                                      |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| All retrieval table values (P@5, pooled R@20, MRR@5, nDCG@5, doc hit@5, strict P@5, strict nDCG@5) | `docs/RETRIEVAL_EVALUATION_RESULTS.md`, Overall Metrics                                                     |
| Reranker delta 3 improved / 5 worsened / 22 unchanged                                              | `docs/RETRIEVAL_EVALUATION_RESULTS.md`, Reranker Delta Analysis                                             |
| Identical metrics after the MPS move (2026-10-21)                                                  | `docs/performance/PERFORMANCE_BASELINE.md`, Ranking equivalence                                             |
| Latency table (rerank and retrieval p50/p95 per configuration), 15–20% variance                    | `docs/performance/PERFORMANCE_BASELINE.md`, Latency                                                         |
| Apple M5, 24 GB                                                                                    | `docs/performance/PERFORMANCE_BASELINE.md`                                                                  |
| Professional median 14.7 s over 2 runs, generation and rerank about 7.3 s; projected 9.1–9.4 s     | `docs/live_runs/LIVE_RUN_SUMMARY.md`; `docs/performance/PERFORMANCE_BASELINE.md`, Projected end-to-end time |
| OCR table, 0.57 s per page                                                                         | `docs/OCR.md`, Measured accuracy                                                                            |
| Citation validity v1 3 of 7, v2 5 of 5 plus 2 no-coverage answers                                  | `docs/live_runs/LIVE_RUN_SUMMARY.md`, Citation validation                                                   |
| NCRB check counts 5,967 / 1,869 / 975 / 25 / 117                                                   | Commit `7103029` message; `docs/analytics/NCRB_CORRECTION.md`                                               |
| All-India 3,544,608 = 1,903,047 IPC + 1,641,561 BNS; 4,824 default rows                            | `docs/analytics/NCRB_CORRECTION.md`, Validation                                                             |
| Reconciliation before: PG 66 docs / 88 chunks (fixtures), Chroma 1,356, BM25 1,363                 | `docs/reconciliation/RECONCILIATION_PLAN.md`, section 1                                                     |
| Reconciliation after: 70 / 1,356 in every store, 0 mismatches                                      | `docs/reconciliation/INVENTORY_REPORT.md`                                                                   |
| Analytics verifier RECONCILED 5 of 5; store verifier CONSISTENT                                    | `docs/analytics/NCRB_CORRECTION.md`, Reload; `docs/live_runs/LIVE_RUN_SUMMARY.md`, Other checks             |

## Documentation pages

| Claim                                                                                                                 | Source                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Setup steps, environment variable names                                                                               | `docs/PHASE1_E2E_UAT_READINESS.md`, Startup Procedure; `.env.example` (names only)                                     |
| JWT secret ≥ 32 bytes; startup refusals                                                                               | `docs/SECURITY.md`, Startup checks                                                                                     |
| Endpoints and roles                                                                                                   | `backend/app/api/*.py` (route decorators and `require_*` dependencies); `backend/main.py`                              |
| Error-code catalogue                                                                                                  | `docs/API_CONTRACTS.md`, Error-code catalogue                                                                          |
| Data sources table, NCRB file integrity, 159 heads × 39 rows, mapping 367 direct / 3 repealed, 22 matches / 7 missing | `docs/DATA_SOURCES.md`; `data/raw/ncrb/SOURCES.md`; `data/raw/ipc_bns/SOURCES.md`; `docs/analytics/NCRB_CORRECTION.md` |
| Login throttling 5 / 20 within 900 s, 900 s lockout; generation cap 4, 10 s wait                                      | `docs/SECURITY.md`                                                                                                     |
| JWT expiry 60 minutes                                                                                                 | `docs/SECURITY.md`, Residual risks                                                                                     |
| Bootstrap guarantees; snapshot, backup, rehearsal procedure                                                           | `docs/TESTING.md`                                                                                                      |
| OCR fixture threshold ≥ 95%                                                                                           | `docs/OCR.md`                                                                                                          |
| BNS/BNSS 33 of 920 section citations                                                                                  | `docs/ANALYTICS_DATA.md`, Section producer (By statute)                                                                |
| 3 transition queries in the benchmark                                                                                 | `docs/RETRIEVAL_EVALUATION_RESULTS.md`, transition_regime                                                              |

## Discrepancies found while writing

- The brief for this site described "about 12,950" NCRB checks. The sources sum to **8,953** (8,928
  arithmetic and cross-table checks plus 25 structure checks), so the site says "about 8,950".
- The brief described the retrieval benchmark as "30 queries, 695 judgments". The 695 are human
  **relevance judgments**; the corpus at the time was 70 judgments (1,356 chunks). The site uses
  the precise wording.
- At `28b23d9`, `docs/TESTING.md` listed 55 + 10 test modules while the code had 80; it now names 12
  database-backed modules and no total. The site uses the count from the code.

## Screenshots

| Claim                                                                      | Source                                                                                                                                             |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| All images in `public/screenshots/`                                        | Captured on 25 October 2026 with `scripts/capture-screenshots.ts` from LegalAI `main` (`ed3cc76`) running locally against the development database |
| Live public answer about IPC 304B with 3 validated sources                 | One live `/query/public` call (HTTP 200); 2 live LLM calls were used in total for the screenshots                                                  |
| Admin status: 70 documents, 1,356 vectors, records and chunks, all healthy | `admin-status.webp`, matching `docs/reconciliation/INVENTORY_REPORT.md`                                                                            |

## Fact-check log (25 October 2026, `28b23d9` → `ed3cc76`)

Only `docs/TESTING.md` and test, CI and e2e files changed between the two commits; routes, models,
dependencies and every other source document are unchanged, so all other rows were re-confirmed as is.

| Claim                                                              | Old                    | New                                                                                               |
| ------------------------------------------------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------- |
| Commit the site describes                                          | `28b23d9` (PR #66)     | `ed3cc76` (PR #67)                                                                                |
| Backend test methods / modules                                     | 938 / 80               | 951 / 81                                                                                          |
| Frontend test cases / files                                        | 291 / 40               | 291 / 40 (unchanged; date updated)                                                                |
| End-to-end tests                                                   | not present            | 15 Playwright tests in 6 specs                                                                    |
| Continuous integration                                             | In progress (unmerged) | Completed: 4 GitHub Actions jobs                                                                  |
| Merged pull requests                                               | 66                     | 67                                                                                                |
| Phase 4 "Continuous integration" item, milestone and roadmap entry | In progress            | Completed; removed from the roadmap                                                               |
| Known issue                                                        | —                      | MPS inference not serialised (new roadmap item and limitation)                                    |
| FE-001                                                             | not mentioned          | A test-only timer-count issue fixed in PR #66 (jsdom storage events); no site claim depends on it |
