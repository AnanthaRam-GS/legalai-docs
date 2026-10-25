import { CountUp } from "@/components/motion/CountUp";
import type { Stat } from "@/content/site";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

/** A verified figure with its sample size, date and source path. */
export function StatCard({ stat }: { stat: Stat }) {
  return (
    <figure className="flex h-full flex-col rounded-xl border border-border bg-surface p-6 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <figcaption className="text-sm font-semibold text-muted">{stat.label}</figcaption>
        {stat.status === "historical" ? <StatusBadge status="historical" /> : null}
      </div>
      <p className="mt-3 text-4xl font-bold tracking-tight text-fg">
        <CountUp
          value={stat.value}
          decimals={stat.decimals}
          prefix={stat.prefix}
          suffix={stat.suffix}
        />
      </p>
      <p className="mt-1 text-sm text-fg">{stat.detail}</p>
      <p className="mt-4 border-t border-border pt-3 text-xs leading-5 text-subtle">
        {stat.sample}. As of <time dateTime={stat.asOf}>{formatDate(stat.asOf)}</time>.
        <br />
        Source: <code className="font-mono break-all">{stat.source}</code>
      </p>
    </figure>
  );
}
