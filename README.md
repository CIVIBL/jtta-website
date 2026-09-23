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
- `.github/workflows/scheduled-rebuild.yml` also rebuilds daily (09:15 UTC) via a Cloudflare deploy hook in the `CF_DEPLOY_HOOK_URL` secret. Upcoming workshops are filtered at build time, so this is what drops past workshops from the live site. Setup steps are in the workflow file.

## Content

- Workshops: one Markdown file each in `src/content/workshops/`. Schema: `src/content.config.ts`.
- Pages CMS config: `.pages.yml`. It mirrors the schema; change both together.
- Contact email and Maps link: `src/lib/site.ts`. Date, time and price formatting: `src/lib/workshops.ts`.
- Other page copy lives in `src/pages/*.astro`.
- Images: `public/images/`. Missing photos are `.ph` placeholders with a TODO comment naming the expected path.

## Structure

- `src/styles/tokens.css` design tokens; `global.css` shared styles; one stylesheet per page with its own class prefix (kids `k-`, adults `a-`, summer `s-`, birthday `b-`, schools `sc-`, about `ab-`).
- `src/layouts/`: BaseLayout, Nav, Footer. `src/components/`: shared and page-scoped components.

## Conventions

- Hyphens only. No em dashes or en dashes, in content or formatter output.
- Never invent data: no prices, dates, counts, awards or credentials the studio has not provided. Pricing is handled by email.
- Canadian spelling (colour, centre, favourite, neighbour).
- Email links use `mailto()` and `CONTACT_EMAIL` from `src/lib/site.ts`, with the address shown as visible text.
