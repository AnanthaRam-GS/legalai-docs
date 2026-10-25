/* eslint-disable @next/next/no-img-element -- static export serves photos as plain files */
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import type { Person } from "@/content/site";

function initials(name: string) {
  const words = name.replace(/^Dr\.?\s+/, "").split(/\s+/);
  // Prefer full name words over trailing initials ("Anantha Ram G S" -> "AR"),
  // falling back to an initial when there is only one ("Ravindran G" -> "RG").
  const full = words.filter((word) => word.length > 1);
  const picked =
    full.length >= 2
      ? full.slice(0, 2)
      : [...full, ...words.filter((w) => w.length === 1)].slice(0, 2);
  return picked
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function TeamCard({ person, featured = false }: { person: Person; featured?: boolean }) {
  const links = [
    person.linkedin ? { href: person.linkedin, label: "LinkedIn", Icon: LinkedInIcon } : null,
    person.github ? { href: person.github, label: "GitHub", Icon: GitHubIcon } : null,
  ].filter((link) => link !== null);

  return (
    <article
      className={`flex h-full flex-col rounded-xl border bg-surface p-6 shadow-card ${
        featured ? "border-accent/50" : "border-border"
      }`}
    >
      <div className="flex items-center gap-4">
        {person.photo ? (
          <img
            src={person.photo}
            alt={`Photo of ${person.name}`}
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy font-serif text-xl font-bold text-navy-fg"
            aria-hidden="true"
          >
            {initials(person.name)}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-fg">{person.name}</h3>
          <p className="text-sm font-medium text-accent">{person.role}</p>
          {person.title ? <p className="text-sm text-muted">{person.title}</p> : null}
          {person.registrationNumber ? (
            <p className="font-mono text-xs text-subtle">{person.registrationNumber}</p>
          ) : null}
        </div>
      </div>

      <ul className="mt-5 flex-1 space-y-2 text-sm text-muted">
        {person.responsibilities.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {links.length > 0 ? (
        <div className="mt-5 flex gap-2">
          {links.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted hover:text-fg"
              aria-label={`${person.name} on ${label}`}
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
