import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Callout } from "@/components/ui/Callout";
import { MetricTable } from "@/components/ui/MetricTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How LegalAI acquires data, chunks judgments, retrieves and reranks evidence, generates grounded answers, builds analytics data, runs OCR and evaluates itself.",
};

const sections = [
  { id: "data", label: "Data acquisition" },
  { id: "chunking", label: "Chunking" },
  { id: "retrieval", label: "Retrieval and reranking" },
  { id: "generation", label: "Grounded generation" },
  { id: "analytics", label: "Analytics data" },
  { id: "ocr", label: "OCR" },
  { id: "evaluation", label: "Evaluation" },
  { id: "engineering", label: "Engineering practice" },
];

function Section({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="border-t border-border pt-12 first:border-t-0 first:pt-0"
    >
      <p className="font-mono text-sm font-semibold text-accent">
        {String(number).padStart(2, "0")}
      </p>
      <h2 id={id} className="mt-1 scroll-mt-24 font-serif text-3xl font-bold">
        {title}
      </h2>
      <div className="mt-5 max-w-3xl space-y-4 leading-7 text-muted [&_strong]:text-fg">
        {children}
      </div>
    </section>
  );
}

function Steps({ items }: { items: ReactNode[] }) {
  return (
    <ol className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-bold text-fg">
            {index + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

export default function MethodologyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Methodology"
        title="How LegalAI is built and measured"
        description="Each stage favours checkable, deterministic steps, and keeps a model in the loop only where it measurably helps."
      >
        <nav aria-label="On this page" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="inline-block rounded-full border border-border px-3 py-1 text-sm text-muted hover:border-border-strong hover:text-fg"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <Container className="space-y-16 py-16">
        <Section id="data" number={1} title="Data acquisition and sources">
          <p>
            <strong>Judgments</strong> come from the documented Indian Kanoon API rather than
            website scraping. Every stored document keeps its source URL, source document ID,
            retrieval time and SHA-256 digest, and duplicates are detected by checksum.
          </p>
          <p>
            Candidates passed a criminal-law filter, a pre-screen and human review before entering
            the <strong>trusted corpus</strong>: currently 70 judgments (48 High Court, 14 Supreme
            Court, 8 district or sessions) split into 4,195 paragraphs and 1,356 chunks. The plan
            scales in stages (about 500, then 2,000, then 8,000–10,000 judgments) only after
            metadata quality and retrieval behaviour are validated.
          </p>
          <p>
            <strong>Crime statistics</strong> come from the National Crime Records Bureau&rsquo;s{" "}
            <cite>Crime in India 2024</cite>, Volume I, Table 1A.4, downloaded from ncrb.gov.in and
            pinned by SHA-256. The <strong>IPC-to-BNS mapping</strong> (370 rows) is built from
            NCRB&rsquo;s CYTRAIN correspondence table and BNS text.
          </p>
        </Section>

        <Section id="chunking" number={2} title="Structure-aware chunking">
          <Steps
            items={[
              "Normalise Unicode, whitespace, soft hyphens and control characters, and join safe line wraps.",
              "Segment the text into paragraph blocks with their heading context and, for PDFs, page numbers.",
              "Group contiguous paragraphs into chunks: target 650 estimated tokens, maximum 900, overlap 100.",
              "Give each chunk a deterministic ID, <provider>:<document>:chunk:<index>, used unchanged in PostgreSQL, Chroma and BM25.",
            ]}
          />
          <p>
            Chunks follow paragraph boundaries instead of fixed token windows, so a holding is
            rarely split mid-sentence, and page and paragraph ranges let every precedent excerpt
            point back to its place in the judgment.
          </p>
        </Section>

        <Section id="retrieval" number={3} title="Hybrid retrieval and reranking">
          <p>
            A query runs through <strong>BGE-M3</strong> dense retrieval (1024-dimensional vectors
            in Chroma) and <strong>BM25</strong> keyword retrieval (k1 = 1.5, b = 0.75, a legal
            tokenizer) in parallel, 20 candidates each. Reciprocal rank fusion with k = 60 merges
            them, and the <strong>bge-reranker-v2-m3</strong> cross-encoder keeps the top 5.
          </p>
          <MetricTable
            caption="The two retrievers find different relevant passages"
            columns={[
              { key: "measure", label: "Relevant candidates (broad), frozen benchmark" },
              { key: "count", label: "Count", numeric: true },
            ]}
            rows={[
              { measure: "Found by BM25", count: "312" },
              { measure: "Found by dense retrieval", count: "327" },
              { measure: "Found by both", count: "171" },
              { measure: "Found by either (union)", count: "468 of 473", highlight: true },
            ]}
            footnote="30 benchmark queries. Source: docs/RETRIEVAL_TUNING_DECISION.md (2026-09-08)."
          />
          <p>
            Three tuning ideas (legal-regime adjustment, controlled query expansion and metadata
            reranking) were tried on a separate 20-query development set. None improved the top 5,
            so the untuned configuration was frozen rather than fitted to a small set.
          </p>
        </Section>

        <Section id="generation" number={4} title="Grounded generation">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Evidence IDs.</strong> Retrieved passages are labelled E1…E5; excerpts from a
              private upload are labelled P# and are facts, never authority.
            </li>
            <li>
              <strong>Structured output.</strong> The model returns JSON in which every substantive
              statement is a claim citing evidence IDs. Case names must be copied exactly, and
              precedent metadata is always taken from retrieval, not from the model.
            </li>
            <li>
              <strong>Citation validation.</strong> Each citation must reference evidence that was
              supplied, with matching metadata. Public sources are drawn only from citations that
              pass.
            </li>
            <li>
              <strong>No-coverage answers.</strong> When nothing relevant is retrieved, the answer
              says &ldquo;The available sources do not cover this question.&rdquo; and offers no
              legal answer from general knowledge.
            </li>
            <li>
              <strong>Prompt versioning.</strong> Prompts are versioned files (v1 is the frozen
              evaluation baseline, v2 is in production) pinned by SHA-256, and every hash change is
              recorded, so evaluation outputs stay attributable to the exact prompt that produced
              them.
            </li>
            <li>
              <strong>Provider chain.</strong> Groq is the primary provider and Gemini the fallback,
              tried only on provider failures such as timeouts or 5xx errors, never because of
              answer content.
            </li>
          </ul>
        </Section>

        <Section id="analytics" number={5} title="Analytics data pipeline">
          <p>
            <strong>Cited sections</strong> are extracted with deterministic rules that normalise
            judgment citation forms (&ldquo;u/s&rdquo;, &ldquo;302/34&rdquo;, &ldquo;r/w&rdquo;) and
            reject anything ambiguous: 920 section rows across all 70 documents, with 1,961 mentions
            rejected for lacking an explicit statute, 63 for ambiguous forms and 20 as out of range.
            Provisions are classified by statute chapter so that dashboards count offences, not
            procedural sections such as CrPC 313.
          </p>
          <p>
            <strong>Outcomes</strong> (conviction, appeal result, disposition) are read only from
            the operative part of a judgment, using present-tense phrasing; narrated history,
            hypotheticals and conflicting values are left empty. Every value records the rule and
            chunk that produced it and stays <em>unreviewed</em> until a legal reviewer imports a
            review file.
          </p>
          <p>
            <strong>NCRB statistics</strong> were re-extracted after an earlier CSV failed to add
            up. A grid-aware PyMuPDF extractor reads the table&rsquo;s cell borders and printed
            column indices, and a validator checks the table against its own arithmetic and an
            independent summary table: about 8,950 checks with 0 exceptions, plus a visual spot
            check of 120 cells.
          </p>
        </Section>

        <Section id="ocr" number={6} title="OCR for scanned PDFs">
          <p>
            PyMuPDF extracts native text first. A page is sent to <strong>Tesseract</strong> (300
            DPI, grayscale) only if its native text is under 50 characters and it contains an image.
            OCR text goes through the same normalisation and keeps its page number, and the document
            records which pages were OCR&rsquo;d and their mean confidence. Below a confidence of 80
            the answer carries a warning.
          </p>
        </Section>

        <Section id="evaluation" number={7} title="Evaluation methodology">
          <Steps
            items={[
              "A frozen benchmark of 30 queries across five types: statute-explicit, plain-language, procedural relief, IPC/BNS transition, and hard or ambiguous.",
              "Candidates from all four systems are pooled and labelled by a human reviewer on a 0/1/2 scale: 695 relevance judgments.",
              "Metrics: Precision@5, pooled Recall@5 and @20, MRR@5 and graded nDCG@5 (gain / log2(rank + 1)), each under broad (grades 1–2) and strict (grade 2) relevance.",
              "A paired bootstrap with 10,000 resamples gives descriptive confidence intervals, not significance claims.",
              "Tuning uses a separate 20-query development set (474 judgments) so the benchmark is not tuned on.",
            ]}
          />
          <p>
            Model choices were made the same way. Deterministic NER was kept after two pretrained
            candidates failed to improve F1 on a 36-example gold set, and section ranking uses the
            BGE cross-encoder, which scored best on 36 human-reviewed queries.
          </p>
          <Callout kind="warning" title="Known limits of the evaluation">
            One reviewer, 30 queries, pooled rather than exhaustive relevance, a 70-judgment corpus,
            and very small transition-law subsets. This is retrieval evaluation, not answer
            evaluation. Expanding towards about 100 queries is planned.
          </Callout>
        </Section>

        <Section id="engineering" number={8} title="Engineering practice">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Isolated test database.</strong> Database-backed suites refuse to run unless
              the target database name ends in <code>_test</code>; they redirect the stores to
              temporary directories and block network calls and model downloads.
            </li>
            <li>
              <strong>Backup and rehearsal.</strong> Every data change is preceded by a backup whose
              restore is verified, then rehearsed on a separate database, then run on development
              with a dry run first.
            </li>
            <li>
              <strong>Store-consistency verifier.</strong> A script checks PostgreSQL, Chroma and
              BM25 chunk for chunk and exits non-zero on any mismatch.
            </li>
            <li>
              <strong>Error contract.</strong> Every error from every route has the shape{" "}
              <code>{"{error, code, detail}"}</code> and a request ID; a test calls every route in
              every way it can fail to enforce it.
            </li>
            <li>
              <strong>Pull requests.</strong> Work lands on main through feature branches and
              reviewed pull requests (66 so far).
            </li>
            <li className="flex flex-wrap items-center gap-2">
              <span>
                <strong>Continuous integration</strong> for the backend and frontend suites.
              </span>
              <StatusBadge status="in-progress" />
            </li>
          </ul>
        </Section>
      </Container>
    </>
  );
}
