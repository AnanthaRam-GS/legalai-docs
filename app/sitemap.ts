import type { MetadataRoute } from "next";
import { docs } from "@/content/docs";
import { site } from "@/content/site";
import { mainNav } from "@/lib/nav";

export const dynamic = "force-static";

/** Every page in the static export, written to /sitemap.xml at build time. */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    ...mainNav.map((item) => item.href),
    ...docs.map((doc) => `/docs/${doc.slug}/`),
  ];
  return routes.map((route) => ({
    url: new URL(route, site.siteUrl).toString(),
    lastModified: site.lastUpdated,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : route.startsWith("/docs/") ? 0.6 : 0.8,
  }));
}
