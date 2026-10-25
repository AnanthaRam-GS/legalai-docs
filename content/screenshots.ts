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

const PENDING_PROVIDER = "Coming soon — pending live provider capacity";

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
    alt: "Professional answer with ranked precedents, relative relevance and cited badges",
    caption: "Professional answer with ranked precedents.",
    placeholder: PENDING_PROVIDER,
  },
  professionalBrief: {
    alt: "Structured brief from a private PDF with parties, chronology, procedural stages and evidence",
    caption: "Structured brief from a private PDF.",
    placeholder: PENDING_PROVIDER,
  },
  ocr: {
    alt: "Answer for a scanned FIR showing the low-confidence OCR note",
    caption: "OCR: a scanned FIR with its confidence note.",
  },
} satisfies Record<string, ShotMeta>;
