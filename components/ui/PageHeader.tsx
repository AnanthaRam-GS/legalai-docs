import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";

/** Top band shared by the inner pages. */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-border bg-surface">
      <Container className="py-12 sm:py-16">
        <p className="text-sm font-semibold tracking-wide text-accent uppercase">{eyebrow}</p>
        <h1 className="mt-2 max-w-3xl font-serif text-4xl font-bold sm:text-5xl">{title}</h1>
        <div className="mt-4 max-w-3xl text-lg text-muted">{description}</div>
        {children}
      </Container>
    </div>
  );
}
