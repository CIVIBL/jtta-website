// @ts-check
import { defineConfig } from 'astro/config';
import { SITE_URL } from './src/lib/site.ts';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: SITE_URL,
  integrations: [sitemap()],
});