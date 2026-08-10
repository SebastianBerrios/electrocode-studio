import { toShowcaseTiles } from "@/lib/content/projections";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/content/locales";
import { ProjectMarquee } from "@/components/ui/project-marquee";

/**
 * Server Component: landing section 4, "Proyectos" — the curated project
 * showcase, now two continuously scrolling rows running in opposite
 * directions rather than a three-column card grid.
 *
 * **Owns the `#proyectos` anchor**, and is now the ONLY surface on the landing
 * that shows client work at all. Until this change the projects appeared
 * twice: here, and above the fold inside `HeroParallax`'s scroll-linked track
 * (`app/[locale]/page.tsx`). The hero showed the same four screenshots the
 * grid did, so a visitor met the portfolio before meeting the offer and then
 * met it again — the duplication cost the hero its focus and left the real
 * section reading as a repeat. The projects now appear exactly once, here, and
 * the hero is copy and CTAs only. `components/ui/hero-parallax.tsx` was
 * deleted with its last consumer, the same call made for
 * `components/ui/sticky-scroll-reveal.tsx` and `components/sections/
 * retainer.tsx`.
 *
 * **Two rows, opposing directions, four tiles.** With a curated set this size
 * a split of two tiles per row would loop a two-image row, so BOTH rows carry
 * the whole set and the second reverses the order as well as the direction —
 * the two rows never sit a matching pair above each other, which is what makes
 * counter-scrolling read as depth instead of as a mirror. The differing cycle
 * durations do the same job.
 *
 * **Full-bleed on purpose.** The heading stays inside the page measure; the
 * rows break out of it and run edge to edge, because a marquee constrained to
 * a centred column reads as a widget rather than as a band of work passing
 * through the page. The tiles being cut off by both viewport edges is the
 * point — it is what tells the visitor the row continues.
 *
 * **What the marquee cannot show.** `toShowcaseTiles()` filters out
 * `no-visual` projects: a tile IS a screenshot, and there is no honest way to
 * put a project with no consented capture in one (`specs/project-portfolio/
 * spec.md`, "`no-visual` degrades honestly"). The grid this replaced could
 * carry them as text-only cards, so that is a real, accepted loss — `fast-
 * route` no longer appears on the landing. It remains in `PROJECTS`, in the
 * curated set, and in every invariant; what it needs to come back is a
 * consented capture, not a code change. `lib/content/invariants.ts`'s
 * `checkShowcaseIsSubsetOfCuratedSet` fails the build if a project is ever
 * missing from the showcase for any other reason.
 *
 * **Link honesty**: `toShowcaseTiles(locale)` already resolves whether each
 * tile should be a link at all (`lib/content/projections.ts`'s
 * `portfolioLink()`) — this section renders whatever it receives without
 * second-guessing it.
 */
export function Portfolio({ locale }: { locale: Locale }) {
  const { portfolio } = getDictionary(locale);
  const tiles = toShowcaseTiles(locale);
  const reversedTiles = tiles.toReversed();

  return (
    <section id="proyectos" className="overflow-hidden py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="reveal mx-auto max-w-3xl text-center text-4xl md:text-6xl">
          {portfolio.heading}
        </h2>
      </div>
      <div className="reveal mt-12 flex flex-col gap-6" style={{ animationDelay: "120ms" }}>
        <ProjectMarquee
          tiles={tiles}
          locale={locale}
          direction="left"
          durationSeconds={64}
        />
        {/*
          `decorative`: this row shows the SAME four projects as the one above
          it, so announcing and tabbing through them twice would double the
          section for a screen-reader or keyboard user with nothing new in the
          second pass. It stays clickable for the pointer.
        */}
        <ProjectMarquee
          tiles={reversedTiles}
          locale={locale}
          direction="right"
          durationSeconds={78}
          decorative
        />
      </div>
    </section>
  );
}
