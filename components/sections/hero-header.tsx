import Link from "next/link";
import type { Route } from "next";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { getDictionary } from "@/lib/dictionaries";
import { landingAnchor } from "@/lib/links";
import type { Locale } from "@/lib/content/locales";

/**
 * Server Component: renders the hero's title/subtitle/CTAs from the active
 * locale's dictionary — landing section 1 in full, composed directly by
 * `app/[locale]/page.tsx`.
 *
 * It used to be a `header` slot passed into `HeroParallax` (design.md D5,
 * task 2.15), which wrapped it in a scroll-linked track of client
 * screenshots. That track moved to section 4 as a marquee and the wrapper was
 * deleted; this component needed no changes to stand on its own, because it
 * already sized itself to the first screen. See `app/[locale]/page.tsx` and
 * `components/sections/portfolio.tsx`.
 *
 * The heading renders through `TextGenerateEffect`
 * (`components/ui/text-generate-effect.tsx`, a Server Component) — the
 * hero's one orchestrated entrance, a staggered word-by-word reveal. It was
 * briefly a client component that hid each word behind `opacity-0` until a
 * `useEffect` ran, which left this heading — the site's primary heading and
 * its LCP element — invisible without JavaScript (verify-report-final.md,
 * C5). It is now CSS-driven and renders entirely on the server.
 *
 * ---
 *
 * **Green restyle.** Three changes, all following the reference direction:
 *
 * 1. **Centred, not left-weighted.** The previous editorial composition was
 *    deliberately asymmetric. This one is a centred column with the subtitle
 *    constrained to `max-w-2xl` so the measure stays readable while the
 *    heading itself runs wide.
 *
 * 2. **One accented word.** `hero.heading` is now `{ lead, accent }` rather
 *    than a two-line tuple, and the accent renders in `--accent-signal` —
 *    verified at 4.89:1 against `--background`, so it clears AA as normal
 *    text and not merely as the large text it happens to be here. The two
 *    `TextGenerateEffect` instances continue one sweep rather than restarting
 *    it: the accent's `startDelaySeconds` is the lead's word count times the
 *    stagger, so the heading reads as a single gesture that lands on the
 *    coloured word.
 *
 * 3. **Two CTAs, filled + outline.** The single `HoverBorderGradient` button
 *    is replaced by the reference direction's pair. The filled one is the
 *    conversion path (`#brief`), the outline one the proof path
 *    (`#proyectos`) — the previous sole CTA, kept rather than dropped.
 *
 * ---
 *
 * **Fits the first screen, on every device.** The hero used to overflow the
 * viewport: `HeroParallax`'s own `py-20` stacked on this component's
 * `py-20 md:py-32` put ~208px of padding above the `<h1>`, and the heading
 * then ran at a fixed `lg:text-8xl` (96px) that broke to three lines in
 * Spanish. Measured on a 1920x1020 window, the subtitle's first line landed
 * at y=975 against a 1020px fold — the description was cut in half and both
 * CTAs were below it entirely.
 *
 * Two mechanisms replace the fixed scale, and they do different jobs:
 *
 * 1. **`min-h` locks the composition to the fold.** `100svh` (small viewport
 *    height) rather than `100vh`, so a mobile browser's retractable URL bar
 *    cannot make the block taller than the screen it is measured against.
 *    The subtracted constant is the site chrome above this block —
 *    `AnnouncementBanner` plus the sticky `SiteHeader`, which are rendered by
 *    `app/[locale]/layout.tsx` and so cannot be measured from here without
 *    client JS. Below `sm` both wrap to extra rows (see those components'
 *    comments on why they wrap rather than collapse), which is why the
 *    mobile constant is the larger one.
 *
 *    **Both constants UNDERSTATE the real chrome, deliberately.** Measured at
 *    1920x1020 the chrome is 118px against the 104px subtracted here, so this
 *    block overshoots the fold by ~14px instead of stopping short of it.
 *    Erring long costs a few pixels of vertical centring; erring short leaves
 *    the next section peeking above the fold. Do not "correct" these to the
 *    measured chrome height.
 *
 * 2. **`clamp()` on the heading is what actually guarantees the fit.** The
 *    preferred term is `min(7.5vw, 9svh)`, so the heading shrinks on a
 *    viewport that is short as well as one that is narrow. A breakpoint
 *    scale cannot do this: `lg:text-8xl` fires on a 1440x600 laptop window
 *    and on a 1440x1200 monitor identically, and the first is exactly the
 *    case that overflowed. The `svh` term is also what keeps a phone in
 *    landscape (844x390) readable, where every width breakpoint says
 *    "desktop" and the height says otherwise.
 *
 * **The `z-10 bg-background` opaque panel is gone**, and the deletion is the
 * point rather than a tidy-up. It existed for one reason: `HeroParallax`'s
 * products track sat below this block in flow but was lifted upward by its
 * own entrance transform, and — being transformed — established a stacking
 * context that painted OVER this `position: relative` block. Measured on a
 * 375x667 phone, a rotated client screenshot showed straight through the
 * secondary CTA's opaque `bg-card`. With the track moved into section 4 as a
 * marquee there is nothing left to mask, and a hero that had to hide the
 * element directly beneath it was the symptom this change set out to remove.
 *
 * **On both anchor casts.** `landingAnchor()` returns a plain `string` by
 * contract (`lib/links.ts`), so `typedRoutes` cannot verify these
 * structurally. Neither cast has a compensating build-time control:
 * `lib/content/invariants.ts`'s `checkNoSelfReferentialLinks` and
 * `checkInternalLinksResolve` both only inspect `toShowcaseTiles()` output and
 * never see this component's hrefs. Both targets are safe TODAY because
 * `components/sections/portfolio.tsx` carries `id="proyectos"` and
 * `components/sections/brief.tsx` carries `id="brief"` — verified by reading
 * those files, not by any gate. See `sdd/dev-services-website/
 * verify-report.md` finding W1.
 */
export function HeroHeader({ locale }: { locale: Locale }) {
  const { hero } = getDictionary(locale);

  return (
    <div className="flex min-h-[calc(100svh_-_11rem)] w-full flex-col justify-center py-[clamp(1.5rem,5svh,3.5rem)] sm:min-h-[calc(100svh_-_6.5rem)]">
      <div className="mx-auto w-full max-w-5xl px-4 text-center">
        <h1 className="text-[clamp(2.25rem,min(7.5vw,9svh),6rem)] leading-[1.05] text-foreground">
          <TextGenerateEffect words={hero.heading.lead} />{" "}
          <TextGenerateEffect
            words={hero.heading.accent}
            className="text-accent-signal"
            startDelaySeconds={hero.heading.lead.split(" ").length * 0.12}
          />
        </h1>
        {/*
          `leading-relaxed` is not decorative here: an arbitrary `text-[...]`
          sets font-size ALONE, so without it this paragraph would inherit the
          cascade's line-height instead of the one a `text-base`/`text-lg`
          utility would have bundled with the size.
        */}
        <p className="mx-auto mt-[clamp(0.75rem,3svh,1.5rem)] max-w-2xl text-[clamp(0.9375rem,min(1.9vw,2.2svh),1.125rem)] leading-relaxed text-muted-foreground">
          {hero.subtitle}
        </p>
        <div className="mt-[clamp(1rem,4svh,2rem)] flex flex-wrap items-center justify-center gap-3">
          <Link
            href={landingAnchor(locale, "brief") as Route}
            className="inline-flex rounded-full bg-accent-signal px-7 py-3.5 text-base font-semibold text-accent-signal-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-signal"
          >
            {hero.primaryCta}
          </Link>
          <Link
            href={landingAnchor(locale, "proyectos") as Route}
            className="inline-flex rounded-full border border-foreground/20 bg-card px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:border-foreground/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-signal"
          >
            {hero.secondaryCta}
          </Link>
        </div>
      </div>
    </div>
  );
}
