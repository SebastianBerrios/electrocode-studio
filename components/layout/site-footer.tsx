import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import logoMark from "@/public/logo-mark.png";
import { WHATSAPP } from "@/lib/content/contact";
import { SERVICE_LINES, type ServiceLine } from "@/lib/content/service-lines";
import { getDictionary } from "@/lib/dictionaries";
import { landingAnchor, pricingLineAnchor, pricingPath } from "@/lib/links";
import type { Locale } from "@/lib/content/locales";

// Server Component. Only `es` ships today, so no locale-switcher is
// rendered — see design.md §7 and tasks.md task 1.8. Link rationale matches
// `site-header.tsx`: never bare `/`, both anchors locale-prefixed.
//
// ---
//
// **Green restyle.** Grown from a single row into the reference direction's
// multi-column sitemap footer, on the inverted `--nav-*` surface so the page
// closes on the same dark green the header opens with.
//
// Three columns, not the reference's four: there is deliberately no
// "Recursos" column, because this site has no blog, glossary, or project
// calculator to fill one. An empty column with plausible-looking headings is
// exactly the kind of borrowed structure this restyle is not doing.
//
// The Servicios column's labels come from `SERVICE_LINES`, not from the
// dictionary — the four line names are domain facts with one home
// (`lib/content/service-lines.ts`), and restating them as chrome copy would
// let the footer and the pricing page drift apart silently. Each links to
// its own block on the pricing page via `pricingLineAnchor()`, the same
// helper the Servicios section's cards already use.
const FOOTER_SERVICE_ORDER = ["A", "B", "C", "D"] as const satisfies readonly ServiceLine[];

export function SiteFooter({ locale }: { locale: Locale }) {
  const { footer } = getDictionary(locale);

  // Build year, not request year: every route under this layout is
  // `force-static`, so this is evaluated once at build time and baked into
  // the HTML. That is the honest reading of a copyright line on a static
  // site — it says when this was published, and it cannot silently drift
  // forward on a page nobody rebuilt.
  const year = new Date().getFullYear();

  const linkClass =
    "text-nav-muted transition-colors hover:text-nav-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nav-cta";
  const headingClass =
    "text-sm font-bold uppercase tracking-wider text-nav-foreground";

  return (
    <footer className="mt-24 px-3 pb-3 md:px-4 md:pb-4">
      <div className="mx-auto max-w-7xl rounded-3xl bg-nav px-6 py-12 text-nav-foreground md:px-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:pr-8">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nav-cta"
            >
              {/* The ink-coloured mark would vanish on this dark surface, so
                  it is inverted here with a CSS filter rather than shipping a
                  third generated PNG for one call site. `invert` on a
                  single-colour transparent mark is exact, not approximate. */}
              <Image
                src={logoMark}
                alt={footer.logoAlt}
                className="size-8 w-auto invert"
              />
              <span className="text-lg font-bold tracking-tight">
                {footer.brand}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-nav-muted">
              {footer.tagline}
            </p>
          </div>

          <nav aria-labelledby="footer-servicios">
            <h2 id="footer-servicios" className={headingClass}>
              {footer.servicesHeading}
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {FOOTER_SERVICE_ORDER.map((id) => (
                <li key={id}>
                  <Link href={pricingLineAnchor(locale, id)} className={linkClass}>
                    {SERVICE_LINES[id].name[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-estudio">
            <h2 id="footer-estudio" className={headingClass}>
              {footer.studioHeading}
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  href={landingAnchor(locale, "proyectos") as Route}
                  className={linkClass}
                >
                  {footer.projectsLink}
                </Link>
              </li>
              <li>
                <Link
                  href={landingAnchor(locale, "proceso") as Route}
                  className={linkClass}
                >
                  {footer.processLink}
                </Link>
              </li>
              {/* No "Mantenimiento" entry here any more. This column lists
                  landing sections, and the Retainer section no longer exists
                  (see `app/[locale]/page.tsx`). Re-pointing it at the pricing
                  page would have duplicated a destination the Servicios column
                  above already links: its line-D entry goes to that exact
                  block via `pricingLineAnchor()`. The retainer is still one
                  click from the footer — just not twice.
                  `FooterDictionary.retainerLink` consequently has no consumer;
                  it stays in the shared dictionary type on the same reasoning
                  as `ProcessDictionary.approvalBadge`. */}
              <li>
                <Link href={pricingPath(locale)} className={linkClass}>
                  {footer.pricingLink}
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-contacto">
            <h2 id="footer-contacto" className={headingClass}>
              {footer.contactHeading}
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  href={landingAnchor(locale, "brief") as Route}
                  className={linkClass}
                >
                  {footer.briefLink}
                </Link>
              </li>
              {WHATSAPP.status === "set" && (
                <li>
                  <a
                    href={WHATSAPP.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {footer.whatsappLink}
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-nav-muted/20 pt-6 text-sm text-nav-muted">
          {footer.copyright.replace("{year}", String(year))}
        </div>
      </div>
    </footer>
  );
}
