import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
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

function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div
      className="my-6 overflow-x-auto rounded-lg border border-border"
      role="region"
      aria-label="Table"
      tabIndex={0}
    >
      <table {...props} />
    </div>
  );
}

const components: MDXComponents = {
  a: Anchor,
  pre: Pre,
  table: Table,
  Callout,
  StatusBadge,
};

export function useMDXComponents(inherited: MDXComponents = {}): MDXComponents {
  return { ...inherited, ...components };
}
