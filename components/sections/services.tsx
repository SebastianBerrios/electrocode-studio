import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { toServiceCards } from "@/lib/content/projections";
import { getDictionary } from "@/lib/dictionaries";
import { landingAnchor, pricingLineAnchor } from "@/lib/links";
import type { Locale } from "@/lib/content/locales";

/**
 * Server Component: landing section 2, "Servicios" — one self-identification
 * card per service line. Task 3.1, updated by task 4.8.
 *
 * `specs/landing-narrative/spec.md`'s "Servicios Section Contract" and
 * `specs/service-catalog/spec.md`'s "Line-to-Pricing Anchor Mapping" both
 * call for each card to link to its pricing block on `/[locale]/precios`
 * AND to its available proof. Each card renders both CTAs: `pricingCta`
 * (`pricingLineAnchor()`, deep-linking to that exact line's block) and
 * `proofCta` (`#proyectos`).
 *
 * ---
 *
 * **The expanding accordion (green restyle).** This replaces a static
 * four-column grid of equal cards with the reference direction's horizontal
 * accordion: narrow cards whose titles run vertically, one of which widens
 * on pointer or keyboard focus to reveal its description, its CTAs, and more
 * of its screenshot.
 *
 * The reference implementation was measured rather than guessed. Its cards
 * are flex items carrying `transition: width 0.3s ease-in`; its titles use
 * `writing-mode: sideways-lr` at 48px; and its description sits inside a
 * `display: grid` wrapper that is `0` wide when collapsed. This rebuilds
 * those three mechanics.
 *
 * **No JavaScript, and no client boundary.** design.md D10 already rejected
 * a Radix accordion for the FAQ on exactly this reasoning — it costs a
 * client boundary and a dependency for something the platform gives for
 * free. The same reasoning applies here and the same answer follows:
 *
 * - Expansion is `hover:` **plus `focus-within:`**, so a keyboard visitor
 *   tabbing into a collapsed card's links opens it. `focus-within` is not
 *   an extra — without it the CTAs inside a collapsed card would be
 *   focusable but invisible, which is a WCAG 2.4.11 failure, not a styling
 *   preference.
 * - The reveal animates `grid-template-columns` from `0fr` to `1fr` (the
 *   reference's own technique). The revealed content is clipped by
 *   `overflow-hidden`, never `display: none` — so it stays in the
 *   accessibility tree and reachable by tab order at every width.
 *
 * **Below `lg` there is no accordion at all.** A hover-driven disclosure has
 * no trigger on a touch screen, so the whole pattern collapses to a plain
 * vertical stack: horizontal titles, every description already open
 * (`grid-cols-[1fr]`), one card per row. The accordion classes are all
 * `lg:`-prefixed, so the mobile layout is the default and the accordion is
 * the enhancement.
 *
 * **`writing-mode: sideways-lr`** is what makes the title read bottom-to-top
 * rather than top-to-bottom (which is what plain `vertical-rl` gives, and
 * reads as sideways-wrong). Verified supported in the browser this was built
 * against; it is also the exact value the reference site computes.
 */
export function Services({ locale }: { locale: Locale }) {
  const { services } = getDictionary(locale);
  const cards = toServiceCards(locale);
  // Same pattern as `site-header.tsx`/`site-footer.tsx`/`hero-header.tsx`:
  // `landingAnchor()` returns a plain `string` (locale + arbitrary fragment
  // id), so `typedRoutes` cannot verify it structurally and this cast waives
  // that check — an existing, already-established waiver reused here, not a
  // new one. See `hero-header.tsx`'s fuller comment on this exact cast.
  const proyectosHref = landingAnchor(locale, "proyectos") as Route;

  return (
    <section id="servicios" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="reveal mx-auto max-w-3xl text-center text-4xl md:text-6xl">
          {services.heading}
        </h2>

        <div className="mt-14 flex flex-col gap-4 lg:h-[30rem] lg:flex-row lg:items-stretch">
          {cards.map((card, index) => (
            <article
              key={card.line}
              style={{ animationDelay: `${index * 80}ms` }}
              className="reveal group relative overflow-hidden rounded-3xl border border-border bg-card transition-[flex-grow] duration-500 ease-out lg:flex-1 lg:hover:flex-[2.4] lg:focus-within:flex-[2.4]"
            >
              {/*
                The screenshot is always mounted and always at the bottom of
                the card — it is cropped by the card's own `overflow-hidden`,
                so widening the card reveals more of it. That is the
                reference direction's effect, and it is why the image is a
                sibling of the text rather than living inside the collapsing
                grid.

                `aria-hidden` + empty `alt` would be wrong here: these are
                real screenshots of real client work and `MediaAsset` already
                carries a written, locale-keyed description, so it is used.
              */}
              {card.showcase !== undefined && (
                <Image
                  src={card.showcase.asset}
                  alt={card.showcase.alt[locale]}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  // `left-32` clears the vertical title's column. The title
                  // is capped at `text-4xl` (below) precisely so the longest
                  // service name — "Landing pages y sitios corporativos" —
                  // wraps to at most two vertical lines inside the 30rem card
                  // height; at `text-5xl` it took three and ran into this
                  // image.
                  className="pointer-events-none absolute -bottom-8 left-6 hidden w-[22rem] max-w-none rounded-t-xl border border-border/60 opacity-90 lg:left-40 lg:block"
                />
              )}

              <div className="relative z-10 flex h-full flex-col gap-5 p-6 lg:flex-row lg:gap-6 lg:p-8">
                {/* Dimmed while collapsed and full-strength on open, the
                    same emphasis shift the reference direction uses to say
                    which card is active. `/70` against `--card` measures
                    well clear of AA for text this size. */}
                <h3 className="shrink-0 text-2xl text-card-foreground transition-colors lg:max-h-full lg:text-3xl lg:text-card-foreground/70 lg:[writing-mode:sideways-lr] lg:group-hover:text-card-foreground lg:group-focus-within:text-card-foreground xl:text-4xl">
                  {card.name}
                </h3>

                {/*
                  `0fr` -> `1fr` on a grid column is the reveal. The inner
                  `min-w-0 overflow-hidden` is what makes it clip rather than
                  overflow, and the fixed `w-72` inside keeps the paragraph
                  from reflowing word by word while the column animates.
                */}
                <div className="grid grid-cols-[1fr] transition-[grid-template-columns] duration-500 ease-out lg:grid-cols-[0fr] lg:group-hover:grid-cols-[1fr] lg:group-focus-within:grid-cols-[1fr]">
                  <div className="min-w-0 overflow-hidden">
                    <div className="flex flex-col gap-4 lg:w-72">
                      <p className="text-sm text-muted-foreground">
                        {card.description}
                      </p>
                      {/* `items-start`: the links are flex children of a
                          stretched column, so without it each underline ran
                          the full 288px of the revealed panel instead of the
                          width of its own label. */}
                      <div className="flex flex-col items-start gap-1">
                        <Link
                          href={pricingLineAnchor(locale, card.line)}
                          className="text-sm font-semibold text-accent-signal underline underline-offset-4"
                        >
                          {services.pricingCta}
                        </Link>
                        <Link
                          href={proyectosHref}
                          className="text-sm font-semibold underline underline-offset-4"
                        >
                          {services.proofCta}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
