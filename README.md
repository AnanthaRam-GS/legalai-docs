# LegalAI documentation site

The project documentation website for **LegalAI: An Intelligent Criminal Legal Assistance and
Analytics System**, a 23CSE399 final-year project in the Department of Computer Science and
Engineering, School of Computing, Amrita Vishwa Vidyapeetham.

The site explains the problem, features, architecture, methodology, results and progress of
LegalAI, and hosts summary documentation. The application itself lives in
[AnanthaRam-GS/lexintelAI](https://github.com/AnanthaRam-GS/lexintelAI).

> LegalAI is a research prototype. It does not provide legal advice.

## Stack

- Next.js 16 (App Router) as a fully static export (`output: "export"`)
- TypeScript (strict), Tailwind CSS 4, MDX for documentation pages
- Framer Motion for subtle motion, Recharts for charts, Lucide icons
- Inter and Source Serif 4, self-hosted through `next/font`
- Light and dark themes via `next-themes` (system default, no flash on load)

## Local development

Requires Node.js 20.9 or later.

```bash
npm ci          # install the exact versions in package-lock.json
npm run dev     # http://localhost:3000
```

## Checks and build

```bash
npm run lint          # ESLint, zero warnings allowed
npm run typecheck     # tsc --noEmit
npm run format:check  # Prettier
npm run build         # static export into out/
npm run check:links   # every internal link and #fragment in out/ must resolve
npx serve out         # preview the exported site
```

Run all of them before committing code.

## Editing content

Almost everything you may want to change is in `content/`.

### `content/site.ts`

Typed configuration that the pages read from:

| Field                                                | What it controls                                                                                                  |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `site`                                               | Title, tagline, course and institution, `repoUrl`, the disclaimer                                                 |
| `site.demoVideoUrl`                                  | YouTube or Google Drive link for the Demo page. Leave `""` to show "coming soon"                                  |
| `site.lastUpdated`                                   | ISO date shown in the footer and on doc pages                                                                     |
| `site.sourceCommit`                                  | The LegalAI commit the facts describe                                                                             |
| `guide`, `team`                                      | People cards. `linkedin`, `github` and `photo` are optional; empty values are hidden                              |
| `stats`                                              | Home page figures, each with sample size, date and source                                                         |
| `phases`, `reviewChecklist`, `milestones`, `roadmap` | Progress page, with statuses `completed`, `in-progress`, `planned`, `pending-approval`, `blocked` or `historical` |

**Photos:** put the image in `public/team/` (for example `public/team/gugan.jpg`) and set
`photo: "/team/gugan.jpg"`. Square images of at least 128 × 128 px work best.

**Screenshots:** put images in `public/screenshots/` and pass `src` to the `Screenshot`
components in `app/features/page.tsx` and `app/demo/page.tsx`.

### Documentation pages (`content/docs/*.mdx`)

1. Create `content/docs/<slug>.mdx`. Start with body text; the page title and description come
   from the index.
2. Add `{ slug, title, description }` to `content/docs/index.ts` in reading order. This drives the
   sidebar, static generation and previous/next links.
3. Use `##` and `###` headings; they get anchor ids and appear in the "On this page" list.

MDX pages can use `<Callout kind="info|warning|disclaimer" title="…">` and
`<StatusBadge status="…" />` without importing them. Leave a blank line after an opening JSX tag
and before its closing tag when the content is Markdown (lists, links), or Prettier will merge it
into one paragraph.

### Accuracy rule

Every number on the site must trace to a file in the LegalAI repository. When you add or change
one, update **`content/SOURCES.md`** in the same commit. Label historical results as historical,
with their sample size and date, and show unfinished work as in progress, planned, blocked or
pending approval.

Never add secrets, `.env` values, credentials, user data, judgment text or internal documents
(such as the build-plan PDF) to this repository.

## Deploying to Vercel

The site is plain static files, so any static host works. On Vercel:

1. Sign in to [vercel.com](https://vercel.com) and choose **Add New… → Project**.
2. Import the `AnanthaRam-GS/legalai-docs` GitHub repository.
3. Keep the detected settings: framework preset **Next.js**, build command `npm run build`,
   install command `npm ci`. Vercel serves the static export automatically. No environment
   variables are needed.
4. Click **Deploy**. Every push to `main` then redeploys, and pull requests get preview URLs.
5. Optional: add a custom domain under **Project → Settings → Domains**.

`out/404.html` is used for unknown paths.

## Project structure

```
app/                 Routes (one folder per page), layout, global styles, 404
components/
  charts/            Recharts charts and their theme colours
  diagrams/          Architecture, pipeline, ingestion and data-model diagrams
  docs/              Docs sidebar, table of contents, previous/next links
  layout/            Navbar, footer, container
  motion/            Scroll reveal and count-up
  ui/                Cards, badges, callouts, tables, code blocks, video, screenshots
content/
  site.ts            Editable facts
  docs/              MDX documentation and its index
  SOURCES.md         Claim → source mapping
lib/                 Navigation, fonts, formatting, hooks
scripts/             Link checker
```
