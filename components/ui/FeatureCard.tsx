import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function FeatureCard({ icon: Icon, title, children, footer }: FeatureCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-border bg-surface p-6 shadow-card transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-raised">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-fg">{title}</h3>
      <div className="mt-2 flex-1 text-sm leading-6 text-muted">{children}</div>
      {footer ? <div className="mt-4">{footer}</div> : null}
    </article>
  );
}
