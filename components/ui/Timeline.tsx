import type { Milestone } from "@/content/site";
import { formatDate } from "@/lib/format";
import { Reveal } from "@/components/motion/Reveal";
import { StatusBadge } from "./StatusBadge";

/** Vertical timeline of dated milestones, newest last. */
export function Timeline({ items }: { items: Milestone[] }) {
  return (
    <ol className="relative border-l-2 border-border pl-6 sm:pl-8">
      {items.map((item) => (
        <Reveal as="li" key={`${item.date}-${item.title}`} className="relative pb-8 last:pb-0">
          <span
            className={`absolute top-1.5 -left-[calc(1.5rem+7px)] h-3 w-3 rounded-full ring-4 ring-bg sm:-left-[calc(2rem+7px)] ${
              item.status === "completed" ? "bg-accent" : "bg-info"
            }`}
            aria-hidden="true"
          />
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <time dateTime={item.date} className="text-sm font-semibold text-accent">
              {formatDate(item.date)}
            </time>
            {item.status !== "completed" ? <StatusBadge status={item.status} /> : null}
          </div>
          <h3 className="mt-1 text-lg font-semibold text-fg">{item.title}</h3>
          <p className="mt-1 text-sm leading-6 text-muted">{item.description}</p>
          <p className="mt-1 text-xs text-subtle">{item.refs}</p>
        </Reveal>
      ))}
    </ol>
  );
}
