import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import {
  ArrowRight,
  BadgeCheck,
  CircleDollarSign,
  Handshake,
  ListChecks,
  RefreshCw,
  Unlock,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import { PROCESS } from "@/lib/content/process";
import { WAY_OF_WORKING_ILLUSTRATIONS } from "@/lib/content/way-of-working-illustrations";
import { getDictionary } from "@/lib/dictionaries";
import { landingAnchor } from "@/lib/links";
import { cn } from "@/lib/utils";
import type { MediaAsset } from "@/lib/content/types";
import type { Locale } from "@/lib/content/locales";

/**
 * Server Component: landing section 3b, "Cómo trabajamos" — the studio's six
 * published commitments, laid out as the reference direction's bento grid.
 *
 * **Why this section is allowed to exist here at all.** The reference site's
 * equivalent block sits inside a run of sections built on social proof
 * (testimonial carousel, client-logo strip, review badge). None of those
 * were reproduced: this repo holds zero testimonials, and its content model
 * actively resists inventing them — `lib/content/authority.ts`'s type has no
 * field for a student, course, or review count precisely so the academy
 * block cannot claim scale. A six-card grid of *the studio's own published
 * commitments* is the one card in that run whose content this repo actually
 * has, so it is the one that got built.
 *
 * **Every card is traceable to data, not to copywriting.** See
 * `WayOfWorkingDictionary`'s doc comment for the key-by-key provenance. The
 * revision-rounds card renders `PROCESS.revisionRoundsIncluded` rather than
 * spelling the figure into the dictionary, so it cannot drift away from what
 * `components/sections/process.tsx` states two sections above it.
 *
 * The icons are decorative only (`aria-hidden`): each sits beside a real
 * `<h3>` that already names the card, so announcing them would be noise.
 *
 * ---
 *
 * **The bento (green restyle).** This replaces six identical cards in a 3×2
 * grid with cells of three different widths, one inverted card, three
 * illustrated cards and a CTA cell — the reference direction's masonry.
 *
 * The uniform grid was the problem worth fixing, not a style that had gone
 * stale: six equal boxes give every commitment the same weight, so the eye
 * has no entry point and reads none of them. The bento makes two commitments
 * large, one dark, and lets the rest sit quiet.
 *
 * **How the cells are placed, and why only one of them is explicit.** The six
 * cards are auto-flowed in reading order; only the CTA carries a position
 * (`lg:col-start-3 lg:row-start-2`). CSS Grid places definite items before
 * auto-flowed ones, so reserving that single cell is enough to shape the
 * whole grid — the two remaining cards flow around it into the arrangement
 * below, with no second explicit coordinate to keep in sync:
 *
 *     ┌───────────────────────┬───────────┐
 *     │ Precio publicado (×2) │ Sin inter.│  ← self-start: leaves air below
 *     ├───────────┬───────────┼───────────┤
 *     │ Avanzas   │ Rondas de │ CTA       │  ← the one explicit cell
 *     │ (ink)     │ revisión  │           │
 *     ├───────────┼───────────┴───────────┤
 *     │ Alcance   │ Sin permanencia  (×2) │
 *     └───────────┴───────────────────────┘
 *
 * `lg:self-start` on the "Sin intermediarios" card and on the CTA is what
 * makes this read as masonry rather than as a table: both stop stretching to
 * their row's height, so the third column breathes instead of matching the
 * tall illustrated cards beside it. Nothing else in the layout is a fixed
 * height, so the rows still size themselves to their content.
 *
 * **Below `lg` the whole thing is a plain stack (one column, two at `sm`).**
 * Every span, position and `self-start` above is `lg:`-prefixed, so the
 * stacked layout is the default and the bento is the enhancement. There is no
 * masonry to preserve on a phone: at one column wide, "large cell" means
 * nothing.
 *
 * **The ink card uses `--primary`, not the dark `--nav` pair.** `--nav` is
 * dark green in both themes, which would make this card *invisible* under
 * `.dark` — it is within 0.02 L of `--card` there. `--primary` inverts with
 * the theme (ink card on light, bright card on dark), which keeps it the
 * highest-contrast surface in the section either way, which is the entire job
 * the card has.
 *
 * **The heading stays centred**, unlike the reference's left-aligned one.
 * Commit ce6d5e5 centred every section heading on the page axis on purpose;
 * left-aligning this one alone would read as a broken section rather than as
 * a borrowed style. What was taken from the reference's heading block is the
 * part that does not fight that decision: the eyebrow above it and the single
 * accented word inside it.
 */
type Card = {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly body: string;
  /**
   * Only the bento's large cells carry one — see
   * `lib/content/way-of-working-illustrations.ts` for why three and not six.
   */
  readonly illustration?: MediaAsset;
  /** The one inverted card. */
  readonly ink?: boolean;
  /** Which side of the text the drawing sits on at `lg`+, if not below it. */
  readonly aside?: "start" | "end";
  /** Grid placement for this cell at `lg`+. */
  readonly cell?: string;
};

export function WayOfWorking({ locale }: { locale: Locale }) {
  const { wayOfWorking } = getDictionary(locale);

  const cards: readonly Card[] = [
    {
      icon: CircleDollarSign,
      ...wayOfWorking.publishedPrice,
      illustration: WAY_OF_WORKING_ILLUSTRATIONS.publishedPrice,
      aside: "start",
      cell: "lg:col-span-2",
    },
    {
      icon: UserRoundCheck,
      ...wayOfWorking.noMiddlemen,
      cell: "lg:self-start",
    },
    { icon: BadgeCheck, ...wayOfWorking.approvalGates, ink: true },
    {
      icon: RefreshCw,
      title: wayOfWorking.revisionRounds.title,
      body: `${wayOfWorking.revisionRounds.bodyPrefix} ${PROCESS.revisionRoundsIncluded} ${wayOfWorking.revisionRounds.bodySuffix}`,
      illustration: WAY_OF_WORKING_ILLUSTRATIONS.revisionRounds,
    },
    { icon: ListChecks, ...wayOfWorking.itemizedScope },
    {
      icon: Unlock,
      ...wayOfWorking.noLockIn,
      illustration: WAY_OF_WORKING_ILLUSTRATIONS.noLockIn,
      aside: "end",
      cell: "lg:col-span-2",
    },
  ];

  return (
    <section id="como-trabajamos" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="reveal mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-accent-signal">
            <Handshake aria-hidden="true" className="size-4" />
            {wayOfWorking.eyebrow}
          </p>
          <h2 className="mt-4 text-4xl md:text-6xl">
            {wayOfWorking.heading.lead}{" "}
            <span className="text-accent-signal">
              {wayOfWorking.heading.accent}
            </span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
            {wayOfWorking.intro}
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <article
              key={card.title}
              style={{ animationDelay: `${index * 70}ms` }}
              className={cn(
                "reveal flex flex-col overflow-hidden rounded-3xl border transition-colors",
                card.ink
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-foreground/30",
                /* `flex-row-reverse` puts the drawing on the left while the
                   text stays first in the DOM — reading order is unaffected
                   by which side the picture landed on. */
                card.aside === "end" && "lg:flex-row lg:items-stretch",
                card.aside === "start" &&
                  "lg:flex-row-reverse lg:items-stretch",
                card.cell,
              )}
            >
              <div className="flex flex-1 flex-col gap-4 p-7">
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-2xl",
                    card.ink
                      ? "bg-primary-foreground/15 text-primary-foreground"
                      : "bg-accent text-accent-signal",
                  )}
                >
                  <card.icon aria-hidden="true" className="size-5" />
                </span>
                <h3
                  className={cn(
                    "text-lg",
                    card.ink ? "text-primary-foreground" : "text-card-foreground",
                  )}
                >
                  {card.title}
                </h3>
                <p
                  className={cn(
                    "text-sm",
                    card.ink
                      ? "text-primary-foreground/75"
                      : "text-muted-foreground",
                  )}
                >
                  {card.body}
                </p>
              </div>

              {card.illustration && (
                /* `h-52` on the stacked/banded case is not a round number: the
                   drawings are 640×400 and `object-cover` crops whatever the
                   container's ratio does not use. At `h-44` a one-column cell
                   is ~2.3:1 and cut through the artwork; `h-52` keeps the crop
                   inside each drawing's own margin. */
                <div
                  className={cn(
                    "relative shrink-0",
                    card.aside
                      ? "h-52 lg:h-auto lg:min-h-64 lg:w-1/2"
                      : "h-52",
                  )}
                >
                  <Image
                    src={card.illustration.asset}
                    alt={card.illustration.alt[locale]}
                    fill
                    sizes={
                      card.aside
                        ? "(min-width: 1024px) 42vw, 100vw"
                        : "(min-width: 1024px) 32vw, 100vw"
                    }
                    className="object-cover"
                  />
                </div>
              )}
            </article>
          ))}

          {/* Last in the DOM so the six commitments stay contiguous for a
              screen reader, but placed into the grid's middle row at `lg` —
              see the doc comment above for why this one explicit position is
              enough to shape the whole bento. */}
          <Link
            href={landingAnchor(locale, "brief") as Route}
            style={{ animationDelay: `${cards.length * 70}ms` }}
            className="reveal group flex flex-col justify-between gap-10 rounded-3xl bg-accent-signal p-7 text-accent-signal-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-signal lg:col-start-3 lg:row-start-2 lg:self-start"
          >
            <span className="text-lg font-semibold">
              {wayOfWorking.ctaLabel}
            </span>
            <ArrowRight
              aria-hidden="true"
              className="size-5 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
