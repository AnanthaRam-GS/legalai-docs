import { renderShareCard } from "@/components/seo/ShareCard";

// Written to out/og.png at build time. A real .png file is served as image/png with no
// trailing-slash redirect, which share-card crawlers need.
export const dynamic = "force-static";

export function GET() {
  return renderShareCard();
}
