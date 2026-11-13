import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import Link from "next/link";
import { Callout } from "@/components/ui/Callout";
import { MetricTable } from "@/components/ui/MetricTable";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How LegalAI acquires data, chunks judgments, retrieves and reranks evidence, generates grounded answers, verifies section labels, builds analytics data, runs OCR, evaluates itself and tests models.",
  alternates: { canonical: "/methodology/" },
};

const sections = [
  { id: "data", label: "Data acquisition" },
  { id: "chunking", label: "Chunking" },
  { id: "retrieval", label: "Retrieval and reranking" },
  { id: "generation", label: "Grounded generation" },
  { id: "section-labels", label: "Section labels" },
  { id: "analytics", label: "Analytics data" },
  { id: "ocr", label: "OCR" },
  { id: "evaluation", label: "Evaluation" },
  { id: "models", label: "Model experiments" },
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
            pinned by SHA-256. The <strong>IPC-to-BNS mapping</strong> (438 rows) combines 370 rows
            from NCRB&rsquo;s CYTRAIN correspondence table and BNS text with 68 correspondences
            printed in the NCRB table itself, each attributed to its source and page.
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
              <strong>Prompt versioning.</strong> Prompts are versioned files pinned by SHA-256 (v1
              is the frozen evaluation baseline; v2 added no-coverage answers; v3, in production,
              adds length and shape rules so professional answers and briefs fit the model&rsquo;s
              output limit). Every hash change is recorded, so evaluation outputs stay attributable
              to the exact prompt that produced them.
            </li>
            <li>
              <strong>Provider routing.</strong> Answers come from Groq, routed by mode:
              professional answers and briefs use gpt-oss-120b only, and public answers use
              gpt-oss-20b, falling back at once to gpt-oss-120b (a second model with its own limits)
              when 20b is at capacity or fails as a provider. A fallback is never tried because of
              answer content.
            </li>
            <li>
              <strong>Pacing and daily capacity.</strong> The backend paces requests to each
              model&rsquo;s per-minute token limit with a first-in, first-out queue (at most 90 s,
              or 45 s for a professional answer waiting for 120b), and tracks each model&rsquo;s
              tokens over a rolling 24 hours. Past those limits the user gets a clear
              &ldquo;busy&rdquo; or &ldquo;daily capacity&rdquo; answer with a retry time instead of
              a provider error.
            </li>
          </ul>
        </Section>

        <Section id="section-labels" number={5} title="Verified section labels">
          <p>
            The answer model names statutory provisions with a one-line label of its own, and those
            labels can be wrong. Every section the model names is therefore resolved against trusted
            sources before it reaches a response; the model&rsquo;s wording is never shown as a
            trusted title.
          </p>
          <Steps
            items={[
              <>
                <strong>Parse</strong> the provision with the project&rsquo;s deterministic section
                extractor (statute, section, sub-section, and the model&rsquo;s label).
              </>,
              <>
                <strong>Look up</strong> a title in order of trust, the first source with an entry
                winning: the Act&rsquo;s official heading from India Code, then the legal section
                catalog, then the IPC-to-BNS mapping.
              </>,
              <>
                <strong>Decide the state:</strong> <code>verified</code> (a trusted title is shown),{" "}
                <code>corrected_statute</code> (the answer named the wrong statute of a pair such as
                BNS and BNSS), <code>unverified</code> (no trusted title: the model&rsquo;s label is
                shown, marked &ldquo;Unverified label&rdquo;) or <code>conflict</code> (trusted
                sources disagree, so no title is shown).
              </>,
            ]}
          />
          <p>
            A statute is corrected in two ways. If the model&rsquo;s label clearly fits the sister
            statute&rsquo;s section with the same number (&ldquo;BNS 173, registration of FIR&rdquo;
            is BNSS 173), the label decides. For an uploaded document, if the document cites the
            number only under the sister statute, the <strong>document-evidence correction</strong>{" "}
            applies and names the page of the upload it came from. In an offline test on every saved
            brief and the 5 fixtures, it made 0 wrong corrections. The model&rsquo;s own label is
            always kept in the data for audit.
          </p>
          <p>
            <strong>Official headings</strong> come from India Code, the official legislative
            repository: 548 IPC headings (plus 21 omitted or repealed sections), 181 for the
            Evidence Act, 358 for the BNS, 531 for the BNSS and 170 for the BSA. IPC and Evidence
            Act headings were read from each Act&rsquo;s PDF and kept only when the printed
            arrangement and the body agree; 70 of 70 rendered spot checks matched. With them, the
            corpus-cited sections that have a trusted title rose from{" "}
            <strong>57 to 214 of 370</strong>. The <strong>CrPC has no official headings</strong>:
            India Code&rsquo;s only copy is a scan of the Act as enacted in 1974 that cannot be read
            reliably, so CrPC sections keep their catalog title or stay unverified.
          </p>
        </Section>

        <Section id="analytics" number={6} title="Analytics data pipeline">
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

        <Section id="ocr" number={7} title="OCR for scanned PDFs">
          <p>
            PyMuPDF extracts native text first. A page is sent to <strong>Tesseract</strong> (300
            DPI, grayscale) only if its native text is under 50 characters and it contains an image.
            OCR text goes through the same normalisation and keeps its page number, and the document
            records which pages were OCR&rsquo;d and their mean confidence. Below a confidence of 80
            the answer carries a warning.
          </p>
        </Section>

        <Section id="evaluation" number={8} title="Evaluation methodology">
          <p>
            <strong>Retrieval.</strong>
          </p>
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
            <strong>Answers.</strong> A frozen set of 30 answer-evaluation queries (15 public, 15
            professional, including 4 out of scope) is answered under three configurations: LLM
            only, dense-only RAG and the full pipeline. Each answer is scored automatically for
            schema validity, structural grounding (citations that point at supplied evidence with
            matching metadata), unsupported references and no-coverage behaviour, and a blinded
            sample of 15 queries × 3 configurations goes to human review, with configurations shown
            as X, Y and Z.
          </p>
          <p>
            Model choices were made the same way: section ranking uses the BGE cross-encoder, which
            scored best on 36 human-reviewed queries, and InLegalBERT was adopted for NER only after
            a bounded experiment (below).
          </p>
          <Callout kind="warning" title="Known limits of the evaluation">
            One reviewer, 30 queries, pooled rather than exhaustive relevance, a 70-judgment corpus,
            and very small transition-law subsets. Answer grounding is structural until the human
            review is done. Expanding the retrieval benchmark by about 70 queries with a labelling
            kit that applies the frozen pooling rules is in progress.
          </Callout>
        </Section>

        <Section id="models" number={9} title="Model experiments">
          <p>
            The planned fine-tuned InLegalBERT was tested rather than assumed. Pass thresholds were
            frozen before training, held-out gold sets were scored once, and each step&rsquo;s rules
            were committed before its code. The NER model passed (F1 0.915 against the rules&rsquo;
            0.788); the section classifier was skipped because no open BNS or BNSS training data
            exists; one brief experiment failed its precision rule and was redone under a new frozen
            rule and a held-out judge. The full record, including the failure and the limitations,
            is on the{" "}
            <Link href="/experiments/" className="font-medium text-accent underline">
              Experiments
            </Link>{" "}
            page.
          </p>
        </Section>

        <Section id="engineering" number={10} title="Engineering practice">
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
              reviewed pull requests (86 so far).
            </li>
            <li>
              <strong>Continuous integration.</strong> GitHub Actions runs the backend, database,
              frontend and Playwright end-to-end suites on every pull request and push to main,
              without secrets, model downloads or the real corpus.
            </li>
          </ul>
        </Section>
      </Container>
    </>
  );
}
