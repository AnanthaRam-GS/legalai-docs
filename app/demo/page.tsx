import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Callout } from "@/components/ui/Callout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Screenshot } from "@/components/ui/Screenshot";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { shots } from "@/content/screenshots";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Demo",
  description: "A video walkthrough and screenshots of LegalAI.",
  alternates: { canonical: "/demo/" },
};

const gallery = [
  shots.publicHome,
  shots.publicAnswer,
  shots.publicAnswerSources,
  shots.publicAnswerMobile,
  shots.login,
  shots.professionalHome,
  shots.analyticsTrends,
  shots.analyticsOutcomes,
  shots.analyticsCooccurrence,
  shots.analyticsIpcBns,
  shots.analyticsNcrb,
  shots.history,
  shots.adminStatus,
  shots.adminIngest,
  shots.professionalAnswer,
  shots.professionalBrief,
];

export default function DemoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Demo"
        title="See LegalAI in use"
        description="A recorded walkthrough of the running application, and screenshots of each mode with real data. Select a screenshot to open it full size."
      />
      <Container className="py-16">
        <section aria-labelledby="video">
          <h2 id="video" className="sr-only">
            Demo video
          </h2>
          <VideoEmbed url={site.demoVideoUrl} title="LegalAI demo walkthrough" />
          <Callout kind="disclaimer">{site.disclaimer}</Callout>
        </section>

        <section aria-labelledby="gallery" className="mt-20">
          <SectionHeader id="gallery" eyebrow="Gallery" title="Screenshots" />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((shot) => (
              <li key={shot.caption}>
                <Screenshot {...shot} />
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
