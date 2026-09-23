import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const workshops = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/workshops" }),
  schema: z.object({
    title: z.string().min(1),
    audience: z.enum(["kids", "adults"]),
    category: z.string(), // e.g. "Painting & Drawing"
    accent: z.enum(["red", "yellow", "sage", "blue", "plum"]).default("red"),
    date: z.coerce.date(), // ISO date, with year
    sessions: z.coerce.number().int().min(1).default(1), // single or multi-session
    startTime: z.string(), // "10:00" 24-hour for sortability
    endTime: z.string(), // "12:00"
    ageMin: z.coerce.number().int(),
    ageMax: z.coerce.number().int(),
    blurb: z.string().min(1),
    provided: z.string(),
    bring: z.string(),
    status: z.enum(["open", "almost", "waitlist", "full"]).default("open"),
    special: z.boolean().default(false),
  }),
});

export const collections = { workshops };
