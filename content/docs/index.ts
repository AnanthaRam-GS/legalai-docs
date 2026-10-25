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
];

export function getDoc(slug: string): DocMeta | undefined {
  return docs.find((doc) => doc.slug === slug);
}
