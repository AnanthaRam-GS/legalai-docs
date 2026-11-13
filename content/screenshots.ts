/**
 * Product screenshots in public/screenshots/, captured from a locally running
 * LegalAI with scripts/capture-screenshots.ts. Entries without `src` render as
 * placeholders until they can be captured from real, working output.
 */
export interface ShotMeta {
  src?: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
  fit?: "cover" | "contain";
  placeholder?: string;
}

export const shots = {
  publicHome: {
    src: "/screenshots/public-home.webp",
    alt: "Public Mode home page with a question box, a PDF upload button and example questions",
    caption: "Public Mode home: ask in your own words or share one PDF, no account needed.",
  },
  publicAnswer: {
    src: "/screenshots/public-answer.webp",
    alt: "A plain-language answer explaining the punishment for dowry death under IPC 304B, with practical next steps",
    caption:
      "A live plain-language answer to a question about dowry death under IPC 304B (captured 25 October 2026).",
  },
  publicAnswerSources: {
    src: "/screenshots/public-answer-sources.webp",
    alt: "The same answer's related law and three validated sources, with case titles blurred",
    caption:
      "The same answer's related law and its three validated sources. Case titles are blurred here because they name the parties.",
  },
  publicAnswerMobile: {
    src: "/screenshots/public-answer-mobile.webp",
    alt: "The plain-language answer on a 390-pixel-wide phone screen",
    caption: "The public answer on a phone (390 × 844).",
    width: 390,
    height: 844,
    fit: "contain",
  },
  login: {
    src: "/screenshots/login.webp",
    alt: "Sign-in page with email and password fields and a continue-as-guest option",
    caption: "Sign in for Professional and Admin modes; the role comes from the account.",
  },
  professionalHome: {
    src: "/screenshots/professional-home.webp",
    alt: "Professional Mode home with cards for text query, confidential PDF analysis, analytics and history",
    caption: "Professional Mode home for a verified lawyer account.",
  },
  analyticsTrends: {
    src: "/screenshots/analytics-offense-trends.webp",
    alt: "Line chart of offence citations by judgment year for IPC 302, 307, 376 and 420",
    caption: "Analytics, Offense Trends: offence provisions cited per judgment year.",
  },
  analyticsOutcomes: {
    src: "/screenshots/analytics-outcomes.webp",
    alt: "Bar chart of extracted judgment outcomes by section and court level",
    caption:
      "Analytics, Outcome Distribution: rule-extracted outcomes by section and court level (unreviewed).",
  },
  analyticsCooccurrence: {
    src: "/screenshots/analytics-cooccurrence.webp",
    alt: "Cards listing pairs of offence sections cited together and how many judgments cite both",
    caption: "Analytics, Section Co-occurrence: offence provisions cited together.",
  },
  analyticsIpcBns: {
    src: "/screenshots/analytics-ipc-bns.webp",
    alt: "IPC-BNS mapping rows for IPC 376, each showing the official heading above the source description; three rows carry the flag Conflicts with the official heading",
    caption:
      "Analytics, IPC-BNS Map, searched for IPC 376: each row shows the official India Code heading above the source's own description. Descriptions that conflict with the official heading are flagged and left as published (unreviewed).",
  },
  analyticsNcrb: {
    src: "/screenshots/analytics-ncrb.webp",
    alt: "Cards of NCRB 2024 crime heads by State/UT with total cases",
    caption: "Analytics, NCRB Statistics: Crime in India 2024, Table 1A.4, by State/UT.",
  },
  history: {
    src: "/screenshots/history.webp",
    alt: "Query history list with two stored professional queries, collapsed",
    caption: "Query history: past professional queries with their answer backend.",
  },
  adminStatus: {
    src: "/screenshots/admin-status.webp",
    alt: "Admin system status showing 70 documents and healthy ChromaDB, keyword index and PostgreSQL with matching counts of 1,356",
    caption:
      "Admin status: 70 documents, with Chroma, BM25 and PostgreSQL all healthy at 1,356 chunks.",
  },
  adminIngest: {
    src: "/screenshots/admin-ingest.webp",
    alt: "Corpus ingestion page with a PDF drop zone, a permanent-update confirmation and an empty job list",
    caption: "Admin ingestion, idle: uploads need an explicit permanent-update confirmation.",
  },
  professionalAnswer: {
    src: "/screenshots/professional-answer.webp",
    alt: "Professional text answer on dowry death under IPC 304B and the presumption under Section 113B of the Evidence Act, with identified sections and the structured case brief",
    caption:
      "A live professional answer on dowry death (IPC 304B) and the Section 113B presumption, from gpt-oss-120b with prompt v3 (captured 8 November 2026).",
  },
  professionalPrecedents: {
    src: "/screenshots/professional-precedents.webp",
    alt: "The same answer's precedents tab: two judgments marked Cited in answer, with relative relevance of 100% and 0%, court, year and excerpt source; case titles and excerpts blurred",
    caption:
      "The same answer's precedents, both cited in the answer. Relative relevance scales the reranker scores within this answer (top = 100%, lowest = 0%); it is not a probability. Case titles and excerpts are blurred.",
  },
  professionalBrief: {
    src: "/screenshots/professional-brief.webp",
    alt: "Brief from an uploaded synthetic FIR: identified sections with official titles, two of them marked statute corrected from BNS, CrPC 154 with an unverified label, explicit provisions listing Section 173 BNSS, and parties and roles with page references",
    caption:
      "A live brief from a synthetic FIR (invented names and places), captured 13 November 2026 with gpt-oss-120b. Section titles come from India Code: the answer cited BNS 173 and BNS 176, which were corrected to BNSS 173 (Information in cognizable cases) and BNSS 176 (Procedure for investigation); the model's own wording stays in the data only. CrPC 154 has no official heading, so the model's label is shown marked unverified. Parties & Roles come from the combined InLegalBERT and rules NER (on this fixture the rules alone find the same two). Two flaws remain visible: the section cards above the tabs label the corrected BNSS sections “BNS”, a display bug in the card (the list below shows BNSS), and the summary's prose attributes all three sections to the BNSS, because section names inside free text are not checked.",
  },
  professionalBriefDetail: {
    src: "/screenshots/professional-brief-detail.webp",
    alt: "The same brief's dated chronology and evidence by category, each item with a page reference",
    caption:
      "The same brief further down: a dated chronology and evidence by category (witness, electronic, medical/forensic), each item with its page reference.",
  },
  professionalBriefChargesheet: {
    src: "/screenshots/professional-brief-chargesheet.webp",
    alt: "Brief from an uploaded synthetic charge sheet: IPC 420, 406 and 120B with official headings, CrPC 438 with a catalog title, CrPC 161 and 173(2) with unverified labels, and parties and roles listing two accused and the complainant",
    caption:
      "A live brief from a synthetic charge sheet, captured 13 November 2026. IPC 420, 406 and 120B show their official India Code headings and CrPC 438 its catalog title; CrPC 161 and 173(2) have no trusted title, so the model's wording is shown marked unverified (the CrPC gap). Parties & Roles list both accused and the complainant with page references, with no cut-off duplicate name such as E4's “Dev Fake”.",
  },
  ocr: {
    alt: "Answer for a scanned FIR showing the low-confidence OCR note",
    caption: "OCR: a scanned FIR with its confidence note.",
  },
} satisfies Record<string, ShotMeta>;
