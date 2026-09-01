/**
 * Should an element at this position be revealed?
 */
export function isWithinRevealBand(
  top: number,
  viewportHeight: number,
  bottomMargin = 0.08,
): boolean {
  return top < viewportHeight * (1 - bottomMargin);
}
