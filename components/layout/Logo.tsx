import { Scale } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-md font-serif text-xl font-bold text-fg"
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-navy text-[#e3b65c] ring-1 ring-border">
        <Scale className="h-5 w-5" aria-hidden="true" />
      </span>
      LegalAI
      <span className="sr-only">, home</span>
    </Link>
  );
}
