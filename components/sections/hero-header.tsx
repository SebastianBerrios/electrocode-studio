import Link from "next/link";
import type { Route } from "next";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { getDictionary } from "@/lib/dictionaries";
import { landingAnchor } from "@/lib/links";
import type { Locale } from "@/lib/content/locales";

/**
 * Server Component: renders the hero's title/subtitle/CTAs from the active
 * locale's dictionary, passed into `HeroParallax`'s `header` slot
 * (design.md D5, task 2.15). Keeps Spanish copy on the server and out of
 * the client bundle — `HeroParallax` itself stays ignorant of copy shape.
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
 * **On both anchor casts.** `landingAnchor()` returns a plain `string` by
 * contract (`lib/links.ts`), so `typedRoutes` cannot verify these
 * structurally. Neither cast has a compensating build-time control:
 * `lib/content/invariants.ts`'s `checkNoSelfReferentialLinks` and
 * `checkInternalLinksResolve` both only inspect `toHeroProducts()` output and
 * never see this component's hrefs. Both targets are safe TODAY because
 * `components/sections/portfolio.tsx` carries `id="proyectos"` and
 * `components/sections/brief.tsx` carries `id="brief"` — verified by reading
 * those files, not by any gate. See `sdd/dev-services-website/
 * verify-report.md` finding W1.
 */
export function HeroHeader({ locale }: { locale: Locale }) {
  const { hero } = getDictionary(locale);

  return (
    <div className="relative mx-auto w-full max-w-5xl px-4 py-20 text-center md:py-32">
      <h1 className="text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-7xl lg:text-8xl">
        <TextGenerateEffect words={hero.heading.lead} />{" "}
        <TextGenerateEffect
          words={hero.heading.accent}
          className="text-accent-signal"
          startDelaySeconds={hero.heading.lead.split(" ").length * 0.12}
        />
      </h1>
      <p className="mx-auto mt-8 max-w-2xl text-base text-muted-foreground md:text-lg">
        {hero.subtitle}
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
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
  );
}
