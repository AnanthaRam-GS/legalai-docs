import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ChartFrame } from "@/components/charts/ChartFrame";
import { LatencyChart } from "@/components/charts/LatencyChart";
import { RetrievalChart } from "@/components/charts/RetrievalChart";
import { Container } from "@/components/layout/Container";
import { Callout } from "@/components/ui/Callout";
import { MetricTable } from "@/components/ui/MetricTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";

export const metadata: Metadata = {
  title: "Results",
  description:
    "Retrieval quality, reranker latency, OCR accuracy, citation validity, NCRB validation and store reconciliation, each with its sample size, date and source.",
};

const toc = [
  { id: "retrieval", label: "Retrieval quality" },
  { id: "latency", label: "Latency" },
  { id: "ocr", label: "OCR accuracy" },
  { id: "citations", label: "Citation validity" },
  { id: "ncrb", label: "NCRB validation" },
  { id: "reconciliation", label: "Reconciliation" },
];

function ResultSection({
  id,
  title,
  meta,
  children,
}: {
  id: string;
  title: string;
  meta: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="border-t border-border pt-12 first:border-t-0 first:pt-0"
    >
      <h2 id={id} className="scroll-mt-24 font-serif text-3xl font-bold">
        {title}
      </h2>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">{meta}</div>
      <div className="mt-6 max-w-4xl leading-7 text-muted [&_strong]:text-fg">{children}</div>
    </section>
  );
}

const Meta = ({ children }: { children: ReactNode }) => (
  <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-fg">
    {children}
  </span>
);

export default function ResultsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Results"
        title="What has been measured so far"
        description="Every figure shows its sample size, date and source document in the LegalAI repository. Samples are small; read the caveats with the numbers."
      >
        <nav aria-label="On this page" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="inline-block rounded-full border border-border px-3 py-1 text-sm text-muted hover:border-border-strong hover:text-fg"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <Container className="space-y-16 py-16">
        <ResultSection
          id="retrieval"
          title="Retrieval quality"
          meta={
            <>
              <StatusBadge status="historical" />
              <Meta>30 queries</Meta>
              <Meta>695 human relevance judgments</Meta>
              <Meta>Corpus: 70 judgments, 1,356 chunks</Meta>
              <Meta>As of 7 September 2026</Meta>
            </>
          }
        >
          <p>
            Four systems were compared on a frozen benchmark: BM25 alone, dense retrieval alone,
            their fusion, and fusion followed by the cross-encoder reranker. The full pipeline
            (Hybrid+Rerank) matches or beats the others on every overall metric, and its clearest
            gain is in ranking order (nDCG@5) and under strict relevance.
          </p>
          <ChartFrame
            title="Overall retrieval metrics (broad relevance)"
            description="Higher is better. The y-axis starts at zero."
            footnote="Source: docs/RETRIEVAL_EVALUATION_RESULTS.md. 30 queries, 695 judgments, one reviewer, pooled relevance."
          >
            <RetrievalChart />
          </ChartFrame>
          <MetricTable
            caption="Retrieval metrics by system"
            columns={[
              { key: "system", label: "System" },
              { key: "p5", label: "P@5", numeric: true },
              { key: "r20", label: "Pooled R@20", numeric: true },
              { key: "mrr", label: "MRR@5", numeric: true },
              { key: "ndcg", label: "nDCG@5", numeric: true },
              { key: "hit", label: "Doc hit@5", numeric: true },
              { key: "p5s", label: "P@5 strict", numeric: true },
              { key: "ndcgs", label: "nDCG@5 strict", numeric: true },
            ]}
            rows={[
              {
                system: "BM25",
                p5: "0.833",
                r20: "0.673",
                mrr: "0.917",
                ndcg: "0.728",
                hit: "0.933",
                p5s: "0.533",
                ndcgs: "0.621",
              },
              {
                system: "Dense (BGE-M3)",
                p5: "0.860",
                r20: "0.686",
                mrr: "0.942",
                ndcg: "0.786",
                hit: "1.000",
                p5s: "0.593",
                ndcgs: "0.679",
              },
              {
                system: "Hybrid (RRF)",
                p5: "0.873",
                r20: "0.705",
                mrr: "0.961",
                ndcg: "0.787",
                hit: "1.000",
                p5s: "0.593",
                ndcgs: "0.678",
              },
              {
                system: "Hybrid + Rerank",
                p5: "0.873",
                r20: "0.723",
                mrr: "0.961",
                ndcg: "0.819",
                hit: "1.000",
                p5s: "0.633",
                ndcgs: "0.753",
                highlight: true,
              },
            ]}
            footnote="Broad relevance counts grades 1 and 2; strict counts grade 2 only. Recall is pooled recall. Source: docs/RETRIEVAL_EVALUATION_RESULTS.md (2026-09-07). Re-run on 2026-10-21 after moving the models to Apple MPS: identical values and top-5 order on all 30 queries (docs/performance/PERFORMANCE_BASELINE.md)."
          />
          <Callout kind="warning" title="Read with care">
            <p>
              On broad P@5 the reranker improved 3 queries, worsened 5 and left 22 unchanged (mean
              change 0.0). Differences are descriptive; a 10,000-resample paired bootstrap was run
              for confidence intervals and does not establish significance.
            </p>
            <p>
              Limits: a single reviewer, pooled rather than exhaustive judgments, only 3
              transition-law queries, a benchmark built from the same small corpus, and retrieval
              only (not answer quality). Expansion towards about 100 queries is planned.
            </p>
          </Callout>
        </ResultSection>

        <ResultSection
          id="latency"
          title="Reranker latency: CPU vs Apple MPS"
          meta={
            <>
              <Meta>10 queries × 3 passes = 30 samples per configuration</Meta>
              <Meta>Apple M5, 24 GB</Meta>
              <Meta>As of 21 October 2026</Meta>
            </>
          }
        >
          <p>
            Reranking dominated query time on CPU. Moving the reranker to the Apple GPU (MPS) in
            fp16, while keeping the query embedder in fp32 to match the stored vectors, cut median
            rerank time <strong>4.2×</strong> with the same top-5 results on all 30 benchmark
            queries.
          </p>
          <ChartFrame
            title="Rerank latency by configuration"
            description="Lower is better. The chosen configuration keeps the embedder in fp32 and runs the reranker in fp16."
            footnote="Source: docs/performance/PERFORMANCE_BASELINE.md. Run-to-run variance on MPS is about 15–20%."
          >
            <LatencyChart />
          </ChartFrame>
          <MetricTable
            caption="Rerank and retrieval latency (milliseconds)"
            columns={[
              { key: "config", label: "Configuration" },
              { key: "r50", label: "Rerank p50", numeric: true },
              { key: "r95", label: "Rerank p95", numeric: true },
              { key: "t50", label: "Retrieval p50", numeric: true },
              { key: "t95", label: "Retrieval p95", numeric: true },
            ]}
            rows={[
              {
                config: "CPU, fp32 (before)",
                r50: "8,002",
                r95: "9,795",
                t50: "8,094",
                t95: "9,906",
              },
              { config: "MPS, all fp32", r50: "5,324", r95: "5,918", t50: "5,405", t95: "6,094" },
              { config: "MPS, all fp16", r50: "1,247", r95: "1,378", t50: "1,309", t95: "1,422" },
              {
                config: "MPS, embedder fp32 + reranker fp16 (chosen)",
                r50: "1,884",
                r95: "2,160",
                t50: "1,956",
                t95: "2,237",
                highlight: true,
              },
            ]}
            footnote="Source: docs/performance/PERFORMANCE_BASELINE.md (2026-10-21)."
          />
          <p>
            End to end, the two answered professional text queries in the live runs took a median of{" "}
            <strong>14.7 s</strong> on CPU against a 15 s target, with reranking and generation
            about 7.3 s each. Replacing the CPU rerank time with the MPS figure projects{" "}
            <strong>9.1–9.4 s</strong>; this is a projection, not a new measurement.
          </p>
        </ResultSection>

        <ResultSection
          id="ocr"
          title="OCR accuracy"
          meta={
            <>
              <Meta>6 fixture pages</Meta>
              <Meta>Tesseract 5.5.3, English, 300 DPI</Meta>
              <Meta>As of 23 October 2026</Meta>
            </>
          }
        >
          <p>
            Character accuracy is 1 − (edit distance ÷ source length), comparing the OCR text of
            each scanned page with the same page&rsquo;s native text.
          </p>
          <MetricTable
            caption="OCR character accuracy on test fixtures"
            columns={[
              { key: "fixture", label: "Fixture page" },
              { key: "acc", label: "Character accuracy", numeric: true },
              { key: "conf", label: "Mean confidence", numeric: true },
            ]}
            rows={[
              { fixture: "Scanned FIR, page 1", acc: "99.81%", conf: "95.2" },
              { fixture: "Scanned FIR, page 2", acc: "100.00%", conf: "95.3" },
              { fixture: "Scanned judgment page", acc: "99.90%", conf: "95.3" },
              { fixture: "Mixed PDF, scanned page 2", acc: "99.81%", conf: "95.2" },
              { fixture: "Mixed PDF, scanned page 4", acc: "99.90%", conf: "95.3" },
              { fixture: "Degraded FIR scan", acc: "72.58%", conf: "67.3 (flagged)" },
            ]}
            footnote="Source: docs/OCR.md (2026-10-23). Median OCR time 0.57 s per page (n = 6). The degraded scan falls below the confidence threshold of 80, so answers built from it carry a warning."
          />
        </ResultSection>

        <ResultSection
          id="citations"
          title="Citation validity: prompt v1 vs v2"
          meta={
            <>
              <StatusBadge status="historical" />
              <Meta>Supervised live runs, steps 11–11d</Meta>
              <Meta>19–20 October 2026</Meta>
            </>
          }
        >
          <MetricTable
            caption="Citations that passed validation"
            columns={[
              { key: "prompt", label: "Prompt" },
              { key: "valid", label: "Valid citations", numeric: true },
              { key: "runs", label: "Answered runs counted" },
            ]}
            rows={[
              { prompt: "v1 (baseline)", valid: "3 of 7", runs: "Steps 11 and 11b" },
              {
                prompt: "v2 (current)",
                valid: "5 of 5",
                runs: "2 public runs in step 11d, plus 2 correct no-coverage answers",
                highlight: true,
              },
            ]}
            footnote="Source: docs/live_runs/LIVE_RUN_SUMMARY.md (2026-10-20)."
          />
          <Callout kind="warning" title="Very small sample">
            Twelve citations across a handful of runs show a direction, not a rate. Professional
            runs could not be completed on the current provider tier: the professional answer
            exceeded the output-token limit even at low reasoning effort.{" "}
            <StatusBadge status="blocked" />
          </Callout>
        </ResultSection>

        <ResultSection
          id="ncrb"
          title="NCRB data validation"
          meta={
            <>
              <Meta>Crime in India 2024, Vol. I, Table 1A.4</Meta>
              <Meta>6,201 rows</Meta>
              <Meta>As of 24 October 2026</Meta>
            </>
          }
        >
          <p>
            After the original CSV failed to add up, the table was re-extracted from the official
            PDF and checked against its own arithmetic and an independent summary table (Table
            1A.1).
          </p>
          <MetricTable
            caption="Validation checks on the re-extracted table"
            columns={[
              { key: "check", label: "Check" },
              { key: "n", label: "Checks", numeric: true },
              { key: "ex", label: "Exceptions", numeric: true },
            ]}
            rows={[
              { check: "Row: Total = IPC + BNS", n: "5,967", ex: "0" },
              { check: "Columns: states, UTs and all-India totals", n: "1,869", ex: "0" },
              { check: "Hierarchy: subtotals and group totals", n: "975", ex: "0" },
              { check: "Structure: printed letters match children (heads)", n: "25", ex: "0" },
              { check: "Cross-check with Table 1A.1", n: "117", ex: "0" },
              { check: "Total", n: "8,953", ex: "0", highlight: true },
            ]}
            footnote="Source: docs/analytics/NCRB_CORRECTION.md and the re-extraction commit message (2026-10-23). A visual spot check of 120 cells against the PDF found 120 matches."
          />
          <p>
            The all-India total of <strong>3,544,608</strong> cognizable IPC/BNS crimes (1,903,047
            IPC + 1,641,561 BNS) equals the published summary in Table 1A.1, and the analytics
            endpoint&rsquo;s default rows (4,824 non-aggregate rows) sum to exactly that figure, so
            nothing is double counted.
          </p>
        </ResultSection>

        <ResultSection
          id="reconciliation"
          title="Analytics and store reconciliation"
          meta={
            <>
              <Meta>Development database</Meta>
              <Meta>17–24 October 2026</Meta>
            </>
          }
        >
          <p>
            An inventory found that PostgreSQL held none of the curated corpus, only test fixtures
            written by earlier un-isolated test runs, while the two indexes held the corpus plus a
            few test chunks. A rehearsed cleanup and backfill fixed this.
          </p>
          <MetricTable
            caption="Store contents before and after reconciliation"
            columns={[
              { key: "store", label: "Store" },
              { key: "before", label: "Before", numeric: true },
              { key: "after", label: "After", numeric: true },
            ]}
            rows={[
              {
                store: "PostgreSQL documents",
                before: "66 (all test fixtures)",
                after: "70 (corpus)",
              },
              { store: "PostgreSQL chunks", before: "88 (all test fixtures)", after: "1,356" },
              { store: "Chroma vectors", before: "1,356", after: "1,356" },
              { store: "BM25 records", before: "1,363 (7 test chunks)", after: "1,356" },
              { store: "Cross-store mismatches", before: "—", after: "0", highlight: true },
            ]}
            footnote="Sources: docs/reconciliation/RECONCILIATION_PLAN.md (before) and docs/reconciliation/INVENTORY_REPORT.md (after)."
          />
          <ul className="list-disc space-y-2 pl-5">
            <li>
              The analytics verifier compares all five endpoints with direct SQL and reports{" "}
              <strong>RECONCILED</strong> (5 of 5 identical) after each data change.
            </li>
            <li>
              The store-consistency verifier reports <strong>CONSISTENT</strong> for PostgreSQL,
              Chroma and BM25 after every change, including the live runs.
            </li>
            <li>
              Section extraction produced 920 rows for 70 of 70 documents, all with provenance.
              Outcome values remain <strong>unreviewed</strong> pending legal review.
            </li>
          </ul>
        </ResultSection>
      </Container>
    </>
  );
}
