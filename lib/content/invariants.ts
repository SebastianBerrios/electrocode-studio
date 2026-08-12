/**
 * Build-time content-integrity assertion.
 *
 * See `openspec/changes/dev-services-website/design.md` §6, "Four
 * enforcement layers, and exactly what each cannot catch", and task 2.12.
 *
 * `import "server-only"` — this module is meant to run once per prerendered
 * locale (`app/[locale]/layout.tsx`, wired in PR 2c) and in `app/sitemap.ts`,
 * never in a Client Component.
 *
 * ---
 *
 * **What this file covers, and what it explicitly does NOT cover.**
 *
 * This is a data-integrity gate, not a rendering or visual gate. It answers
 * "is the content model internally consistent?", never "does the page look
 * right?". It cannot and does not catch: broken layouts, the showcase marquee
 * at any given tile count (whether each track still outruns the viewport is
 * arithmetic done in `components/ui/project-marquee.tsx`'s doc comment, by a
 * human), the form's no-JS path, responsive breakpoints, a11y issues, or
 * whether a stub `[PENDIENTE]` string has since become real, plausible-looking
 * prose. All of those need a human, a browser, or a test runner this project
 * does not have (design.md risk 8; proposal §2.2).
 *
 * The checks below:
 *
 * 1. **Unique slugs** — no two `PROJECTS` entries share a `slug`
 *    (specs/content-model/spec.md, "Slug Uniqueness").
 * 2. **No internal link resolves to `/` or `/{locale}`** — checked against
 *    every locale's `toShowcaseTiles()` output (project-portfolio spec, "No
 *    Self-Referential Links").
 * 3. **Every non-retainer service line has at least one project** — checked
 *    against the full `PROJECTS` list, not only the publishable subset, per
 *    the literal wording of "Every non-retainer line has proof".
 * 4. **No empty `Localized<string>` value** — every locale-keyed string
 *    field this module can see (`summary`, `problem`, `role`,
 *    `outcome.statement` when qualitative, `evidence.disclosure` when
 *    gated) must be non-blank for every configured locale. This catches an
 *    accidentally empty string; it does NOT catch a `[PENDIENTE]` stub
 *    still being a stub — that is a content-review concern, not a
 *    data-integrity one, and deliberately not what "empty" means here.
 * 5. **Non-empty `approach` per project** — same "empty string", not
 *    "still a stub", distinction as above; resolved via the async loader,
 *    so this check is itself `async`.
 * 6. **Showcase projection has at least `SHOWCASE_FLOOR` entries** — per every
 *    locale's `toShowcaseTiles()` (design.md D4/§13 risk 1 introduced a floor
 *    of 4; the `fix/content-honesty` slice temporarily lowered it to 3, and
 *    `fix/restore-consented-content` raised it back to 4 once `blu` and
 *    `atemporal` were both honestly restored — see the constant's own
 *    comment).
 * 7. **Evidence/media shape** — mostly a compile-time guarantee already
 *    (`Evidence`'s discriminated union in `lib/content/types.ts` makes a
 *    mismatched state/media pair a type error before this file ever runs).
 *    The runtime check here is deliberately redundant defense-in-depth in
 *    case a future dynamic content source bypasses the type system.
 * 8. **Pending price reaching production** — gated by
 *    `PRICE_INTEGRITY_CHECK_ACTIVE`, now `true` (task 4.10): PR 4 populated
 *    real figures in `lib/content/pricing.ts` for every one of the 8 tokens,
 *    so a `pending` price reaching a production build is now a real defect,
 *    not an expected intermediate state. Verified by fault injection — see
 *    apply-progress.md.
 * 9. **Every curated project links only to published case studies** — per
 *    every locale's `toPortfolioCards()` (task 3.4/3.10). A project whose
 *    evidence is not `live` must not link to `/[locale]/proyectos/{slug}`
 *    unless `caseStudyPublished` is `true` for it. Deliberately swept over the
 *    FULL curated set rather than only what the showcase renders, so a link
 *    defect cannot hide in a project the marquee currently filters out.
 * 10. **Academy stays `no-link` while unverified as reachable** (task 3.5,
 *     PR 3b) — `ACADEMY_VERIFIED_UNREACHABLE` records this batch's verified
 *     fact (private repo, deployment 404s). Flipping `ACADEMY.state` to
 *     `"linked"` without also updating that flag fails the build on
 *     purpose, as a reminder to re-verify reachability rather than silently
 *     shipping an unverified link.
 * 11. **No retainer commitment marked `"set"` is blank** (task 3.6, PR 3b) —
 *     `lib/content/retainer.ts`'s `RETAINER_COMMITMENTS`. A `"pending"`
 *     commitment is exempt (that is the designed unresolved state); a
 *     `"set"` one must actually carry non-blank content for every locale.
 * 12. **Curated set size stays within its floor and ceiling** (remediation of
 *     `verify-report-final.md` finding C7) — `specs/project-portfolio/
 *     spec.md`'s "Curated Set Size" (amended 2026-07-31 to 4–8). The
 *     `fix/merge-duplicate-project` slice correctly dropped the curated set
 *     from 6 to 5 by removing a real duplicate, and nothing caught that this
 *     requirement had no build-time gate at all — a reviewer had to notice
 *     it by reading the spec by hand. This closes that gap.
 * 13. **No template excluded for consent reasons is in the catalogue** —
 *     `TEMPLATE_SLUGS_EXCLUDED_FOR_CONSENT`. The one entry today is
 *     `piero-cielo`, a real couple's private invitation whose `PROJECTS` record
 *     is `consent: "withheld"`. See that constant's own comment for why this is
 *     a denylist rather than a join against `PROJECTS`.
 * 14. **Unique template slugs** — the slug is the React key and the gallery id.
 * 15. **No blank `Localized<string>` anywhere in the catalogue** — including
 *     every preview's `alt`, which on a card that IS a screenshot is the only
 *     description a screen-reader user receives.
 * 16. **No empty template family** — a family with no designs would render an
 *     empty gallery under a heading promising models.
 * 17. **Every `set` template demo points at its own template** — the most
 *     likely edit here is copying a neighbouring entry and forgetting to change
 *     the slug, which yields a live link to the wrong design. See
 *     `checkTemplateDemoMatchesItsSlug`.
 * 18. **Every `set` template demo is an absolute URL** — the demos are their own
 *     standalone static site, so an internal-looking path would be a dead link
 *     on a surface `checkInternalLinksResolve` does not walk.
 * 19. **Every family's `featured` design exists and is deployed** — it is the
 *     one loaded into the phone frame at the top of the family page, so a
 *     mistyped slug or a `pending` demo leaves an empty device under a heading
 *     promising a preview. See `checkFamilyFeaturedTemplateIsLive`.
 */

import "server-only";

import { LOCALES } from "./locales";
import { PROJECTS } from "./projects";
import {
  featuredProjects,
  publishedCaseStudyProjects,
  toShowcaseTiles,
  toPortfolioCards,
} from "./projections";
import { PRICES, type PriceEntry, type PriceToken } from "./pricing";
import { SERVICE_LINES, type ServiceLine } from "./service-lines";
import { getProjectApproach } from "./projects/approach/loader";
import { caseStudyPath, isExternalHref } from "@/lib/links";
import type { ProjectSlug } from "./projects";
import { ACADEMY } from "./authority";
import { RETAINER_COMMITMENTS } from "./retainer";
import {
  TEMPLATES,
  TEMPLATE_FAMILIES,
  featuredTemplate,
  templatesByFamily,
} from "./templates";
import type { Localized } from "./types";

/**
 * Task 4.10: flipped to `true` now that PR 4 has populated real price
 * figures in `lib/content/pricing.ts` for every one of the 8 tokens. See the
 * file header, point 8.
 */
const PRICE_INTEGRITY_CHECK_ACTIVE = true;

/**
 * Minimum showcase tile count.
 *
 * **The marquee gives this number a second, harder job than the hero did.**
 * For the hero it was an editorial floor — fewer than four screenshots and
 * the section looked thin. The marquee additionally needs enough tiles for
 * each track to outrun the widest viewport; below four the loop starts
 * showing a blank strip at the trailing edge before it restarts. See
 * `components/ui/project-marquee.tsx` for that arithmetic, and re-do it if
 * this floor is ever lowered — this constant does not encode the tile width,
 * so it cannot enforce the pixel side of the requirement on its own.
 *
 * Originally 4 by design. The
 * `fix/content-honesty` remediation slice temporarily lowered it to 3
 * because it had to honestly demote `blu` to `no-visual` (unconsented
 * capture, finding C1) and `atemporal` to `not-deployed` (domain did not
 * resolve, finding C2) rather than fabricate a fourth entry to keep the old
 * floor — that dip was a real, temporary consequence of removing dishonest
 * content, not churn.
 *
 * The `fix/restore-consented-content` slice raises it back to 4 because both
 * underlying facts reversed: the client granted consent for the `blu`
 * capture (task 3.H2, now `evidence.state: "gated"` with media), and
 * Atemporal's site was found live at a new URL,
 * `https://atemporalarq.vercel.app/` (task 1.H2, now `evidence.state:
 * "live"`) — the old `atemporalarq.com` domain still does not resolve, it
 * simply moved. With Luang, Atemporal, Blu Café, and `blu` all honest again,
 * the projection naturally has 4 entries, so 4 is once again both the design
 * target and the enforced floor — not a new, stricter requirement, just the
 * original one restored now that the content backing it is honest. See
 * `sdd/dev-services-website/verify-report.md` §7.
 */
const SHOWCASE_FLOOR = 4;

/** The one service line that legitimately has no project proof. */
const LINE_EXEMPT_FROM_PROOF: ServiceLine = "D";

/**
 * The curated (`featured`) project set's floor and ceiling —
 * `specs/project-portfolio/spec.md`'s "Curated Set Size", amended 2026-07-31
 * (remediation of `verify-report-final.md` finding C7) from a 6–8 floor to
 * 4–8, matching `SHOWCASE_FLOOR` below. See that requirement's dated amendment
 * for why the floor moved rather than a sixth project being invented to meet
 * the old number.
 */
const CURATED_SET_MIN = 4;
const CURATED_SET_MAX = 8;

/**
 * This batch's (sdd-apply, PR 3b, task 3.5) verified fact: ElectroCode
 * Academy's repository is PRIVATE and its deployment returns 404. Flip this
 * to `false` ONLY alongside a fresh verification that the deployment is
 * actually reachable — never bump `ACADEMY.state` to `"linked"` without also
 * updating this flag, or `checkAuthorityNoLinkWhileUndeployed` below fails
 * the build. That failure is deliberate: a reminder to re-verify, not a bug.
 */
const ACADEMY_VERIFIED_UNREACHABLE = true;

function isStrictMode(): boolean {
  if (process.env.SITE_CONTENT_GATE === "warn") return false;
  return process.env.VERCEL_ENV === "production";
}

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

function checkUniqueSlugs(violations: string[]): void {
  const seen = new Set<string>();
  for (const project of PROJECTS) {
    if (seen.has(project.slug)) {
      violations.push(`Duplicate project slug: "${project.slug}".`);
    }
    seen.add(project.slug);
  }
}

function checkNoSelfReferentialLinks(violations: string[]): void {
  for (const locale of LOCALES) {
    for (const tile of toShowcaseTiles(locale)) {
      // `undefined` is "this tile renders as a non-link", which is the
      // designed honest state for a project with no live site and no
      // published case study — never a violation.
      if (tile.link === undefined) continue;
      if (tile.link === "/" || tile.link === `/${locale}`) {
        violations.push(
          `Project "${tile.title}" resolves to a self-referential link ("${tile.link}") for locale "${locale}".`,
        );
      }
    }
  }
}

/**
 * Every internal showcase link must resolve to something that actually exists.
 *
 * This is the real compensating control for the `tile.link as Route` cast in
 * `components/ui/project-marquee.tsx` (previously `hero-parallax.tsx`, same
 * cast, same reason). `link` is typed `string` because it holds either an
 * external URL or an internal route, and no single `Route` type covers both —
 * so `typedRoutes` cannot check it structurally. That check has to happen
 * here instead.
 *
 * `checkNoSelfReferentialLinks` does NOT cover this. It only catches a link
 * equal to `/` or `/{locale}`. Route existence is a different property.
 *
 * LIVE_TARGETS must be extended as each slice lands: `/{locale}/precios`
 * added in a prior commit (task 4.10/hard constraint 2), now that
 * `app/[locale]/precios/page.tsx` exists; `/{locale}/proyectos/{slug}` added
 * for PR 5 (hard constraint 2), for published slugs only — derived from
 * `publishedCaseStudyProjects()` rather than hardcoded, so this list cannot
 * go stale the way a hand-maintained one could (the exact failure mode this
 * comment used to warn about); `/{locale}/gracias` added in THIS commit (PR
 * 6b, hard constraint 2), now that `app/[locale]/gracias/page.tsx` exists.
 * This function only walks `toShowcaseTiles()`, which today links internally
 * to `/proyectos/luang` and `/proyectos/blu` (the two published case studies)
 * — no tile links to `/gracias`, so that entry is defensive coverage for a
 * future one, not the first real exercise of the branch. A link added before
 * its target fails the build — which is the point, since that exact mistake
 * has already been caught four times in this change set.
 *
 * `/{locale}#proyectos` stays in the live-target set even though no tile can
 * produce it any more: `publicLink()`'s anchor fallback was deleted with the
 * hero (`lib/content/projections.ts`), so the showcase now emits `undefined`
 * where it used to emit that anchor. The entry is harmless and the anchor is
 * still a real target rendered by `components/sections/portfolio.tsx`.
 */
function checkInternalLinksResolve(violations: string[]): void {
  for (const locale of LOCALES) {
    const liveTargets = new Set<string>([
      `/${locale}`,
      `/${locale}#proyectos`,
      `/${locale}/precios`,
      `/${locale}/gracias`,
      ...publishedCaseStudyProjects().map((project) =>
        caseStudyPath(locale, project.slug),
      ),
    ]);
    for (const tile of toShowcaseTiles(locale)) {
      // A non-link tile has nothing to resolve. See
      // `checkNoSelfReferentialLinks` above.
      if (tile.link === undefined) continue;
      // External hrefs are deliberately NOT reachability-checked here. This
      // is the exact gap finding C2 (`sdd/dev-services-website/verify-report.md`)
      // exploited: `atemporalarq.com` was `evidence.state: "live"` with a
      // dead DNS entry, and this loop's `continue` never saw it. It stays
      // uncovered on purpose, not by oversight — a build-time DNS/HTTP probe
      // of a third party's domain is a NETWORK CALL during `next build`:
      // non-deterministic (the same build can pass or fail depending on
      // network conditions unrelated to any code change — S2 already
      // documents `next build` being flaky enough without adding a live
      // egress dependency), slow, and often unavailable in CI/build
      // sandboxes that block outbound network access entirely. A check that
      // sometimes fails for reasons that have nothing to do with the commit
      // being built is worse than no check — it teaches reviewers to retry
      // past red builds. External liveness is a periodic HUMAN/product
      // verification (see task 1.H2 and this same finding), not a
      // build-time gate; do not add automated coverage for it here without
      // first solving that non-determinism.
      if (isExternalHref(tile.link)) continue;
      if (!liveTargets.has(tile.link)) {
        violations.push(
          `Project "${tile.title}" links to "${tile.link}", which is not a live target for locale "${locale}". ` +
            `Either the route/anchor has not shipped yet, or LIVE_TARGETS in checkInternalLinksResolve needs updating.`,
        );
      }
    }
  }
}

/**
 * No two showcase tiles may share a label.
 *
 * Two distinct reasons, and the second is why this check survived the move off
 * `HeroParallax`:
 *
 * 1. The tile label is the visitor's only way to tell two tiles apart, and it
 *    is also what the announced copy's `alt` text describes. Two identical
 *    labels are an ambiguity for sighted visitors and an a11y defect for
 *    everyone else.
 * 2. `checkShowcaseIsSubsetOfCuratedSet` joins the showcase and the curated
 *    set BY TITLE. A collision would silently make that join lie, so this
 *    check is a precondition of that one, not merely a cosmetic rule.
 *
 * (`components/ui/project-marquee.tsx` keys its tiles by `slug`, not title, so
 * the React-key collision the original version of this check also guarded
 * against can no longer occur. The two reasons above stand on their own.)
 *
 * This fired for real: `blucafe` (the client's public site) and `blu` (that
 * same client's internal system) both carry `client: "Blu Café"`, and
 * `publicTitle()` used to return `client` for named projects, so both rendered
 * as "Blu Café". Caught by reading compiled HTML, not by any gate — hence this
 * check.
 */
function checkUniqueShowcaseTitles(violations: string[]): void {
  for (const locale of LOCALES) {
    const seen = new Set<string>();
    for (const tile of toShowcaseTiles(locale)) {
      if (seen.has(tile.title)) {
        violations.push(
          `Two showcase tiles share the label "${tile.title}" for locale "${locale}". ` +
            `checkShowcaseIsSubsetOfCuratedSet joins the two projections by title, so this also ` +
            `makes that check unreliable. Give each project a distinct "title" that identifies ` +
            `the work, not just the client.`,
        );
      }
      seen.add(tile.title);
    }
  }
}

/**
 * A project whose consent is granted but NOT `namedClient` must not name its
 * client in its own `title`, because `publicTitle()` renders that title
 * verbatim. Without this, a title like "Sistema interno de Blu Café" would
 * leak the client the consent state says to withhold.
 *
 * This guards a case that does not exist today — every granted project is also
 * `namedClient` — which is exactly when it is cheap to add.
 */
function checkGrantedTitlesDoNotLeakClient(violations: string[]): void {
  for (const project of PROJECTS) {
    const { consent } = project;
    if (consent.status !== "granted" || consent.namedClient) continue;
    if (project.title.includes(project.client)) {
      violations.push(
        `Project "${project.slug}" has granted consent WITHOUT namedClient, but its title ` +
          `("${project.title}") contains its client name ("${project.client}"). ` +
          `publicTitle() renders the title verbatim, so this would leak the client.`,
      );
    }
  }
}

/**
 * The showcase must be a SUBSET of the curated set, and the only honest reason
 * for a curated project to be missing from it is that it has no image.
 *
 * **This check matters MORE than it did, not less.** It used to compare two
 * rendered surfaces — the hero and the portfolio grid — where a divergence
 * meant the page contradicted itself and a reader could see it. The grid is
 * gone: the marquee is now the only place client work appears on the landing,
 * so a project silently dropped from it is a project that has vanished from
 * the site with nothing left to contradict. The one permitted reason
 * (`no-visual` — there is no honest screenshot to show, see
 * `specs/project-portfolio/spec.md`, "`no-visual` degrades honestly") stays
 * permitted; every other cause fails the build.
 *
 * `toPortfolioCards()` is the reference set rather than `featuredProjects()`
 * directly, because it is the projection that carries the resolved
 * `evidence.state` this check reasons about.
 *
 * Joining the two projections by `title` is sound because `publicTitle()` is
 * deterministic per project and `checkUniqueShowcaseTitles` guarantees the
 * labels do not collide.
 */
function checkShowcaseIsSubsetOfCuratedSet(violations: string[]): void {
  for (const locale of LOCALES) {
    const curated = toPortfolioCards(locale);
    const showcaseTitles = new Set(toShowcaseTiles(locale).map((t) => t.title));
    const curatedTitles = new Set(curated.map((c) => c.title));

    for (const title of showcaseTitles) {
      if (!curatedTitles.has(title)) {
        violations.push(
          `The showcase marquee shows "${title}" for locale "${locale}" but it is not in the curated set. ` +
            `Everything the landing shows must come from featuredProjects().`,
        );
      }
    }

    for (const card of curated) {
      const inShowcase = showcaseTitles.has(card.title);
      if (!inShowcase && card.evidence.state !== "no-visual") {
        violations.push(
          `Project "${card.slug}" has visual evidence ("${card.evidence.state}") but is missing from the ` +
            `showcase marquee for locale "${locale}". The marquee is the only surface on the landing that ` +
            `shows client work, so this project appears nowhere. The one permitted reason to be absent is ` +
            `"no-visual".`,
        );
      }
      if (inShowcase && card.evidence.state === "no-visual") {
        violations.push(
          `Project "${card.slug}" is "no-visual" yet appears in the showcase marquee for locale "${locale}", ` +
            `which cannot render a tile without a screenshot.`,
        );
      }
    }
  }
}

/**
 * Task 3.10: no portfolio grid card may link to a case study that is not
 * actually published.
 *
 * `toPortfolioCards()`'s `link` field is `undefined` for exactly this reason
 * whenever `project.caseStudyPublished` is `false` (`lib/content/
 * projections.ts`'s `portfolioLink()`), so this check is redundant with that
 * function's own logic today — same "defense-in-depth over a compile-time
 * guarantee" reasoning as `checkEvidenceMediaShape` above. It earns its keep
 * the moment a future edit to `portfolioLink()` (or a data entry) drifts:
 * this fails the build instead of shipping a real dead link, which is
 * exactly the class of defect already caught four times in this change set.
 *
 * External `live` links are skipped: they are never gated by case-study
 * publication (see `portfolioLink()`'s doc comment) and are out of scope for
 * a build-time reachability check for the same non-determinism reason
 * `checkInternalLinksResolve` gives for skipping external hero links.
 */
function checkPortfolioLinksOnlyToPublishedCaseStudies(violations: string[]): void {
  for (const locale of LOCALES) {
    for (const card of toPortfolioCards(locale)) {
      if (card.link === undefined) continue;
      if (isExternalHref(card.link)) continue;

      const project = PROJECTS.find((p) => p.slug === card.slug);
      if (!project?.caseStudyPublished) {
        violations.push(
          `Portfolio card "${card.slug}" links to "${card.link}" but its case study is not published ` +
            `("caseStudyPublished: false" in lib/content/projects/index.ts). A card must only link to a ` +
            `case study once it is actually published — see tasks.md task 3.4's critical constraint.`,
        );
        continue;
      }

      const expected = caseStudyPath(locale, card.slug);
      if (card.link !== expected) {
        violations.push(
          `Portfolio card "${card.slug}" link ("${card.link}") does not match its expected case-study path ` +
            `("${expected}") for locale "${locale}".`,
        );
      }
    }
  }
}

/**
 * A production build must not fall back to the localhost site URL.
 *
 * `app/layout.tsx` and `app/robots.ts` both read
 * `process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"`. That fallback
 * is correct for local development and a **silent catastrophe** in production:
 * `metadataBase` drives the canonical tag, so deploying without the variable
 * emits `<link rel="canonical" href="http://localhost:3000/es">` and a
 * `robots.txt` whose `sitemap:` points at localhost. Search engines would be
 * told the canonical home of every page is a machine they cannot reach — and
 * the build would pass without a word.
 *
 * Setting the variable is human task 2.H2, still open. Until it is done this
 * check makes the omission loud instead of silent, matching how
 * `lib/brief/abuse.ts` fails closed when its HMAC secret is absent rather than
 * accepting submissions it cannot verify.
 *
 * Local and preview builds are unaffected: `isStrictMode()` only treats
 * `VERCEL_ENV === "production"` as strict.
 */
function checkSiteUrlConfigured(violations: string[]): void {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured === undefined || isBlank(configured)) {
    violations.push(
      "NEXT_PUBLIC_SITE_URL is not set, so metadataBase and robots.txt would " +
        'fall back to "http://localhost:3000". A production build must not ship ' +
        "canonical URLs or a sitemap reference pointing at localhost (human task 2.H2).",
    );
    return;
  }
  if (configured.startsWith("http://localhost")) {
    violations.push(
      `NEXT_PUBLIC_SITE_URL is "${configured}", which is a localhost address. ` +
        "A production build must use the real public origin.",
    );
  }
}

function checkServiceLineProof(violations: string[]): void {
  const linesWithProof = new Set<ServiceLine>(PROJECTS.map((p) => p.serviceLine));
  for (const line of Object.keys(SERVICE_LINES) as ServiceLine[]) {
    if (line === LINE_EXEMPT_FROM_PROOF) continue;
    if (!linesWithProof.has(line)) {
      violations.push(`Service line "${line}" has no associated project.`);
    }
  }
}

function checkNoEmptyLocalizedValues(violations: string[]): void {
  for (const project of PROJECTS) {
    for (const locale of LOCALES) {
      if (isBlank(project.summary[locale])) {
        violations.push(`Project "${project.slug}" has an empty "summary" for locale "${locale}".`);
      }
      if (isBlank(project.problem[locale])) {
        violations.push(`Project "${project.slug}" has an empty "problem" for locale "${locale}".`);
      }
      if (isBlank(project.role[locale])) {
        violations.push(`Project "${project.slug}" has an empty "role" for locale "${locale}".`);
      }
      if (project.outcome.kind === "qualitative" && isBlank(project.outcome.statement[locale])) {
        violations.push(`Project "${project.slug}" has an empty qualitative "outcome.statement" for locale "${locale}".`);
      }
      if (project.evidence.state === "gated" && isBlank(project.evidence.disclosure[locale])) {
        violations.push(`Project "${project.slug}" has an empty "evidence.disclosure" for locale "${locale}".`);
      }
    }
  }
}

async function checkNonEmptyApproach(violations: string[]): Promise<void> {
  await Promise.all(
    PROJECTS.map(async (project) => {
      // `PROJECTS` is typed `readonly Project[]` (task 2.8), so `slug` is
      // widened to plain `string` at this module boundary even though every
      // entry is authored alongside `PROJECT_SLUGS` in the same file. The
      // cast below is safe under that authored-together invariant; the
      // `default` branch in `getProjectApproach()`'s switch is what catches
      // a slug drifting out of sync in practice.
      const { approach } = await getProjectApproach(project.slug as ProjectSlug);
      for (const locale of LOCALES) {
        if (isBlank(approach[locale])) {
          violations.push(`Project "${project.slug}" has an empty "approach" for locale "${locale}".`);
        }
      }
    }),
  );
}

function checkShowcaseFloor(violations: string[]): void {
  for (const locale of LOCALES) {
    const count = toShowcaseTiles(locale).length;
    if (count < SHOWCASE_FLOOR) {
      violations.push(
        `Showcase projection for locale "${locale}" has only ${count} tiles; the floor is ${SHOWCASE_FLOOR}. ` +
          `Below it the marquee's tracks stop covering the viewport and the loop shows a gap — ` +
          `see components/ui/project-marquee.tsx.`,
      );
    }
  }
}

function checkEvidenceMediaShape(violations: string[]): void {
  // Redundant with the compile-time guarantee in `lib/content/types.ts`'s
  // `Evidence` union (see file header, point 7) — written for
  // defense-in-depth, not because it can currently fail.
  for (const project of PROJECTS) {
    const { evidence } = project;
    if (evidence.state === "no-visual" && evidence.media.length !== 0) {
      violations.push(`Project "${project.slug}" is "no-visual" but carries media.`);
    }
    if (evidence.state !== "no-visual" && evidence.media.length === 0) {
      violations.push(`Project "${project.slug}" is "${evidence.state}" but carries no media.`);
    }
  }
}

function checkPendingPricesInProduction(violations: string[]): void {
  if (!PRICE_INTEGRITY_CHECK_ACTIVE) return;
  // `Object.entries(PRICES)` widened explicitly to `PriceEntry` per value —
  // task 4.1 populated every token as `"set"`, so without this widening
  // TypeScript infers the narrower "every entry is literally 'set'" type and
  // flags the `"pending"` comparison below as provably false. Same fix as
  // `components/pricing/price.tsx`'s `Price` component.
  const entries = Object.entries(PRICES) as [PriceToken, PriceEntry][];
  for (const [token, entry] of entries) {
    if (entry.status === "pending") {
      violations.push(`Price token "${token}" is still "pending" in a production build.`);
    }
  }
}

/**
 * Task 3.5's compensating control: the academy must stay `no-link` for as
 * long as `ACADEMY_VERIFIED_UNREACHABLE` records that its deployment has not
 * been re-verified as reachable. See that constant's own comment.
 */
function checkAuthorityNoLinkWhileUndeployed(violations: string[]): void {
  if (ACADEMY_VERIFIED_UNREACHABLE && ACADEMY.state !== "no-link") {
    violations.push(
      `ACADEMY.state is "${ACADEMY.state}" but ACADEMY_VERIFIED_UNREACHABLE is still true in ` +
        "lib/content/invariants.ts. Flip that flag only alongside a fresh verification that the " +
        "academy's deployment is actually reachable — do not upgrade the state on its own.",
    );
  }
}

/**
 * Task (remediation, `verify-report-final.md` finding C7): the curated
 * (`featured`) project set must stay within `specs/project-portfolio/
 * spec.md`'s "Curated Set Size" floor/ceiling. This is locale-independent —
 * `featuredProjects()` filters on `featured`/`consent`, neither of which
 * varies per locale — so, unlike `checkShowcaseFloor`, this runs once, not once
 * per locale.
 */
function checkCuratedSetSize(violations: string[]): void {
  const count = featuredProjects().length;
  if (count < CURATED_SET_MIN || count > CURATED_SET_MAX) {
    violations.push(
      `The curated (featured) project set has ${count} entries; ` +
        `specs/project-portfolio/spec.md's "Curated Set Size" requires between ` +
        `${CURATED_SET_MIN} and ${CURATED_SET_MAX}.`,
    );
  }
}

function isBlankLocalized(value: Localized<string>): boolean {
  return LOCALES.some((locale) => isBlank(value[locale]));
}

/**
 * Template folders that exist in the source repositories but must NEVER appear
 * in the public catalogue.
 *
 * `piero-cielo` is a real couple's private wedding invitation. `PROJECTS`
 * records the same work as `wedding-invitation-piero` with
 * `consent: { status: "withheld" }` and `evidence: { state: "no-visual",
 * media: [] }` — "No recorded consent exists to publish anything identifying".
 * Its screenshot in a gallery would be finding C1 (an unconsented capture) all
 * over again, which is the one content defect this repository has already had
 * to remediate.
 *
 * **This is a denylist by template slug, not a join on `PROJECTS`, and that is
 * deliberate.** The two identifiers do not match — the template folder is
 * `piero-cielo` and the project slug is `wedding-invitation-piero` — so a
 * string join would silently pass while proving nothing. Naming the excluded
 * folder outright is the check that actually fires. Add to this list, never
 * remove from it, unless written consent for that specific work is on record.
 */
const TEMPLATE_SLUGS_EXCLUDED_FOR_CONSENT: readonly string[] = ["piero-cielo"];

/**
 * The consent gate on the template catalogue — the guard
 * `lib/content/templates.ts`'s doc comment points at.
 *
 * Cheap, and it guards the most likely way the mistake recurs: someone adds
 * "the seventh invitation" because the repository has seven folders and the
 * catalogue shows six.
 */
function checkTemplatesExcludeWithheldWork(violations: string[]): void {
  for (const template of TEMPLATES) {
    if (TEMPLATE_SLUGS_EXCLUDED_FOR_CONSENT.includes(template.slug)) {
      violations.push(
        `Template "${template.slug}" is in the public catalogue but is excluded for consent reasons ` +
          `(see TEMPLATE_SLUGS_EXCLUDED_FOR_CONSENT in lib/content/invariants.ts). It is real client work ` +
          `recorded in lib/content/projects/index.ts with consent "withheld" — it must not be published as ` +
          `a template.`,
      );
    }
  }
}

/** No two designs may share a slug — it is the React key and the gallery id. */
function checkUniqueTemplateSlugs(violations: string[]): void {
  const seen = new Set<string>();
  for (const template of TEMPLATES) {
    if (seen.has(template.slug)) {
      violations.push(`Duplicate template slug: "${template.slug}".`);
    }
    seen.add(template.slug);
  }
}

/**
 * Every locale-keyed string the catalogue renders must be non-blank.
 *
 * Same "empty string, not still-a-stub" distinction as
 * `checkNoEmptyLocalizedValues` above: this catches a field that was added and
 * never filled, which on this surface would render as a nameless card or a
 * feature bullet that is just whitespace.
 */
function checkNoEmptyTemplateCopy(violations: string[]): void {
  for (const template of TEMPLATES) {
    if (isBlankLocalized(template.direction)) {
      violations.push(`Template "${template.slug}" has a blank "direction".`);
    }
    if (isBlankLocalized(template.bestFor)) {
      violations.push(`Template "${template.slug}" has a blank "bestFor".`);
    }
    if (isBlankLocalized(template.preview.alt)) {
      violations.push(
        `Template "${template.slug}" has blank alt text on its preview. The screenshot is the whole ` +
          `card, so this is the only description a screen-reader user gets.`,
      );
    }
  }

  for (const family of Object.values(TEMPLATE_FAMILIES)) {
    if (isBlankLocalized(family.name)) {
      violations.push(`Template family "${family.id}" has a blank "name".`);
    }
    if (isBlankLocalized(family.tagline)) {
      violations.push(`Template family "${family.id}" has a blank "tagline".`);
    }
    if (family.features.some(isBlankLocalized)) {
      violations.push(`Template family "${family.id}" has a blank entry in "features".`);
    }
    if (family.steps.some(isBlankLocalized)) {
      violations.push(`Template family "${family.id}" has a blank entry in "steps".`);
    }
  }
}

/**
 * Every family must actually have designs to show.
 *
 * A family with zero templates builds a route whose gallery is an empty grid
 * under a heading promising models — and its landing card would read "0
 * diseños". The floor is 1 rather than a larger editorial number on purpose:
 * this is a structural gate, and the honest count is whatever the catalogue
 * holds (six invitations, not seven — see
 * `checkTemplatesExcludeWithheldWork`).
 */
function checkTemplateFamiliesAreNotEmpty(violations: string[]): void {
  for (const family of Object.values(TEMPLATE_FAMILIES)) {
    if (templatesByFamily(family.id).length === 0) {
      violations.push(
        `Template family "${family.id}" has no designs, so its gallery would render empty.`,
      );
    }
  }
}

/**
 * A published demo must point at ITS OWN template.
 *
 * `deployed(family, slug)` (`lib/content/templates.ts`) takes the family and
 * slug as arguments even though the entry already declares both, so the demos
 * repository's URL layout stays visible at the call site. That redundancy is
 * only safe if something checks it: the most likely edit to this catalogue is
 * copying a neighbouring entry and changing the name, direction and image while
 * leaving `deployed(...)` pointing at the design it was copied from. The result
 * would be a live, 200-returning link to the wrong template — a defect no
 * status check and no screenshot review would catch.
 */
function checkTemplateDemoMatchesItsSlug(violations: string[]): void {
  for (const template of TEMPLATES) {
    if (template.demo.status !== "set") continue;
    const expectedSuffix = `/${template.family}/${template.slug}/`;
    if (!template.demo.value.endsWith(expectedSuffix)) {
      violations.push(
        `Template "${template.slug}" has demo "${template.demo.value}", which does not end with ` +
          `"${expectedSuffix}". A copied entry is pointing at another template's demo.`,
      );
    }
  }
}

/**
 * A published demo must be an external URL.
 *
 * The failure it guards is specific: the demos are their own standalone static
 * site (`electrocode-templates`), so the only correct value is an absolute URL.
 * An internal-looking path here would render an `<a href="/algo">` on this site
 * pointing at a route that does not exist — the dead-link class
 * `checkInternalLinksResolve` covers for the showcase and nothing covered for
 * this surface.
 */
function checkTemplateDemosAreExternal(violations: string[]): void {
  for (const template of TEMPLATES) {
    if (template.demo.status !== "set") continue;
    if (isBlank(template.demo.value)) {
      violations.push(`Template "${template.slug}" has a "set" demo with a blank URL.`);
      continue;
    }
    if (!isExternalHref(template.demo.value)) {
      violations.push(
        `Template "${template.slug}" has demo "${template.demo.value}", which is not an absolute URL. ` +
          `Templates deploy as their own standalone sites, so a demo must be an external link.`,
      );
    }
  }
}

/**
 * A family's `featured` design must be one of its own, and must be deployed.
 *
 * `TemplatePhone` (`components/templates/template-phone.tsx`) frames that
 * template's demo URL at the top of the family page. Two ways it silently ends
 * up with nothing to frame, neither of which any type catches: the slug is
 * typed as a plain `string` (so a typo compiles), and a design's `demo` can be
 * `pending` (so a family could legitimately feature a design whose demo has not
 * shipped). Both render an empty device under a heading promising a preview —
 * the same "surface shipped before its target exists" defect this file already
 * gates four other ways.
 */
function checkFamilyFeaturedTemplateIsLive(violations: string[]): void {
  for (const family of Object.values(TEMPLATE_FAMILIES)) {
    const template = featuredTemplate(family.id);
    if (!template) {
      violations.push(
        `Template family "${family.id}" features "${family.featured}", which is not one of its designs. ` +
          `The phone frame at the top of that page would render nothing.`,
      );
      continue;
    }
    if (template.demo.status !== "set") {
      violations.push(
        `Template family "${family.id}" features "${template.slug}", whose demo is "${template.demo.status}". ` +
          `The phone frame needs a deployed URL to load — feature a design that is live, or deploy this one.`,
      );
    }
  }
}

/**
 * Task 3.6's compensating control: a retainer commitment marked `"set"` in
 * `lib/content/retainer.ts` must actually carry non-blank content for every
 * locale. A `"pending"` commitment is exempt — that is the designed
 * unresolved state, not a defect.
 */
function checkRetainerCommitmentsNotBlank(violations: string[]): void {
  const {
    responseWindow,
    channels,
    scopeModel,
    includedScope,
    excludedScope,
    bugVsFeatureBoundary,
    contentChangeScope,
    cancellationTerms,
  } = RETAINER_COMMITMENTS;

  if (responseWindow.status === "set") {
    for (const tier of responseWindow.value) {
      if (isBlankLocalized(tier.severity) || isBlankLocalized(tier.window)) {
        violations.push(
          'RETAINER_COMMITMENTS.responseWindow is "set" but one of its tiers has a blank severity or window.',
        );
      }
    }
  }
  if (channels.status === "set" && channels.value.length === 0) {
    violations.push('RETAINER_COMMITMENTS.channels is "set" but its value is empty.');
  }
  if (scopeModel.status === "set" && isBlankLocalized(scopeModel.value)) {
    violations.push('RETAINER_COMMITMENTS.scopeModel is "set" but blank.');
  }
  if (includedScope.status === "set" && includedScope.value.some(isBlankLocalized)) {
    violations.push('RETAINER_COMMITMENTS.includedScope is "set" but one of its entries is blank.');
  }
  if (excludedScope.status === "set" && excludedScope.value.some(isBlankLocalized)) {
    violations.push('RETAINER_COMMITMENTS.excludedScope is "set" but one of its entries is blank.');
  }
  if (bugVsFeatureBoundary.status === "set" && isBlankLocalized(bugVsFeatureBoundary.value)) {
    violations.push('RETAINER_COMMITMENTS.bugVsFeatureBoundary is "set" but blank.');
  }
  if (contentChangeScope.status === "set" && isBlankLocalized(contentChangeScope.value)) {
    violations.push('RETAINER_COMMITMENTS.contentChangeScope is "set" but blank.');
  }
  if (cancellationTerms.status === "set" && isBlankLocalized(cancellationTerms.value)) {
    violations.push('RETAINER_COMMITMENTS.cancellationTerms is "set" but blank.');
  }
}

/**
 * Runs every check above. Throws in strict mode (`VERCEL_ENV === "production"`
 * unless `SITE_CONTENT_GATE=warn`); otherwise logs a warning and returns.
 *
 * `async` because approach resolution (point 5) is async.
 */
export async function assertContentInvariants(): Promise<void> {
  const violations: string[] = [];

  checkUniqueSlugs(violations);
  checkNoSelfReferentialLinks(violations);
  checkInternalLinksResolve(violations);
  checkUniqueShowcaseTitles(violations);
  checkGrantedTitlesDoNotLeakClient(violations);
  checkShowcaseIsSubsetOfCuratedSet(violations);
  checkSiteUrlConfigured(violations);
  checkPortfolioLinksOnlyToPublishedCaseStudies(violations);
  checkServiceLineProof(violations);
  checkNoEmptyLocalizedValues(violations);
  await checkNonEmptyApproach(violations);
  checkShowcaseFloor(violations);
  checkEvidenceMediaShape(violations);
  checkPendingPricesInProduction(violations);
  checkAuthorityNoLinkWhileUndeployed(violations);
  checkRetainerCommitmentsNotBlank(violations);
  checkCuratedSetSize(violations);
  checkTemplatesExcludeWithheldWork(violations);
  checkUniqueTemplateSlugs(violations);
  checkNoEmptyTemplateCopy(violations);
  checkTemplateFamiliesAreNotEmpty(violations);
  checkTemplateDemoMatchesItsSlug(violations);
  checkTemplateDemosAreExternal(violations);
  checkFamilyFeaturedTemplateIsLive(violations);

  if (violations.length === 0) return;

  const message = `Content integrity check failed:\n${violations.map((v) => `  - ${v}`).join("\n")}`;

  if (isStrictMode()) {
    throw new Error(message);
  }
  console.warn(message);
}
