"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useMounted } from "@/lib/useMounted";

interface Stage {
  id: string;
  title: string;
  /** Two side-by-side boxes for stages that run in parallel. */
  parallel?: [string, string];
  subtitle: string;
  detail: string;
}

const STAGES: Stage[] = [
  {
    id: "understand",
    title: "Query understanding",
    subtitle: "statutes, sections, regime",
    detail:
      "Deterministic analysis finds statute and section references and the legal regime (IPC/CrPC or BNS/BNSS). The original query stays the primary retrieval signal.",
  },
  {
    id: "retrieve",
    title: "Hybrid retrieval",
    parallel: ["Dense · BGE-M3", "Keyword · BM25"],
    subtitle: "top 20 candidates each",
    detail:
      "BGE-M3 embeds the query (1024 dimensions) and searches Chroma, while BM25 (k1 = 1.5, b = 0.75, legal tokenizer) matches exact terms and section numbers. The two find different relevant passages, which is why both are kept.",
  },
  {
    id: "fuse",
    title: "Reciprocal rank fusion",
    subtitle: "k = 60, depth 20",
    detail:
      "The two ranked lists are merged and de-duplicated with reciprocal rank fusion (k = 60), so a passage ranked well by either retriever rises.",
  },
  {
    id: "rerank",
    title: "BGE reranker",
    subtitle: "cross-encoder, 20 → 5",
    detail:
      "BAAI/bge-reranker-v2-m3 reads each query–passage pair together and keeps the best five. Its raw scores also give the precedents' relative relevance.",
  },
  {
    id: "evidence",
    title: "Bounded evidence",
    subtitle: "E# authority, P# document",
    detail:
      "The top passages become an evidence packet with IDs (E1…E5). Excerpts from a private upload are labelled P# and are never treated as authority. A size guard trims items to fit the provider's token limit.",
  },
  {
    id: "generate",
    title: "LLM generation",
    subtitle: "structured JSON, prompt v2",
    detail:
      "The answer model returns schema-checked JSON in which every substantive statement is a claim citing evidence IDs. Groq (gpt-oss-120b) is primary; Gemini is tried only if the primary fails as a provider.",
  },
  {
    id: "validate",
    title: "Citation validation",
    subtitle: "every claim checked",
    detail:
      "Each citation must point to evidence that was actually supplied, with matching case metadata. An answer with no claims is rejected unless it is the explicit no-coverage answer.",
  },
  {
    id: "respond",
    title: "Response",
    subtitle: "public or professional",
    detail:
      "Public: a plain-language explanation with validated sources only. Professional: identified sections, ranked precedents with provenance, and a structured case brief.",
  },
];

const STEP_MS = 1800;

export function PipelineDiagram() {
  const reduceMotion = useReducedMotion();
  // The motion preference is unknown on the server, so autoplay starts after hydration.
  const mounted = useMounted();
  const [active, setActive] = useState(0);
  // null = follow the reduced-motion preference; true/false = the user's explicit choice.
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const playing = userPlaying ?? (mounted && !reduceMotion);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % STAGES.length);
    }, STEP_MS);
    return () => window.clearInterval(timer);
  }, [playing]);

  const stage = STAGES[active] ?? STAGES[0]!;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-muted">
          Select a stage for details. Stage {active + 1} of {STAGES.length}.
        </p>
        <button
          type="button"
          onClick={() => setUserPlaying(!playing)}
          aria-pressed={playing}
          className="inline-flex shrink-0 items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium hover:bg-surface-2"
        >
          {playing ? (
            <Pause className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4" aria-hidden="true" />
          )}
          {playing ? "Pause" : "Play"} animation
        </button>
      </div>

      <ol className="grid gap-2 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-6">
        {STAGES.map((item, index) => {
          const isActive = index === active;
          const done = index < active;
          return (
            <li key={item.id} className="relative">
              <button
                type="button"
                onClick={() => {
                  setActive(index);
                  setUserPlaying(false);
                }}
                aria-current={isActive ? "step" : undefined}
                className={`relative flex h-full w-full flex-col rounded-xl border p-4 text-left transition-colors duration-300 ${
                  isActive
                    ? "border-accent bg-navy text-navy-fg shadow-raised"
                    : done
                      ? "border-border-strong bg-surface text-fg"
                      : "border-border bg-surface text-fg hover:bg-surface-2"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isActive ? "bg-[#e3b65c] text-[#0a1120]" : "bg-surface-2 text-muted"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="font-semibold">{item.title}</span>
                </span>
                {item.parallel ? (
                  <span className="mt-3 grid grid-cols-2 gap-2">
                    {item.parallel.map((part) => (
                      <span
                        key={part}
                        className={`rounded-md border px-2 py-1.5 text-center text-xs font-medium ${
                          isActive ? "border-white/20 bg-white/5" : "border-border bg-surface-2"
                        }`}
                      >
                        {part}
                      </span>
                    ))}
                  </span>
                ) : null}
                <span
                  className={`mt-2 block text-xs ${isActive ? "text-navy-muted" : "text-muted"}`}
                >
                  {item.subtitle}
                </span>
                {isActive && playing ? (
                  <motion.span
                    key={`progress-${active}`}
                    className="absolute bottom-0 left-0 h-0.5 rounded-full bg-[#e3b65c]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                    aria-hidden="true"
                  />
                ) : null}
              </button>
              {index < STAGES.length - 1 ? (
                <>
                  <ArrowDown
                    className="mx-auto my-1 h-4 w-4 text-subtle lg:hidden"
                    aria-hidden="true"
                  />
                  {(index + 1) % 4 !== 0 ? (
                    <ArrowRight
                      className="absolute top-1/2 -right-6 hidden h-4 w-4 -translate-y-1/2 text-subtle lg:block"
                      aria-hidden="true"
                    />
                  ) : null}
                </>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div
        className="mt-6 rounded-xl border border-border bg-surface p-5"
        aria-live={playing ? "off" : "polite"}
      >
        <p className="text-sm font-semibold text-accent">
          Stage {active + 1}: {stage.title}
        </p>
        <p className="mt-2 text-sm leading-6 text-fg">{stage.detail}</p>
      </div>
    </div>
  );
}
