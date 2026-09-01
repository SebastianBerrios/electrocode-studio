/**
 * Google Maps search deep link.
 */
export function googleMapsUrl(venue: string, address: string): string {
  const query = [venue.trim(), address.trim()].filter(Boolean).join(", ");
  const url = new URL("https://www.google.com/maps/search/");

  url.searchParams.set("api", "1");
  url.searchParams.set("query", query);

  return url.toString();
}
