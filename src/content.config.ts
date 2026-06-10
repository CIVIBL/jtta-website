import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const workshops = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/workshops" }),
  schema: z.object({
    title: z.string(),
    audience: z.enum(["kids", "adults"]),
    category: z.string(), // e.g. "Painting & Drawing"
    accent: z.enum(["red", "yellow", "sage", "blue", "plum"]).default("red"),
    date: z.coerce.date(), // ISO date, with year
    sessions: z.number().int().min(1).default(1), // single or multi-session
    startTime: z.string(), // "10:00" 24-hour for sortability
    endTime: z.string(), // "12:00"
    ageMin: z.number().int(),
    ageMax: z.number().int(),
    price: z.number(), // HST-inclusive dollars, e.g. 44
    blurb: z.string(),
    provided: z.string(),
    bring: z.string(),
    status: z.enum(["open", "almost", "waitlist", "full"]).default("open"),
    special: z.boolean().default(false),
  }),
});

export const collections = { workshops };
