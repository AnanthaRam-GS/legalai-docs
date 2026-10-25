/* eslint-disable @next/next/no-img-element -- static export serves images as plain files */
import { ImageIcon } from "lucide-react";

interface ScreenshotProps {
  /** Path under /public, e.g. "/screenshots/public-answer.webp". Empty shows a placeholder. */
  src?: string;
  alt: string;
  caption: string;
  /** Intrinsic size, so the page does not shift while the image loads. */
  width?: number;
  height?: number;
  /** "contain" letterboxes tall images (phone frames) inside the 16:10 frame. */
  fit?: "cover" | "contain";
  /** Placeholder text when there is no image yet. */
  placeholder?: string;
}

/** A product screenshot that opens full size, or a labelled placeholder until one exists. */
export function Screenshot({
  src,
  alt,
  caption,
  width = 1440,
  height = 900,
  fit = "cover",
  placeholder = "Screenshot coming soon",
}: ScreenshotProps) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      {src ? (
        <a
          href={src}
          className="block bg-surface-2"
          title="Open the full-size screenshot"
          aria-label={`${alt} (opens the full-size image)`}
        >
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            className={`block aspect-[16/10] h-auto w-full ${
              fit === "contain" ? "object-contain" : "object-cover object-top"
            }`}
          />
        </a>
      ) : (
        <div className="flex aspect-[16/10] flex-col items-center justify-center gap-2 bg-surface-2 p-6 text-center">
          <ImageIcon className="h-8 w-8 text-subtle" aria-hidden="true" />
          <p className="text-sm font-medium text-muted">{placeholder}</p>
          <p className="max-w-xs text-xs text-subtle">{alt}</p>
        </div>
      )}
      <figcaption className="border-t border-border px-4 py-3 text-sm text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
