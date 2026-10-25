import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Callout } from "@/components/ui/Callout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Screenshot } from "@/components/ui/Screenshot";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Demo",
  description: "A video walkthrough and screenshots of LegalAI.",
};

const gallery = [
  { alt: "Public Mode home with the question box", caption: "Public Mode home" },
  { alt: "Public answer with validated sources", caption: "Plain-language answer" },
  { alt: "Professional query page with a structured brief", caption: "Professional brief" },
  { alt: "Precedent cards with relative relevance and cited badges", caption: "Ranked precedents" },
  { alt: "Analytics dashboard, NCRB statistics tab", caption: "Analytics: NCRB statistics" },
  { alt: "Admin status page with store health", caption: "Admin store status" },
];

export default function DemoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Demo"
        title="See LegalAI in use"
        description="A recorded walkthrough of the running application, and screenshots of each mode."
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
                <Screenshot alt={shot.alt} caption={shot.caption} />
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
