/* Display formatting for workshop collection entries.
 *
 * Timezone model — read before changing:
 * Frontmatter date-only values ("date: 2026-07-04") parse as midnight UTC.
 * That instant is 8 PM the *previous day* in Toronto, so formatting it with
 * timeZone "America/Toronto" would render "Fri Jul 3" — a day earlier than
 * what was typed. The date IS the calendar date; we therefore format its
 * parts in UTC, which reproduces the written date on any build server.
 * America/Toronto (the studio's timezone, Port Hope ON) is used where "now"
 * matters: isUpcoming() compares against today's date in Toronto.
 * Check: date 2026-07-04 renders "Sat Jul 4" regardless of server location.
 */

import { mailto } from "./site";

const STUDIO_TZ = "America/Toronto";

// en-CA abbreviates with trailing periods ("Jul.", "Sat.") — strip them.
const clean = (s: string) => s.replace(/\./g, "");

const monthFmt = new Intl.DateTimeFormat("en-CA", { timeZone: "UTC", month: "short" });
const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: "UTC", day: "numeric" });
const dowFmt = new Intl.DateTimeFormat("en-CA", { timeZone: "UTC", weekday: "short" });
const todayFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: STUDIO_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** "Jul" */
export function formatMonth(date: Date): string {
  return clean(monthFmt.format(date));
}

/** "27" (no leading zero) */
export function formatDay(date: Date): string {
  return dayFmt.format(date);
}

/** "Sat" */
export function formatDow(date: Date): string {
  return clean(dowFmt.format(date));
}

/** "10:00" (24h) -> { h12: "10:00", suffix: "AM" } */
function to12h(time: string): { h12: string; suffix: "AM" | "PM" } {
  const [hRaw, m] = time.split(":");
  const h = Number(hRaw);
  const suffix = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return { h12: `${h12}:${m}`, suffix };
}

/** ("10:00", "12:00") -> "10:00 AM - 12:00 PM" */
export function formatTimeRange(startTime: string, endTime: string): string {
  const start = to12h(startTime);
  const end = to12h(endTime);
  return `${start.h12} ${start.suffix} - ${end.h12} ${end.suffix}`;
}

/** (7, 10) -> "7-10". The "Ages" prefix is a label in markup, not data. */
export function formatAgeRange(ageMin: number, ageMax: number): string {
  return `${ageMin}-${ageMax}`;
}

/** 1 -> "Single session" · 4 -> "4 weekly sessions" */
export function formatSessions(sessions: number): string {
  return sessions === 1 ? "Single session" : `${sessions} weekly sessions`;
}

/** Session length in minutes, e.g. ("16:45","18:00") -> 75 */
export function durationMinutes(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}

/** 90 -> "90 min" · 120 -> "2 hours" */
export function formatDuration(minutes: number): string {
  return minutes >= 120 && minutes % 60 === 0 ? `${minutes / 60} hours` : `${minutes} min`;
}

/** True if the workshop date is today (in Toronto) or later. */
export function isUpcoming(date: Date): boolean {
  const workshopDay = date.toISOString().slice(0, 10); // calendar date as written
  const todayInToronto = todayFmt.format(new Date()); // en-CA -> "YYYY-MM-DD"
  return workshopDay >= todayInToronto;
}

/** Per-workshop registration mailto with a subject Christine can triage at a glance. */
export function buildMailto(workshopTitle: string, date: Date): string {
  const subject = `Workshop registration: ${workshopTitle} (${formatDow(date)} ${formatMonth(date)} ${formatDay(date)})`;
  return mailto(subject);
}
