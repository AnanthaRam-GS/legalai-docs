import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Callout } from "@/components/ui/Callout";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Timeline } from "@/components/ui/Timeline";
import { milestones, phases, reviewChecklist, roadmap, site, type PhaseItem } from "@/content/site";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Progress",
  description:
    "LegalAI's build-plan phases and their status, the Phase 1 review checklist, the engineering log and the remaining roadmap.",
};

function ItemList({ items }: { items: PhaseItem[] }) {
  return (
    <ul className="divide-y divide-border">
      {items.map((item) => (
        <li
          key={item.label}
          className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-fg">{item.label}</p>
            {item.note ? <p className="mt-0.5 text-xs leading-5 text-muted">{item.note}</p> : null}
          </div>
          <StatusBadge status={item.status} />
        </li>
      ))}
    </ul>
  );
}

export default function ProgressPage() {
  const allItems = phases.flatMap((phase) => phase.items);
  const done = allItems.filter((item) => item.status === "completed").length;
  const percent = Math.round((done / allItems.length) * 100);

  return (
    <>
      <PageHeader
        eyebrow="Progress"
        title="Where the project stands"
        description={
          <>
            Status against the build plan&rsquo;s phases, as of{" "}
            <time dateTime={site.lastUpdated}>{formatDate(site.lastUpdated)}</time>. Unfinished work
            is shown as in progress, planned, blocked or pending approval.
          </>
        }
      >
        <div className="mt-8 max-w-xl">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium text-fg">Build-plan work items completed</span>
            <span className="text-muted">
              {done} of {allItems.length}
            </span>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={allItems.length}
            aria-valuenow={done}
            aria-label="Build-plan work items completed"
          >
            <div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-2 text-xs text-subtle">
            Counted from the work items listed below; it is not a measure of effort.
          </p>
        </div>
      </PageHeader>

      <Container className="py-16">
        <section aria-labelledby="phases">
          <SectionHeader
            id="phases"
            eyebrow="Build plan"
            title="Phase timeline"
            description="Phases 0 to 4 of the build plan. Phases 2 and 3 ran in parallel with Phase 1 against frozen API contracts."
          />
          <ol className="mt-10 space-y-6">
            {phases.map((phase, index) => (
              <Reveal as="li" key={phase.id}>
                <article className="relative rounded-xl border border-border bg-surface p-6 shadow-card">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy font-serif text-lg font-bold text-navy-fg">
                        {index}
                      </span>
                      <div>
                        <h3 className="text-xl font-semibold">{phase.name}</h3>
                        <p className="mt-1 text-sm text-muted">{phase.summary}</p>
                      </div>
                    </div>
                    <StatusBadge status={phase.status} />
                  </div>
                  <div className="mt-4 sm:pl-14">
                    <ItemList items={phase.items} />
                  </div>
                </article>
              </Reveal>
            ))}
          </ol>
        </section>

        <section aria-labelledby="review" className="mt-24">
          <SectionHeader
            id="review"
            eyebrow="Phase 1 review"
            title="60% completion checklist"
            description="The components the build plan set as the target demonstration for the Phase 1 panel review."
          />
          <div className="mt-8 rounded-xl border border-border bg-surface px-6 py-2 shadow-card">
            <ItemList items={reviewChecklist} />
          </div>
        </section>

        <section aria-labelledby="log" className="mt-24">
          <SectionHeader
            id="log"
            eyebrow="Engineering log"
            title="Major milestones"
            description="From the LegalAI repository's merged pull requests and documentation."
          />
          <div className="mt-10 max-w-3xl">
            <Timeline items={milestones} />
          </div>
        </section>

        <section aria-labelledby="roadmap" className="mt-24">
          <SectionHeader id="roadmap" eyebrow="Roadmap" title="Remaining work" />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {roadmap.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 40}>
                <div className="h-full rounded-xl border border-border bg-surface p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </ul>
          <Callout kind="info" title="Future work: CourtSim">
            The build plan defers a mock-trial simulator with prosecutor, defence and judge agents
            grounded in the same corpus. It is outside the current scope.
          </Callout>
        </section>
      </Container>
    </>
  );
}
