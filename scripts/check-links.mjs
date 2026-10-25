// Checks every internal link and asset reference in the static export (out/).
// Run after `npm run build`. Exits 1 if any link points to a missing page,
// file or #fragment.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");

if (!existsSync(OUT)) {
  console.error("out/ not found. Run `npm run build` first.");
  process.exit(1);
}

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return htmlFiles(full);
    return name.endsWith(".html") ? [full] : [];
  });
}

/** Maps a URL path to the file the static host would serve, or null. */
function resolveTarget(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const candidates = clean.endsWith("/")
    ? [path.join(OUT, clean, "index.html")]
    : [path.join(OUT, clean), path.join(OUT, `${clean}.html`), path.join(OUT, clean, "index.html")];
  return candidates.find((file) => existsSync(file) && statSync(file).isFile()) ?? null;
}

const idCache = new Map();
function idsIn(file) {
  if (!idCache.has(file)) {
    const html = readFileSync(file, "utf8");
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file);
}

const pages = htmlFiles(OUT);
const broken = [];
let checked = 0;

for (const page of pages) {
  const html = readFileSync(page, "utf8");
  const pageUrl =
    "/" +
    path
      .relative(OUT, page)
      .replace(/index\.html$/, "")
      .replace(/\\/g, "/");
  const refs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]);

  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(ref)) continue;
    checked += 1;
    const [rawPath, fragment] = ref.split("#");
    const target = rawPath ? new URL(rawPath, `http://site${pageUrl}`).pathname : pageUrl;
    const file = resolveTarget(target);
    if (!file) {
      broken.push(`${pageUrl} → ${ref} (no such page or file)`);
      continue;
    }
    if (fragment && file.endsWith(".html") && !idsIn(file).has(fragment)) {
      broken.push(`${pageUrl} → ${ref} (no element with id "${fragment}")`);
    }
  }
}

if (broken.length > 0) {
  console.error(`Broken links (${broken.length}):`);
  for (const line of [...new Set(broken)]) console.error(`  ${line}`);
  process.exit(1);
}

console.log(`Checked ${checked} internal links across ${pages.length} pages: none broken.`);
