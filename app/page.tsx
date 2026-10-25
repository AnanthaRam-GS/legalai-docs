import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ClipboardList,
  FlaskConical,
  Gavel,
  Layers,
  MessageCircleQuestion,
  PlayCircle,
  ServerCog,
  Users,
} from "lucide-react";
import Link from "next/link";
import { GitHubIcon } from "@/components/icons";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectJsonLd } from "@/components/seo/ProjectJsonLd";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { site, stats } from "@/content/site";

const modes = [
  {
    icon: MessageCircleQuestion,
    title: "Public Mode",
    href: "/features/#public-mode",
    body: "Anyone can ask a question in plain language, without an account, and get an explanation backed by validated sources. When the corpus does not cover a question, LegalAI says so instead of guessing.",
  },
  {
    icon: Gavel,
    title: "Professional Mode",
    href: "/features/#professional-mode",
    body: "Verified lawyers get grounded answers with precedents, relative relevance, a cited-in-answer badge, and structured briefs from private PDFs: parties, chronology, procedural stages and evidence.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    href: "/features/#analytics",
    body: "Five dashboards: offence frequency, outcome distribution, section co-occurrence, the IPC-to-BNS map, and NCRB crime statistics re-extracted from the official report.",
  },
  {
    icon: ServerCog,
    title: "Admin",
    href: "/features/#admin",
    body: "Administrators ingest judgments into the trusted corpus with all-or-nothing writes across PostgreSQL, Chroma and BM25, and watch live store health.",
  },
];

const pipeline = [
  "Query understanding",
  "Dense + BM25 retrieval",
  "Reciprocal rank fusion",
  "Cross-encoder reranking",
  "Grounded generation",
  "Citation validation",
];

const quickLinks = [
  {
    href: "/overview/",
    icon: BookOpen,
    title: "Problem and objectives",
    body: "Why LegalAI exists and who it is for.",
  },
  {
    href: "/methodology/",
    icon: FlaskConical,
    title: "Methodology",
    body: "Data, retrieval, generation and evaluation.",
  },
  {
    href: "/results/",
    icon: BarChart3,
    title: "Results",
    body: "Measured figures with sample sizes and dates.",
  },
  {
    href: "/progress/",
    icon: ClipboardList,
    title: "Progress",
    body: "Phase status, engineering log and roadmap.",
  },
  { href: "/team/", icon: Users, title: "Team", body: "The guide and the four developers." },
  {
    href: "/docs/",
    icon: Layers,
    title: "Documentation",
    body: "Setup, API reference, security and glossary.",
  },
];

const corpusAndRetrieval = stats.filter((stat) =>
  ["corpus", "p5", "mrr", "ndcg"].includes(stat.id),
);
const engineering = stats.filter((stat) =>
  ["backend-tests", "frontend-tests", "rerank-speedup"].includes(stat.id),
);

export default function HomePage() {
  return (
    <>
      <ProjectJsonLd />
      <section className="relative overflow-hidden bg-navy text-navy-fg">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(#e6ebf3 1px, transparent 1px), linear-gradient(90deg, #e6ebf3 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <Container className="relative py-20 sm:py-28">
          <p className="text-sm font-semibold tracking-wide text-[#e3b65c] uppercase">
            {site.course} · {site.institution}
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-bold text-white sm:text-6xl">
            LegalAI
          </h1>
          <p className="mt-3 max-w-3xl font-serif text-xl text-navy-fg sm:text-2xl">
            An Intelligent Criminal Legal Assistance and Analytics System
          </p>
          <p className="mt-6 max-w-2xl text-lg text-navy-muted">{site.tagline}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/demo/"
              className="inline-flex items-center gap-2 rounded-md bg-[#e3b65c] px-5 py-3 text-sm font-semibold text-[#0a1120] transition-colors hover:bg-[#ecc77a] focus-visible:outline-[#e3b65c]"
            >
              <PlayCircle className="h-5 w-5" aria-hidden="true" />
              Watch demo
            </Link>
            <a
              href={site.repoUrl}
              className="inline-flex items-center gap-2 rounded-md border border-white/25 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-[#e3b65c]"
            >
              <GitHubIcon className="h-5 w-5" />
              GitHub
            </a>
            <Link
              href="/docs/"
              className="inline-flex items-center gap-2 rounded-md border border-white/25 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-[#e3b65c]"
            >
              <BookOpen className="h-5 w-5" aria-hidden="true" />
              Documentation
            </Link>
          </div>
          <p className="mt-8 text-sm text-navy-muted">Research prototype. Not legal advice.</p>
        </Container>
      </section>

      <section aria-labelledby="stats-heading" className="py-20">
        <Container>
          <SectionHeader
            id="stats-heading"
            eyebrow="Key figures"
            title="Measured, with the sample size attached"
            description="Each figure names the source document it comes from. Retrieval metrics are from the frozen benchmark run and are labelled historical."
          />
          <h3 className="mt-12 text-sm font-semibold tracking-wide text-muted uppercase">
            Corpus and retrieval
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {corpusAndRetrieval.map((stat, index) => (
              <Reveal key={stat.id} delay={index * 60}>
                <StatCard stat={stat} />
              </Reveal>
            ))}
          </div>
          <h3 className="mt-10 text-sm font-semibold tracking-wide text-muted uppercase">
            Engineering
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {engineering.map((stat, index) => (
              <Reveal key={stat.id} delay={index * 60}>
                <StatCard stat={stat} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="modes-heading" className="border-y border-border bg-surface py-20">
        <Container>
          <SectionHeader
            id="modes-heading"
            eyebrow="What LegalAI does"
            title="Four modes for four kinds of user"
            description="One Next.js application serves the public, verified lawyers and administrators, with roles enforced by the backend."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {modes.map((mode, index) => (
              <Reveal key={mode.title} delay={index * 60}>
                <FeatureCard
                  icon={mode.icon}
                  title={mode.title}
                  footer={
                    <Link
                      href={mode.href}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-accent underline-offset-4 hover:underline"
                    >
                      Details<span className="sr-only"> about {mode.title}</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  }
                >
                  {mode.body}
                </FeatureCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="architecture-heading" className="py-20">
        <Container>
          <SectionHeader
            id="architecture-heading"
            eyebrow="Architecture"
            title="Retrieval first, generation second"
            description="Every answer is generated from bounded, retrieved evidence, and every citation is checked against that evidence before it is shown."
          />
          <Reveal>
            <ol className="mt-10 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
              {pipeline.map((step, index) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm font-medium shadow-card">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-navy-fg">
                      {index + 1}
                    </span>
                    {step}
                  </span>
                  {index < pipeline.length - 1 ? (
                    <ArrowRight
                      className="hidden h-4 w-4 shrink-0 text-subtle md:block"
                      aria-hidden="true"
                    />
                  ) : null}
                </li>
              ))}
            </ol>
          </Reveal>
          <Link
            href="/architecture/"
            className="mt-8 inline-flex items-center gap-1 font-semibold text-accent underline-offset-4 hover:underline"
          >
            Explore the architecture
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Container>
      </section>

      <section aria-labelledby="links-heading" className="border-t border-border bg-surface py-20">
        <Container>
          <SectionHeader id="links-heading" eyebrow="Quick links" title="Read further" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex h-full items-start gap-4 rounded-xl border border-border bg-bg p-5 transition-colors hover:border-border-strong hover:bg-surface-2"
                >
                  <link.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <span>
                    <span className="flex items-center gap-1 font-semibold text-fg">
                      {link.title}
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-1 block text-sm text-muted">{link.body}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
