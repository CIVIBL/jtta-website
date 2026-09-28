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
    category: z.string(), // e.g. "Painting & Drawing"
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

export const collections = { workshops };
