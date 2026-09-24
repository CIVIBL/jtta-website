# Journey Through the Arts website

Brochure site for Journey Through the Arts (JTtA), Christine Benson's arts studio in an 1840s log cabin at 190 Hope St N, Port Hope, Ontario. No e-commerce, accounts or payments: registration and booking happen by email.

## Stack

- Astro 6, static output, TypeScript strict
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

- Workshops: one Markdown file each in `src/content/workshops/`. Schema: `src/content.config.ts`.
- Pages CMS config: `.pages.yml`. It mirrors the schema; change both together.
- Christine's editing guide: `docs/editing-workshops.md`. After editing it, regenerate the PDF with `node scripts/guide-pdf.mjs` and commit both.
- CMS editing flow: Christine edits workshops in Pages CMS (app.pagescms.org), which commits to `main`; Cloudflare deploys it and the build-check workflow reports failures. Workshop uploads go to `public/images/workshops/`.
- Contact email and Maps link: `src/lib/site.ts`. Date and time formatting: `src/lib/workshops.ts`.
- Other page copy lives in `src/pages/*.astro`.
- Images: `public/images/`. Missing photos are `.ph` placeholders with a TODO comment naming the expected path.

## Structure

- `src/styles/tokens.css` design tokens; `global.css` shared styles; one stylesheet per page with its own class prefix (kids `k-`, adults `a-`, summer `s-`, birthday `b-`, schools `sc-`, about `ab-`).
- `src/layouts/`: BaseLayout, Nav, Footer. `src/components/`: shared and page-scoped components.
- `scripts/`: one-off generators, run by hand with `node scripts/<name>.mjs`. `og-share.mjs` makes the social share image; `favicons.mjs` makes the favicons from the logo. `guide-pdf.mjs` makes `docs/editing-workshops.pdf` (needs Chrome or Edge).

## Conventions

- Hyphens only. No em dashes or en dashes, in content, code comments or formatter output.
- Prices are never shown on the site. Pricing is handled by email, and the workshop schema has no price field.
- Never invent data: no dates, counts, awards or credentials the studio has not provided.
- Canadian spelling (colour, centre, favourite, neighbour).
- Email links use `mailto()` and `CONTACT_EMAIL` from `src/lib/site.ts`, with the address shown as visible text.
- Workshop rows and cards are containers, not links. Only the register control links (to `buildMailto()`); the row's arrow circle repeats it for mouse users with `tabindex="-1"` and `aria-hidden`. A full session renders as plain text, not a link.
- Status pill text comes from `STATUS_LABEL` in `src/lib/workshops.ts` and matches the labels in `.pages.yml`.
- Icons come from `src/components/Icon.astro`, wrapped in `aria-hidden` when decorative. No emojis in markup.
- Motion: honour `prefers-reduced-motion` (no smooth scrolling or transitions) and give custom controls a visible `:focus-visible` style.
