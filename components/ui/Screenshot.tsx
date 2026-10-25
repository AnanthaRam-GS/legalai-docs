/* eslint-disable @next/next/no-img-element -- static export serves images as plain files */
import { ImageIcon } from "lucide-react";

interface ScreenshotProps {
  /** Path under /public, e.g. "/screenshots/public-ask.png". Empty shows a placeholder. */
  src?: string;
  alt: string;
  caption: string;
}

/** A product screenshot, or a labelled placeholder until the real image is added. */
export function Screenshot({ src, alt, caption }: ScreenshotProps) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      {src ? (
        <img src={src} alt={alt} className="block h-auto w-full" loading="lazy" />
      ) : (
        <div className="flex aspect-[16/10] flex-col items-center justify-center gap-2 bg-surface-2 p-6 text-center">
          <ImageIcon className="h-8 w-8 text-subtle" aria-hidden="true" />
          <p className="text-sm font-medium text-muted">Screenshot coming soon</p>
          <p className="max-w-xs text-xs text-subtle">{alt}</p>
        </div>
      )}
      <figcaption className="border-t border-border px-4 py-3 text-sm text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
