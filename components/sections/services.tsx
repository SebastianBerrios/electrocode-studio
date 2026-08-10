import Image from "next/image";
import Link from "next/link";
import { toServiceCards } from "@/lib/content/projections";
import { getDictionary } from "@/lib/dictionaries";
import { pricingLineAnchor } from "@/lib/links";
import type { Locale } from "@/lib/content/locales";

/**
 * Server Component: landing section 2, "Servicios" — one self-identification
 * card per service line. Task 3.1, updated by task 4.8.
 *
 * `specs/service-catalog/spec.md`'s "Line-to-Pricing Anchor Mapping" is what
 * the single CTA implements: each card deep-links to its own block on
 * `/[locale]/precios` via `pricingLineAnchor()`, so the card answers "what is
 * this and what does it cost" and hands the visitor straight to the price and
 * the inclusions. The former second CTA to `#proyectos` is gone — see
 * `ServicesDictionary`'s doc comment for why.
 *
 * ---
 *
 * **The expanding accordion (green restyle).** This replaces a static
 * four-column grid of equal cards with the reference direction's horizontal
 * accordion: narrow cards whose titles run vertically, one of which widens
 * on pointer or keyboard focus to reveal its description and its CTA.
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
 *   tabbing into a collapsed card's link opens it. `focus-within` is not an
 *   extra — without it the CTA inside a collapsed card would be focusable
 *   but invisible, which is a WCAG 2.4.11 failure, not a styling preference.
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
 * **`writing-mode: sideways-lr`**, and the choice is load-bearing enough to
 * be worth stating exactly. Three candidate values differ in two independent
 * ways — which way the glyphs turn, and which way the lines stack:
 *
 * - `sideways-lr` — glyphs rotate counter-clockwise, text reads
 *   **bottom-to-top**, lines stack **left-to-right**.
 * - `vertical-lr` — glyphs rotate clockwise, text reads top-to-bottom, lines
 *   stack left-to-right.
 * - `vertical-rl` — glyphs rotate clockwise, text reads top-to-bottom, lines
 *   stack right-to-left.
 *
 * The reference reads bottom-to-top (its "W" of "Webflow" sits at the BOTTOM
 * of the card) with "Webflow" in the left column and "Development" in the
 * right — so only `sideways-lr` matches on both axes. A previous revision of
 * this file switched to `vertical-lr` on a misreading of a low-resolution
 * screenshot; it was wrong, and this is the correction.
 *
 * **Centred, not top-aligned.** `text-center` centres each line along the
 * inline axis — which is the VERTICAL axis under this writing mode, so it
 * centres the title top-to-bottom inside the card. `justify-center` on the
 * flex row centres it left-to-right. The second one is doing double duty: it
 * only reads as "centred" while the card is collapsed, because the reveal
 * panel next to the title is `0` wide then. As the panel opens it takes its
 * share of the row and pushes the title left on its own — the same shift the
 * reference makes between its collapsed and open cards, with no separate
 * open-state alignment rule to keep in sync.
 *
 * ---
 *
 * **The illustration band.** The image is a row of the card's own flex
 * column, below the text, rather than an absolutely-positioned sibling
 * floating behind it. The absolute version collided with the vertical title
 * at every width — the title needs the full text column's height and the
 * image needed the same space — and no `left-*` offset fixed it for all four
 * titles at once, because they are four different lengths. Flow layout has
 * no such conflict: the text row takes what is left after the band's fixed
 * height, so the two can never overlap however long a title gets.
 *
 * The band is edge-to-edge (`-mx-6 lg:-mx-8 -mb-6 lg:-mb-8` cancel the
 * card's padding) and the drawing is `object-cover object-top`, so a narrow
 * collapsed card crops it and a wide open one shows more — the reference
 * direction's cropped-screenshot effect, kept, but now driven by the card's
 * own `overflow-hidden` instead of a negative offset.
 */
export function Services({ locale }: { locale: Locale }) {
  const { services } = getDictionary(locale);
  const cards = toServiceCards(locale);

  return (
    <section id="servicios" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="reveal mx-auto max-w-3xl text-center text-4xl md:text-6xl">
          {services.heading}
        </h2>

        {/* `h-[38rem]`, taller than the `30rem` the accordion shipped with.
            The title's inline axis IS the card's height under `sideways-lr`,
            so the card's height is what caps how many vertical lines a name
            wraps to. At the reference's own type size, the longest name
            ("Landing pages y sitios corporativos" — nearly double the
            reference's longest) needs this much run to stay at three lines
            instead of four. */}
        <div className="mt-14 flex flex-col gap-4 lg:h-[38rem] lg:flex-row lg:items-stretch">
          {cards.map((card, index) => (
            <article
              key={card.line}
              style={{ animationDelay: `${index * 80}ms` }}
              className="reveal group flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 transition-[flex-grow] duration-500 ease-out lg:flex-1 lg:p-8 lg:hover:flex-[2.4] lg:focus-within:flex-[2.4]"
            >
              {/* `min-h-0` lets this row give up height to the band below it
                  instead of growing past the card and being clipped. */}
              {/* `lg:gap-0`, and the separation between title and panel lives
                  as `ps-6` INSIDE the panel instead. A flex `gap` is laid out
                  even when the item after it is zero-wide, so `gap-6` next to
                  a collapsed (`0fr`) panel made `justify-center` centre
                  "title + 24px of nothing" — the title sat 12px left of the
                  card's centre in every collapsed card. Padding carried by
                  the panel is clipped along with it, so it costs nothing
                  while closed and still spaces the two apart once open. */}
              <div className="flex min-h-0 flex-1 flex-col gap-5 lg:flex-row lg:justify-center lg:gap-0">
                {/* Dimmed while collapsed and full-strength on open, the
                    same emphasis shift the reference direction uses to say
                    which card is active. `/70` against `--card` measures
                    well clear of AA for text this size. */}
                <h3 className="shrink-0 text-2xl text-card-foreground transition-colors lg:max-h-full lg:text-center lg:text-3xl lg:text-card-foreground/70 lg:[writing-mode:sideways-lr] lg:group-hover:text-card-foreground lg:group-focus-within:text-card-foreground xl:text-4xl">
                  {card.name}
                </h3>

                {/*
                  `0fr` -> `1fr` on a grid column is the reveal. The inner
                  `min-w-0 overflow-hidden` is what makes it clip rather than
                  overflow, and the `w-72` inside keeps the paragraph from
                  reflowing word by word while the column animates.

                  `max-w-full` is not decoration on that `w-72` — it is the
                  bound that keeps the width a PREFERENCE rather than a
                  promise. `overflow-hidden` clips whatever the fixed width
                  overshoots by, and it clips mid-word, silently: with the
                  title at the reference's type size the widest name takes
                  four vertical lines, which leaves under 288px beside it in
                  an open card and cut the description off mid-sentence.
                  Capping at the column's real width costs a reflow only in
                  the cases that would otherwise have lost text.
                */}
                <div className="grid grid-cols-[1fr] transition-[grid-template-columns] duration-500 ease-out lg:grid-cols-[0fr] lg:group-hover:grid-cols-[1fr] lg:group-focus-within:grid-cols-[1fr]">
                  <div className="min-w-0 overflow-hidden">
                    <div className="flex flex-col gap-4 lg:w-72 lg:max-w-full lg:ps-6">
                      <p className="text-base text-muted-foreground">
                        {card.description}
                      </p>
                      {/* `items-start`: the link is a flex child of a
                          stretched column, so without it the underline ran
                          the full 288px of the revealed panel instead of the
                          width of its own label. */}
                      <div className="flex flex-col items-start">
                        <Link
                          href={pricingLineAnchor(locale, card.line)}
                          className="text-sm font-semibold text-accent-signal underline underline-offset-4"
                        >
                          {services.pricingCta}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mt-6 -mx-6 -mb-6 h-40 shrink-0 border-t border-border/60 lg:mt-8 lg:-mx-8 lg:-mb-8 lg:h-44">
                <Image
                  src={card.illustration.asset}
                  alt={card.illustration.alt[locale]}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
