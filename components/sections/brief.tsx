import { MessageCircle } from "lucide-react";
import { WHATSAPP } from "@/lib/content/contact";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/content/locales";

/**
 * Server Component: landing section 8, the conversion section. Task 6.6.
 *
 * ---
 *
 * **The brief form no longer renders here (2026-08-09).** This section used
 * to branch on `isBriefFormConfigured()` (`lib/brief/config.ts`): with the
 * email provider's environment variables present it rendered `BriefForm` —
 * eight fields, a `<noscript>` explanation, and a WhatsApp aside — and
 * without them it rendered a paragraph apologising for the form's absence
 * next to a WhatsApp link. It is now one closing call to action in every
 * case: an eyebrow, a heading, and a single WhatsApp button.
 *
 * Two things drove that. The first is that the configured branch was never
 * reachable in production — `BRIEF_FROM_EMAIL` needs DNS domain verification
 * with the provider, and the studio has no owned domain today (it deploys to
 * a `.vercel.app` subdomain) — so the only page anyone has ever seen was the
 * apology. The second is that the apology was the WORST version of that page:
 * it spent its most valuable position explaining an internal outage to a
 * visitor who cannot act on it, and buried the one channel that does work
 * under four lines of it.
 *
 * So the honest form of this section is the one that only ever offers what
 * actually works. `specs/lead-capture/spec.md` has been amended to record
 * that — the "Brief Form Presence" requirement was replaced rather than left
 * to contradict this file, the same call made when the retainer section was
 * removed from the landing (see `app/[locale]/page.tsx`).
 *
 * **The form's code is intentionally still in the repo**, unused:
 * `components/brief/brief-form.tsx` and all of `lib/brief/**` (validation,
 * abuse signals, token issuance, notification, the `/[locale]/gracias`
 * confirmation route it redirects to) are untouched. Unlike
 * `components/sections/retainer.tsx` and `components/ui/hero-parallax.tsx`,
 * which were deleted with their last consumer because the studio had decided
 * against what they showed, nothing here was decided against — the form is
 * waiting on a domain. Deleting it would mean rebuilding a validated,
 * abuse-checked, spec'd submission path to get back to where the repo
 * already is. Re-mounting it is a matter of importing `BriefForm` again on a
 * route of its own once the provider is verified.
 *
 * **`id="brief"` MUST stay.** `landingAnchor(locale, "brief")` is the target
 * of the header CTA, the hero's primary CTA, the "Cómo trabajamos" bento CTA
 * and the footer link, and none of those are structurally verified — see
 * `hero-header.tsx`'s note on both anchor casts.
 *
 * **`WHATSAPP.status` still gates the button.** With no number on record this
 * card renders no CTA at all rather than a dead `wa.me` link — the same
 * `pending`/`set` discipline used throughout `lib/content/**`. The number IS
 * on record today (`lib/content/contact.ts`), so this is a structural
 * guarantee, not a live branch.
 */
export function Brief({ locale }: { locale: Locale }) {
  const { brief } = getDictionary(locale);
  const whatsappUrl = WHATSAPP.status === "set" ? WHATSAPP.url : null;

  return (
    <section id="brief" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        {/* The card is what makes this read as a closing statement rather
            than a ninth section of argument: every other section on the page
            sets its heading directly on the background, so lifting this one
            onto a surface marks it as the end of the page without needing a
            larger type scale than the rest of the site uses. */}
        <div className="reveal mx-auto flex max-w-4xl flex-col items-center rounded-3xl border border-border bg-card px-6 py-16 text-center sm:px-12 md:py-20">
          {/* Same eyebrow composition as `way-of-working.tsx` — accent green,
              `size-4` glyph, `aria-hidden` because the label beside it
              already says the same thing. */}
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-accent-signal">
            <MessageCircle aria-hidden="true" className="size-4" />
            {brief.eyebrow}
          </p>
          <h2 className="mt-4 text-4xl md:text-6xl">
            {brief.heading.lead}{" "}
            <span className="text-accent-signal">{brief.heading.accent}</span>
          </h2>
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex rounded-full bg-accent-signal px-8 py-4 text-base font-semibold text-accent-signal-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-signal"
            >
              {brief.whatsappCtaLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
