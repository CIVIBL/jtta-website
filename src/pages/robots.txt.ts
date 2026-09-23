// robots.txt as an endpoint (prerendered to dist/robots.txt) so the sitemap URL
// comes from SITE_URL instead of hardcoding the domain in a static file.
import type { APIRoute } from "astro";
import { SITE_URL } from "../lib/site";

export const GET: APIRoute = () => {
  const sitemap = new URL("/sitemap-index.xml", SITE_URL).href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
