"use client";

import { FileText, Loader2, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { docs } from "@/content/docs";
import { mainNav } from "@/lib/nav";

interface PagefindResultData {
  url: string;
  excerpt: string;
  meta: { title?: string };
}

interface PagefindResult {
  id: string;
  data: () => Promise<PagefindResultData>;
}

interface Pagefind {
  init: () => Promise<void>;
  debouncedSearch: (query: string) => Promise<{ results: PagefindResult[] } | null>;
}

interface Hit {
  id: string;
  url: string;
  title: string;
  excerpt: string;
}

const MAX_RESULTS = 8;
let pagefindPromise: Promise<Pagefind | null> | null = null;

/**
 * Loads the Pagefind index that `npm run build` writes to out/pagefind/. It is
 * plain static files on the same origin, so search needs no server or third
 * party. In `next dev` the index does not exist and search reports that.
 */
function loadPagefind(): Promise<Pagefind | null> {
  if (!pagefindPromise) {
    const url = "/pagefind/pagefind.js";
    pagefindPromise = import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url)
      .then(async (module: Pagefind) => {
        await module.init();
        return module;
      })
      .catch(() => null);
  }
  return pagefindPromise;
}

/** Section names for routes, so results read "Architecture" rather than the page's headline. */
const ROUTE_LABELS = new Map<string, string>([
  ["/", "Home"],
  ...mainNav.map((item) => [item.href, item.label] as [string, string]),
  ...docs.map((doc) => [`/docs/${doc.slug}/`, `Docs: ${doc.title}`] as [string, string]),
]);

/** Turns Pagefind's /path/index.html URLs into the site's trailing-slash routes. */
function toRoute(url: string): string {
  return url.replace(/index\.html$/, "").replace(/\.html$/, "/");
}

export function SearchDialog() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "unavailable">("idle");

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    inputRef.current?.select();
    setStatus((current) => (current === "idle" ? "loading" : current));
    void loadPagefind().then((pagefind) => setStatus(pagefind ? "ready" : "unavailable"));
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  // ⌘K / Ctrl+K opens search from anywhere.
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    let cancelled = false;
    const term = query.trim();
    if (!term || status !== "ready") {
      // Clearing stale results when the query empties is the purpose of this effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHits([]);
      return;
    }
    void (async () => {
      const pagefind = await loadPagefind();
      const search = await pagefind?.debouncedSearch(term);
      if (!search || cancelled) return;
      const data = await Promise.all(
        search.results.slice(0, MAX_RESULTS).map(async (result) => {
          const item = await result.data();
          return {
            id: result.id,
            url: toRoute(item.url),
            title: ROUTE_LABELS.get(toRoute(item.url)) ?? item.meta.title ?? item.url,
            excerpt: item.excerpt,
          };
        }),
      );
      if (!cancelled) {
        setHits(data);
        setActive(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query, status]);

  const go = (hit: Hit | undefined) => {
    if (!hit) return;
    close();
    router.push(hit.url);
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, hits.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(hits[active]);
    }
  };

  const activeId = hits[active] ? `${listId}-${hits[active].id}` : undefined;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-keyshortcuts="Meta+K Control+K"
        className="inline-flex h-10 items-center gap-2 rounded-md px-2.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-fg sm:border sm:border-border sm:bg-surface"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Search</span>
        <kbd className="hidden rounded border border-border px-1.5 font-mono text-[0.6875rem] text-subtle lg:inline">
          ⌘K
        </kbd>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Search the site"
        onClose={() => triggerRef.current?.focus()}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
        className="mx-auto mt-[10vh] w-[min(40rem,calc(100vw-2rem))] max-w-none rounded-xl border border-border bg-surface p-0 text-fg shadow-raised backdrop:bg-navy/60"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-5 w-5 shrink-0 text-subtle" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search pages and documentation"
            aria-label="Search pages and documentation"
            role="combobox"
            aria-expanded={hits.length > 0}
            aria-controls={listId}
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            className="h-14 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-subtle"
          />
          <button
            type="button"
            onClick={close}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-fg"
            aria-label="Close search"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {status === "loading" ? (
            <p className="flex items-center gap-2 px-3 py-6 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Loading the search index…
            </p>
          ) : status === "unavailable" ? (
            <p className="px-3 py-6 text-sm text-muted">
              Search is available in the built site (run <code>npm run build</code>).
            </p>
          ) : query.trim() && hits.length === 0 ? (
            <p className="px-3 py-6 text-sm text-muted">No results for “{query.trim()}”.</p>
          ) : !query.trim() ? (
            <p className="px-3 py-6 text-sm text-muted">
              Type to search every page and document. Use ↑ ↓ to move and Enter to open.
            </p>
          ) : null}

          <ul id={listId} role="listbox" aria-label="Search results">
            {hits.map((hit, index) => (
              <li
                key={hit.id}
                id={`${listId}-${hit.id}`}
                role="option"
                aria-selected={index === active}
                onMouseEnter={() => setActive(index)}
                onClick={() => go(hit)}
                className={`flex cursor-pointer gap-3 rounded-lg px-3 py-3 ${
                  index === active ? "bg-accent-soft" : ""
                }`}
              >
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block font-semibold text-fg">{hit.title}</span>
                  <span
                    className="mt-0.5 block text-sm text-muted [&_mark]:bg-transparent [&_mark]:font-semibold [&_mark]:text-fg"
                    // Pagefind returns the excerpt as HTML with <mark> around matches, built from our own pages.
                    dangerouslySetInnerHTML={{ __html: hit.excerpt }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="border-t border-border px-4 py-2 text-xs text-subtle">
          Search runs in your browser from a static index; nothing is sent to a server.
        </p>
      </dialog>
    </>
  );
}
