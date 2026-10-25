import type { ReactNode } from "react";

interface SectionHeaderProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  /** Heading level; sections inside a page use h2. */
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  as: Heading = "h2",
  align = "left",
}: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <div className={`max-w-3xl ${centered ? "mx-auto text-center" : ""}`}>
      {eyebrow ? (
        <p className="text-sm font-semibold tracking-wide text-accent uppercase">{eyebrow}</p>
      ) : null}
      <Heading
        id={id}
        className={`mt-2 scroll-mt-24 font-serif font-bold text-fg ${
          Heading === "h1" ? "text-4xl sm:text-5xl" : Heading === "h2" ? "text-3xl" : "text-2xl"
        }`}
      >
        {title}
      </Heading>
      {description ? <div className="mt-4 text-lg text-muted">{description}</div> : null}
    </div>
  );
}
