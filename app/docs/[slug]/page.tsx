import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocPager } from "@/components/docs/DocPager";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { docs, getDoc } from "@/content/docs";
import { site } from "@/content/site";
import { formatDate } from "@/lib/format";

interface DocPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return docs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const doc = getDoc((await params).slug);
  return doc ? { title: doc.title, description: doc.description } : {};
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  const { default: Content } = await import(`@/content/docs/${slug}.mdx`);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 xl:grid-cols-[minmax(0,1fr)_12rem]">
      <article className="min-w-0 max-w-3xl">
        <p className="text-sm font-semibold tracking-wide text-accent uppercase">Documentation</p>
        <h1 className="mt-2 font-serif text-4xl font-bold">{doc.title}</h1>
        <p className="mt-3 text-lg text-muted">{doc.description}</p>
        <div data-doc-content className="prose-doc mt-8">
          <Content />
        </div>
        <p className="mt-12 text-xs text-subtle">
          Last reviewed <time dateTime={site.lastUpdated}>{formatDate(site.lastUpdated)}</time>{" "}
          against LegalAI commit <code className="font-mono">{site.sourceCommit}</code>.
        </p>
        <DocPager slug={slug} />
      </article>
      <aside className="hidden xl:block">
        <TableOfContents />
      </aside>
    </div>
  );
}
