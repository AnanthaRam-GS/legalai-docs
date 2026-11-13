import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChartFrame } from "@/components/charts/ChartFrame";
import { ComparisonChart } from "@/components/charts/ComparisonChart";
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
    "The October 2026 three-configuration evaluation, retrieval quality, reranker latency, OCR accuracy, citation validity, NCRB validation, store reconciliation, the InLegalBERT experiments and section-label coverage, each with its sample size, date and source.",
  alternates: { canonical: "/results/" },
};

const toc = [
  { id: "evaluation-2026-10", label: "October 2026 evaluation" },
  { id: "retrieval", label: "Retrieval quality (historical)" },
  { id: "latency", label: "Latency" },
  { id: "ocr", label: "OCR accuracy" },
  { id: "citations", label: "Citation validity" },
  { id: "ncrb", label: "NCRB validation" },
  { id: "reconciliation", label: "Reconciliation" },
  { id: "experiments", label: "Model experiments" },
  { id: "section-labels", label: "Section labels" },
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

const REVIEW_CHART = [
  {
    metric: "B strict",
    "Round 1 (600-character excerpts)": 0.225,
    "Round 2 (full passages)": 0.65,
  },
  {
    metric: "B lenient",
    "Round 1 (600-character excerpts)": 0.7,
    "Round 2 (full passages)": 0.775,
  },
  { metric: "C strict", "Round 1 (600-character excerpts)": 0.19, "Round 2 (full passages)": 0.69 },
  {
    metric: "C lenient",
    "Round 1 (600-character excerpts)": 0.595,
    "Round 2 (full passages)": 0.762,
  },
];

const Meta = ({ children }: { children: ReactNode }) => (
  <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-fg">
    {children}{" "}
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
          id="evaluation-2026-10"
          title="October 2026 evaluation: LLM-only vs dense RAG vs full LegalAI"
          meta={
            <>
              <StatusBadge status="completed" />
              <Meta>30 queries × 3 configurations</Meta>
              <Meta>Groq gpt-oss-120b / 20b, prompt v3</Meta>
              <Meta>30 October – 1 November 2026</Meta>
              <Meta>AI-reviewed in two rounds; human check pending</Meta>
            </>
          }
        >
          <p>
            The frozen benchmarks were re-run on the current corpus and product. Retrieval was
            re-scored against the frozen human labels; answers were generated for the 30 frozen
            answer-evaluation queries (15 public, 15 professional) under three configurations:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>
              <strong>A, LLM only:</strong> no evidence; a v3-style prompt that forbids invented
              authority.
            </li>
            <li>
              <strong>B, dense RAG:</strong> BGE-M3 dense top 5 only (no BM25, fusion or reranker),
              prompt v3.
            </li>
            <li>
              <strong>C, full LegalAI:</strong> hybrid BM25 + dense fusion and the BGE reranker, top
              5, prompt v3, through the product&rsquo;s own generation and citation validation.
            </li>
          </ul>

          <h3 className="mt-8 font-serif text-xl font-bold text-fg">Retrieval re-run</h3>
          <MetricTable
            caption="Retrieval re-run on the frozen 30-query benchmark (broad relevance unless marked strict)"
            columns={[
              { key: "system", label: "System" },
              { key: "p5", label: "P@5", numeric: true },
              { key: "r5", label: "Pooled R@5", numeric: true },
              { key: "r20", label: "Pooled R@20", numeric: true },
              { key: "mrr", label: "MRR@5", numeric: true },
              { key: "ndcg", label: "nDCG@5", numeric: true },
              { key: "p5s", label: "P@5 strict", numeric: true },
              { key: "same", label: "Rankings equal to frozen", numeric: true },
            ]}
            rows={[
              {
                system: "BM25",
                p5: "0.833",
                r5: "0.277",
                r20: "0.673",
                mrr: "0.917",
                ndcg: "0.728",
                p5s: "0.533",
                same: "30/30",
              },
              {
                system: "Dense (BGE-M3)",
                p5: "0.860",
                r5: "0.284",
                r20: "0.686",
                mrr: "0.942",
                ndcg: "0.786",
                p5s: "0.593",
                same: "30/30",
              },
              {
                system: "Hybrid (RRF)",
                p5: "0.873",
                r5: "0.286",
                r20: "0.705",
                mrr: "0.961",
                ndcg: "0.785 (frozen 0.787)",
                p5s: "0.587 (frozen 0.593)",
                same: "29/30",
              },
              {
                system: "Hybrid + Rerank",
                p5: "0.873",
                r5: "0.290",
                r20: "0.723",
                mrr: "0.961",
                ndcg: "0.819",
                p5s: "0.633",
                same: "30/30",
                highlight: true,
              },
            ]}
            footnote="Source: docs/evaluation/EVALUATION_2026-10.md, section 2, and data/evaluation/runs/2026-10_v3_groq/retrieval/ (re-run 30 October 2026). 30 queries, 695 frozen human labels. Recall is pooled recall: relevant means judged relevant within the pool, so it understates recall against the whole corpus."
          />
          <p>
            Every value equals the frozen September result except hybrid nDCG@5 and strict P@5,
            which differ in one query (eval-q005): one chunk now also appears at dense rank 20, the
            edge of the dense candidate list, which moves it from hybrid rank 11 to 5. The full
            pipeline (Hybrid + Rerank) is unchanged. The frozen benchmark files were only read;
            their hashes were checked before and after.
          </p>

          <h3 className="mt-8 font-serif text-xl font-bold text-fg">Answer generation</h3>
          <p>
            Grounding is reported at three levels, each with its own sample.{" "}
            <strong>Structural</strong> grounding asks whether every citation points at real
            retrieved evidence with matching metadata; it is checked automatically on every answer.{" "}
            <strong>Reviewed</strong> grounding asks whether the cited passage actually supports the
            claim. It was judged on a stratified review sample of 15 queries × 3 configurations by
            an AI reviewer, so it uses that sample, not the 24-query paired set.
          </p>
          <MetricTable
            caption="Grounding at three levels, by configuration"
            columns={[
              { key: "measure", label: "Measure" },
              { key: "a", label: "A, LLM only", numeric: true },
              { key: "b", label: "B, dense RAG", numeric: true },
              { key: "c", label: "C, full LegalAI", numeric: true },
            ]}
            rows={[
              {
                measure:
                  "Structural: citations pointing at real retrieved evidence (paired, 24 queries)",
                a: "n/a (no citations)",
                b: "100% (71/71)",
                c: "100% (73/73)",
              },
              {
                measure: "Structural, on the review sample",
                a: "n/a",
                b: "100% (40/40)",
                c: "100% (42/42)",
              },
              {
                measure: "Reviewed, strict: fully supported (round 2)",
                a: "n/a",
                b: "65.0% (26/40)",
                c: "69.0% (29/42)",
                highlight: true,
              },
              {
                measure: "Reviewed, lenient: at least partly supported (round 2)",
                a: "n/a",
                b: "77.5% (31/40)",
                c: "76.2% (32/42)",
                highlight: true,
              },
              {
                measure: "Citations judged to state the wrong law (round 2)",
                a: "n/a",
                b: "10.0% (4/40)",
                c: "7.1% (3/42)",
              },
              {
                measure: "Answers judged correct (of answers judged)",
                a: "43% (6/14)",
                b: "55% (6/11)",
                c: "46% (6/13)",
              },
            ]}
            footnote="Sources: docs/evaluation/EVALUATION_2026-10.md (sections 3 and 4) and data/evaluation/runs/2026-10_v3_groq/human_review/result.json (round 1) and result_round2.json (round 2). Reviewed rates count structured citations only. Answer correctness is from round 1 (round 2 re-judged citations, not answers); abstentions, failed answers and cannot-judge are excluded from its denominator. A cites no evidence, so it has no citation measures."
          />
          <ChartFrame
            title="Reviewed citation support, round 1 vs round 2"
            description="Share of structured citations judged fully (strict) or at least partly (lenient) supported. B: 40 citations; C: 42 citations; 15 queries × 3 configurations. Higher is better."
            footnote="Round 1 saw each cited passage cut at 600 characters; round 2 re-judged, with the full passage, only the citations round 1 did not call fully supported. Source: data/evaluation/runs/2026-10_v3_groq/human_review/result_round2.json."
          >
            <ComparisonChart
              data={REVIEW_CHART}
              systems={["Round 1 (600-character excerpts)", "Round 2 (full passages)"]}
              ariaLabel="Grouped bar chart. B strict: round 1 0.225, round 2 0.650. B lenient: 0.700 and 0.775. C strict: 0.190 and 0.690. C lenient: 0.595 and 0.762."
            />
          </ChartFrame>
          <p>
            With the full passages, strict support across B and C rose from 17 to 55 of 82
            citations: the 600-character cut caused most of round 1&rsquo;s gap. About a third of
            citations are still not fully supported.
          </p>
          <MetricTable
            caption="Three-configuration generation results"
            columns={[
              { key: "measure", label: "Measure" },
              { key: "a", label: "A, LLM only", numeric: true },
              { key: "b", label: "B, dense RAG", numeric: true },
              { key: "c", label: "C, full LegalAI", numeric: true },
            ]}
            rows={[
              {
                measure: "Schema pass, all 30 queries",
                a: "27 / 30",
                b: "29 / 30",
                c: "28 / 30",
              },
              {
                measure: "Schema pass, public (15)",
                a: "15 / 15",
                b: "15 / 15",
                c: "13 / 15",
              },
              {
                measure: "Schema pass, professional (15)",
                a: "12 / 15",
                b: "14 / 15",
                c: "15 / 15",
              },
              {
                measure: "Valid / total citations, all 30 queries",
                a: "0 / 0",
                b: "84 / 86",
                c: "85 / 85",
              },
              {
                measure: "Out-of-scope queries answered “not covered” (4)",
                a: "0 / 4",
                b: "2 / 4",
                c: "1 / 4",
              },
            ]}
            footnote="Source: docs/evaluation/EVALUATION_2026-10.md and data/evaluation/runs/2026-10_v3_groq/generation/summary.json. Public half run on 30 October 2026, professional half on 31 October, the last cell on 1 November. 84 of 90 records are schema-valid; the 6 that are not are 2 schema failures, 3 provider JSON errors (HTTP 400) and 1 busy refusal, reported as recorded."
          />
          <Callout kind="warning" title="Caveats for the October 2026 evaluation">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>AI-reviewed, not human-verified.</strong> The review was done by an AI chat
                assistant (not Claude Code), blind to which configuration produced each answer, and
                no person has verified it.{" "}
                <StatusBadge status="planned" label="Human check pending" />
              </li>
              <li>
                <strong>Two rounds, with a known bias.</strong> Round 1 saw each cited passage cut
                at 600 characters. Round 2 re-judged, with the full passages, only the citations
                round 1 had not called fully supported, after seeing round 1&rsquo;s verdicts, so it
                may anchor on them and could mostly only move judgments up.
              </li>
              <li>
                <strong>B and C cannot be told apart.</strong> With about 40 citations each, one
                judgment moves a rate by about 2.5 points; B and C are statistically
                indistinguishable on this sample.
              </li>
              <li>
                <strong>7 citations still state the wrong law,</strong> 3 of them in IPC-to-BNS
                transition reasoning (for example, that murder after 1 July 2024 is still IPC 302).
              </li>
              <li>
                <strong>Unsupported case names in the answer text.</strong> The validator checks
                structured citations only. C named 2 real cases that are not in its retrieved
                evidence, and B named 1, in the answer text; A named 4 cases from memory. A check of
                case names in the answer text is recorded as a future improvement.
              </li>
              <li>
                <strong>Provider and prompt.</strong> Answers came from Groq: professional answers
                from gpt-oss-120b only, public answers from gpt-oss-20b or, when it was at capacity,
                gpt-oss-120b. All used prompt v3.
              </li>
              <li>
                <strong>Historical Gemini run.</strong> The frozen September 2026 answer evaluation
                used Gemini (gemini-3.6-flash) with prompt v1: 29 of 30 answers parsed and 23 passed
                the structural citation check. It is kept unchanged as a historical baseline and is
                not directly comparable with this run. <StatusBadge status="historical" />
              </li>
            </ul>
          </Callout>
        </ResultSection>

        <ResultSection
          id="retrieval"
          title="Retrieval quality (frozen benchmark)"
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
              only (not answer quality). Expansion towards about 100 queries is in progress with a
              labelling kit.
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
          title="Citation validity across prompt versions"
          meta={
            <>
              <StatusBadge status="historical" />
              <Meta>Supervised live runs, steps 11–11d and 22</Meta>
              <Meta>19–30 October 2026</Meta>
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
                prompt: "v2",
                valid: "5 of 5",
                runs: "2 public runs in step 11d, plus 2 correct no-coverage answers",
              },
              {
                prompt: "v3 (current)",
                valid: "41 of 41",
                runs: "13 runs on gpt-oss-120b in step 22: 4 public, 3 professional, 5 PDF briefs and 1 question on a PDF, including 2 correct no-coverage answers",
                highlight: true,
              },
            ]}
            footnote="Source: docs/live_runs/LIVE_RUN_SUMMARY.md (v1 and v2, 2026-10-20; v3, Step 22 live runs, 2026-10-30) and docs/LLM_PROVIDER_CONFIGURATION.md, Step 22."
          />
          <Callout kind="warning" title="Small samples">
            These are supervised runs of a few hand-picked cases, so they show a direction, not a
            rate. Until step 22 the professional answer exceeded the provider&rsquo;s output limit;
            prompt v3&rsquo;s length rules made professional answers and PDF briefs fit, and the
            October evaluation above measures them on 30 queries.
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

        <ResultSection
          id="experiments"
          title="Model experiments: InLegalBERT"
          meta={
            <>
              <StatusBadge status="pending-approval" label="Adopted — sign-off pending" />
              <Meta>Thresholds frozen before training</Meta>
              <Meta>11–12 November 2026</Meta>
            </>
          }
        >
          <MetricTable
            caption="Held-out results, each scored once"
            columns={[
              { key: "test", label: "Test" },
              { key: "before", label: "Before", numeric: true },
              { key: "after", label: "With InLegalBERT", numeric: true },
              { key: "verdict", label: "Frozen rule" },
            ]}
            rows={[
              {
                test: "E1 NER, exact F1 (36 examples, 89 entities)",
                before: "0.788",
                after: "0.915",
                verdict: "Pass",
                highlight: true,
              },
              {
                test: "E3 retrieval nDCG@5 (30 queries)",
                before: "0.819",
                after: "0.819",
                verdict: "Pass (no regression)",
              },
              {
                test: "E4 Parties & Roles precision (15 documents)",
                before: "1.000",
                after: "0.846",
                verdict: "Fail",
              },
              {
                test: "E4c Parties & Roles F1 (5 held-out excerpts, 17 parties)",
                before: "0.000",
                after: "0.839",
                verdict: "Pass (AI-labelled judge)",
              },
            ]}
            footnote="Sources: docs/experiments/INLEGALBERT_E1_RESULTS.md, INLEGALBERT_E3_RESULTS.md, NER_PARTY_ROLES_RESULTS.md and INLEGALBERT_DECISION.md."
          />
          <p>
            The protocol, per-seed results, the E4 failure and the limitations are on the{" "}
            <Link href="/experiments/" className="font-medium text-accent underline">
              Experiments
            </Link>{" "}
            page.
          </p>
        </ResultSection>

        <ResultSection
          id="section-labels"
          title="Section-label coverage"
          meta={
            <>
              <Meta>370 distinct corpus-cited sections</Meta>
              <Meta>12–13 November 2026</Meta>
              <Meta>Unreviewed</Meta>
            </>
          }
        >
          <MetricTable
            caption="Corpus-cited sections with a trusted title"
            columns={[
              { key: "statute", label: "Statute (distinct cited sections)" },
              { key: "before", label: "Catalog + mapping", numeric: true },
              { key: "after", label: "Official headings first", numeric: true },
            ]}
            rows={[
              { statute: "IPC (173)", before: "26", after: "161" },
              { statute: "CrPC (105)", before: "5", after: "5" },
              { statute: "Evidence Act (13)", before: "0", after: "12" },
              { statute: "BNS (16)", before: "13", after: "16" },
              { statute: "BNSS (12)", before: "5", after: "12" },
              { statute: "All (370)", before: "57", after: "214", highlight: true },
            ]}
            footnote="Special Acts (NDPS, POCSO, SC/ST) are unchanged. Source: docs/SECTION_LABELS.md, Coverage before and after (backend/scripts/section_label_coverage.py, no provider calls)."
          />
          <p>
            The document-evidence statute correction was tested offline before any live call, on
            every saved brief from steps 22–26b and a probe of the 5 brief fixtures: 16 correct
            document-evidence corrections (2 on saved briefs, 14 in the probe), 3 correct
            label-based corrections, 56 correct no-ops and <strong>0 wrong corrections</strong>.
          </p>
        </ResultSection>
      </Container>
    </>
  );
}
