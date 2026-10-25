import {
  Ban,
  Briefcase,
  CheckCircle2,
  Scale,
  ShieldCheck,
  Target,
  User,
  Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Callout } from "@/components/ui/Callout";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Problem and objectives",
  description:
    "The problem LegalAI addresses, its objectives, scope, non-goals and intended users.",
};

const motivations = [
  {
    icon: User,
    title: "Access to criminal law",
    body: "Criminal law reaches people at stressful moments: an FIR, an arrest, a bail hearing. Judgments and statutes are public, but finding the relevant ones and reading them is hard without legal training.",
  },
  {
    icon: Scale,
    title: "The IPC to BNS and BNSS transition",
    body: "From 1 July 2024 the Bharatiya Nyaya Sanhita (BNS) and Bharatiya Nagarik Suraksha Sanhita (BNSS) replaced the IPC and CrPC. Most precedent still cites the old codes, so questions often need both regimes, and the right one depends on the date of the offence.",
  },
  {
    icon: ShieldCheck,
    title: "Trust in AI answers",
    body: "General-purpose chatbots can produce fluent legal answers that cite cases that do not exist. In law an invented citation is worse than no answer, so every claim must be tied to a real, retrievable source.",
  },
];

const objectives = [
  "Answer criminal-law questions from a trusted corpus of Indian judgments using hybrid retrieval (dense + BM25) and cross-encoder reranking.",
  "Generate answers only from bounded retrieved evidence, validate every citation against that evidence, and say plainly when the corpus does not cover a question.",
  "Serve two audiences: plain-language answers for the public, and structured research briefs with precedents for verified lawyers.",
  "Analyse private PDFs (FIRs, charge sheets, judgments) for a single request without ever adding them to the shared corpus.",
  "Provide analytics over cited sections, outcomes, the IPC-to-BNS mapping and official NCRB crime statistics.",
  "Keep the corpus consistent across PostgreSQL, the vector index and the keyword index, with an administrator ingestion workflow.",
  "Evaluate retrieval with human relevance labels and report every figure with its sample size.",
];

const inScope = [
  "Indian criminal law: IPC, BNS, CrPC and BNSS, and selected special Acts cited in judgments (Evidence Act, NDPS, POCSO, SC/ST Act).",
  "English-language judgments from a curated, human-reviewed corpus (currently 70 judgments).",
  "Text questions and temporary PDF uploads, including scanned PDFs through OCR.",
  "Role-based access for public users, verified lawyers and administrators.",
];

const nonGoals = [
  "Giving legal advice or predicting the outcome of a case.",
  "Treating predicted sections as legal conclusions; they are supplementary retrieval signals only.",
  "Adding user uploads to the corpus; only administrators ingest trusted documents.",
  "Comprehensive coverage of all Indian case law at this stage.",
  "Civil, family or other non-criminal areas of law.",
  "A courtroom simulator (CourtSim), which is deferred to future work.",
];

const users = [
  {
    icon: User,
    title: "Members of the public",
    body: "People who need to understand an FIR, a notice or a legal term. They use Public Mode without an account and get plain-language explanations with validated sources.",
  },
  {
    icon: Briefcase,
    title: "Lawyers and law students",
    body: "Verified practitioners researching precedents and preparing briefs. Lawyer access is granted only after an administrator reviews their credentials.",
  },
  {
    icon: Wrench,
    title: "Administrators",
    body: "Maintainers who curate the trusted corpus, review lawyer applications and monitor store health.",
  },
];

export default function OverviewPage() {
  return (
    <>
      <PageHeader
        eyebrow="Problem and objectives"
        title="Grounded legal help for Indian criminal law"
        description="LegalAI is a retrieval-augmented assistant that answers criminal-law questions from a curated corpus of Indian judgments, shows where every claim comes from, and adds analytics over cited sections and official crime statistics."
      />

      <Container className="py-16">
        <section aria-labelledby="problem">
          <SectionHeader id="problem" eyebrow="Problem statement" title="The problem" />
          <div className="mt-6 max-w-3xl space-y-4 text-lg leading-8 text-muted">
            <p>
              Legal information in India is public but not accessible. Judgments are long, written
              for lawyers and spread across courts. Since July 2024 the criminal codes themselves
              have changed, so a question about an offence may need the IPC, the BNS, or both.
            </p>
            <p>
              Large language models make legal text easier to read but introduce a new risk: answers
              that sound authoritative while citing provisions or cases that do not support them. A
              legal assistant is only useful if a reader can check every claim against its source.
            </p>
          </div>
        </section>

        <section aria-labelledby="motivation" className="mt-20">
          <SectionHeader id="motivation" eyebrow="Motivation" title="Why this matters" />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {motivations.map((item, index) => (
              <Reveal key={item.title} delay={index * 60}>
                <FeatureCard icon={item.icon} title={item.title}>
                  {item.body}
                </FeatureCard>
              </Reveal>
            ))}
          </div>
        </section>

        <section aria-labelledby="objectives" className="mt-20">
          <SectionHeader
            id="objectives"
            eyebrow="Objectives"
            title="What the project sets out to do"
          />
          <ol className="mt-8 grid gap-3 md:grid-cols-2">
            {objectives.map((objective, index) => (
              <Reveal as="li" key={objective} delay={index * 40}>
                <div className="flex h-full gap-4 rounded-lg border border-border bg-surface p-4">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-navy-fg">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-fg">{objective}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        <section aria-labelledby="scope" className="mt-20">
          <SectionHeader id="scope" eyebrow="Scope" title="Scope and non-goals" />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Target className="h-5 w-5 text-ok" aria-hidden="true" />
                In scope
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
                {inScope.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ok" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Ban className="h-5 w-5 text-danger" aria-hidden="true" />
                Non-goals
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
                {nonGoals.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Ban className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section aria-labelledby="users" className="mt-20">
          <SectionHeader id="users" eyebrow="Intended users" title="Who LegalAI is for" />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {users.map((item, index) => (
              <Reveal key={item.title} delay={index * 60}>
                <FeatureCard icon={item.icon} title={item.title}>
                  {item.body}
                </FeatureCard>
              </Reveal>
            ))}
          </div>
          <Callout kind="disclaimer">{site.disclaimer}</Callout>
        </section>
      </Container>
    </>
  );
}
