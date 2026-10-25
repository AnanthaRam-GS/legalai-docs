/**
 * Captures product screenshots of a locally running LegalAI frontend and
 * backend into public/screenshots/ as optimized WebP.
 *
 * Run with Node 22.6+ (type stripping):
 *   node --experimental-strip-types scripts/capture-screenshots.ts [options]
 *
 * Environment (credentials are read at runtime and never printed):
 *   SHOT_LAWYER_EMAIL, SHOT_LAWYER_PASSWORD   a lawyer account
 *   SHOT_ADMIN_EMAIL,  SHOT_ADMIN_PASSWORD    an admin account
 *   SHOT_FRONTEND_URL  default http://127.0.0.1:3000
 *   SHOT_PUBLIC_QUESTION  the question used for the live public answer
 *   SHOT_PROFESSIONAL_QUESTION, SHOT_BRIEF_PDF   used only with --professional
 *   SHOT_RAW_DIR       optional folder (outside the repo) for full-page PNGs of live answers,
 *                      for review and cropping without another LLM call
 *
 * Options:
 *   --only=a,b          capture only the named shots
 *   --no-live           skip shots that make a live LLM call
 *   --max-live-calls=N  hard cap on live LLM calls (default 1)
 *   --professional      also capture the professional answer (SHOT_PROFESSIONAL_QUESTION) and,
 *                       if SHOT_BRIEF_PDF is set, a PDF brief. Each is one live LLM call; off by
 *                       default until professional runs fit the provider's limits.
 *
 * Never point this at a fake or mock LLM mode: site screenshots must show real output.
 * The script makes no uploads and changes no data apart from the LLM call itself.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium, type Browser, type Page } from "playwright-core";
import sharp from "sharp";

const OUT_DIR = path.resolve("public/screenshots");
const FRONTEND = (process.env.SHOT_FRONTEND_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const option = (name: string) =>
  args.find((arg) => arg.startsWith(`--${name}=`))?.split("=")[1] ?? undefined;

const only = option("only")?.split(",") ?? null;
const allowLive = !flag("no-live");
const maxLiveCalls = Number(option("max-live-calls") ?? 1);
const includeProfessional = flag("professional");
let liveCalls = 0;
const rawDir = process.env.SHOT_RAW_DIR;

// Hides the Next.js dev-tools badge, which is not part of the product.
const HIDE_DEV_CHROME = "nextjs-portal { display: none !important; }";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}.`);
  return value;
}

function wanted(name: string): boolean {
  return only === null || only.includes(name);
}

/** Converts a PNG buffer to WebP and writes it. */
async function save(name: string, png: Buffer): Promise<void> {
  const file = path.join(OUT_DIR, `${name}.webp`);
  const webp = await sharp(png).webp({ quality: 82, effort: 6 }).toBuffer();
  writeFileSync(file, webp);
  console.log(`saved ${path.relative(process.cwd(), file)} (${Math.round(webp.length / 1024)} KB)`);
}

/** Saves a full-page PNG of a live answer outside the repository, for review. */
async function saveRaw(page: Page, name: string): Promise<void> {
  if (!rawDir) return;
  mkdirSync(rawDir, { recursive: true });
  await page.screenshot({ path: path.join(rawDir, `${name}-full.png`), fullPage: true });
}

/** Spends one live LLM call: runs `submit` and waits for the matching API response. */
async function liveQuery(page: Page, urlPart: string, submit: () => Promise<void>): Promise<void> {
  if (liveCalls >= maxLiveCalls) throw new Error("Live LLM call limit reached.");
  liveCalls += 1;
  const response = page.waitForResponse(
    (r) => r.url().includes(urlPart) && r.request().method() === "POST",
    { timeout: 180000 },
  );
  await submit();
  const result = await response;
  console.log(`live call ${liveCalls}: ${urlPart} HTTP ${result.status()}`);
  if (!result.ok()) throw new Error("The live answer failed; nothing was saved for it.");
}

async function settle(page: Page, extraMs = 800): Promise<void> {
  await page.waitForLoadState("networkidle");
  await page.addStyleTag({ content: HIDE_DEV_CHROME });
  await page.waitForTimeout(extraMs);
}

async function shoot(page: Page, name: string): Promise<void> {
  await page.addStyleTag({ content: HIDE_DEV_CHROME });
  await save(name, await page.screenshot({ type: "png" }));
}

/** Signs in without ever letting the password reach logs or error messages. */
async function signIn(browser: Browser, emailVar: string, passwordVar: string): Promise<Page> {
  const email = requireEnv(emailVar);
  const password = requireEnv(passwordVar);
  const page = await browser.newPage({ viewport: DESKTOP });
  try {
    await page.goto(`${FRONTEND}/login`);
    await page.locator("input[type=email]").fill(email);
    await page.locator("input[type=password]").fill(password);
    await page.locator("button[type=submit]").click();
    await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 15000 });
  } catch {
    // Playwright call logs can echo typed values, so the original error is dropped.
    throw new Error(`Sign-in failed for the account in ${emailVar}.`);
  }
  return page;
}

async function capturePublic(browser: Browser): Promise<void> {
  const page = await browser.newPage({ viewport: DESKTOP });
  if (wanted("public-home")) {
    await page.goto(`${FRONTEND}/public`);
    await settle(page);
    await shoot(page, "public-home");
  }

  const answerShots = ["public-answer", "public-answer-sources", "public-answer-mobile"];
  if (answerShots.some(wanted) && allowLive) {
    const question = requireEnv("SHOT_PUBLIC_QUESTION");
    await page.goto(`${FRONTEND}/public/ask`);
    await settle(page);
    await page.locator("textarea").fill(question);
    await liveQuery(page, "/query/public", () =>
      page.getByRole("button", { name: "Send" }).click(),
    );
    await settle(page, 1500);

    // The conversation scrolls inside its own panel on desktop, so a tall viewport is used
    // for the review copy and the frames below scroll that panel to the right place.
    await page.setViewportSize({ width: DESKTOP.width, height: 3200 });
    await page.waitForTimeout(500);
    await saveRaw(page, "public-answer");
    await page.setViewportSize(DESKTOP);
    await page.waitForTimeout(500);

    const card = page.locator('[aria-label="Plain-language legal information"]').last();
    const sources = page.getByRole("heading", { name: "Sources", exact: true }).last();
    const sourceCount = await card.locator("section:has(h3:text-is('Sources')) li").count();
    console.log(`answer shows ${sourceCount} validated source(s)`);

    if (wanted("public-answer")) {
      await card.evaluate((node) => node.scrollIntoView({ block: "start" }));
      await page.waitForTimeout(400);
      await shoot(page, "public-answer");
    }
    if (wanted("public-answer-sources") && sourceCount > 0) {
      // Case titles name the parties, so they are blurred before capture.
      await page.addStyleTag({
        content: `[aria-label="Plain-language legal information"] section:has(> h3) li > span { filter: blur(6px); }`,
      });
      await sources.evaluate((node) => node.scrollIntoView({ block: "center" }));
      await page.waitForTimeout(400);
      await shoot(page, "public-answer-sources");
    }
    if (wanted("public-answer-mobile")) {
      await page.setViewportSize(MOBILE);
      await page.waitForTimeout(600);
      await card.evaluate((node) => node.scrollIntoView({ block: "start" }));
      await page.waitForTimeout(400);
      await shoot(page, "public-answer-mobile");
      await page.setViewportSize(DESKTOP);
    }
  }

  if (wanted("login")) {
    await page.goto(`${FRONTEND}/login`);
    await settle(page);
    await shoot(page, "login");
  }
  await page.close();
}

const ANALYTICS_TABS: [string, string][] = [
  ["Offense Trends", "analytics-offense-trends"],
  ["Outcome Distribution", "analytics-outcomes"],
  ["Section Co-occurrence", "analytics-cooccurrence"],
  ["IPC-BNS Map", "analytics-ipc-bns"],
  ["NCRB Statistics", "analytics-ncrb"],
];

async function captureProfessional(browser: Browser): Promise<void> {
  const page = await signIn(browser, "SHOT_LAWYER_EMAIL", "SHOT_LAWYER_PASSWORD");

  if (wanted("professional-home")) {
    await page.goto(`${FRONTEND}/professional`);
    await settle(page);
    await shoot(page, "professional-home");
  }

  if (ANALYTICS_TABS.some(([, name]) => wanted(name))) {
    await page.goto(`${FRONTEND}/professional/analytics`);
    await settle(page, 1500);
    for (const [label, name] of ANALYTICS_TABS) {
      if (!wanted(name)) continue;
      await page.getByRole("button", { name: label, exact: true }).click();
      await settle(page, 1500);
      await shoot(page, name);
    }
  }

  if (wanted("history")) {
    // Stored briefs stay collapsed so no answer or judgment text is captured.
    await page.goto(`${FRONTEND}/professional/history`);
    await settle(page);
    await shoot(page, "history");
  }

  if (includeProfessional && allowLive && wanted("professional-answer")) {
    await page.goto(`${FRONTEND}/professional/query`);
    await settle(page);
    await page.locator("textarea").fill(requireEnv("SHOT_PROFESSIONAL_QUESTION"));
    await liveQuery(page, "/query/professional", () =>
      page.getByRole("button", { name: "Execute Legal Research" }).click(),
    );
    await settle(page, 1500);
    await saveRaw(page, "professional-answer");
    await shoot(page, "professional-answer");
  }

  if (
    includeProfessional &&
    allowLive &&
    wanted("professional-brief") &&
    process.env.SHOT_BRIEF_PDF
  ) {
    // A private query upload: analysed for one request, never added to the corpus.
    await page.goto(`${FRONTEND}/professional/upload`);
    await settle(page);
    await page.locator("input[type=file]").setInputFiles(process.env.SHOT_BRIEF_PDF);
    const query = page.locator("main textarea");
    if (await query.count()) await query.first().fill(requireEnv("SHOT_PROFESSIONAL_QUESTION"));
    await liveQuery(page, "/query/professional/pdf", () =>
      page.locator("main button[type=submit]").first().click(),
    );
    await settle(page, 1500);
    await saveRaw(page, "professional-brief");
    await shoot(page, "professional-brief");
  }

  await page.close();
}

async function captureAdmin(browser: Browser): Promise<void> {
  const page = await signIn(browser, "SHOT_ADMIN_EMAIL", "SHOT_ADMIN_PASSWORD");
  if (wanted("admin-status")) {
    await page.goto(`${FRONTEND}/admin`);
    await settle(page, 1500);
    await shoot(page, "admin-status");
  }
  if (wanted("admin-ingest")) {
    // Idle state only: nothing is uploaded.
    await page.goto(`${FRONTEND}/admin/ingest`);
    await settle(page);
    await shoot(page, "admin-ingest");
  }
  await page.close();
}

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  try {
    await capturePublic(browser);
    await captureProfessional(browser);
    await captureAdmin(browser);
  } finally {
    await browser.close();
  }
  console.log(`done; live LLM calls made: ${liveCalls}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Screenshot capture failed.");
  process.exit(1);
});
