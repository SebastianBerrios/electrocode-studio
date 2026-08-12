import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { assertLocale } from "@/lib/content/locales";
import {
  TEMPLATE_FAMILIES,
  featuredTemplate,
  templatesByFamily,
  type TemplateFamilyId,
} from "@/lib/content/templates";
import { PRICING_TIERS } from "@/lib/content/pricing";
import { WHATSAPP } from "@/lib/content/contact";
import { Price } from "@/components/pricing/price";
import { TemplateCard } from "@/components/templates/template-card";
import { TemplatePhone } from "@/components/templates/template-phone";
import { getDictionary } from "@/lib/dictionaries";
import { pricingLineAnchor } from "@/lib/links";
import { canonicalAlternates } from "@/lib/seo";

/**
 * One route for both catalogues rather than two near-identical page files.
 * The family id IS the URL segment (`lib/content/templates.ts`), so adding a
 * third family ships its page with no new route — and `templatesPath()`
 * (`lib/links.ts`) builds the same string this segment matches.
 */
export function generateStaticParams() {
  return Object.keys(TEMPLATE_FAMILIES).map((family) => ({ family }));
}

/** An unknown family must 404, not render dynamically on request. */
export const dynamicParams = false;

/**
 * No request-time data anywhere on this page (design.md D11) — every design,
 * feature and figure is build-time content, same as `precios` and the case
 * studies.
 */
export const dynamic = "force-static";

function findFamily(family: string) {
  return Object.hasOwn(TEMPLATE_FAMILIES, family)
    ? TEMPLATE_FAMILIES[family as TemplateFamilyId]
    : undefined;
}

/**
 * This page's own canonical, title and description — never the root layout's.
 * These two routes are the ones most likely to be pasted straight into a DM or
 * an Instagram bio, which is exactly the case finding W14 was about: a route
 * that inherits the brand-level `<title>` previews as the homepage wherever it
 * is shared. `DESCRIPTION` is the family's own tagline from
 * `lib/content/templates.ts`, already-real copy rather than a new claim.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; family: string }>;
}): Promise<Metadata> {
  const { locale, family } = await params;
  const validLocale = assertLocale(locale);
  const definition = findFamily(family);
  if (!definition) return {};

  const title = `${definition.name[validLocale]} — ElectroCode Studio`;
  const description = definition.tagline[validLocale];

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: canonicalAlternates(validLocale, "plantillas", family),
  };
}

export default async function TemplateFamilyPage({
  params,
}: {
  params: Promise<{ locale: string; family: string }>;
}) {
  const { locale, family } = await params;
  const validLocale = assertLocale(locale);
  const definition = findFamily(family);
  if (!definition) notFound();

  // `pricing` alongside `templates`: the exclusions block below reuses the
  // pricing page's own heading rather than declaring a second name for the
  // same list.
  const { templates, pricing } = getDictionary(validLocale);
  const designs = templatesByFamily(definition.id);

  // The design loaded into the phone frame beside the header copy. Named in
  // `TEMPLATE_FAMILIES`, not `designs[0]` — see `TemplateFamily.featured`.
  const featured = featuredTemplate(definition.id);

  // The exclusions are NOT restated here. Every fixed tier already publishes
  // them (`PricingTier.notIncluded`, `lib/content/pricing.ts`), and this page
  // sells the same tier under a different name — so it reads that tier's own
  // list. Writing a second one is how a catalogue page and a pricing page end
  // up disagreeing about what a client is buying.
  const tier = PRICING_TIERS.find((entry) => entry.token === definition.priceToken);

  return (
    <main id="main-content" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        {/* Block 1: what this is, what it costs, how many designs — and the
            featured design running live beside it. The phone is inside the
            header rather than a section of its own because it is not a separate
            claim: it is the evidence for the sentence next to it, the same way
            a case study's hero image sits with its summary. On narrow screens
            the grid collapses and the phone falls under the copy, which is also
            the reading order a screen reader gets. */}
        <header className="reveal grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-medium tracking-tight md:text-6xl">
              {definition.name[validLocale]}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              {definition.tagline[validLocale]}
            </p>
            <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-base">
              <span className="font-semibold">
                {designs.length} {templates.designsCountSuffix}
              </span>
              <span aria-hidden="true" className="text-muted-foreground">
                ·
              </span>
              <span className="text-muted-foreground">
                {templates.fromPrefix}{" "}
                <span className="text-foreground">
                  <Price token={definition.priceToken} />
                </span>
              </span>
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {WHATSAPP.status === "set" ? (
                <a
                  href={WHATSAPP.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-accent-signal px-6 py-3 text-sm font-medium text-accent-signal-foreground"
                >
                  {templates.ctaButtonLabel}
                </a>
              ) : null}
              <Link
                href={pricingLineAnchor(validLocale, definition.serviceLine)}
                className="text-sm font-semibold text-accent-signal underline underline-offset-4"
              >
                {templates.viewPricingLink}
              </Link>
            </div>
          </div>

          {featured ? (
            <TemplatePhone template={featured} locale={validLocale} />
          ) : null}
        </header>

        {/* Block 2: the gallery.
            **The designs come FIRST, before the feature list.** A visitor
            arriving here has already been told what this is by the header; the
            next thing they want is to see the models and find one they like —
            not to read thirteen verified behaviours about a product they have
            not chosen yet. The feature list is what closes the choice, so it
            now sits after it (block 4), next to the exclusions it belongs
            with. */}
        <section id="modelos" className="mt-20">
          <h2 className="reveal text-2xl font-medium md:text-3xl">
            {templates.galleryHeading}
          </h2>
          {/* A dashed note used to sit here saying no demo was online yet. It
              came out with the demos going live — every tile now carries a real
              "ver ejemplo" link, so the note described the opposite of what the
              visitor is looking at. See `TemplatesDictionary`'s doc comment. */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {designs.map((template) => (
              <TemplateCard
                key={template.slug}
                template={template}
                locale={validLocale}
              />
            ))}
          </div>
        </section>

        {/* Block 3: how a visitor goes from picking one to having it live */}
        <section className="mt-20">
          <h2 className="reveal text-2xl font-medium md:text-3xl">
            {templates.stepsHeading}
          </h2>
          <ol className="mt-6 grid gap-6 md:grid-cols-3">
            {definition.steps.map((step, index) => (
              <li
                key={step[validLocale]}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <span className="font-display text-3xl font-semibold text-accent-signal tabular-nums">
                  {index + 1}
                </span>
                <p className="mt-3 text-sm text-muted-foreground">
                  {step[validLocale]}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Block 4: what a buyer actually gets — every entry verified against
            the template source, see `lib/content/templates.ts`. Placed
            immediately before the exclusions on purpose: "qué incluye" and "qué
            no incluye" are two halves of one answer, and separating them by the
            gallery let a reader take the first half as the whole. */}
        <section className="mt-20">
          <h2 className="reveal text-2xl font-medium md:text-3xl">
            {templates.featuresHeading}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {definition.features.map((feature) => (
              <li
                key={feature[validLocale]}
                className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground"
              >
                {feature[validLocale]}
              </li>
            ))}
          </ul>
        </section>

        {/* Block 5: the same exclusions the pricing page publishes for this
            tier — read from it, never re-written */}
        {tier ? (
          <section className="mt-20">
            <h2 className="reveal text-2xl font-medium md:text-3xl">
              {pricing.notIncludedHeading}
            </h2>
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {tier.notIncluded.map((item) => (
                <li
                  key={item[validLocale]}
                  className="text-sm text-muted-foreground"
                >
                  {item[validLocale]}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Block 6: CTA */}
        <section className="reveal mt-20 rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-2xl font-medium md:text-3xl">
            {templates.ctaHeading}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {templates.ctaBody}
          </p>
          {WHATSAPP.status === "set" ? (
            <a
              href={WHATSAPP.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center rounded-full bg-accent-signal px-6 py-3 text-sm font-medium text-accent-signal-foreground"
            >
              {templates.ctaButtonLabel}
            </a>
          ) : null}
        </section>
      </div>
    </main>
  );
}
