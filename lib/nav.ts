export interface NavItem {
  href: string;
  label: string;
}

export const mainNav: NavItem[] = [
  { href: "/overview/", label: "Overview" },
  { href: "/features/", label: "Features" },
  { href: "/architecture/", label: "Architecture" },
  { href: "/methodology/", label: "Methodology" },
  { href: "/tech-stack/", label: "Tech stack" },
  { href: "/results/", label: "Results" },
  { href: "/progress/", label: "Progress" },
  { href: "/team/", label: "Team" },
  { href: "/demo/", label: "Demo" },
  { href: "/docs/", label: "Docs" },
];

/** True when `pathname` is `href` or inside it (so /docs/api/ marks Docs active). */
export function isActive(pathname: string, href: string): boolean {
  const normalise = (p: string) => (p.endsWith("/") ? p : `${p}/`);
  return normalise(pathname).startsWith(normalise(href));
}
