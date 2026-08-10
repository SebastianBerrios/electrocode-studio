import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { isExternalHref } from "@/lib/links";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/content/locales";
import type { ShowcaseTile } from "@/lib/content/projections";

/**
 * Server Component: one continuously scrolling row of project screenshots.
 * `components/sections/portfolio.tsx` stacks two of these in opposing
 * directions — the Proyectos section's whole visual, replacing the static
 * three-column card grid.
 *
 * **CSS, not `motion`, and that is the load-bearing decision here.** The
 * component this replaces (`components/ui/hero-parallax.tsx`, deleted with
 * this change) was a Client Component driving `useScroll`/`useSpring` per
 * card. A marquee needs none of that: the motion is a single
 * constant-velocity translation with no input, so `@keyframes` in
 * `app/globals.css` expresses it exactly. Three things follow, all wins:
 *
 * 1. Zero JavaScript ships for this section, and the tiles are in the static
 *    HTML rather than assembled on the client.
 * 2. The site-wide `prefers-reduced-motion` override in `app/globals.css`
 *    reaches it. A `MotionValue` is applied as an inline style, which no media
 *    query can touch — which is why `hero-parallax.tsx` had to call
 *    `useReducedMotion()` itself. The marquee's own reduced-motion rule does
 *    better than merely stopping: it turns the row into a normal
 *    horizontally-scrollable strip, so the content stays fully reachable
 *    rather than frozen with half of it off-screen.
 * 3. Pausing on hover and on focus is two CSS rules, not state.
 *
 * **Why each row renders its tiles four times.** A marquee is seamless only
 * while some copy of the track covers the viewport at every instant. The
 * animation translates one track by exactly its own width plus the gap, so at
 * the end of a cycle the SECOND track sits where the first began — meaning
 * each individual track must be at least as wide as the widest viewport, or a
 * blank strip appears at the trailing edge just before the loop restarts. The
 * curated set is 4 tiles (~1736px at the desktop tile width), narrower than a
 * 1920px display, so each track repeats the set twice and there are two
 * tracks. Do not reduce this to one copy per track without re-checking that
 * arithmetic against the tile count at the time.
 *
 * **Exactly one copy of each project is announced.** See `TileRun` — every
 * repeat, and every tile in a `decorative` row, is inside an `aria-hidden`
 * subtree and carries `tabIndex={-1}`, so assistive tech meets each project
 * once and the keyboard tabs through four links rather than sixteen. The
 * repeats stay mouse-clickable: hiding them from AT is about not repeating
 * announcements, not about making two thirds of a visibly identical row
 * behave differently under the pointer.
 */
export function ProjectMarquee({
  tiles,
  locale,
  direction,
  durationSeconds,
  decorative = false,
}: {
  tiles: readonly ShowcaseTile[];
  locale: Locale;
  /** `"left"` scrolls tiles toward the start of the row, `"right"` away. */
  direction: "left" | "right";
  /** One full cycle. Longer is slower; stacked rows deliberately differ. */
  durationSeconds: number;
  /**
   * Set on every row after the first that shows the SAME projects. The row
   * still renders and still clicks; it is simply not announced or tabbed
   * through a second time.
   */
  decorative?: boolean;
}) {
  return (
    <div
      className="marquee relative flex w-full gap-6 overflow-hidden"
      style={{ "--marquee-duration": `${durationSeconds}s` } as CSSProperties}
      aria-hidden={decorative || undefined}
    >
      <MarqueeTrack direction={direction}>
        <TileRun tiles={tiles} locale={locale} announced={!decorative} />
        <TileRun tiles={tiles} locale={locale} announced={false} />
      </MarqueeTrack>
      <MarqueeTrack direction={direction} aria-hidden={!decorative || undefined}>
        <TileRun tiles={tiles} locale={locale} announced={false} />
        <TileRun tiles={tiles} locale={locale} announced={false} />
      </MarqueeTrack>
    </div>
  );
}

function MarqueeTrack({
  direction,
  children,
  ...rest
}: {
  direction: "left" | "right";
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "marquee-track flex shrink-0 gap-6",
        direction === "right" && "marquee-track-reverse",
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * One pass over the tile set.
 *
 * A run that is not `announced` is wrapped in an `aria-hidden` element rather
 * than putting `aria-hidden` on each tile, so the whole subtree — images, alt
 * text, labels — leaves the accessibility tree in one move. `display: contents`
 * is what keeps that wrapper out of the layout: the tiles stay direct flex
 * items of the track, so the wrapper does not become a single unbreakable
 * block that the `gap` would space wrongly.
 *
 * The tiles inside also get `tabIndex={-1}` (see `ShowcaseTileCard`). Both
 * halves are required together: `aria-hidden` around a focusable element is
 * itself an accessibility defect, because a keyboard user can land on
 * something a screen reader refuses to describe.
 */
function TileRun({
  tiles,
  locale,
  announced,
}: {
  tiles: readonly ShowcaseTile[];
  locale: Locale;
  announced: boolean;
}) {
  const run = tiles.map((tile) => (
    <ShowcaseTileCard
      key={tile.slug}
      tile={tile}
      locale={locale}
      announced={announced}
    />
  ));

  if (announced) return <>{run}</>;

  return (
    <div className="contents" aria-hidden>
      {run}
    </div>
  );
}

/**
 * One tile: the screenshot, the project's label over a scrim, and — for the
 * evidence states that require it — a caveat chip.
 *
 * **The chip is a spec obligation, not decoration.**
 * `specs/project-portfolio/spec.md`'s "Evidence State Rendering" requires
 * `gated` to render "an explicit note that the product sits behind a login"
 * and `not-deployed` a note that no public deployment exists. The grid
 * satisfied that with two paragraphs under the screenshot
 * (`components/portfolio/evidence.tsx`); a tile in a moving row cannot carry a
 * paragraph, so the caveat becomes a chip pinned to the image it qualifies,
 * and the project's own full `evidence.disclosure` line stays on the case
 * study the tile links to. What must never happen is the screenshot
 * travelling without its caveat — a sanitized internal dashboard shown bare
 * reads as a public product.
 *
 * **Non-link tiles must not look clickable** — the same rule
 * `components/portfolio/project-card.tsx` follows, for the same reason: a
 * project with neither a live site nor a published case study has no honest
 * destination, so it gets no hover affordance and no pointer cursor.
 */
function ShowcaseTileCard({
  tile,
  locale,
  announced,
}: {
  tile: ShowcaseTile;
  locale: Locale;
  announced: boolean;
}) {
  const { portfolio } = getDictionary(locale);
  const caveatLabel =
    tile.caveat === "gated"
      ? portfolio.gatedBadge
      : tile.caveat === "not-deployed"
        ? portfolio.notDeployedBadge
        : undefined;

  const body = (
    <>
      <Image
        src={tile.image}
        // A repeat is a visual duplicate of a tile already described by the
        // announced copy, so it carries an empty `alt` instead of repeating
        // the same sentence four times.
        alt={announced ? tile.alt : ""}
        placeholder="blur"
        sizes="(min-width: 768px) 26rem, 18rem"
        className="h-full w-full object-cover object-top"
      />
      {/*
        The scrim is weighted low and steep — 95% at the bottom edge, still
        50% a third of the way up — rather than the gentle fade a decorative
        overlay would use. It is doing contrast work, not mood: the tiles show
        real client screenshots, several of which are near-white dashboards,
        and a title in `text-background` over one of those is unreadable
        without it. A two-line title on a narrow viewport is the case that
        sets the `via` stop; a fade that only darkens the last few pixels
        leaves the first line stranded over the image.
      */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/50 via-30% to-transparent" />
      {caveatLabel !== undefined && (
        <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm">
          {caveatLabel}
        </span>
      )}
      <span className="absolute inset-x-4 bottom-4 line-clamp-2 font-display text-base font-medium text-background md:text-lg">
        {tile.title}
      </span>
    </>
  );

  const className = cn(
    "relative block h-56 w-72 shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:h-72 md:w-104",
    tile.link !== undefined
      ? "transition-shadow hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-signal"
      : "cursor-default",
  );

  if (tile.link === undefined) {
    return <div className={className}>{body}</div>;
  }

  // See `TileRun`: a repeat lives inside an `aria-hidden` subtree, so it must
  // also be unreachable by keyboard.
  const tabIndex = announced ? undefined : -1;

  return isExternalHref(tile.link) ? (
    <a
      href={tile.link}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={tabIndex}
      className={className}
    >
      {body}
    </a>
  ) : (
    // `tile.link` is `string` because it holds either an external URL or an
    // internal route and no single `Route` type covers both, so `typedRoutes`
    // cannot verify it here. `lib/content/invariants.ts`'s
    // `checkInternalLinksResolve` is the compensating build-time control — it
    // walks this exact projection and fails the build on a link whose target
    // does not exist.
    <Link href={tile.link as Route} tabIndex={tabIndex} className={className}>
      {body}
    </Link>
  );
}
