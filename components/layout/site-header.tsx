import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import logoMarkLight from "@/public/logo-mark-light.png";
import { WHATSAPP } from "@/lib/content/contact";
import { getDictionary } from "@/lib/dictionaries";
import { landingAnchor, pricingPath } from "@/lib/links";
import type { Locale } from "@/lib/content/locales";

// Server Component: no interactivity, so it stays out of the client bundle.
//
// The brand link resolves to `/{locale}` directly, never bare `/` —
// specs/site-shell/spec.md's "Zero Dead Internal Links" requirement forbids
// an internal link resolving to `/` when a real destination (`/es`) exists,
// even though `/` itself redirects and never 404s (next.config.ts's
// `redirects()`, design.md D2).
//
// ---
//
// **Green restyle.** The header is now the reference direction's floating
// "pill": an inverted dark-green bar inset from the page edges rather than a
// full-bleed translucent strip. It uses the `--nav-*` tokens
// (`app/globals.css`), which exist precisely because the colour relationships
// inside this bar are inverted relative to the page and cannot be derived
// from `--foreground`/`--background`.
//
// **No hamburger menu, deliberately.** A collapsing mobile menu would make
// this a Client Component with open/close state and a focus trap. With only
// two nav links the whole bar fits on a small screen once the labels drop to
// `text-sm` and the secondary CTA hides below `sm`, so the responsive answer
// here is "let it fit", not "hide it behind a button". Revisit only if the
// nav grows a third or fourth item.
//
// **`logo-mark-light.png`, not `logo.png`.** The supplied logo is an opaque
// pale-green square (`#e6ebe8` ground, verified by pixel histogram) with the
// wordmark baked in below the mark; dropped on the dark bar it would render
// as a pale rectangle, and its wordmark is illegible at bar height anyway.
// The imported file is the mark alone, keyed to transparency and recoloured
// to `--nav-foreground`'s near-white, generated from `public/logo.png`. The
// wordmark is live text next to it, so it stays selectable and scalable.
// `public/logo.png` itself remains the source of truth and is unmodified.
export function SiteHeader({ locale }: { locale: Locale }) {
  const { header } = getDictionary(locale);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 md:px-4 md:pt-4">
      {/*
        Below `sm` the bar wraps to two rows instead of squeezing into one.
        Measured: brand 214px + nav 143px + CTA group 317px = 674px of
        content, 542px even with the secondary CTA hidden — against a 390px
        phone viewport. The alternatives were hiding the nav links (which
        would leave `/precios`, a separate route, with no link at all on
        mobile) or a hamburger menu (a Client Component with open/close state
        and a focus trap, for two links). Wrapping keeps every destination
        reachable with zero client JS; `rounded-3xl` rather than
        `rounded-full` below `sm` because a two-row pill with a fully round
        radius reads as a lozenge, not a bar.
      */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-3xl bg-nav px-4 py-2.5 text-nav-foreground shadow-lg shadow-foreground/5 sm:flex-nowrap sm:justify-between sm:rounded-full md:gap-6 md:px-6 md:py-3">
        <Link
          href={`/${locale}`}
          // `w-full` below `sm`: the brand is `shrink-0` (a wordmark must not
          // compress), so when it shared the first wrapped row with the nav
          // the two ran into each other at 390px — measured 214px + 143px +
          // gap against 358px of usable width. Giving it its own row is what
          // makes the wrap above actually work.
          className="flex w-full shrink-0 items-center justify-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nav-cta sm:w-auto sm:justify-start"
        >
          <Image
            src={logoMarkLight}
            alt={header.logoAlt}
            // Fixed intrinsic box: the mark is a 238x238 square, so height is
            // the only dimension that matters visually.
            className="size-7 w-auto md:size-8"
            priority
          />
          <span className="text-base font-bold tracking-tight md:text-lg">
            {header.brand}
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm md:gap-6">
          <Link
            href={landingAnchor(locale, "proyectos") as Route}
            className="text-nav-muted transition-colors hover:text-nav-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nav-cta"
          >
            {header.projectsLink}
          </Link>
          <Link
            href={pricingPath(locale)}
            className="text-nav-muted transition-colors hover:text-nav-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nav-cta"
          >
            {header.pricingLink}
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          {/* Secondary CTA: hidden below `sm` so the bar never wraps on a
              narrow phone. It is not the only route to the brief — the
              landing's own section 8 and the footer both reach it — so
              hiding it strands nothing. */}
          <Link
            href={landingAnchor(locale, "brief") as Route}
            className="hidden rounded-full border border-nav-muted/40 px-4 py-2 text-sm font-medium text-nav-foreground transition-colors hover:border-nav-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nav-cta sm:inline-flex"
          >
            {header.briefCta}
          </Link>
          {WHATSAPP.status === "set" && (
            <a
              href={WHATSAPP.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-nav-cta px-4 py-2 text-sm font-semibold text-nav-cta-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nav-foreground"
            >
              {header.whatsappLink}
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
