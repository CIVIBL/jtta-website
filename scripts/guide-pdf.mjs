// Regenerate docs/editing-workshops.pdf from docs/editing-workshops.md. Run: node scripts/guide-pdf.mjs
// Prints with headless Chrome or Edge (set CHROME_PATH to override). Needs internet for the Google Fonts.
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { marked } from "marked";

const src = "docs/editing-workshops.md";
const out = resolve("docs/editing-workshops.pdf");

const browsers = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const browser = browsers.find((p) => existsSync(p));
if (!browser) throw new Error("No Chrome or Edge found. Set CHROME_PATH.");

const md = readFileSync(src, "utf8");
const title = md.match(/^# (.+)$/m)?.[1] ?? "Editing workshops";

const html = `<!doctype html>
<html lang="en-CA">
<head>
<meta charset="utf-8">
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@0,400;0,600;0,700;1,400&family=Fraunces:opsz,wght@9..144,600&display=block" rel="stylesheet">
<style>
  @page {
    size: Letter;
    margin: 20mm 24mm 22mm;
    @bottom-center { content: counter(page) " of " counter(pages); font: 9pt "Albert Sans", sans-serif; color: #777; }
  }
  html { font: 11.5pt/1.5 "Albert Sans", Arial, sans-serif; color: #1f1b16; }
  body { margin: 0; }
  h1, h2 { font-family: "Fraunces", Georgia, serif; font-weight: 600; line-height: 1.2; break-after: avoid; }
  h1 { font-size: 22pt; margin: 0 0 14pt; }
  h2 { font-size: 15pt; margin: 16pt 0 5pt; padding-top: 7pt; border-top: 0.75pt solid #d9d2c5; }
  p { margin: 0 0 8pt; }
  ol, ul { margin: 0 0 10pt; padding-left: 20pt; }
  ol > li { margin-bottom: 6pt; padding-left: 3pt; }
  ol > li::marker { font-weight: 700; color: #b8412c; }
  ul > li { margin-bottom: 3pt; }
  li > ul { margin-top: 6pt; }
  li, p { orphans: 3; widows: 3; }
  strong { font-weight: 700; }
</style>
</head>
<body>
${marked.parse(md)}
</body>
</html>`;

const dir = mkdtempSync(join(tmpdir(), "guide-pdf-"));
try {
  const page = join(dir, "guide.html");
  writeFileSync(page, html);
  execFileSync(browser, [
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--virtual-time-budget=15000",
    `--user-data-dir=${join(dir, "profile")}`,
    `--print-to-pdf=${out}`,
    pathToFileURL(page).href,
  ], { stdio: "ignore" });
} finally {
  rmSync(dir, { recursive: true, force: true });
}
console.log(`Wrote ${out}`);
