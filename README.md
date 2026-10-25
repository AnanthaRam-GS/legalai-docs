# LegalAI documentation site

The project documentation website for **LegalAI: An Intelligent Criminal Legal Assistance and
Analytics System**, a 23CSE399 final-year project in the Department of Computer Science and
Engineering, School of Computing, Amrita Vishwa Vidyapeetham.

The site explains the problem, features, architecture, methodology, results and progress of
LegalAI, and hosts summary documentation. The application itself lives in
[AnanthaRam-GS/lexintelAI](https://github.com/AnanthaRam-GS/lexintelAI).

> LegalAI is a research prototype. It does not provide legal advice.

Live site: **https://legalai-docs.vercel.app/**

## Stack

- Next.js 16 (App Router) as a fully static export (`output: "export"`)
- TypeScript (strict), Tailwind CSS 4, MDX for documentation pages
- Framer Motion for subtle motion, Recharts for charts, Lucide icons
- Inter and Source Serif 4, self-hosted through `next/font`
- Light and dark themes via `next-themes` (system default, no flash on load)
- Pagefind full-text search over the static export (no server, works offline once loaded)

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
npm run build         # static export into out/, then the Pagefind index into out/pagefind/
npm run check:links   # every internal link and #fragment in out/ must resolve
npx serve out         # preview the exported site
```

Run all of them before committing code. Search only works on the built site (`npm run build`
then `npx serve out`); under `npm run dev` the dialog says the index is missing.

## Editing content

Almost everything you may want to change is in `content/`.

### `content/site.ts`

Typed configuration that the pages read from:

| Field                                                | What it controls                                                                                                  |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `site`                                               | Title, tagline, course and institution, `siteUrl`, `repoUrl`, the disclaimer                                      |
| `site.demoVideoUrl`                                  | YouTube or Google Drive link for the Demo page. Leave `""` to show "coming soon"                                  |
| `site.lastUpdated`                                   | ISO date shown in the footer and on doc pages                                                                     |
| `site.sourceCommit`                                  | The LegalAI commit the facts describe                                                                             |
| `guide`, `team`                                      | People cards. `linkedin`, `github` and `photo` are optional; empty values are hidden                              |
| `stats`                                              | Home page figures, each with sample size, date and source                                                         |
| `phases`, `reviewChecklist`, `milestones`, `roadmap` | Progress page, with statuses `completed`, `in-progress`, `planned`, `pending-approval`, `blocked` or `historical` |

**Photos:** put the image in `public/team/` (for example `public/team/gugan.jpg`) and set
`photo: "/team/gugan.jpg"`. Square images of at least 128 × 128 px work best.

**Screenshots:** images live in `public/screenshots/`; their alt text and captions are in
`content/screenshots.ts`, which the Features and Demo pages read. An entry without `src` shows a
placeholder. See [Capturing screenshots](#capturing-screenshots) to refresh them.

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

### Updating facts after LegalAI changes

1. In the LegalAI repository, list what changed since the commit in `site.sourceCommit`:
   `git log --oneline <old>..main` and `git diff --stat <old> main`.
2. Re-check each affected row of `content/SOURCES.md` against the new files; recount tests with the
   commands recorded there.
3. Update `content/site.ts` (stats, statuses, milestones, roadmap, `sourceCommit`, `lastUpdated`),
   the pages and docs that repeat the figure, and add an old-vs-new row to the fact-check log at
   the end of `SOURCES.md`.

### Accuracy rule

Every number on the site must trace to a file in the LegalAI repository. When you add or change
one, update **`content/SOURCES.md`** in the same commit. Label historical results as historical,
with their sample size and date, and show unfinished work as in progress, planned, blocked or
pending approval.

Never add secrets, `.env` values, credentials, user data, judgment text or internal documents
(such as the build-plan PDF) to this repository.

## Capturing screenshots

`scripts/capture-screenshots.ts` drives a locally running LegalAI and writes optimized WebP files
(1440 × 900, plus one 390 × 844 phone frame) to `public/screenshots/`.

1. Start the LegalAI backend and frontend with their documented commands. Serve the frontend on
   `127.0.0.1` so its session cookie is same-site with the API:
   `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000 npx next dev -H 127.0.0.1 -p 3000`.
2. Install the browser once: `npx playwright-core install chromium`.
3. Provide the accounts through environment variables (never commit or print them):

   | Variable                                       | Purpose                                                               |
   | ---------------------------------------------- | --------------------------------------------------------------------- |
   | `SHOT_LAWYER_EMAIL`, `SHOT_LAWYER_PASSWORD`    | A lawyer account (analytics, history)                                 |
   | `SHOT_ADMIN_EMAIL`, `SHOT_ADMIN_PASSWORD`      | An admin account (status, ingestion page)                             |
   | `SHOT_PUBLIC_QUESTION`                         | The question for the live public answer                               |
   | `SHOT_PROFESSIONAL_QUESTION`, `SHOT_BRIEF_PDF` | Only with `--professional`                                            |
   | `SHOT_FRONTEND_URL`                            | Defaults to `http://127.0.0.1:3000`                                   |
   | `SHOT_RAW_DIR`                                 | Optional folder outside the repo for full-page copies of live answers |

4. Run it:

   ```bash
   node --experimental-strip-types scripts/capture-screenshots.ts --no-live        # no LLM calls
   node --experimental-strip-types scripts/capture-screenshots.ts --only=public-answer,public-answer-sources,public-answer-mobile
   node --experimental-strip-types scripts/capture-screenshots.ts --professional --only=professional-answer,professional-brief
   ```

   Each live answer costs one LLM call and `--max-live-calls` (default 1) caps them. The script
   never uploads to the corpus, hides the Next.js dev badge, blurs case titles in the sources
   frame, and leaves stored briefs collapsed. Never point it at a fake or mock LLM mode.

5. Look at every image before committing: only seed or test accounts, no personal data, no
   stack traces, no secrets, no local URLs. Then update the captions in `content/screenshots.ts`.

## Search

`npm run build` runs `pagefind --site out` afterwards (the `postbuild` script). Only each page's
`<main>` is indexed and the 404 page is excluded. The search dialog (navbar button or ⌘K / Ctrl+K)
loads `/pagefind/pagefind.js` on first use. To keep an element out of the index, add
`data-pagefind-ignore`.

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

`vercel.json` adds the security headers (a Content-Security-Policy that allows only this origin
plus YouTube and Google Drive frames, `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy`, COOP and HSTS) and cache rules (a year for hashed assets,
a day for screenshots). If you embed another service, add its origin to `frame-src`.

After a deployment, check the live site:

```bash
curl -sI https://legalai-docs.vercel.app/ | grep -iE "content-security|x-frame|referrer"
curl -s https://legalai-docs.vercel.app/sitemap.xml | head
```

The share card is `components/seo/ShareCard.tsx`, rendered to `/og.png` at build time by `app/og.png/route.tsx`; `sitemap.xml` and
`robots.txt` come from `app/sitemap.ts` and `app/robots.ts`.

## Project structure

```
app/                 Routes (one folder per page), layout, global styles, 404
components/
  charts/            Recharts charts and their theme colours
  diagrams/          Architecture, pipeline, ingestion and data-model diagrams
  docs/              Docs sidebar, table of contents, previous/next links
  layout/            Navbar, footer, container
  motion/            Scroll reveal and count-up
  search/            Search dialog
  seo/               JSON-LD structured data
  ui/                Cards, badges, callouts, tables, code blocks, video, screenshots
content/
  site.ts            Editable facts
  screenshots.ts     Screenshot alt text and captions
  docs/              MDX documentation and its index
  SOURCES.md         Claim → source mapping
lib/                 Navigation, fonts, formatting, hooks
public/screenshots/  Product screenshots (WebP)
scripts/             Link checker, screenshot capture
vercel.json          Security headers and caching
```
