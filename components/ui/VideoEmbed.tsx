import { Clapperboard } from "lucide-react";

/**
 * Converts a YouTube or Google Drive share link into an embeddable URL.
 * Returns null for anything else, so the page falls back to "coming soon".
 */
export function toEmbedUrl(url: string): string | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1);
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "youtube.com" || host === "m.youtube.com") {
    const id =
      parsed.searchParams.get("v") ??
      parsed.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] ??
      null;
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "drive.google.com") {
    const id =
      parsed.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ?? parsed.searchParams.get("id") ?? null;
    return id ? `https://drive.google.com/file/d/${id}/preview` : null;
  }
  return null;
}

export function VideoEmbed({ url, title }: { url: string; title: string }) {
  const embed = toEmbedUrl(url);

  if (!embed) {
    return (
      <div className="relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-navy p-6 text-center text-navy-fg">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(#e6ebf3 1px, transparent 1px), linear-gradient(90deg, #e6ebf3 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-[#e3b65c]">
          <Clapperboard className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="relative mt-4 font-serif text-2xl font-bold text-white">
          Demo video coming soon
        </p>
        <p className="relative mt-2 max-w-md text-sm text-navy-muted">
          A walkthrough of Public Mode, Professional Mode, analytics and admin ingestion will be
          published here.
        </p>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-navy">
      <iframe
        src={embed}
        title={title}
        className="h-full w-full"
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
