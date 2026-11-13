import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ChartFrame } from "@/components/charts/ChartFrame";
import { ComparisonChart } from "@/components/charts/ComparisonChart";
import { Container } from "@/components/layout/Container";
import { Callout } from "@/components/ui/Callout";
import { MetricTable } from "@/components/ui/MetricTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";

export const metadata: Metadata = {
  title: "Experiments",
  description:
    "The bounded InLegalBERT experiments: a protocol frozen before training, held-out gold sets scored once, the E1 NER pass, the skipped section classifier, the integration check, the E4 failure, and the held-out judge that led to adoption.",
  alternates: { canonical: "/experiments/" },
};

const toc = [
  { id: "protocol", label: "Protocol" },
  { id: "e1", label: "E1: NER" },
  { id: "e2", label: "E2: classifier skipped" },
  { id: "e3", label: "E3: integration" },
  { id: "e4", label: "E4: failed" },
  { id: "e4c", label: "E4b/E4c: the judge" },
  { id: "limitations", label: "Limitations" },
  { id: "status", label: "Final status" },
];

function ExperimentSection({
  id,
  title,
  meta,
  children,
}: {
  id: string;
  title: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="border-t border-border pt-12 first:border-t-0 first:pt-0"
    >
      <h2 id={id} className="scroll-mt-24 font-serif text-3xl font-bold">
        {title}
      </h2>
      {meta ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">{meta}</div>
      ) : null}
      <div className="mt-6 max-w-4xl space-y-4 leading-7 text-muted [&_strong]:text-fg">
        {children}
      </div>
    </section>
  );
}

const Meta = ({ children }: { children: ReactNode }) => (
  <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-fg">
    {children}{" "}
  </span>
);

const E1_CHART = [
  { metric: "Precision", "Rules only (baseline)": 0.855, "Combined (InLegalBERT + rules)": 0.92 },
  { metric: "Recall", "Rules only (baseline)": 0.73, "Combined (InLegalBERT + rules)": 0.91 },
  { metric: "F1", "Rules only (baseline)": 0.788, "Combined (InLegalBERT + rules)": 0.915 },
];

const E4C_CHART = [
  { metric: "Precision", "Regex only": 0, "Combined (E4b)": 0.929 },
  { metric: "Recall", "Regex only": 0, "Combined (E4b)": 0.765 },
  { metric: "F1", "Regex only": 0, "Combined (E4b)": 0.839 },
];

export default function ExperimentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Experiments"
        title="InLegalBERT: a bounded experiment, rules frozen first"
        description="The build plan called for a fine-tuned InLegalBERT. Instead of assuming it would help, the team tested it against the existing rules under thresholds fixed before training, on held-out data scored once. One step failed, and that result stands."
      >
        <nav aria-label="On this page" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="inline-block rounded-full border border-border px-3 py-1 text-sm text-muted hover:border-border-strong hover:text-fg"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <Container className="space-y-16 py-16">
        <MetricTable
          caption="The record, step by step"
          columns={[
            { key: "step", label: "Step" },
            { key: "question", label: "Question" },
            { key: "result", label: "Result" },
          ]}
          rows={[
            {
              step: "E1",
              question: "Does InLegalBERT NER beat the rules on held-out NER gold?",
              result: "Pass: F1 0.915 vs 0.788; all five frozen criteria met by every seed",
            },
            {
              step: "E2",
              question: "IPC/BNS section classifier",
              result: "Skipped by decision: no open BNS/BNSS training data",
            },
            {
              step: "E3",
              question: "Is it safe inside the product?",
              result:
                "Pass: retrieval identical, no brief item lost; +0.84 GB memory, about +10 ms per query",
            },
            {
              step: "E4",
              question: "Do the model's parties improve the brief's Parties & Roles?",
              result: "Fail on the frozen rule “precision not lower” (1.000 → 0.846)",
              highlight: true,
            },
            {
              step: "E4b",
              question: "Fix both error causes; freeze a new rule judged on unseen excerpts",
              result: "Fixes and rules frozen before any code; regression check only",
            },
            {
              step: "E4c",
              question: "The held-out judge, scored once",
              result: "Pass on all six frozen rules (AI-labelled judge, see limitations)",
            },
          ]}
          footnote="Source: docs/experiments/INLEGALBERT_DECISION.md in the LegalAI repository (E0–E4c, 11–12 November 2026). All results are marked UNREVIEWED there."
        />

        <ExperimentSection id="protocol" title="The protocol">
          <p>
            <strong>The adoption rule</strong> comes from the project guide: adopt a model only if
            it beats the current approach on held-out gold data. The experiment plan turned that
            into numbers before any model was trained.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Thresholds frozen first.</strong> On 11 November 2026, before any training,
              the plan fixed the pass criteria: the combined system needs exact F1 ≥ 0.838 (the
              rules&rsquo; 0.788 + 0.05), a paired-bootstrap gain whose 95% CI lies above 0,
              precision ≥ 0.805, no F1 loss on the eight entity types the brief relies on, and 0
              false positives on the 2 examples with no entities. Retrieval must not regress (P@5 ≥
              0.873, nDCG@5 ≥ 0.814).
            </li>
            <li>
              <strong>Held-out gold, scored once.</strong> The 36-example NER gold set (89 entities)
              was never used for training, early stopping, thresholds or checkpoint choice. Each
              seed&rsquo;s checkpoint was chosen on the public dev split and then scored on the gold
              set once. No hyperparameter was changed after a gold result.
            </li>
            <li>
              <strong>Leakage filtered.</strong> Training items sharing a 13-word passage with the
              corpus were removed: 108 train and 23 dev items. No item overlapped the gold set.
            </li>
            <li>
              <strong>Commit order as evidence.</strong> For E1, the data pin (22:03 IST), the label
              mapping and combination policy (22:04) and the training script (22:06) were committed
              before training began at 22:06:07, and the scorer (22:07) before any model was scored.
              For E4b, the plan was committed before the code that implements it, and for E4c the
              judge labels were committed unchanged before the single scoring run (21:10 and 21:15
              IST on 12 November).
            </li>
          </ul>
        </ExperimentSection>

        <ExperimentSection
          id="e1"
          title="E1: InLegalBERT NER beats the rules"
          meta={
            <>
              <StatusBadge status="completed" label="Pass" />
              <Meta>36 gold examples, 89 entities</Meta>
              <Meta>3 seeds (11, 22, 33)</Meta>
              <Meta>Scored once, 12 November 2026</Meta>
            </>
          }
        >
          <p>
            <code>law-ai/InLegalBERT</code> (pinned revision, MIT) was fine-tuned for token
            classification on InLegalNER (10,887 training items after the leakage filter), for up to
            5 epochs per seed: 3 h 30 min of training on an Apple M5. The model&rsquo;s entities are
            combined with the rule-based NER through the product&rsquo;s existing merge, which keeps
            rule-owned types such as STATUTE, SECTION and FIR_NUMBER.
          </p>
          <ChartFrame
            title="E1: exact-match NER on the held-out gold set"
            description="Rules alone vs the combined system (median seed 22). Higher is better."
            footnote="36 short authored queries, 89 entities, exact span and type. Source: docs/experiments/INLEGALBERT_E1_RESULTS.md, section 4."
          >
            <ComparisonChart
              data={E1_CHART}
              systems={["Rules only (baseline)", "Combined (InLegalBERT + rules)"]}
              ariaLabel="Grouped bar chart. Rules only: precision 0.855, recall 0.730, F1 0.788. Combined: precision 0.920, recall 0.910, F1 0.915."
            />
          </ChartFrame>
          <MetricTable
            caption="Combined system per seed, against the rules"
            columns={[
              { key: "seed", label: "Seed" },
              { key: "p", label: "Precision", numeric: true },
              { key: "r", label: "Recall", numeric: true },
              { key: "f1", label: "F1 [95% CI]", numeric: true },
              { key: "delta", label: "Paired ΔF1 [95% CI]", numeric: true },
            ]}
            rows={[
              {
                seed: "Rules only (baseline)",
                p: "0.855",
                r: "0.730",
                f1: "0.788 [0.700, 0.866]",
                delta: "—",
              },
              {
                seed: "11",
                p: "0.899",
                r: "0.899",
                f1: "0.899 [0.841, 0.951]",
                delta: "+0.112 [+0.061, +0.169]",
              },
              {
                seed: "22 (median, used)",
                p: "0.920",
                r: "0.910",
                f1: "0.915 [0.864, 0.961]",
                delta: "+0.128 [+0.066, +0.203]",
                highlight: true,
              },
              {
                seed: "33",
                p: "0.920",
                r: "0.910",
                f1: "0.915 [0.864, 0.961]",
                delta: "+0.128 [+0.066, +0.203]",
              },
            ]}
            footnote="Bootstrap over the 36 examples, 10,000 resamples, seed 20261111. Every seed meets all five frozen criteria on its own. Source: docs/experiments/INLEGALBERT_E1_RESULTS.md."
          />
          <p>
            <strong>Where the gain comes from.</strong> The combined system finds 16 more correct
            entities than the rules (81 against 65). Twelve are in types the rules do not cover at
            all (organisation +4, location +4, person +3, case name +1), and four are courts and
            dates. So the model fills gaps; it does not improve the rules&rsquo; own types, and no
            brief-relevant type loses F1. The model alone scores F1 0.61 because it has no labels
            for 34 of the 89 gold entities (offence, procedure, legal role, FIR number).
          </p>
        </ExperimentSection>

        <ExperimentSection
          id="e2"
          title="E2: the section classifier was skipped, by measurement"
          meta={<StatusBadge status="historical" label="Skipped by decision" />}
        >
          <p>
            A multi-label IPC/BNS section classifier was not trained. The reasons were measured in
            the feasibility step, before any training:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>No open BNS or BNSS training data exists.</strong> The only open
              statute-identification set (ILSI) is IPC-only and covers 22 of the 60 positive labels
              in LegalAI&rsquo;s section gold set, and none of the BNS, BNSS, CrPC or special-Act
              ones.
            </li>
            <li>
              <strong>No room to improve where it could apply.</strong> On the 15 queries ILSI can
              express, the current BGE cross-encoder ranker already reaches P@1 0.867 and MRR 0.933,
              so the frozen pass condition (+0.10 recall@5 with a CI above 0) was out of reach.
            </li>
          </ul>
          <p>
            This is a recorded decision, not a failed model: nothing was trained and the section
            gold set was not scored. Section ranking stays with the BGE cross-encoder.
          </p>
        </ExperimentSection>

        <ExperimentSection
          id="e3"
          title="E3: integration is safe"
          meta={
            <>
              <StatusBadge status="completed" label="Pass" />
              <Meta>30 retrieval queries, 6 brief fixtures</Meta>
              <Meta>No LLM calls</Meta>
            </>
          }
        >
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Retrieval:</strong> identical rankings on all 30 frozen benchmark queries (P@5
              0.873, nDCG@5 0.819, Δ 0). Retrieval sends the original query, so NER cannot move it;
              no gain is claimed.
            </li>
            <li>
              <strong>Briefs:</strong> on the 5 brief fixtures and a scanned FIR, 0 expected items
              lost and 0 gained.
            </li>
            <li>
              <strong>Cost:</strong> about +0.84 GB memory, about +10 ms per query for NER, and 0
              crashes in 5 × 45 stress requests.
            </li>
          </ul>
        </ExperimentSection>

        <ExperimentSection
          id="e4"
          title="E4: failed its frozen precision rule"
          meta={
            <>
              <StatusBadge status="blocked" label="Fail" />
              <Meta>15 documents, 47 gold parties</Meta>
              <Meta>Record unchanged</Meta>
            </>
          }
        >
          <p>
            E4 asked whether the model&rsquo;s people and organisations improve the brief&rsquo;s{" "}
            <strong>Parties &amp; Roles</strong>. On 15 documents (5 fixtures, 10 synthetic), recall
            rose from 0.298 to 0.702, but precision fell from 1.000 to 0.846. The frozen rule was
            &ldquo;precision not lower&rdquo;, so <strong>E4 failed</strong>, and the default stayed
            rules-only.
          </p>
          <MetricTable
            caption="E4: Parties & Roles on 15 documents (strict scoring)"
            columns={[
              { key: "system", label: "System" },
              { key: "p", label: "Precision", numeric: true },
              { key: "r", label: "Recall", numeric: true },
              { key: "f1", label: "F1", numeric: true },
              { key: "counts", label: "TP / FP / FN", numeric: true },
            ]}
            rows={[
              { system: "Regex only", p: "1.000", r: "0.298", f1: "0.459", counts: "14 / 0 / 33" },
              {
                system: "Combined (E4)",
                p: "0.846",
                r: "0.702",
                f1: "0.767",
                counts: "33 / 6 / 14",
                highlight: true,
              },
            ]}
            footnote="Recall gain +0.404 [0.158, 0.659]; precision change −0.154 [−0.342, 0.000]. Paired document bootstrap, 10,000 resamples. Source: docs/experiments/NER_PARTY_ROLES_RESULTS.md."
          />
          <p>
            The 6 errors had two causes: four accused listed as &ldquo;A-1 …&rdquo; were given the
            role &ldquo;respondent&rdquo;, and two names were cut mid-word (&ldquo;Dev Fake&rdquo;
            for &ldquo;Dev Fakename&rdquo;). Nothing was changed after the run; the fixes became a
            new, separately frozen experiment.
          </p>
        </ExperimentSection>

        <ExperimentSection
          id="e4c"
          title="E4b and E4c: the fixes, then a held-out judge"
          meta={
            <>
              <StatusBadge status="completed" label="Pass on all six rules" />
              <Meta>5 public judgment excerpts, 17 gold parties</Meta>
              <Meta>Scored once</Meta>
            </>
          }
        >
          <p>
            <strong>E4b</strong> froze two fixes before writing any code: model names are snapped to
            whole words, and in FIRs and charge sheets an accused number (&ldquo;A-1&rdquo;,
            &ldquo;Accused No. 1&rdquo;) or an accused heading sets the role to accused. Because
            those fixes came from the 15 known documents, a new judge was frozen: 5 public judgment
            excerpts never run with the model or scored. On the 15 known documents (a regression
            check only, not the verdict) precision was 0.974 and recall 0.787, with no E4 correct
            party lost.
          </p>
          <p>
            <strong>E4c</strong> scored the judge once. On these real judgments, the existing regex
            detectors found <strong>0 of 17 parties</strong>; the combined system found 13 with one
            false positive, which is the regex&rsquo;s own output kept by the merge.
          </p>
          <ChartFrame
            title="E4c: Parties & Roles on the held-out judge"
            description="Regex only vs the combined system with the E4b fixes. Higher is better."
            footnote="5 public judgment excerpts, 17 gold parties (AI-labelled, not human-verified), scored once. Source: docs/experiments/INLEGALBERT_DECISION.md; experiments/inlegalbert/results/e4b_judge.json."
          >
            <ComparisonChart
              data={E4C_CHART}
              systems={["Regex only", "Combined (E4b)"]}
              ariaLabel="Grouped bar chart. Regex only: precision, recall and F1 all 0. Combined: precision 0.929, recall 0.765, F1 0.839."
            />
          </ChartFrame>
          <MetricTable
            caption="E4c judge: the six frozen rules"
            columns={[
              { key: "rule", label: "Rule" },
              { key: "result", label: "Result" },
            ]}
            rows={[
              { rule: "J1 precision ≥ 0.90", result: "Pass (0.929 [0.813, 0.938])" },
              { rule: "J2 recall gain ≥ 0.10", result: "Pass (+0.765; recall [0.600, 1.000])" },
              { rule: "J3 no accused given a wrong role", result: "Pass (0)" },
              { rule: "J4 no regex party lost", result: "Pass" },
              { rule: "J5 a valid page reference on every party", result: "Pass (14 of 14)" },
              {
                rule: "J6 nothing invented on documents without parties",
                result: "Pass, vacuously (every excerpt has parties)",
              },
            ]}
            footnote="Paired bootstrap, 10,000 resamples of the 5 excerpts. Misses: a substituted petitioner, a respondent named only by designation, and two appellants named in prose."
          />
        </ExperimentSection>

        <ExperimentSection id="limitations" title="Limitations, stated plainly">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>The judge labels are AI-generated and not human-verified.</strong> An AI chat
              assistant labelled the 5 excerpts without seeing any system output; no person has
              checked them. The labeller and the rule&rsquo;s author are models of the same family,
              so their errors may be correlated, and the verdict is weaker evidence than the
              adoption rule assumes.
            </li>
            <li>
              <strong>The accused-cue fix was not tested on real FIRs or charge sheets.</strong> The
              judge excerpts are judgments and orders; that fix rests on the 15 known documents and
              unit tests.
            </li>
            <li>
              <strong>Five documents, 17 parties.</strong> One error moves precision by about 7
              points, so the confidence intervals are wide and coarse.
            </li>
            <li>
              <strong>Alias gap.</strong> An alias written as a separate word after the
              model&rsquo;s span (&ldquo;Raju Tambolkar @ Raja&rdquo;) is not added.
            </li>
            <li>
              The NER gold set is 36 short authored queries with one reviewer, so E1 shows a large
              effect on a small sample, not a general claim about InLegalBERT.
            </li>
          </ul>
        </ExperimentSection>

        <ExperimentSection
          id="status"
          title="Final status"
          meta={
            <StatusBadge
              status="pending-approval"
              label="Adopted under the guide's rule — sign-off pending"
            />
          }
        >
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>On by default:</strong> the combined NER (InLegalBERT + rules) feeds the
              entity fields and the brief&rsquo;s Parties &amp; Roles.
            </li>
            <li>
              <strong>Fallback:</strong> without the checkpoint, or on any model error, the
              rule-based NER is used and queries never fail; the health check reports the fallback.
              One setting restores the previous behaviour exactly.
            </li>
            <li>
              <strong>Cost:</strong> about +0.84 GB of memory and about +10 ms per query.
            </li>
          </ul>
          <Callout kind="info" title="Sign-off">
            The decision record has an unsigned approval line for the project guide. Before any
            external claim, it recommends a human check of the 5 judge labels and a held-out set of
            real FIRs and charge sheets.
          </Callout>
        </ExperimentSection>
      </Container>
    </>
  );
}
