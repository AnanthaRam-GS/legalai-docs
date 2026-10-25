import {
  BarChart3,
  CheckCircle2,
  FileScan,
  Gavel,
  Lock,
  MessageCircleQuestion,
  ServerCog,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Callout } from "@/components/ui/Callout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Screenshot } from "@/components/ui/Screenshot";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { shots, type ShotMeta } from "@/content/screenshots";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Public Mode, Professional Mode, analytics dashboards, admin ingestion, OCR for scanned PDFs, and privacy for uploads.",
  alternates: { canonical: "/features/" },
};

interface FeatureSectionProps {
  id: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  intro: ReactNode;
  points: ReactNode[];
  screenshot: ShotMeta;
  reverse?: boolean;
  children?: ReactNode;
}

function FeatureSection({
  id,
  icon: Icon,
  eyebrow,
  title,
  intro,
  points,
  screenshot,
  reverse,
  children,
}: FeatureSectionProps) {
  return (
    <section aria-labelledby={id} className="border-b border-border py-16 last:border-b-0">
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div className={reverse ? "lg:order-2" : ""}>
          <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-accent uppercase">
            <Icon className="h-4 w-4" aria-hidden="true" />
            {eyebrow}
          </p>
          <h2 id={id} className="mt-2 scroll-mt-24 font-serif text-3xl font-bold">
            {title}
          </h2>
          <div className="mt-4 text-lg text-muted">{intro}</div>
          <ul className="mt-6 space-y-3">
            {points.map((point, index) => (
              <li key={index} className="flex gap-3 text-sm leading-6 text-fg">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ok" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          {children}
        </div>
        <Reveal className={reverse ? "lg:order-1" : ""}>
          <Screenshot {...screenshot} />
        </Reveal>
      </div>
    </section>
  );
}

const dashboards = [
  ["Offence trends", "How often each offence provision is cited, by judgment year."],
  ["Outcome distribution", "Rule-extracted outcomes by section and court level."],
  ["Section co-occurrence", "Which offence provisions are cited together."],
  ["IPC-BNS map", "Comparative mapping from IPC sections to their BNS counterparts."],
  ["NCRB statistics", "Crime in India 2024, Table 1A.4: crime heads by State/UT."],
];

export default function FeaturesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Features"
        title="What LegalAI can do today"
        description="Everything on this page is implemented in the LegalAI repository. Screenshots come from the running application with real data; professional answers will follow once live provider capacity allows."
      />
      <Container>
        <FeatureSection
          id="public-mode"
          icon={MessageCircleQuestion}
          eyebrow="Public Mode"
          title="Plain-language answers, no account needed"
          intro="Anyone can ask a question or upload a document and get an explanation without legal jargon."
          points={[
            "Text questions or one temporary PDF, such as an FIR, with follow-up questions kept in the browser session.",
            "Sources are only citations that passed validation. If none validates, the page says it could not verify a source instead of showing an unverified link.",
            <>
              <strong>No-coverage honesty:</strong> when nothing retrieved is relevant, the answer
              starts with &ldquo;The available sources do not cover this question.&rdquo; and gives
              no provisions, sources or general-knowledge legal answer.
            </>,
            "Per-IP rate limits (5 a minute, 100 a day by default) keep anonymous use within the answer provider's capacity.",
          ]}
          screenshot={shots.publicAnswer}
        />

        <FeatureSection
          id="professional-mode"
          icon={Gavel}
          eyebrow="Professional Mode"
          title="Grounded research for verified lawyers"
          intro="Lawyer access is granted only after an administrator reviews the applicant's bar credentials."
          reverse
          points={[
            "Answers cite retrieved evidence by ID; citation metadata always comes from the retrieved judgment, never from the model.",
            <>
              <strong>Precedents</strong> list every retrieved judgment in rank order with a
              verbatim excerpt (at most 400 characters), page and paragraph provenance, and a{" "}
              <strong>relative relevance</strong>: reranker scores scaled so the top result is 1.0.
              It is a ranking within one query, not a probability.
            </>,
            <>
              A <strong>cited</strong> badge marks precedents that the answer actually cites through
              a validated citation; the rest were only retrieved.
            </>,
            <>
              <strong>PDF briefs</strong> extract parties and roles, a dated chronology, procedural
              stages (FIR, arrest, bail, charge sheet, trial, appeal…) and evidence by category,
              each item ending with its page reference, for example <code>[P2, p. 3]</code>.
            </>,
            "Query history is kept per user, without any text quoted from uploaded documents.",
          ]}
          screenshot={shots.professionalAnswer}
        >
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted">
            <StatusBadge status="blocked" />
            Live professional runs are blocked by LLM provider capacity; the flow is covered by
            tests.
          </div>
        </FeatureSection>

        <FeatureSection
          id="analytics"
          icon={BarChart3}
          eyebrow="Analytics"
          title="Five dashboards over the corpus and official statistics"
          intro="Professional users can explore cited sections, outcomes and national crime statistics in a tabbed Recharts dashboard."
          points={dashboards.map(([name, body]) => (
            <>
              <strong>{name}:</strong> {body}
            </>
          ))}
          screenshot={shots.analyticsTrends}
        >
          <Callout kind="warning">
            Sections and outcomes are extracted from judgments by deterministic rules, and the
            IPC-BNS mapping is a comparative reference. Both are marked unreviewed until a qualified
            legal reviewer checks them. Counts include offence provisions only by default.
          </Callout>
        </FeatureSection>

        <FeatureSection
          id="admin"
          icon={ServerCog}
          eyebrow="Admin"
          title="Corpus ingestion and store status"
          intro="Administrators add trusted judgments and see whether the three stores agree."
          reverse
          points={[
            "Upload PDFs with metadata and follow each job through QUEUED, EXTRACTING, CHUNKING, EMBEDDING and INDEXING to COMPLETED or FAILED.",
            "Ingestion is all-or-nothing: a completed job is in PostgreSQL, Chroma and BM25; a failed job leaves nothing behind.",
            "Re-uploading an identical file is refused before anything is written.",
            "The status page reports each store as healthy, degraded or down, compares vector and keyword counts with PostgreSQL, and lists jobs that need reconciliation.",
            "Administrators also review lawyer verification applications.",
          ]}
          screenshot={shots.adminStatus}
        />

        <FeatureSection
          id="ocr"
          icon={FileScan}
          eyebrow="OCR"
          title="Scanned PDFs are read with OCR"
          intro="Many FIRs and older judgments are scans with no text layer."
          points={[
            "A page is OCR'd with Tesseract only when its native text is under 50 characters and it contains an image; text pages are untouched.",
            "OCR text keeps its page number, so page references in briefs still work.",
            "When any OCR'd page has low confidence (below 80), the answer carries a warning to check names, dates and figures against the original.",
            "Page and time limits (10 pages for a query, 200 for ingestion) stop oversized scans; nothing partial is answered.",
          ]}
          screenshot={shots.ocr}
        />

        <FeatureSection
          id="privacy"
          icon={Lock}
          eyebrow="Privacy"
          title="Uploads never enter the corpus"
          intro="A document uploaded for a question is used for that request only."
          reverse
          points={[
            "Query uploads create no ingestion job and no vector or keyword index writes; they are parsed in a temporary directory.",
            "Query history never stores PDF bytes, extracted text, temporary chunks or server paths.",
            "Uploaded text is treated as facts supplied by the user, not as legal authority; citations come only from the trusted corpus.",
            "Lawyer verification proofs are private and are never indexed or sent to the answer model.",
            "The session token lives in an HttpOnly cookie that page scripts cannot read.",
          ]}
          screenshot={shots.professionalHome}
        />
      </Container>
    </>
  );
}
