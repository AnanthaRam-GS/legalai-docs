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
    alt: "Table mapping IPC provisions to BNS provisions with descriptions and the nature of change",
    caption: "Analytics, IPC-BNS Map: the comparative mapping (unreviewed).",
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
    alt: "Brief from an uploaded synthetic FIR PDF with identified sections, parties and roles with page references, applicable law and procedural considerations",
    caption:
      "A live brief from a synthetic FIR (invented names and places), uploaded privately. Parties and procedural steps come with page references such as [P1, pp. 1-2]. The model's one-line section labels are wrong here: BNS 309(4) is robbery and BNS 115(2) is voluntarily causing hurt, and Section 173 is in the BNSS. This is why answers must be checked against the statute.",
  },
  professionalBriefDetail: {
    src: "/screenshots/professional-brief-detail.webp",
    alt: "The same brief's dated chronology, explicit provisions, evidence by category and key legal issues, each item with a page reference",
    caption:
      "The same brief further down: a dated chronology and evidence by category (witness, electronic, medical), each with its page reference. The model also noted that the FIR's dates fall before the BNS took effect on 1 July 2024.",
  },
  ocr: {
    alt: "Answer for a scanned FIR showing the low-confidence OCR note",
    caption: "OCR: a scanned FIR with its confidence note.",
  },
} satisfies Record<string, ShotMeta>;
