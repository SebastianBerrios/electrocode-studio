import { HeroParallax } from "@/components/ui/hero-parallax";
import { HeroHeader } from "@/components/sections/hero-header";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { WayOfWorking } from "@/components/sections/way-of-working";
import { Portfolio } from "@/components/sections/portfolio";
import { Authority } from "@/components/sections/authority";
import { PricingSummary } from "@/components/sections/pricing-summary";
import { FaqSection } from "@/components/sections/faq-section";
import { Brief } from "@/components/sections/brief";
import { assertLocale } from "@/lib/content/locales";
import { toHeroProducts } from "@/lib/content/projections";
import { canonicalAlternates } from "@/lib/seo";
import type { Metadata } from "next";

/**
 * Each route owns its canonical. The root layout deliberately declares none,
 * because a canonical in a shared shell is inherited by every page — see the
 * note in `app/layout.tsx` and `lib/seo.ts`.
 *
 * **`alternates.languages`/`x-default`, corrected 2026-08-01 (remediation of
 * `verify-report-final.md` finding W13)**: every route's `generateMetadata`
 * used to return only `{ canonical }`, which — because Next.js replaces
 * `alternates` wholesale rather than merging it — silently discarded the
 * root layout's `alternates.languages`/`x-default` on every content route,
 * leaving them present only on the one page that never called
 * `generateMetadata` at all (`_not-found`). `canonicalAlternates()`
 * (`lib/seo.ts`) now returns both together so every route keeps them. No
 * title/description override here — the landing page intentionally keeps
 * the brand-level `<title>`/description the root layout already sets
 * (`app/layout.tsx`), the conventional homepage default; see W14's fix on
 * the other routes for the pages that needed their own.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: canonicalAlternates(assertLocale(locale)) };
}

/**
 * D11 requires every route to be `force-static` (design.md §6): there is no
 * request-time data anywhere on this page, and a throw during static
 * generation is how `assertContentInvariants()` fails the build
 * deterministically. Missing here and on `app/[locale]/layout.tsx` until
 * this fix (`verify-report-final.md` finding W20) — both now declare it,
 * matching `precios`/`gracias`/`proyectos/[slug]`, which already did.
 */
export const dynamic = "force-static";

/**
 * The locale landing page. It composes the numbered sections `specs/
 * landing-narrative/spec.md`'s "Fixed Section Order" requires: 1 (Hero, PR 2),
 * 2 (Servicios, PR 3a), 3 (Proceso, PR 3a), 4 (Proyectos, PR 3a), 5
 * (Autoridad, PR 3b), 6 (Precios summary, PR 3b/4), 8 (Brief/WhatsApp
 * conversion, task 6.7). The footer (site chrome, not a numbered landing
 * section) is rendered by `app/[locale]/layout.tsx`, unchanged.
 *
 * **Section 7 (Retainer/Mantenimiento) is deliberately absent**, and the spec's
 * "Fixed Section Order" and "Retainer Section Contract" requirements have been
 * updated to record that rather than left to contradict this file. The landing
 * no longer pitches the maintenance retainer at all: line D is filtered out of
 * the Servicios accordion (`LINES_HIDDEN_FROM_LANDING` in
 * `lib/content/projections.ts`, which explains the reasoning) and the
 * commitments section that used to sit between Precios and the FAQ is gone with
 * it — `components/sections/retainer.tsx` was deleted, having no other consumer,
 * the same call made for `components/ui/sticky-scroll-reveal.tsx`.
 *
 * **The retainer is still sold.** Every commitment that section rendered still
 * reaches the visitor through `components/pricing/retainer-plans.tsx` on
 * `/[locale]/precios`, which reads the same `RETAINER_COMMITMENTS` and adds the
 * prices the landing section never showed. `lib/content/retainer.ts` and its
 * invariants are untouched; the footer's "Mantenimiento" link now points at
 * that pricing block instead of the removed `#retainer` anchor.
 *
 * Replaces the former `app/page.tsx` (task 2.18). `toHeroProducts(locale)`
 * is now the single source of truth for the hero's product grid, replacing
 * the hardcoded 4-entry array that page used to define inline.
 *
 * `HeroParallax` no longer receives `productsId="proyectos"`: that id now
 * belongs to `components/sections/portfolio.tsx` — its real, intended
 * destination now that the Proyectos section exists — see that
 * component's doc comment.
 */
export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = assertLocale(locale);
  const products = toHeroProducts(validLocale);

  return (
    <main id="main-content">
      <HeroParallax
        products={products}
        header={<HeroHeader locale={validLocale} />}
      />
      <Services locale={validLocale} />
      <Process locale={validLocale} />
      {/*
        Sections 3b and 7b, inserted by the green restyle. Both are additions
        BETWEEN the eight sections `specs/landing-narrative/spec.md`'s "Fixed
        Section Order" fixes, never reorderings of them — that requirement's
        sequence still reads top to bottom exactly as written. The spec has
        been updated to name both insertions; see it for the reasoning on
        each.
      */}
      <WayOfWorking locale={validLocale} />
      <Portfolio locale={validLocale} />
      <Authority locale={validLocale} />
      <PricingSummary locale={validLocale} />
      <FaqSection locale={validLocale} />
      <Brief locale={validLocale} />
    </main>
  );
}
