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
];

export function getDoc(slug: string): DocMeta | undefined {
  return docs.find((doc) => doc.slug === slug);
}
