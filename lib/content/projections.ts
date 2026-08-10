/**
 * Projections from the content model onto specific rendering contracts.
 *
 * See `openspec/changes/dev-services-website/design.md` §5, "The hero
 * receives a projection", and task 2.11. Zero React imports — these are
 * pure functions over `lib/content/**` data.
 */

import type { Locale } from "./locales";
import type { Consent, Evidence, MediaAsset, Project } from "./types";
import type { ServiceLine } from "./service-lines";
import { SERVICE_LINES } from "./service-lines";
import { SERVICE_ILLUSTRATIONS } from "./service-illustrations";
import { PROJECTS } from "./projects";
import { caseStudyPath } from "@/lib/links";

/**
 * The evidence caveat a showcase tile must carry ON the tile itself.
 *
 * `live` needs none — the tile links to the running site, which is the proof.
 * `gated` and `not-deployed` are the two states whose honesty depends on a
 * caveat travelling WITH the screenshot (`specs/project-portfolio/spec.md`,
 * "Evidence State Rendering"), so the projection names the state and
 * `components/ui/project-marquee.tsx` renders the locale's copy for it.
 * `no-visual` never reaches this type — those projects have no image and are
 * filtered out of the showcase entirely.
 */
export type TileCaveat = "gated" | "not-deployed";

/**
 * One tile in the landing's Proyectos marquee
 * (`components/ui/project-marquee.tsx`).
 *
 * Replaces the former `HeroProduct` (`{ title, link, thumbnail }`), which
 * existed to satisfy `HeroParallax`'s legacy prop contract — that component
 * is gone, so the shape no longer has to be a lowest common denominator:
 *
 * - `image` is the `StaticImageData` itself rather than a `.src` string, so
 *   `next/image` gets intrinsic dimensions and a blur placeholder instead of
 *   an opaque path.
 * - `alt` is the asset's real per-locale alt text rather than the project
 *   title reused as a description.
 * - `link` is `string | undefined`, not `string`. The hero's `publicLink()`
 *   fell back to the `#proyectos` anchor when a project had no honest
 *   destination; a tile that lives INSIDE `#proyectos` and links to
 *   `#proyectos` is a link to itself, so the showcase uses the portfolio's
 *   stricter `portfolioLink()` and renders a non-link tile instead.
 */
export type ShowcaseTile = {
  readonly slug: string;
  readonly title: string;
  readonly link: string | undefined;
  readonly image: MediaAsset["asset"];
  readonly alt: string;
  readonly caveat: TileCaveat | undefined;
};

/**
 * A grid card for the landing's portfolio section (PR 3a's consumer).
 *
 * `link` is `undefined` when the card must render as a non-link — see
 * `portfolioLink()`'s doc comment below and task 3.4's critical constraint
 * in tasks.md. A component consuming this MUST NOT render an `<a>`/`<Link>`
 * when `link` is `undefined`.
 */
export type PortfolioCard = {
  readonly slug: string;
  readonly title: string;
  readonly summary: Project["summary"];
  readonly serviceLine: ServiceLine;
  readonly evidence: Evidence;
  readonly link: string | undefined;
};

/**
 * The public-facing label for a project, honouring its `consent` state.
 * Never returns `client` for anything other than `granted` +
 * `namedClient: true` — see design.md §5, "Consent gates identification".
 *
 * Returns `project.title` (the PROJECT's name), not `project.client`, even
 * when the client may be named. Two projects can share one client — `blucafe`
 * (the public site) and `blu` (that client's internal management system) both
 * have `client: "Blu Café"` — so labelling by client produced two identical
 * cards. That was three defects from one root cause: ambiguous UI labels, two
 * images with identical `alt` text, and colliding React keys, since the
 * component of the day keyed its cards by title. (The React-key half is
 * historical — `components/ui/project-marquee.tsx` keys by `slug` — but the
 * other two are not, and `checkUniqueShowcaseTitles` now also depends on
 * titles being unique to join two projections correctly.)
 *
 * The client is still named wherever the project's own title names it, e.g.
 * "Sistema de gestión interno de Blu Café". For the three projects whose
 * `title` equals their `client`, the rendered label is unchanged.
 *
 * `checkUniqueHeroTitles` in `lib/content/invariants.ts` makes a future
 * collision a build failure rather than something a reviewer has to notice.
 *
 * Exported (PR 5): `components/case-study/case-study-layout.tsx` needs the
 * exact same consent-gated label a case study's title renders — reusing this
 * function keeps "Title and Context Honesty" (`specs/case-study/spec.md`)
 * governed by the single place that already implements it, instead of a
 * second copy of the same `switch` drifting out of sync.
 */
export function publicTitle(project: Project): string {
  const { consent } = project;
  switch (consent.status) {
    case "granted":
      // `namedClient` is deliberately not branched on here. When it is false
      // the label must not identify the client, and a `title` that embeds the
      // client's name would leak it — so that guarantee belongs in a check
      // over the data, not in a ternary that silently picks the same value
      // either way. `checkGrantedTitlesDoNotLeakClient` enforces it.
      return project.title;
    case "anonymised":
      return `${consent.industry} — ${consent.size}`;
    case "withheld":
      // Unreachable in practice: `publishableProjects()` filters these out
      // before this function is ever called. Kept exhaustive so a future
      // caller that skips the filter fails loudly instead of leaking a
      // withheld client's `client`/`title` field.
      throw new Error(
        `publicTitle() called on a withheld project ("${project.slug}") — ` +
          "withheld projects must never reach a rendering function. Filter " +
          "with publishableProjects() first.",
      );
    default: {
      const exhaustiveCheck: never = consent;
      throw new Error(`Unhandled consent status: ${String(exhaustiveCheck)}`);
    }
  }
}

/**
 * A project's link, for every surface that renders one.
 *
 * Formerly `portfolioLink()`, one of two link derivations in this file. The
 * other — `publicLink()`, the hero's — differed in exactly one way: when a
 * project had neither a live site nor a published case study it returned the
 * `#proyectos` landing anchor instead of "no link". That fallback existed
 * because the hero sat ABOVE the portfolio, so pointing at it was a real
 * destination. The showcase marquee IS `#proyectos`, so the same fallback
 * would now produce a tile linking to the section containing it. With its one
 * distinguishing behaviour invalid, `publicLink()` was deleted rather than
 * kept as a second name for this function.
 *
 * `live` evidence always links externally, unconditionally: that URL is an
 * independently-verified third-party site (e.g. task 1.H2's checks), so it
 * is never gated by this project's OWN case-study route existing. This
 * matches `specs/project-portfolio/spec.md`'s "Evidence State Rendering"
 * table (`live` → "screenshot + external link").
 *
 * Every other evidence state (`gated`, `not-deployed`, `no-visual`) is a
 * candidate for an INTERNAL case-study link instead — but only once that
 * case study is actually published. Rendering a `<Link>`/`<a>` at an address
 * that does not exist yet is the exact class of defect this change set has
 * repeatedly had to fix (see tasks.md's "Delivery order correction"), so this
 * function returns `undefined` — "no link" — unless
 * `project.caseStudyPublished` is `true`.
 *
 * Both consumers MUST NOT render an anchor when this returns `undefined`:
 * `components/ui/project-marquee.tsx` (the showcase tile) and
 * `components/portfolio/project-card.tsx`.
 */
function portfolioLink(locale: Locale, project: Project): string | undefined {
  // A published case study wins over the client's live site: the case study is
  // the studio's own proof, and the client's live site is evidence cited
  // INSIDE it, where the case study already links to it. The reverse order
  // sent every visitor to the client's website and left the studio's write-up
  // in zero hrefs across the whole site (verify-report-final.md, finding C6).
  if (project.caseStudyPublished) return caseStudyPath(locale, project.slug);
  if (project.evidence.state === "live") return project.evidence.externalUrl;
  return undefined;
}

/**
 * Every project not `withheld`. This is the set case-study routes and the
 * sitemap enumerate over — broader than "featured" because a project can
 * be publishable without (yet) being in the curated hero/grid set.
 */
export function publishableProjects(): readonly Project[] {
  return PROJECTS.filter(
    (project): project is Project & { consent: Exclude<Consent, { status: "withheld" }> } =>
      project.consent.status !== "withheld",
  );
}

/**
 * The curated, `featured` project set — the set both `toShowcaseTiles()` and
 * `toPortfolioCards()` project from. See specs/project-portfolio/spec.md,
 * "Showcase Consistency With The Curated Set" and "Curated Set Size".
 *
 * Exported (remediation of `verify-report-final.md` finding C7) so
 * `lib/content/invariants.ts`'s `checkCuratedSetSize` reads the exact same
 * set this file's own consumers do, instead of a second hand-rolled filter
 * that could drift out of sync with it.
 */
export function featuredProjects(): readonly Project[] {
  return publishableProjects().filter((project) => project.featured);
}

/**
 * Every project whose case study is actually published (`caseStudyPublished:
 * true`) — PR 5's `luang` and `blu`, today.
 *
 * The single source of truth for "which case-study routes really exist" —
 * `app/[locale]/proyectos/[slug]/page.tsx`'s `generateStaticParams`,
 * `app/sitemap.ts`, and `lib/content/invariants.ts`'s
 * `checkInternalLinksResolve` all read from this function instead of each
 * re-deriving the same filter, so the three cannot drift out of sync with
 * each other. Deliberately narrower than `publishableProjects()`: that
 * function answers "is this project allowed to be named at all", a different
 * question from "does a real, populated case-study page exist for it right
 * now" — using the broader set here would statically generate a page full of
 * `[PENDIENTE]` stub prose for every curated project that has not received a
 * write-up yet, and list it in the sitemap as if it were real content.
 */
export function publishedCaseStudyProjects(): readonly Project[] {
  return PROJECTS.filter((project) => project.caseStudyPublished);
}

/**
 * The showcase marquee's data source — `components/sections/portfolio.tsx`,
 * via `components/ui/project-marquee.tsx`.
 *
 * Successor to `toHeroProducts()`, which fed `HeroParallax`'s scroll-linked
 * track at the top of the landing. That track is gone (see
 * `components/sections/portfolio.tsx` for why the projects moved out of the
 * hero and into two counter-rotating marquee rows), and with it the legacy
 * `{ title, link, thumbnail }` prop contract this projection existed to
 * satisfy.
 *
 * **`no-visual` projects are still filtered out, for the same reason as
 * before.** A marquee tile IS a screenshot; a project with no consented
 * capture cannot appear in one without a broken frame or a fake grey box,
 * which is precisely what the `no-visual` state exists to prevent
 * (`specs/project-portfolio/spec.md`, "`no-visual` degrades honestly").
 * Unlike before, those projects no longer have a second landing surface to
 * fall back to — the grid that used to carry them is what the marquee
 * replaces. `toPortfolioCards()` still projects them for
 * `lib/content/invariants.ts`, and `checkShowcaseIsSubsetOfCuratedSet` fails
 * the build if any project is ever missing from the showcase for any OTHER
 * reason than this one.
 */
export function toShowcaseTiles(locale: Locale): readonly ShowcaseTile[] {
  return featuredProjects()
    .filter((project) => project.evidence.state !== "no-visual")
    .toSorted((a, b) => a.order - b.order)
    .map((project) => {
      const { evidence } = project;
      if (evidence.state === "no-visual") {
        // Unreachable given the filter above — `Array.prototype.filter` does
        // not narrow the element type, so this both restores the narrowing
        // TypeScript loses and fails loudly if a future edit to that filter
        // lets a media-less project through to `next/image`.
        throw new Error(
          `Project "${project.slug}" has no media but was not filtered out of the showcase projection.`,
        );
      }
      const media = evidence.media[0];
      return {
        slug: project.slug,
        title: publicTitle(project),
        link: portfolioLink(locale, project),
        image: media.asset,
        alt: media.alt[locale],
        caveat: evidence.state === "live" ? undefined : evidence.state,
      };
    });
}

/**
 * A Servicios card for the landing's expanding accordion
 * (`components/sections/services.tsx`).
 *
 * `illustration` is required, not optional: every line has a drawing, so a
 * card can no longer render as a broken row with a hole where line D's image
 * should be. See `lib/content/service-illustrations.ts` for why the image is
 * a drawing rather than a client screenshot.
 */
export type ServiceCard = {
  readonly line: ServiceLine;
  readonly name: string;
  readonly description: string;
  readonly illustration: MediaAsset;
};

/**
 * Service lines the landing's Servicios accordion does not show.
 *
 * **This is a landing-narrative decision, not a catalogue change.** Line D
 * (Mantenimiento y evolución) is still a product the studio sells and is
 * still fully present everywhere it is bought: the `/[locale]/precios` line-D
 * block with its `RETAINER_PLANS`, the footer's Servicios column, and the
 * brief form's service-line selector all read `SERVICE_LINES` directly and
 * are untouched. What changed is only that the landing no longer opens with a
 * retainer pitch — a visitor arriving cold is being sold project work, and
 * the maintenance offer is something they meet on the pricing page once they
 * are already interested.
 *
 * Filtering here rather than in `components/sections/services.tsx` keeps the
 * component a plain renderer of whatever cards it is handed, which is the
 * split every other section in `app/[locale]/page.tsx` already uses. The
 * constant is typed as `ServiceLine` so a hidden line that stops existing
 * becomes a compile error here instead of a silently ineffective filter.
 */
const LINES_HIDDEN_FROM_LANDING: readonly ServiceLine[] = ["D"];

/**
 * The Servicios section's data source: the fixed service lines the landing
 * advertises, each paired with its generic illustration.
 *
 * This section deliberately does NOT read `publishableProjects()`. It used
 * to — each card showed the lowest-`order` project's primary screenshot —
 * and `lib/content/service-illustrations.ts` records why that was wrong:
 * Servicios describes what the studio sells, `#proyectos` is where real
 * client work is shown with its consent and evidence state attached. Nothing
 * here is consent-gated any more because nothing here identifies a client.
 *
 * `SERVICE_LINES` is iterated through its own `A`/`B`/`C`/`D` key order, the
 * same order `components/sections/pricing-summary.tsx` and the footer use,
 * minus `LINES_HIDDEN_FROM_LANDING` — see that constant for why the omission
 * is a narrative choice and not a removal from the catalogue.
 */
export function toServiceCards(locale: Locale): readonly ServiceCard[] {
  return Object.values(SERVICE_LINES)
    .filter((line) => !LINES_HIDDEN_FROM_LANDING.includes(line.id))
    .map((line) => ({
      line: line.id,
      name: line.name[locale],
      description: line.description[locale],
      illustration: SERVICE_ILLUSTRATIONS[line.id],
    }));
}

/**
 * The complete curated set, projected as full information cards — including
 * the `no-visual` entries `toShowcaseTiles()` cannot show.
 *
 * **This has no renderer on the landing any more.** It fed the Proyectos
 * grid, which the showcase marquee replaced. It is kept, rather than deleted
 * with its consumer, because `lib/content/invariants.ts` reads it as the
 * reference set the showcase is checked against
 * (`checkShowcaseIsSubsetOfCuratedSet`) and as the link-honesty sweep over
 * every curated project (`checkPortfolioLinksOnlyToPublishedCaseStudies`),
 * both of which must keep seeing the projects the showcase filters out.
 * `components/portfolio/project-card.tsx` — the card component this shape was
 * designed for — is likewise unused on the landing today and left in place
 * for the `/[locale]/proyectos` index the marquee's "see everything" path
 * will eventually need.
 */
export function toPortfolioCards(locale: Locale): readonly PortfolioCard[] {
  return featuredProjects()
    .toSorted((a, b) => a.order - b.order)
    .map((project) => ({
      slug: project.slug,
      title: publicTitle(project),
      summary: project.summary,
      serviceLine: project.serviceLine,
      evidence: project.evidence,
      link: portfolioLink(locale, project),
    }));
}
