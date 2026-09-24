// @ts-check
import { defineConfig } from 'astro/config';
import { SITE_URL } from './src/lib/site.ts';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: SITE_URL,
  // Astro 7 defaults to 'jsx', which strips spaces between inline elements
  // (e.g. "JTtA.A graduate"). Keep the HTML-aware behaviour from Astro 6.
  compressHTML: true,
  integrations: [sitemap()],
});