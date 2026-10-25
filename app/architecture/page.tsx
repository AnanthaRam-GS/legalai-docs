import type { Metadata } from "next";
import { DataModel } from "@/components/diagrams/DataModel";
import { IngestionFlow } from "@/components/diagrams/IngestionFlow";
import { LayerDiagram } from "@/components/diagrams/LayerDiagram";
import { PipelineDiagram } from "@/components/diagrams/PipelineDiagram";
import { Container } from "@/components/layout/Container";
import { Callout } from "@/components/ui/Callout";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "LegalAI's four layers, the retrieval-augmented query pipeline, all-or-nothing ingestion and the data model.",
};

export default function ArchitecturePage() {
  return (
    <>
      <PageHeader
        eyebrow="Architecture"
        title="Four layers, one grounded pipeline"
        description="A Next.js frontend talks to a single FastAPI backend, which runs retrieval, generation and analytics over PostgreSQL, a Chroma vector index and a BM25 keyword index."
      />
      <Container className="py-16">
        <section aria-labelledby="layers">
          <SectionHeader
            id="layers"
            eyebrow="System layers"
            title="Layered architecture"
            description="Each layer talks to the next through explicit interfaces: REST between frontend and backend, and in-process service calls inside the backend."
          />
          <div className="mt-10">
            <LayerDiagram />
          </div>
        </section>

        <section aria-labelledby="pipeline" className="mt-24">
          <SectionHeader
            id="pipeline"
            eyebrow="Query pipeline"
            title="From question to validated answer"
            description="The same pipeline serves Public and Professional Mode; only the prompt and the response shape differ."
          />
          <div className="mt-10">
            <PipelineDiagram />
          </div>
          <Callout kind="info" title="Configuration frozen after evaluation">
            Candidate depth 20, final top 5, RRF k = 60 and reranker max length 512 were kept
            untuned: three tuning experiments (regime-aware, query expansion, metadata reranking)
            did not beat this baseline on the development set. Source:
            docs/RETRIEVAL_TUNING_DECISION.md.
          </Callout>
        </section>

        <section aria-labelledby="ingestion" className="mt-24">
          <SectionHeader
            id="ingestion"
            eyebrow="Ingestion"
            title="All-or-nothing across three stores"
            description="Admin ingestion either lands a document in PostgreSQL, Chroma and BM25, or leaves no trace in any of them."
          />
          <div className="mt-10">
            <IngestionFlow />
          </div>
        </section>

        <section aria-labelledby="data-model" className="mt-24">
          <SectionHeader
            id="data-model"
            eyebrow="Data model"
            title="PostgreSQL is canonical"
            description="The vector and keyword indexes are derived from PostgreSQL and can be rebuilt from it."
          />
          <div className="mt-10">
            <DataModel />
          </div>
        </section>
      </Container>
    </>
  );
}
