// @ts-check
import { defineConfig } from 'astro/config';
import { SITE_URL } from './src/lib/site.ts';

// https://astro.build/config
export default defineConfig({
	output: 'static',
	site: SITE_URL,
});
