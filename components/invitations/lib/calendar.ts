import type { CalendarEvent } from "@/lib/clients/types";

/**
 * Format an instant as an iCalendar / Google "basic format" UTC stamp
 * (`YYYYMMDDTHHMMSSZ`). Converting to UTC is what makes the entry land at the
 * right wall-clock time for a guest in any timezone.
 */
export function toCalendarStamp(instant: number): string {
  return new Date(instant).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function boundsOf(event: CalendarEvent) {
  const start = Date.parse(event.startsAt);
  return { start, end: start + event.durationMinutes * 60_000 };
}

export function googleCalendarUrl(event: CalendarEvent, location: string): string {
  const { start, end } = boundsOf(event);
  const url = new URL("https://calendar.google.com/calendar/render");

  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", event.title);
  url.searchParams.set("location", location);
  url.searchParams.set("dates", `${toCalendarStamp(start)}/${toCalendarStamp(end)}`);

  return url.toString();
}

export function outlookCalendarUrl(event: CalendarEvent, location: string): string {
  const { start, end } = boundsOf(event);
  const url = new URL("https://outlook.live.com/calendar/0/deeplink/compose");

  url.searchParams.set("path", "/calendar/action/compose");
  url.searchParams.set("rru", "addevent");
  url.searchParams.set("subject", event.title);
  url.searchParams.set("location", location);
  url.searchParams.set("startdt", new Date(start).toISOString());
  url.searchParams.set("enddt", new Date(end).toISOString());

  return url.toString();
}

/**
 * Escape a value for an iCalendar TEXT field. Backslash first — otherwise the
 * escapes this function introduces would themselves get escaped.
 */
function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * A minimal single-event VCALENDAR, served as a data URL for Apple Calendar
 * and anything else that speaks .ics. RFC 5545 mandates CRLF line endings.
 */
export function buildIcs(event: CalendarEvent, location: string): string {
  const { start, end } = boundsOf(event);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//wedding-invitation//electrocode//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${toCalendarStamp(start)}-electrocode@wedding-invitation`,
    `DTSTAMP:${toCalendarStamp(start)}`,
    `DTSTART:${toCalendarStamp(start)}`,
    `DTEND:${toCalendarStamp(end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `LOCATION:${escapeIcsText(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

/** `buildIcs` output packaged as an href a plain anchor can download. */
export function icsDataUrl(event: CalendarEvent, location: string): string {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(buildIcs(event, location))}`;
}

/** Triggers a clean blob-based ICS file download compatible with Apple / iOS / macOS. */
export function downloadIcs(event: CalendarEvent, location: string, filename: string): void {
  const icsContent = buildIcs(event, location);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 100);
}
