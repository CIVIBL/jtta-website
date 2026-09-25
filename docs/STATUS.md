# JTtA Website - Project Status

Updated 2026-09-24.

## Context

Client: Journey Through the Arts (JTtA), a one-person arts studio in an 1840s log cabin at 190 Hope St N, Port Hope, Ontario. Owner: Christine Benson (non-technical). Founded 2002.

Site type: brochure site. No e-commerce, accounts or payments. Registration and booking are by email (jttacabin@gmail.com). Prices are never shown; pricing is handled by email.

Why: the previous webmaster retired. Brent (CIVIBL) took over hosting and rebuilt the site.

## Stack and infrastructure

- Astro 7, static output, TypeScript strict, npm. Dev on Windows with Git Bash.
- Repo: github.com/CIVIBL/jtta-website (public), branch main.
- Hosting: Cloudflare Workers Static Assets via Workers Builds. Every push to main deploys.
- Preview URL: https://jtta-website.brent-1de.workers.dev/
- Production domain: https://www.journeythroughthearts.com (not yet pointed at the Worker; currently on the old DigitalOcean host with an expired certificate).
- Daily rebuild: .github/workflows/scheduled-rebuild.yml fires a Cloudflare Deploy Hook at 09:15 UTC so past workshops drop off without a push. Secret CF_DEPLOY_HOOK_URL is set. Tested.
- Build check: .github/workflows/build-check.yml runs build and astro check on every push and PR. A failing run emails the repo owner. This is the safety net for CMS commits.
- Local: npm run dev, npm run build, npx astro check. All clean (0 errors, 0 warnings, 0 hints).

## Content editing (Pages CMS)

- Connected at app.pagescms.org, scoped to this repo only.
- Config: .pages.yml, mirrors src/content.config.ts. Every field has help text.
- Collection: Workshops (src/content/workshops/*.md). Media uploads go to public/images/workshops.
- End-to-end tested: add, deploy, verify, delete. Works.
- Christine signs in with "Continue with email" as an invited collaborator. Invite pending (Brent).
- Guide for Christine: docs/editing-workshops.md and docs/editing-workshops.pdf. Regenerate the PDF with node scripts/guide-pdf.mjs after editing the .md.
- Still hardcoded (CMS-bound later): announce bar, summer weeks, instructors, party themes, grade workshops, about copy.

## Pages (8, all live on the preview URL)

/ , /for-kids, /for-adults, /summer-program, /birthday-parties, /in-the-schools, /about, /404.

Nav: For Kids / For Adults / Summer Camp / About plus "Contact Christine". Birthday Parties and In-the-Schools are reached from homepage cards and the footer, by design.

## Content model

Fields: title, audience, category, accent, date, sessions, startTime, endTime, ageMin, ageMax, blurb, provided, bring, status (open/almost/waitlist/full), special. Numeric fields use z.coerce so CMS string values parse. Price was removed entirely.

Status is rendered: almost shows an amber pill, waitlist shows a pill and changes the link to "Email to join waitlist", full shows "Session full" as non-interactive text on both card and homepage row. Labels live in src/lib/workshops.ts.

Current entries: 8 kids and 2 adult workshops, all sample data, all past-dated (June-August 2026). The two adult ones are invented and must be removed before cutover.

## Done since the last status

- Scheduled rebuild, build check, .gitattributes, README rewritten.
- Head metadata: per-page descriptions (all under 160 chars), canonical, Open Graph and Twitter card, og-share.jpg (1000x523), lang en-CA.
- Sitemap, robots.txt, 404 page served via Cloudflare not_found_handling.
- Favicon set from the logo's ink-splat silhouette (favicon.ico, favicon-32.png, apple-touch-icon.png). Astro defaults removed.
- Footer year computed at build time; "v2 redesign" fine print removed.
- Accessibility: WorkshopRow is a container with a single labelled link; Session full leaves the tab order; carousel has focus styles, arrow keys, a live counter and reduced-motion handling; hero pin is an aria-hidden SVG.
- WorkshopCard double-padding fixed. Dead CSS removed (global.css 1084 to 978 lines). Zero em or en dashes anywhere in the repo.
- Photo shot list: docs/photo-shot-list.md (36 placeholders across 6 pages, measured).

## Open items

Blocked on Christine:
1. Fall workshop data. She should enter it herself in Pages CMS with Brent on a call.
2. Photos per docs/photo-shot-list.md. Only 12 real photos exist.
3. Copy confirmations: homepage lede says "published children's-book illustrator", /about says "relief printmaker". Announce-bar copy.

Brent:
4. Invite jttacabin@gmail.com in Pages CMS, then send her the PDF guide.
5. Remove the two invented adult workshops before cutover.
6. Test reduced motion on the carousel with the Windows setting on.

Cutover (Phase 5), when content is in:
7. Point www.journeythroughthearts.com at the Worker (Cloudflare custom domain), add an apex-to-www redirect rule, verify 404 and canonicals on the real domain, submit sitemap-index.xml to Google Search Console.

After cutover:
8. Performance: self-host Google Fonts (currently render-blocking from the CDN); move images from public/ to Astro Image (several JPGs are 300-570 KB).
9. Split the ~700 lines of homepage-only CSS out of global.css. Consolidate repeated inline styles.
10. CMS singletons for the announce bar, summer weeks, instructors, party themes, grade workshops and about copy.
11. Give the "almost" status a treatment on the homepage row if the pill alone proves too subtle.

Yearly, each spring before summer camp registration opens:
12. Update the "24th year running" badge in the homepage summer section (src/pages/index.astro).
13. Set ANNOUNCE in src/lib/site.ts for the new summer, or leave it null. The previous summer value is in the comment above it.

## Conventions

- Hyphens only. No em or en dashes anywhere, including comments and formatter output.
- Never invent data: no prices, dates, guest counts or CV detail. Use only what the design or client provides.
- Canadian spelling. No emojis in code or copy.
- Ages 6-13 for kids programs. Founding year 2002. 1,000+ participants.
- Photos: .ph placeholder divs with a TODO comment naming the expected /images/... path.
- Email CTAs: visible address text via the .cta-email pattern; always use src/lib/site.ts constants (CONTACT_EMAIL, SITE_URL, STUDIO_NAME, mailto()).
- Rows and cards are containers; only the register control is a link.
- Icons come from Icon.astro (shared) or a page-scoped icon component (single-use), aria-hidden when decorative.
- Page stylesheets use their own class prefix: k-, a-, s-, b-, sc-, ab-. Design handoffs that borrow another page's prefix get renamed.
- Awards (2024 Northumberland News Readers' Choice) stay on their own pages as quiet trust signals; never moved.

## Workflow

- Claude (chat) orchestrates; Claude Code executes prompts in the local checkout and reports back.
- Larger work: commit locally, wait for Brent's review, then push. Small fixes: push directly.
- Claude Code must fetch origin before starting any prompt; one report was wrong because its checkout was 12 commits behind.
- Report back with conflicts against existing patterns and anything omitted because it would have required invented data.
- Commits use the global git identity (Brent, brent@civentures.ca). No co-author lines.
