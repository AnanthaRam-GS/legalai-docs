import { CheckCircle2, Circle, CircleDashed, Clock, History, OctagonAlert } from "lucide-react";
import type { Status } from "@/content/site";

const STYLES: Record<Status, { label: string; className: string; Icon: typeof Circle }> = {
  completed: { label: "Completed", className: "bg-ok-bg text-ok", Icon: CheckCircle2 },
  "in-progress": { label: "In progress", className: "bg-info-bg text-info", Icon: CircleDashed },
  planned: { label: "Planned", className: "bg-neutral-bg text-neutral", Icon: Circle },
  "pending-approval": {
    label: "Pending approval",
    className: "bg-pending-bg text-pending",
    Icon: Clock,
  },
  blocked: { label: "Blocked", className: "bg-warn-bg text-warn", Icon: OctagonAlert },
  historical: { label: "Historical", className: "bg-neutral-bg text-neutral", Icon: History },
};

/** Status pill. The text label carries the meaning; colour and icon only reinforce it. */
export function StatusBadge({ status, label }: { status: Status; label?: string }) {
  const { label: defaultLabel, className, Icon } = STYLES[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${className}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label ?? defaultLabel}
    </span>
  );
}
