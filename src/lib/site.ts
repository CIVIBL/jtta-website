/* Site-wide constants and helpers. Single source for contact/identity values
 * that were previously hardcoded across components. */

export const CONTACT_EMAIL = "jttacabin@gmail.com";
export const MAPS_URL = "https://maps.app.goo.gl/B21tc9VSLLVKoAx69";
export const STUDIO_NAME = "Journey Through the Arts";

/** Build a mailto: link, optionally with a pre-filled subject. */
export function mailto(subject?: string): string {
  const base = `mailto:${CONTACT_EMAIL}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}
