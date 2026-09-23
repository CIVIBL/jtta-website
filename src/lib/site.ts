/* Site-wide constants and helpers. Single source for contact/identity values
 * that were previously hardcoded across components. */

/** Production origin. Includes the scheme because Astro's `site` option, canonical
 * links and og:url all require an absolute URL. No trailing slash. */
export const SITE_URL = "https://www.journeythroughthearts.com";
export const CONTACT_EMAIL = "jttacabin@gmail.com";
export const MAPS_URL = "https://maps.app.goo.gl/B21tc9VSLLVKoAx69";
export const STUDIO_NAME = "Journey Through the Arts";

/** Fallback meta/OG description, drawn from the homepage hero copy. */
export const SITE_DESCRIPTION =
  "A creative studio in an 1840s log cabin in Port Hope, run by Christine Benson. Workshops, summer camps, adult classes, birthday parties and in-school visits since 2002.";

/** Build a mailto: link, optionally with a pre-filled subject. */
export function mailto(subject?: string): string {
  const base = `mailto:${CONTACT_EMAIL}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}
