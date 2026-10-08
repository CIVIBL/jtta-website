import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { ACCENTS } from "./lib/workshops";

// Pages CMS saves an emptied optional field as "", so treat blank strings as absent.
const blank = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);

const workshops = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/workshops" }),
  schema: z.object({
    title: z.string().min(1),
    audience: z.enum(["kids", "teens", "adults"]),
    category: z.string().min(1), // free-text medium label, e.g. "Painting"
    accent: z.preprocess(blank, z.enum(ACCENTS).optional()), // optional; pages rotate one in when absent
    date: z.coerce.date(), // ISO date, with year
    sessions: z.coerce.number().int().min(1).default(1), // single or multi-session
    startTime: z.string(), // "10:00" 24-hour for sortability
    endTime: z.string(), // "12:00"
    ageMin: z.coerce.number().int(),
    ageMax: z.coerce.number().int(),
    blurb: z.preprocess(blank, z.string().optional()), // optional; the card hides it when absent
    provided: z.preprocess(blank, z.string().default("All art supplies included")),
    bring: z.preprocess(blank, z.string().optional()), // optional; the card hides "Bring" when absent
    status: z.preprocess(blank, z.enum(["open", "almost", "waitlist", "full"]).default("open")),
    special: z.boolean().default(false),
  }),
});

// Christine's portfolio. Images live in src/assets/artwork so Astro resizes them; paths are relative to the .md file.
const artwork = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/artwork" }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      medium: z.string().min(1), // e.g. "Relief print", "Acrylic on canvas"
      year: z.preprocess(blank, z.coerce.number().int().optional()),
      image: image(),
      note: z.preprocess(blank, z.string().optional()), // one or two sentences, shown under the medium
      order: z.preprocess(blank, z.coerce.number().optional()), // manual ordering; lower comes first
    }),
});

export const collections = { workshops, artwork };
