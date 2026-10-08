# JTtA Website - Project Status

Updated 2026-10-08.

## Context

Client: Journey Through the Arts (JTtA), a one-person arts studio in an 1840s log cabin at 190 Hope St N, Port Hope, Ontario. Owner: Christine Benson (non-technical). Founded 2002.

Site type: brochure site. No e-commerce, accounts or payments. Registration and booking are by email (jttacabin@gmail.com). Workshop prices are never shown; pricing is handled by email. The birthday party price is shown as copy on that page.

Why: the previous webmaster retired. Brent (CIVIBL) took over hosting and rebuilt the site.

## Stack and infrastructure

- Astro 7, static output, TypeScript strict, npm. Dev on Windows with Git Bash.
- Repo: github.com/CIVIBL/jtta-website (public), branch main.
- Hosting: Cloudflare Workers Static Assets via Workers Builds. Every push to main deploys.
- Live: https://www.journeythroughthearts.com since 2026-10-03.
- Preview URL (kept): https://jtta-website.brent-1de.workers.dev/
- Domain: registered at Domains Priced Right (GoDaddy reseller) in the account of Christine's brother. DNS on Cloudflare.
- www is attached to the Worker as a custom domain. Apex redirects to www via a Cloudflare redirect rule plus Always Use HTTPS.
- DreamHost and the mail DNS records are retained pending an answer on whether domain email is used.
- Daily rebuild: .github/workflows/scheduled-rebuild.yml fires a Cloudflare Deploy Hook at 09:15 UTC so past workshops drop off without a push. Secret CF_DEPLOY_HOOK_URL is set. Tested.
- Build check: .github/workflows/build-check.yml runs build and astro check on every push and PR. A failing run emails the repo owner. This is the safety net for CMS commits.
- Local: npm run dev, npm run build, npx astro check. All clean (0 errors, 0 warnings, 0 hints).

## Content editing (Pages CMS)

- Connected at app.pagescms.org, scoped to this repo only.
- Config: .pages.yml, mirrors src/content.config.ts. Every field has help text.
- Collections: Workshops (src/content/workshops/*.md; uploads to public/images/workshops) and Artwork (src/content/artwork/*.md; uploads to src/assets/artwork, resized by Astro). Artwork CMS flow not yet tested end to end.
- End-to-end tested: add, deploy, verify, delete. Works.
- Christine signs in with "Continue with email" as an invited collaborator. Invite pending (Brent).
- Guide for Christine: docs/editing-workshops.md and docs/editing-workshops.pdf. Regenerate the PDF with node scripts/guide-pdf.mjs after editing the .md.
- Still hardcoded (CMS-bound later): announce bar, summer weeks, instructors, party themes, grade workshops, about copy.

## Pages (9, live)

/ , /for-kids, /for-adults, /summer-program, /birthday-parties, /in-the-schools, /about, /artwork, /404.

Nav: For Kids & Teens / For Adults / Summer Camp / Birthdays / In the Schools / About / Artwork plus "Contact Christine". Below 1320px the links move into a Menu panel (button with aria-expanded, Escape and click-outside close, works without JavaScript as an open list); Contact Christine stays in the bar at every width. Below 600px the brand name is visually hidden and the logo carries it.

## Design

Colours are provisional until Christine's brand files arrive. Tokens in src/styles/tokens.css:

- --c-teal #1A6B61: primary accent (buttons, links, active nav, focus rings, register links, closing band, heading accents). Passes AA as text on cream, white and warm, and under white text.
- --c-turquoise #2BB3A3: decorative only (splats, category pill and address stamp tints). Never text.
- --c-yellow #F2C14E: badges, Almost full pill, large accent words on dark bands.
- --c-red #C44128: retained for card accents only (last in the accent rotation, plus fixed per-card picks).

Splat component (src/components/Splat.astro, path traced from the logo by scripts/splat-path.mjs; HeadingSplat.astro wraps it for hero headings). Placed:

- Homepage hero heading: turquoise at 50% plus three yellow droplets. Inner-page hero headings (all six pages and /artwork): sized to the heading's height.
- Homepage section titles: 120px at 25%, alternating turquoise and yellow.
- Corners of the How to register box (18%) and the closing band (20%), clipped by the box.
- Behind every AwardBadge (100px yellow at 80%).

## Content model

Fields: title, audience (kids/teens/adults; teens is live), category (free-text medium label), accent, date, sessions, startTime, endTime, ageMin, ageMax, blurb, provided, bring, status (open/almost/waitlist/full), special. Optional: blurb, bring, accent (rotated in at render time so neighbouring cards differ). Defaults: provided "All art supplies included", status open, special false. Blank CMS values count as absent. Numeric fields use z.coerce so CMS string values parse. Price was removed entirely. Teens list in a Teen art section on For Kids (shown only when teen workshops are scheduled) and join the homepage rows.

Status is rendered: almost shows an amber pill, waitlist shows a pill and changes the link to "Email to join waitlist", full shows "Session full" as non-interactive text on both card and homepage row. Labels live in src/lib/workshops.ts.

Current entries: 12 real October 2026 workshops (5 kids, 2 teens, 5 adults). The sample data is removed. Files are named YYYY-MM-DD-slug.md by workshop date; Pages CMS names new entries the same way (filename "{fields.date}-{primary}.md" in .pages.yml).

## Done since the last status

- Artwork portfolio: collection, Pages CMS entry, /artwork page (grid, native dialog, empty state), nav/footer/About links. The two sample entries used to check the layout are deleted; the page shows its empty state until real pieces are added. Nav breakpoint moved from 1280px to 1320px for the seventh link.

- Scheduled rebuild, build check, .gitattributes, README rewritten.
- Head metadata: per-page descriptions (all under 160 chars), canonical, Open Graph and Twitter card, og-share.jpg (1080x565), lang en-CA.
- Sitemap, robots.txt, 404 page served via Cloudflare not_found_handling.
- Favicon set from the logo's ink-splat silhouette (favicon.ico, favicon-32.png, apple-touch-icon.png). Astro defaults removed.
- Footer year computed at build time; "v2 redesign" fine print removed.
- Accessibility: WorkshopRow is a container with a single labelled link; Session full leaves the tab order; carousel has focus styles, arrow keys, a live counter and reduced-motion handling; hero pin is an aria-hidden SVG.
- WorkshopCard double-padding fixed. Dead CSS removed (global.css 1084 to 978 lines). Zero em or en dashes anywhere in the repo.
- Sample workshops removed; real October data entered; teens audience live with a Teen art section on For Kids.
- Photo shot list: docs/photo-shot-list.md (36 photo slots across 6 pages, measured; all filled).

## Open items

Blocked on Christine:
1. Workshop data: October is in. The PA Day entry is pending its ages. Future workshops: she should enter them herself in Pages CMS with Brent on a call.
2. Photos per docs/photo-shot-list.md. Done: all 36 slots are filled. 48 real photos are on the site (41 distinct; 7 reuse an existing photo). No empty slots remain. The four files that were too small have been replaced with full-size ones. If a slot is emptied later, it shows as a placeholder in npm run dev only and production collapses around it.
3. Artwork: real pieces (photo, title, medium, optional year and note), entered in Pages CMS. /artwork shows its empty state until then.
4. Copy confirmations: homepage lede says "published children's-book illustrator", /about says "relief printmaker". Announce-bar copy.

Brent:
5. Invite jttacabin@gmail.com in Pages CMS, then send her the PDF guide.
6. Done: sample workshops (including the two invented adult ones) removed.
7. Test reduced motion on the carousel with the Windows setting on.

Cutover (Phase 5):
8. Done 2026-10-03: www on the Worker, apex redirect, 404 and canonicals verified on the real domain. Still to do: submit sitemap-index.xml to Google Search Console.

Post-launch:
9. Performance pass: move images from public/ to the Astro Image pipeline (several JPGs are 300-570 KB); self-host Google Fonts (currently render-blocking from the CDN).
10. Turn on Cloudflare Web Analytics.
11. Split the ~700 lines of homepage-only CSS out of global.css. Consolidate repeated inline styles.
12. CMS singletons for the announce bar, summer weeks, instructors, party themes, grade workshops and about copy.
13. Give the "almost" status a treatment on the homepage row if the pill alone proves too subtle.

Yearly, each spring before summer camp registration opens:
14. Update the "24th year running" badge in the homepage summer section (src/pages/index.astro).
15. Set ANNOUNCE in src/lib/site.ts for the new summer, or leave it null. The previous summer value is in the comment above it.

## Conventions

- Hyphens only. No em or en dashes anywhere, including comments and formatter output.
- Never invent data: no prices, dates, guest counts or CV detail. Use only what the design or client provides.
- Prices: not shown for workshops (email only). The birthday party price ($19 plus HST per child) is shown as hardcoded copy in src/pages/birthday-parties.astro and must be updated there by hand.
- Canadian spelling. No emojis in code or copy.
- Ages 6-16 for kids and teen workshops; summer camp and birthday parties stay 6-13. Founding year 2002. 1,000+ participants.
- Photos: an empty slot has no src and a TODO comment naming the expected /images/... path. The grey .ph placeholder renders only when import.meta.env.DEV is true; the production build emits nothing for it and the layout collapses (strip shows filled photos or hides, hero mosaic drops tiles or goes text-only, cards drop the photo area).
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
