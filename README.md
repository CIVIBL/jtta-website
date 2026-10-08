# Journey Through the Arts website

Brochure site for Journey Through the Arts (JTtA), Christine Benson's arts studio in an 1840s log cabin at 190 Hope St N, Port Hope, Ontario. No e-commerce, accounts or payments: registration and booking happen by email.

## Stack

- Astro 7, static output, TypeScript strict
- Cloudflare Workers Static Assets (`wrangler.jsonc` serves `./dist`)

## Local commands

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # builds to ./dist
npx astro check   # type check; keep at 0 errors
```

## Deploy

- Push to `main` deploys via Cloudflare Workers Builds.
- `.github/workflows/build-check.yml` runs build and `astro check` on every push to `main` and on PRs, so a broken commit fails visibly in GitHub Actions.
- `.github/workflows/scheduled-rebuild.yml` also rebuilds daily (09:15 UTC) via a Cloudflare deploy hook in the `CF_DEPLOY_HOOK_URL` secret. Upcoming workshops are filtered at build time, so this is what drops past workshops from the live site. Setup steps are in the workflow file.

## Content

- Workshops: one Markdown file each in `src/content/workshops/`. Schema: `src/content.config.ts`. Audience is kids, teens or adults; teens list in the Teen art section of For Kids. blurb, bring and accent are optional, provided defaults to "All art supplies included", and a missing accent is rotated in at render time (`accentRotation()` in `src/lib/workshops.ts`).
- Artwork: one Markdown file each in `src/content/artwork/` (title, medium, optional year, note and order). Images live in `src/assets/artwork/` and are referenced relative to the .md file (`../../assets/artwork/x.jpg`) so Astro resizes them (400/800/1200 webp with jpg fallback). Order: `order` ascending, then year newest first, then title (`src/lib/artwork.ts`). Page: `/artwork`.
- Pages CMS config: `.pages.yml`. It mirrors the schema; change both together.
- Christine's editing guide: `docs/editing-workshops.md`. After editing it, regenerate the PDF with `node scripts/guide-pdf.mjs` and commit both.
- CMS editing flow: Christine edits workshops in Pages CMS (app.pagescms.org), which commits to `main`; Cloudflare deploys it and the build-check workflow reports failures. Artwork uploads go to `src/assets/artwork`. Workshop uploads go to `public/images/workshops/`.
- Contact email and Maps link: `src/lib/site.ts`. Date and time formatting: `src/lib/workshops.ts`.
- Other page copy lives in `src/pages/*.astro`.
- Images: `public/images/`. A missing photo is a slot with no `src` and a TODO comment naming the expected path. It renders as a grey `.ph` placeholder only in `npm run dev` (`import.meta.env.DEV`); the production build drops it and the layout collapses (strips show only filled photos or hide, hero mosaics drop empty tiles or go text-only, cards lose the photo area). To fill a slot, add `src`, `alt`, `width` and `height`.

## Structure

- `src/styles/tokens.css` design tokens; `global.css` shared styles; one stylesheet per page with its own class prefix (kids `k-`, adults `a-`, summer `s-`, birthday `b-`, schools `sc-`, about `ab-`, artwork `aw-`).
- `src/layouts/`: BaseLayout, Nav, Footer. `src/components/`: shared and page-scoped components.
- Nav (`src/layouts/Nav.astro`): For Kids & Teens, For Adults, Summer Camp, Birthdays, In the Schools, About, Artwork, then the Contact Christine button. Pages pass `activeNav` (kids, adults, summer, birthdays, schools, about, artwork) to highlight their link. At 1320px and wider the seven links sit in one row (the full brand name fits from 1310px). Below 1320px they move into a panel opened by a Menu button (a real button with aria-expanded; Escape and clicking outside close it); Contact Christine stays in the bar at every width. The panel is rendered open and a small inline script in Nav.astro closes it on load, so without JavaScript the links are still listed. Below 600px the brand name is visually hidden (the logo carries it) but stays as the home link's accessible name. The footer keeps its own links list.
- `scripts/`: one-off generators, run by hand with `node scripts/<name>.mjs`. `og-share.mjs` makes the social share image; `favicons.mjs` makes the favicons from the logo. `guide-pdf.mjs` makes `docs/editing-workshops.pdf` (needs Chrome or Edge). `splat-path.mjs` traces the logo silhouette for `Splat.astro`.

## Conventions

- Hyphens only. No em dashes or en dashes, in content, code comments or formatter output.
- Workshop prices are never shown on the site. Pricing is handled by email, and the workshop schema has no price field. Exception: the birthday party price is hardcoded copy on /birthday-parties ("What's included" lead line); update it there by hand.
- Never invent data: no dates, counts, awards or credentials the studio has not provided.
- Canadian spelling (colour, centre, favourite, neighbour).
- Email links use `mailto()` and `CONTACT_EMAIL` from `src/lib/site.ts`, with the address shown as visible text.
- Workshop rows and cards are containers, not links. Only the register control links (to `buildMailto()`); the row's arrow circle repeats it for mouse users with `tabindex="-1"` and `aria-hidden`. A full session renders as plain text, not a link.
- Status pill text comes from `STATUS_LABEL` in `src/lib/workshops.ts` and matches the labels in `.pages.yml`.
- Icons come from `src/components/Icon.astro`, wrapped in `aria-hidden` when decorative. No emojis in markup.
- Colours: use tokens, never hex. `--c-teal` is the primary accent (buttons, links, active nav, focus); `--c-turquoise` is decorative only, never text; `--c-yellow` for badges and the Almost full pill; `--c-red` only as a card accent.
- Splats (`Splat.astro`, `HeadingSplat.astro`): always `aria-hidden`, static (no animation), and never under body text above 25% opacity. A heading holding a splat becomes its own stacking context (global.css), so lift anything above it (crumbs, taglines) with `position: relative; z-index: 1`.
- Motion: honour `prefers-reduced-motion` (no smooth scrolling or transitions) and give custom controls a visible `:focus-visible` style.
