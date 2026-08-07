import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LAUNCH_PRICING_SLOTS } from "@/lib/content/pricing";
import { getDictionary } from "@/lib/dictionaries";
import { pricingPath } from "@/lib/links";
import type { Locale } from "@/lib/content/locales";

/**
 * The slim promotional bar above the header (green restyle).
 *
 * **Why it is not dismissible.** The reference direction's equivalent bar has
 * a close button. Reproducing that would make this a Client Component with
 * its own persisted state, and a bar that stays dismissed needs storage the
 * rest of this site does not use — a whole cookie/localStorage surface for
 * one decorative affordance. It stays a Server Component with zero client
 * JS; the bar is one line tall and scrolls away with the page (it is
 * deliberately NOT inside the sticky header), so it costs a returning
 * visitor almost nothing.
 *
 * **Why this copy and no other.** A promotional bar is the single easiest
 * place on a site to publish a claim nobody checked. This one renders
 * `LAUNCH_PRICING_SLOTS` — the same figure the pricing page's launch note
 * already renders, sourced from `lib/content/pricing.ts` — and links
 * straight to that page so the claim is one click from its own detail. It
 * must never grow a countdown, a discount percentage, or a deadline: none of
 * those exist as facts anywhere in `lib/content/**`.
 */
export function AnnouncementBanner({ locale }: { locale: Locale }) {
  const { announcement } = getDictionary(locale);

  return (
    <div className="w-full bg-nav text-nav-foreground">
      <Link
        href={pricingPath(locale)}
        className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-2.5 text-center text-sm transition-colors hover:text-nav-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nav-cta"
      >
        <span>
          {announcement.prefix} {LAUNCH_PRICING_SLOTS} {announcement.suffix}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold underline underline-offset-4">
          {announcement.linkLabel}
          {/* Decorative: the adjacent label already names the destination. */}
          <ArrowRight aria-hidden="true" className="size-4" />
        </span>
      </Link>
    </div>
  );
}
