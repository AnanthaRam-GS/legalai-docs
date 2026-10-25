import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TeamCard } from "@/components/ui/TeamCard";
import { guide, site, team } from "@/content/site";

export const metadata: Metadata = {
  title: "Team",
  description: "The project guide and the four developers of LegalAI.",
};

export default function TeamPage() {
  return (
    <>
      <PageHeader
        eyebrow="Team"
        title="The people behind LegalAI"
        description={`${site.course}, ${site.department}, ${site.school}, ${site.institution}.`}
      />
      <Container className="py-16">
        <section aria-labelledby="guide">
          <SectionHeader id="guide" eyebrow="Guide" title="Project guide" />
          <div className="mt-8 max-w-xl">
            <TeamCard person={guide} featured />
          </div>
        </section>

        <section aria-labelledby="developers" className="mt-20">
          <SectionHeader
            id="developers"
            eyebrow="Developers"
            title="Development team"
            description="Responsibilities follow the work packages assigned in the build plan."
          />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {team.map((person, index) => (
              <Reveal as="li" key={person.name} delay={index * 60}>
                <TeamCard person={person} />
              </Reveal>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
