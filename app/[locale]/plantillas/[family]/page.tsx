import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { assertLocale } from "@/lib/content/locales";
import {
  TEMPLATE_FAMILIES,
  templatesByFamily,
  type TemplateFamilyId,
} from "@/lib/content/templates";
import { PRICING_TIERS } from "@/lib/content/pricing";
import { WHATSAPP } from "@/lib/content/contact";
import { Price } from "@/components/pricing/price";
import { TemplateCard } from "@/components/templates/template-card";
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

  // The exclusions are NOT restated here. Every fixed tier already publishes
  // them (`PricingTier.notIncluded`, `lib/content/pricing.ts`), and this page
  // sells the same tier under a different name — so it reads that tier's own
  // list. Writing a second one is how a catalogue page and a pricing page end
  // up disagreeing about what a client is buying.
  const tier = PRICING_TIERS.find((entry) => entry.token === definition.priceToken);

  return (
    <main id="main-content" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        {/* Block 1: what this is, what it costs, how many designs */}
        <header className="reveal max-w-3xl">
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
        </header>

        {/* Block 2: what a buyer actually gets — every entry verified against
            the template source, see `lib/content/templates.ts` */}
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

        {/* Block 3: the gallery */}
        <section id="modelos" className="mt-20">
          <h2 className="reveal text-2xl font-medium md:text-3xl">
            {templates.galleryHeading}
          </h2>
          {/* Says plainly that nothing is deployed. See `TemplatesDictionary`'s
              doc comment for why this must not become a "próximamente". */}
          <p className="mt-3 max-w-2xl rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
            {templates.demoPendingNote}
          </p>
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

        {/* Block 4: how a visitor goes from picking one to having it live */}
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
