import { Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

type CalloutKind = "info" | "warning";

const KINDS: Record<CalloutKind, { label: string; className: string; Icon: typeof Info }> = {
  info: { label: "Note", className: "border-info/40 bg-info-bg", Icon: Info },
  warning: { label: "Caveat", className: "border-warn/40 bg-warn-bg", Icon: TriangleAlert },
};

const ICON_COLOUR: Record<CalloutKind, string> = {
  info: "text-info",
  warning: "text-warn",
};

interface CalloutProps {
  kind?: CalloutKind;
  title?: string;
  children: ReactNode;
}

export function Callout({ kind = "info", title, children }: CalloutProps) {
  const { label, className, Icon } = KINDS[kind];
  return (
    <aside
      className={`my-6 flex gap-3 rounded-lg border p-4 text-fg ${className}`}
      aria-label={title ?? label}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${ICON_COLOUR[kind]}`} aria-hidden="true" />
      <div className="min-w-0 text-sm leading-6 [overflow-wrap:anywhere] [&>p+p]:mt-2">
        <p className="font-semibold">{title ?? label}</p>
        <div className="mt-1 text-fg/90 [&_p+p]:mt-2">{children}</div>
      </div>
    </aside>
  );
}
