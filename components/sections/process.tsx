import { Code2, FileText, PenTool, Rocket, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";
import { PROCESS, type ProcessPhaseId } from "@/lib/content/process";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/content/locales";

/**
 * Server Component: landing section 3, "Proceso" — task 3.2.
 *
 * Renders `PROCESS.phases` (`lib/content/process.ts`) as a fixed, ordered
 * five-step sequence.
 *
 * **`requiresApproval` is no longer rendered per phase.** Until now each gated
 * phase carried a "Requiere tu aprobación para avanzar" badge here. Three
 * identical badges in a five-column row read as three buttons, and repeating
 * one sentence three times spent the row's visual weight on the least
 * informative thing in it. The commitment itself is not dropped from the site,
 * which is the only reason removing it is safe: the "Avanzas cuando apruebas"
 * card in `components/sections/way-of-working.tsx` states it in full, and this
 * section's own approval-deadline paragraph below still names the act of
 * approving a pending phase. The flag stays in `lib/content/process.ts` — it
 * is a domain fact about the engagement, not a rendering detail, and dropping
 * it there would lose the data, not just the badge.
 *
 * `ProcessDictionary.approvalBadge` (`lib/dictionaries/types.ts`) consequently
 * has no consumer left. It is deliberately not deleted in the same pass: it is
 * a required key of a shared dictionary type, so removing it is a change to
 * that contract rather than to this component, and it belongs to whoever
 * decides the badge is gone for good rather than parked.
 *
 * `PROCESS.revisionRoundsIncluded` is read from the data module, not
 * hardcoded — see that module's doc comment for why this is the concrete
 * value that satisfies `specs/landing-narrative/spec.md`'s "Proceso Section
 * Contract" data-driven mechanism, and why a client-facing response-time
 * commitment is deliberately absent rather than invented.
 *
 * No link/CTA in this section: nothing in the studio's approved content for
 * this batch has a live target to point at from here.
 *
 * Copy voice: first-person-plural studio voice ("Diseñamos…", "Construimos…"),
 * matching `lib/dictionaries/es.ts`'s existing hero copy. No "nuestro
 * equipo"/"nuestros diseñadores" phrasing — the studio is solo-operated and
 * this section earns its "studio" positioning through structure (the
 * five-phase, approval-gated sequence itself), never through implied
 * headcount (design.md §4.4 / landing-narrative spec's "Copy Voice
 * Constraint").
 *
 * **Approval-deadline addition**: renders
 * `PROCESS.clientApprovalDeadlineBusinessDays` and its pause/recalculation
 * consequence — stated up front, not raised later as a complaint.
 *
 * ---
 *
 * **The winding path (green restyle).** This replaces the sticky-scroll list
 * (`components/ui/sticky-scroll-reveal.tsx`, now deleted — it had no other
 * consumer) with the reference direction's journey line: a single curve
 * crossing the section, with one circled marker per phase alternating above
 * and below it.
 *
 * **No client boundary, no `motion`.** The previous list needed one: its
 * activation was driven by `useScroll` on an internal scroll container. This
 * layout has no scroll-linked state at all, so the section returns to being a
 * plain Server Component — the same trade design.md D10 already made for the
 * FAQ and for the Servicios accordion. Nothing here ships JavaScript.
 *
 * **All five phases stay readable at once**, which the sticky list could not
 * do: it showed one description at a time inside its own scroll container, so
 * four fifths of the sequence was unreadable at any given scroll position.
 * Here the whole five-step shape is legible in a single glance. That is the
 * reason for the change, not the curve itself.
 *
 * **How the curve and the markers stay aligned**, since they are two separate
 * layers (an SVG and absolutely-positioned HTML) and nothing enforces
 * agreement between them automatically:
 *
 * - The `<svg>` uses `preserveAspectRatio="none"` over a `1000 × 240` viewBox
 *   at a fixed `240px` rendered height. The x axis therefore stretches with
 *   the container while **the y axis is 1:1 with CSS pixels** — so a node at
 *   `y = 70` in the path sits at exactly `top: 70px` in the layout, at any
 *   viewport width. `NODE_Y_PX` is the single source both read.
 * - The x positions need no shared constant: the five markers are the five
 *   equal grid columns' own centres (`left-1/2`), and the path's x values are
 *   those same centres expressed in viewBox units (100, 300, 500, 700, 900 of
 *   1000). Resizing the section cannot desynchronise them.
 * - `vectorEffect="non-scaling-stroke"` keeps the line 1.5px thick despite the
 *   non-uniform scale; without it the stroke would thin or fatten with the
 *   viewport.
 *
 * **Below `lg` there is no curve.** A five-stop horizontal path has nowhere to
 * go on a phone, so the whole thing collapses to a vertical timeline: marker
 * and text side by side, connected by a plain 1px rule. The curve, the band's
 * reserved height and the absolute marker offsets are all `lg:`-prefixed, so
 * the stacked layout is the default and the path is the enhancement.
 *
 * The switch is at `lg`, not `md`, and that was measured rather than assumed:
 * five columns inside `md` (768px) are ~140px wide, which is narrower than the
 * word "Descubrimiento" sets at this type size — the titles overlapped their
 * neighbours. `lg` gives each column ~185px, which fits. This is the same
 * breakpoint, chosen for the same class of reason, as the Servicios accordion
 * in `components/sections/services.tsx`.
 *
 * The icons are `lucide-react` glyphs, not drawings from
 * `lib/content/service-illustrations.ts`: these mark positions along a
 * sequence, they do not depict a deliverable. They are `aria-hidden` — each
 * marker's meaning is already carried by the phase name and number next to
 * it, so announcing the icon would only repeat it.
 */

/**
 * Rendered height of the curve band, in CSS pixels, and the y coordinates of
 * the markers within it. These are viewBox units AND pixels at once — see the
 * doc comment above for why that identity holds and why it matters.
 */
const BAND_HEIGHT_PX = 240;
const NODE_Y_PX = { low: 170, high: 70 } as const;

/**
 * The path itself. Every segment is a cubic with horizontal tangents at both
 * ends (control points share their anchor's y), so the line arrives at each
 * marker flat rather than at an angle — the curve reads as a route with
 * stations on it instead of a zigzag. The leading and trailing straights run
 * to the viewBox edges so the path bleeds off both sides of the section.
 */
const CURVE_PATH = [
  `M 0 ${NODE_Y_PX.low}`,
  `L 100 ${NODE_Y_PX.low}`,
  `C 200 ${NODE_Y_PX.low} 200 ${NODE_Y_PX.high} 300 ${NODE_Y_PX.high}`,
  `C 400 ${NODE_Y_PX.high} 400 ${NODE_Y_PX.low} 500 ${NODE_Y_PX.low}`,
  `C 600 ${NODE_Y_PX.low} 600 ${NODE_Y_PX.high} 700 ${NODE_Y_PX.high}`,
  `C 800 ${NODE_Y_PX.high} 800 ${NODE_Y_PX.low} 900 ${NODE_Y_PX.low}`,
  `L 1000 ${NODE_Y_PX.low}`,
].join(" ");

/**
 * One icon per phase id. Keyed by `ProcessPhaseId` rather than by array
 * position, so a reordering of `PROCESS.phases` carries its icons with it, and
 * `Record` makes a new phase a type error here rather than a blank circle at
 * runtime. Lives in this component and not in `lib/content/**`: those modules
 * hold zero React imports by rule (design.md §5), and a Lucide glyph is a
 * component.
 */
const PHASE_ICONS: Record<ProcessPhaseId, LucideIcon> = {
  discovery: Search,
  proposal: FileText,
  design: PenTool,
  development: Code2,
  delivery: Rocket,
};

export function Process({ locale }: { locale: Locale }) {
  const { process } = getDictionary(locale);
  const {
    phases,
    revisionRoundsIncluded,
    clientApprovalDeadlineBusinessDays,
  } = PROCESS;

  return (
    <section id="proceso" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="reveal mx-auto max-w-3xl text-center font-display text-4xl md:text-6xl">
          {process.heading}
        </h2>

        {/* No row `gap`: on mobile the connector rule is a child of each item
            and can only reach that item's own bottom edge, so a row gap would
            break the timeline into visibly detached segments. The separation
            is carried by the text block's `pb-10` instead, which the rule
            stretches through. `lg:gap-x-4` is a column gap and does not
            reintroduce the problem. */}
        <ol className="relative mt-12 grid gap-y-0 lg:mt-16 lg:grid-cols-5 lg:gap-x-4">
          {/* Decorative: the sequence itself is carried by the ordered list
              and by each phase's own number, so the line adds no information
              a screen reader would otherwise miss. */}
          <svg
            aria-hidden="true"
            viewBox={`0 0 1000 ${BAND_HEIGHT_PX}`}
            preserveAspectRatio="none"
            fill="none"
            style={{ height: BAND_HEIGHT_PX }}
            className="pointer-events-none absolute inset-x-0 top-0 hidden w-full text-border lg:block"
          >
            <path
              d={CURVE_PATH}
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {phases.map((phase, index) => {
            const Icon = PHASE_ICONS[phase.id];
            const isLast = index === phases.length - 1;
            /* Odd stops (1st, 3rd, 5th) ride the low pass of the wave, even
               stops the high one — the alternation is what gives the path its
               shape, so it is derived from the position rather than stored. */
            const y = index % 2 === 0 ? NODE_Y_PX.low : NODE_Y_PX.high;

            return (
              <li
                key={phase.id}
                style={{ animationDelay: `${index * 80}ms` }}
                className="reveal relative flex gap-5 lg:flex-col lg:gap-0"
                /* `lg:pt-*` cannot be an arbitrary class here because the
                   value comes from `BAND_HEIGHT_PX`; an inline style would
                   apply at every width, including mobile, where there is no
                   band. The padding is therefore carried by an empty spacer
                   below instead. */
              >
                {/* Mobile rail: the marker plus the rule that joins it to the
                    next one. On `lg` the rule is gone and the marker leaves
                    the flow to sit on the curve. */}
                <div className="flex flex-col items-center lg:block">
                  <div
                    style={{ top: y }}
                    className={cn(
                      "flex size-16 shrink-0 items-center justify-center rounded-full border border-border bg-card text-accent-signal shadow-sm",
                      "lg:absolute lg:left-1/2 lg:size-20 lg:-translate-x-1/2 lg:-translate-y-1/2",
                    )}
                  >
                    <Icon aria-hidden="true" className="size-6 lg:size-7" />
                  </div>
                  {!isLast && (
                    <div className="w-px flex-1 bg-border lg:hidden" />
                  )}
                </div>

                {/* Reserves the band on `lg`+ so the text of every phase — high
                    marker or low — starts on one shared baseline. */}
                <div
                  aria-hidden="true"
                  style={{ height: BAND_HEIGHT_PX }}
                  className="hidden lg:block"
                />

                {/* `pb-10` is the mobile timeline's row spacing — the `<ol>`
                    carries no row gap on purpose, so the connector rule can
                    reach the next marker unbroken. `lg:flex-1` is gone with
                    the badge it existed to push to the bottom of the column. */}
                <div className="flex flex-col pb-10 lg:mt-6 lg:pb-0 lg:text-center">
                  <p className="text-sm tabular-nums text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  {/* `xl:`, not `lg:`, for the step up in size. At `lg` a
                      column is ~185px wide and "Descubrimiento" is a single
                      unbreakable word — at `text-2xl` it overflows its column
                      and collides with the next title. */}
                  <h3 className="mt-1 text-xl xl:text-2xl">
                    {phase.name[locale]}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {phase.description[locale]}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mx-auto mt-14 max-w-3xl text-center">
          <p className="text-sm text-muted-foreground">
            {revisionRoundsIncluded} {process.revisionsLabel}{" "}
            {process.revisionsExtra}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {process.approvalDeadlinePrefix} {clientApprovalDeadlineBusinessDays}{" "}
            {process.approvalDeadlineSuffix}
          </p>
        </div>
      </div>
    </section>
  );
}
