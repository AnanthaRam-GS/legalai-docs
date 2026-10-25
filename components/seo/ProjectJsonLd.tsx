import { guide, site, team } from "@/content/site";

/** schema.org description of the project for search engines (rendered as JSON-LD). */
export function ProjectJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: site.name,
    alternateName: site.title,
    description: site.description,
    url: site.siteUrl,
    codeRepository: site.repoUrl,
    programmingLanguage: ["Python", "TypeScript"],
    runtimePlatform: ["FastAPI", "Next.js"],
    keywords: [
      "retrieval-augmented generation",
      "Indian criminal law",
      "IPC",
      "BNS",
      "legal analytics",
      "hybrid retrieval",
    ],
    inLanguage: "en",
    dateModified: site.lastUpdated,
    author: team.map((person) => ({ "@type": "Person", name: person.name })),
    contributor: { "@type": "Person", name: guide.name, jobTitle: guide.title },
    sourceOrganization: {
      "@type": "CollegeOrUniversity",
      name: site.institution,
      department: { "@type": "Organization", name: site.department },
    },
  };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output from our own config; "<" is escaped so it cannot close the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
