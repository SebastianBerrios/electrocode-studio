import Image from "next/image";
import Link from "next/link";
import { LayoutTemplate } from "lucide-react";
import { TEMPLATE_FAMILIES, templatesByFamily } from "@/lib/content/templates";
import { Price } from "@/components/pricing/price";
import { getDictionary } from "@/lib/dictionaries";
import { templatesPath } from "@/lib/links";
import type { Locale } from "@/lib/content/locales";

/**
 * Server Component: landing section 4b, "Plantillas listas" — the teaser for
 * the two ready-made catalogues, one card each, linking to
 * `/[locale]/plantillas/{family}`.
 *
 * **An insertion between the numbered sections, never a reordering of them** —
 * the same kind of addition `WayOfWorking` (3b) and the landing FAQ (7b)
 * already are, so `specs/landing-narrative/spec.md`'s "Fixed Section Order"
 * still reads top to bottom exactly as written. It sits directly after
 * `#proyectos` on purpose: the visitor has just been shown bespoke client work,
 * and this is the answer to the thought that follows it — "that looks like more
 * than I need". Placing it before the portfolio would offer the cheap option to
 * someone who has not yet seen what the studio can do.
 *
 * **This section does NOT restate a price.** The two figures come from
 * `<Price>` (`components/pricing/price.tsx`), the one component in the codebase
 * allowed to render a money figure, via each family's `priceToken`. That is
 * what stops the landing from saying "S/100" while `/precios` says something
 * else — finding C3's exact failure, where a monthly retainer was published on
 * the landing as a one-off.
 *
 * **The design count is read, not written.** `templatesByFamily().length`
 * feeds the count and `templates.designsCountSuffix` only supplies the word
 * after it, so deleting a template updates every surface that mentions how many
 * there are. `piero-cielo` being excluded from the catalogue (see
 * `lib/content/templates.ts`) therefore shows up here as "6 diseños"
 * automatically, with no sentence to remember to edit.
 *
 * **Three previews per card, not the whole set.** The card is a teaser for a
 * gallery, so it shows the first three designs and sends the visitor to the
 * page that holds all of them. They are `aria-hidden` and the link carries the
 * accessible name: a screen-reader user gets "Biolinks — ver los diseños", not
 * three redundant screenshot descriptions before it.
 */
export function Templates({ locale }: { locale: Locale }) {
  const { templates } = getDictionary(locale);
  const families = Object.values(TEMPLATE_FAMILIES);

  return (
    <section id="plantillas" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="reveal mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-accent-signal">
            <LayoutTemplate aria-hidden="true" className="size-4" />
            {templates.eyebrow}
          </p>
          <h2 className="mt-4 text-4xl md:text-6xl">
            {templates.heading.lead}{" "}
            <span className="text-accent-signal">
              {templates.heading.accent}
            </span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
            {templates.intro}
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {families.map((family, index) => {
            const designs = templatesByFamily(family.id);
            const previews = designs.slice(0, 3);

            return (
              <article
                key={family.id}
                style={{ animationDelay: `${index * 120}ms` }}
                className="reveal flex flex-col overflow-hidden rounded-3xl border border-border bg-card"
              >
                <div
                  aria-hidden="true"
                  className="grid grid-cols-3 gap-px border-b border-border/60 bg-border/60"
                >
                  {previews.map((template) => (
                    <div
                      key={template.slug}
                      className="relative aspect-[3/4] overflow-hidden bg-card"
                    >
                      <Image
                        src={template.preview.asset}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 16vw, 33vw"
                        className="object-cover object-top"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <h3 className="text-2xl font-medium text-card-foreground md:text-3xl">
                    {family.name[locale]}
                  </h3>
                  <p className="mt-3 text-base text-muted-foreground">
                    {family.tagline[locale]}
                  </p>

                  <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    <span className="font-semibold text-card-foreground">
                      {designs.length} {templates.designsCountSuffix}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {templates.fromPrefix}{" "}
                      <span className="text-card-foreground">
                        <Price token={family.priceToken} />
                      </span>
                    </span>
                  </p>

                  <div className="mt-auto pt-6">
                    <Link
                      href={templatesPath(locale, family.id)}
                      className="inline-flex items-center rounded-full bg-accent-signal px-5 py-2.5 text-sm font-medium text-accent-signal-foreground"
                    >
                      {templates.viewFamilyCta}
                      <span className="sr-only"> — {family.name[locale]}</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
