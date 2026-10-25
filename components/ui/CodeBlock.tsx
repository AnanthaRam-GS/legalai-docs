"use client";

import { Check, Copy } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";

interface CodeBlockProps {
  children: ReactNode;
  /** Optional label, such as "bash" or a file name. */
  title?: string;
  className?: string;
}

/** A <pre> block with a copy-to-clipboard button. Also used for fenced code in MDX. */
export function CodeBlock({ children, title, className = "" }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = preRef.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-lg border border-border bg-navy text-navy-fg">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-1.5">
        <span className="font-mono text-xs text-navy-muted">{title ?? "code"}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-navy-muted hover:bg-white/10 hover:text-navy-fg focus-visible:outline-[#9cc0f5]"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
        <span className="sr-only" role="status" aria-live="polite">
          {copied ? "Code copied to clipboard" : ""}
        </span>
      </div>
      <pre
        ref={preRef}
        className={`overflow-x-auto p-4 font-mono text-[0.8125rem] leading-6 ${className}`}
        tabIndex={0}
      >
        {children}
      </pre>
    </div>
  );
}
