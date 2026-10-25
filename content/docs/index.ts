/** Documentation pages in reading order. Each slug matches content/docs/<slug>.mdx. */
export interface DocMeta {
  slug: string;
  title: string;
  description: string;
}

export const docs: DocMeta[] = [
  {
    slug: "getting-started",
    title: "Getting started",
    description: "Prerequisites and a summary of local setup.",
  },
  {
    slug: "api-reference",
    title: "API reference",
    description: "Endpoints by group and role, and the error-code catalogue.",
  },
  {
    slug: "data-sources",
    title: "Data sources and attribution",
    description: "Where the judgments, statistics and mappings come from.",
  },
  {
    slug: "security",
    title: "Security and privacy",
    description: "Authentication, rate limits, CSRF defence and how uploads are handled.",
  },
  {
    slug: "testing",
    title: "Testing and QA",
    description: "Test suites, the isolated test database and data-change safeguards.",
  },
  {
    slug: "limitations",
    title: "Limitations",
    description:
      "Known technical limits of the corpus, answers, analytics, evaluation and engineering.",
  },
  {
    slug: "glossary",
    title: "Glossary",
    description: "Legal and technical terms used on this site.",
  },
];

export function getDoc(slug: string): DocMeta | undefined {
  return docs.find((doc) => doc.slug === slug);
}
