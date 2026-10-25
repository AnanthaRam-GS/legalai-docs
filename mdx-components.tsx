import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { Children, isValidElement, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Callout } from "@/components/ui/Callout";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { StatusBadge } from "@/components/ui/StatusBadge";

function Anchor({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

function Pre({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  // Fenced code arrives as <pre><code className="language-x">.
  const child = children as { props?: { className?: string } } | undefined;
  const language = child?.props?.className?.replace("language-", "");
  return (
    <CodeBlock title={language} className={props.className}>
      {children}
    </CodeBlock>
  );
}

/** Plain text of a React subtree. */
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

/** Text of each cell in the first row of a <thead> or <tbody> element. */
function firstRowCells(section: ReactNode): string[] {
  if (!isValidElement<{ children?: ReactNode }>(section)) return [];
  const row = Children.toArray(section.props.children).find((child) => isValidElement(child));
  if (!isValidElement<{ children?: ReactNode }>(row)) return [];
  return Children.toArray(row.props.children)
    .map((cell) => textOf(cell).trim())
    .filter(Boolean);
}

/**
 * A scrollable, focusable region around each table. Its name comes from the
 * table's column headings and first row, so tables on one page stay distinct.
 */
function Table(props: ComponentPropsWithoutRef<"table">) {
  const [head, body] = Children.toArray(props.children);
  const first = firstRowCells(body).slice(0, 2).join(" ");
  return (
    <div
      className="my-6 overflow-x-auto rounded-lg border border-border"
      role="region"
      aria-label={`Table: ${firstRowCells(head).join(", ")}${first ? `, starting ${first}` : ""}`}
      tabIndex={0}
    >
      <table {...props} />
    </div>
  );
}

// A trailing space keeps adjacent cells apart in the search index.
function Th({ children, ...props }: ComponentPropsWithoutRef<"th">) {
  return <th {...props}>{children} </th>;
}

function Td({ children, ...props }: ComponentPropsWithoutRef<"td">) {
  return <td {...props}>{children} </td>;
}

const components: MDXComponents = {
  a: Anchor,
  th: Th,
  td: Td,
  pre: Pre,
  table: Table,
  Callout,
  StatusBadge,
};

export function useMDXComponents(inherited: MDXComponents = {}): MDXComponents {
  return { ...inherited, ...components };
}
