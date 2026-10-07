import type { CollectionEntry } from "astro:content";

/** Default portfolio order: manual order ascending (entries with one come first), then newest year, then title. */
export function sortArtwork(a: CollectionEntry<"artwork">, b: CollectionEntry<"artwork">): number {
  const oa = a.data.order ?? Infinity;
  const ob = b.data.order ?? Infinity;
  if (oa !== ob) return oa - ob;
  const ya = a.data.year ?? -Infinity;
  const yb = b.data.year ?? -Infinity;
  if (ya !== yb) return yb - ya;
  return a.data.title.localeCompare(b.data.title, "en-CA");
}
