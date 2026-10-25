import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { GitHubIcon } from "@/components/icons";
import { guide, site } from "@/content/site";
import { formatDate } from "@/lib/format";
import { mainNav } from "@/lib/nav";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-serif text-xl font-bold">{site.name}</p>
            <p className="mt-2 text-sm text-muted">
              {site.course}
              <br />
              {site.department}, {site.school}
              <br />
              {site.institution}
            </p>
            <a
              href={site.repoUrl}
              className="mt-4 inline-flex items-center gap-2 rounded-md text-sm font-medium text-fg underline-offset-4 hover:underline"
            >
              <GitHubIcon className="h-4 w-4" />
              Source code on GitHub
              <ExternalLink className="h-3.5 w-3.5 text-subtle" aria-hidden="true" />
            </a>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <p className="text-sm font-semibold">Pages</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted hover:text-fg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="text-sm font-semibold">Acknowledgements</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                Guided by {guide.name}, {guide.title}.
              </li>
              <li>Judgment data sourced from the Indian Kanoon API.</li>
              <li>
                Crime statistics from <cite>Crime in India 2024</cite>, National Crime Records
                Bureau, Ministry of Home Affairs, Government of India.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-lg border border-border bg-surface-2 p-4 text-sm text-muted">
          <strong className="text-fg">Disclaimer.</strong> {site.disclaimer}
        </div>

        <div className="mt-6 flex flex-col gap-2 text-xs text-subtle sm:flex-row sm:justify-between">
          <p>
            Last updated <time dateTime={site.lastUpdated}>{formatDate(site.lastUpdated)}</time>
          </p>
          <p>
            Facts reflect LegalAI <code className="font-mono">main</code> at commit{" "}
            <code className="font-mono">{site.sourceCommit}</code>.
          </p>
        </div>
      </Container>
    </footer>
  );
}
