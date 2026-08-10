/**
 * Per-locale copy dictionary shape.
 *
 * See `openspec/changes/dev-services-website/design.md` §5, "Dictionary vs
 * content — the dividing line", and `specs/content-model/spec.md`, "Locale
 * Dictionary Structure". This is the chrome/copy layer: section headings,
 * labels, button text — never domain facts (those live in
 * `lib/content/**`).
 */

export type HeroDictionary = {
  /**
   * The hero heading, split at its accented word.
   *
   * The reference direction's hero sets the whole heading in the ink colour
   * except for a single closing word in the accent green — that one word IS
   * the composition. Modelling it as `lead` + `accent` makes the pattern
   * structural: the accent can only ever close the heading, and no call site
   * can drift into painting three scattered words or none at all.
   *
   * This replaces the previous two-line tuple, which existed because the
   * older editorial heading rendered as two deliberate lines. The heading is
   * now centred and wraps naturally at whatever width the viewport gives it,
   * so a hardcoded line split had nothing left to describe.
   */
  readonly heading: {
    readonly lead: string;
    readonly accent: string;
  };
  readonly subtitle: string;
  /** Filled CTA — the conversion path, targeting the landing's `#brief`. */
  readonly primaryCta: string;
  /** Outline CTA — the proof path, targeting the landing's `#proyectos`. */
  readonly secondaryCta: string;
};

/**
 * Site chrome — `components/layout/site-header.tsx`. Renders on every route
 * under `app/[locale]/**`, not a landing section, so it is keyed separately
 * from the numbered sections below.
 */
export type SiteHeaderDictionary = {
  readonly brand: string;
  readonly projectsLink: string;
  readonly pricingLink: string;
  readonly whatsappLink: string;
  /**
   * Alt text for the brand mark now rendered in the header bar. The mark
   * sits next to the `brand` wordmark, so it is decorative-adjacent — but
   * the pair together forms the site's home link, and an unlabelled image
   * inside a link is the one case where alt text is load-bearing.
   */
  readonly logoAlt: string;
  /**
   * Label for the header's secondary (outline) CTA, targeting the landing's
   * `#brief` section. The reference direction pairs a quiet outline CTA with
   * a filled one in the bar; here the outline is the form and the fill is
   * WhatsApp, matching which of the two this studio actually prefers.
   */
  readonly briefCta: string;
  /**
   * Skip-link label, rendered by `app/[locale]/layout.tsx` (finding W8 — no
   * page had a `<main>` landmark or a skip link, so a keyboard/screen-reader
   * visitor had to traverse the header and hero on every page). Grouped
   * here rather than in a new dictionary section because it is global site
   * chrome, same category as `header`'s other keys.
   */
  readonly skipToContentLabel: string;
};

/**
 * Site chrome — the announcement bar above the header
 * (`components/layout/announcement-banner.tsx`).
 *
 * The reference direction opens every page with a slim, full-width bar
 * carrying one promotional line. This one carries the ONE promotional fact
 * this studio actually has on record: launch pricing, limited to the first
 * `LAUNCH_PRICING_SLOTS` projects (`lib/content/pricing.ts`). The count is a
 * domain fact and is NOT stored here — `prefix`/`suffix` wrap it, the same
 * prefix/suffix pattern `pricing.launchNote*` already uses for the same
 * number on the pricing page. Nothing in this bar may state an offer,
 * deadline, or discount that is not sourced from `lib/content/**`.
 */
export type AnnouncementDictionary = {
  readonly prefix: string;
  readonly suffix: string;
  readonly linkLabel: string;
};

/**
 * Site chrome — `components/layout/site-footer.tsx`. `brand`/`projectsLink`/
 * `whatsappLink` currently repeat `header`'s values; kept as separate keys
 * (rather than shared with `header`) because the header and footer are
 * independent components and either copy may diverge later without forcing
 * a shared-type refactor.
 *
 * **Column headings, added by the green restyle**: the footer grew from a
 * single row into the reference direction's multi-column sitemap. It has
 * THREE columns, not the reference's four — there is deliberately no
 * "Recursos" column, because this site has no blog, glossary, or calculator
 * to put in one. Column headings only; the service-line names inside the
 * `services` column come from `SERVICE_LINES` (`lib/content/
 * service-lines.ts`), never restated here.
 */
export type SiteFooterDictionary = {
  readonly brand: string;
  readonly tagline: string;
  readonly projectsLink: string;
  readonly pricingLink: string;
  readonly whatsappLink: string;
  readonly logoAlt: string;
  readonly servicesHeading: string;
  readonly studioHeading: string;
  readonly contactHeading: string;
  readonly processLink: string;
  readonly retainerLink: string;
  readonly briefLink: string;
  /** `{year}` is substituted at render time with the build year. */
  readonly copyright: string;
};

/**
 * Landing section 2, "Servicios" (landing-narrative spec, "Servicios Section
 * Contract").
 *
 * One CTA per card, `pricingCta`, pointing at that line's block on
 * `/[locale]/precios` (task 4.8's `pricingLineAnchor()`). The former second
 * CTA, `proofCta` (to the Proyectos grid), was removed with the illustration
 * restyle: a service card no longer shows client work, so a "ver proyectos"
 * link next to a drawing pointed at proof the card was not making. The
 * Proyectos grid is still reachable from the navbar, the hero, and the
 * footer — this removed a duplicate route to it, not the only one.
 */
export type ServicesDictionary = {
  readonly heading: string;
  readonly pricingCta: string;
};

/**
 * Landing section 4, "Proyectos" (landing-narrative spec, "Proyectos Section
 * Contract"). `gatedNote`/`notDeployedNote` are the generic, state-level
 * labels `components/portfolio/evidence.tsx` renders alongside each
 * project's own specific `evidence.disclosure` text — structural UI copy,
 * not a domain fact, so it belongs here rather than in `lib/content/**`.
 *
 * `gatedBadge`/`notDeployedBadge` say the same thing in the length a marquee
 * tile can carry (`components/ui/project-marquee.tsx`). They are NOT a
 * softened restatement: "Evidence State Rendering" requires the caveat to
 * travel with the screenshot, and a tile has room for a chip, not a
 * paragraph. The full note and the project's own `evidence.disclosure` are
 * still rendered in full on the case study the tile links to.
 */
export type PortfolioDictionary = {
  readonly heading: string;
  readonly gatedNote: string;
  readonly notDeployedNote: string;
  readonly gatedBadge: string;
  readonly notDeployedBadge: string;
};

/**
 * Landing section 3, "Proceso" (landing-narrative spec, "Proceso Section
 * Contract", task 3.2). The phase names/descriptions, the
 * `requiresApproval` flag, and `clientApprovalDeadlineBusinessDays` are
 * domain facts and live in `lib/content/process.ts`; these keys are
 * structural UI labels around that data — the heading, the per-phase
 * approval badge, the sentence wrapping `PROCESS.revisionRoundsIncluded`,
 * and the prefix/suffix wrapping the approval-deadline number.
 */
export type ProcessDictionary = {
  readonly heading: string;
  readonly approvalBadge: string;
  readonly revisionsLabel: string;
  readonly revisionsExtra: string;
  readonly approvalDeadlinePrefix: string;
  readonly approvalDeadlineSuffix: string;
};

/**
 * One card in the "Cómo trabajamos" grid (`components/sections/
 * way-of-working.tsx`), added by the green restyle.
 */
export type WayOfWorkingItem = {
  readonly title: string;
  readonly body: string;
};

/**
 * Landing section 3b, "Cómo trabajamos" — the reference direction's
 * six-card "why work with us" grid.
 *
 * **Every card restates a commitment this repo already holds as data.** That
 * is the whole constraint on this section, and it is not a soft one: a
 * benefits grid is the easiest place on a site to publish six pleasant
 * sentences nobody can check. Each key below is traceable:
 *
 * - `publishedPrice`  -> `PRICES` / `pricing.introBody` (every line has a
 *                        published reference figure)
 * - `noMiddlemen`     -> `pricing.faq.priceReasonAnswer` ("sin intermediarios")
 * - `approvalGates`   -> `PROCESS.phases[].requiresApproval`
 * - `revisionRounds`  -> `PROCESS.revisionRoundsIncluded` (the figure is
 *                        rendered from that constant, not written here —
 *                        hence the prefix/suffix split)
 * - `itemizedScope`   -> the `notIncluded` / `excludedScope` fields that
 *                        already exist on every tier and on the retainer
 * - `noLockIn`        -> `pricing.faq.howToLeaveAnswer` +
 *                        `RETAINER_COMMITMENTS.cancellationTerms`
 *
 * Do not add a seventh card for a quality, speed, or scale claim: none of
 * those exist as facts anywhere in `lib/content/**`, and this section is
 * exactly where one would look plausible.
 */
export type WayOfWorkingDictionary = {
  /**
   * The small line above the heading. Names what the six cards *are* —
   * commitments — so the grid is not read as a list of virtues. It must stay
   * a label, never a claim: it is the one string in this section with no card
   * body underneath it to qualify what it says.
   */
  readonly eyebrow: string;
  /**
   * Split at its accented word, exactly the shape and for exactly the reason
   * documented on `HeroDictionary.heading` — the accent can only ever close
   * the heading, so no call site can drift into painting three scattered
   * words. This section is the second and only other place that uses it.
   */
  readonly heading: {
    readonly lead: string;
    readonly accent: string;
  };
  readonly intro: string;
  /**
   * Label for the CTA cell that sits inside the bento grid. Deliberately the
   * same words as `header.briefCta` and `footer.briefLink`, because it is the
   * same destination (the landing's `#brief`) — a third name for one target
   * would read as a third offer.
   */
  readonly ctaLabel: string;
  readonly publishedPrice: WayOfWorkingItem;
  readonly noMiddlemen: WayOfWorkingItem;
  readonly approvalGates: WayOfWorkingItem;
  /** Wraps `PROCESS.revisionRoundsIncluded`, same prefix/suffix pattern as
   *  `process.revisionsLabel` and the announcement bar. */
  readonly revisionRounds: {
    readonly title: string;
    readonly bodyPrefix: string;
    readonly bodySuffix: string;
  };
  readonly itemizedScope: WayOfWorkingItem;
  readonly noLockIn: WayOfWorkingItem;
};

/**
 * Landing section 7b — the landing's FAQ block.
 *
 * Holds NO questions or answers of its own — and no heading either. Both the
 * entries and the block heading come from `pricing.faq`, rendered through the
 * same `components/pricing/faq.tsx` the pricing page uses, so the two pages
 * can never drift into answering the same objection differently or naming the
 * block differently. This type carries only the one string the landing adds
 * on top: its framing line.
 */
export type LandingFaqDictionary = {
  readonly intro: string;
};

/**
 * Landing section 5, "Autoridad" (trust-signals spec, "Academy Block
 * Placement" / "Academy No-Link State While Undeployed"). The academy's
 * name/description are domain facts and live in `lib/content/authority.ts`;
 * `heading`/`intro` are structural framing copy around that data, and
 * `visitCta` is a UI label reserved for the `linked` state — unused today
 * because `ACADEMY.state` is `no-link`, but declared here so upgrading the
 * academy's state later needs no new dictionary key.
 */
export type AuthorityDictionary = {
  readonly heading: string;
  readonly intro: string;
  readonly visitCta: string;
};

/**
 * Landing section 7, "Retainer/Mantenimiento" (landing-narrative spec,
 * "Retainer Section Contract"; trust-signals spec, "Retainer Published
 * Commitments" / "Itemized Maintenance Scope"). The commitment values
 * themselves are domain facts and live in `lib/content/retainer.ts`'s
 * `RETAINER_COMMITMENTS`; these keys are the structural headings/labels
 * around that data.
 */
export type RetainerDictionary = {
  readonly heading: string;
  readonly responseHeading: string;
  readonly includedHeading: string;
  readonly excludedHeading: string;
  readonly cancellationLabel: string;
};

/**
 * The pricing page's FAQ block (`components/pricing/faq.tsx`), task 4.5.
 * `specs/pricing/spec.md`'s "FAQ Objection Coverage" names four mandatory
 * objections. Three are answered from settled facts; `codeOwnership` is
 * honestly `Pending*` — the studio has not been asked/has not supplied a
 * code-ownership policy this batch. See `components/pricing/faq.tsx`'s doc
 * comment and apply-progress.md's open items.
 */
export type PricingFaqDictionary = {
  readonly heading: string;
  readonly priceReasonQuestion: string;
  readonly priceReasonAnswer: string;
  readonly laterChangesQuestion: string;
  readonly laterChangesAnswer: string;
  readonly codeOwnershipQuestion: string;
  readonly codeOwnershipPendingAnswer: string;
  readonly howToLeaveQuestion: string;
  readonly howToLeaveAnswer: string;
};

/**
 * The pricing page (`/[locale]/precios`, `specs/pricing/spec.md`). Domain
 * facts (figures, tier anatomy, terms) live in `lib/content/pricing.ts`;
 * these keys are the structural headings/labels around that data, following
 * the same dividing line every other section already uses.
 */
export type PricingDictionary = {
  readonly heading: string;
  readonly introHeading: string;
  readonly introBody: string;
  readonly launchNotePrefix: string;
  readonly launchNoteSuffix: string;
  readonly lineAHeading: string;
  readonly lineCHeading: string;
  readonly lineBHeading: string;
  readonly lineDHeading: string;
  readonly audienceLabel: string;
  readonly deliverablesLabel: string;
  readonly notIncludedHeading: string;
  readonly turnaroundLabel: string;
  readonly turnaroundPendingNote: string;
  readonly revisionsPrefix: string;
  readonly revisionsSuffix: string;
  readonly quoteShapesHeading: string;
  readonly quoteVariablesHeading: string;
  readonly quoteProcessHeading: string;
  readonly quoteFloorPrefix: string;
  readonly termsHeading: string;
  readonly alwaysIncludedHeading: string;
  readonly alwaysExtraHeading: string;
  readonly paymentScheduleLabel: string;
  readonly paymentSchedulePendingNote: string;
  readonly ctaHeading: string;
  readonly ctaBody: string;
  readonly ctaButtonLabel: string;
  readonly faq: PricingFaqDictionary;
};

/**
 * Landing section 6, "Precios summary" (`components/sections/
 * pricing-summary.tsx`, task 3.8). `specs/landing-narrative/spec.md`'s
 * "Precios Summary Section Contract" requires this to show only a subset of
 * the full tier anatomy plus a link to `/[locale]/precios` — so this
 * dictionary is deliberately smaller than `PricingDictionary` above, not a
 * duplicate of it.
 */
export type PricingSummaryDictionary = {
  readonly heading: string;
  readonly intro: string;
  readonly viewFullPricingLink: string;
  /** Prefix for a line whose summary figure is its cheapest tier, not its price. */
  readonly fromPrefix: string;
};

/**
 * The case-study route (`/[locale]/proyectos/[slug]`, `specs/case-study/
 * spec.md`, task 5.1/5.2). The project's own facts (title, problem, role,
 * stack, outcome, evidence, approach) live in `lib/content/projects/**`;
 * these keys are the structural headings/labels around that data, following
 * the same dividing line every other section already uses.
 *
 * `stackUnavailableNote` is the honest fallback for a project (like `luang`)
 * with no verified stack on record — never a fabricated technology list.
 */
export type CaseStudyDictionary = {
  readonly problemHeading: string;
  readonly roleHeading: string;
  readonly approachHeading: string;
  readonly stackHeading: string;
  readonly stackUnavailableNote: string;
  readonly outcomeHeading: string;
  readonly nextStepHeading: string;
  readonly nextStepBody: string;
  readonly viewPricingCtaLabel: string;
  readonly contactCtaLabel: string;
  readonly backToProjectsLabel: string;
};

/**
 * Landing section 8, the brief form + WhatsApp conversion section
 * (`components/sections/brief.tsx`, task 6.6; `specs/lead-capture/spec.md`).
 * Field rules and validation messages live in `lib/brief/schema.ts`
 * (`BriefErrors`, one dictionary namespace per concern); these keys are the
 * structural labels/copy around that pure validator, following the same
 * dividing line every other section already uses.
 *
 * `whatsappOnlyBody` is the copy rendered when `isBriefFormConfigured()`
 * (`lib/brief/config.ts`) is `false` — the fail-closed WhatsApp-only path
 * this batch's overriding rule requires. It must read as an honest
 * invitation to use WhatsApp, never as a "form coming soon" placeholder.
 */
export type BriefDictionary = {
  readonly heading: string;
  readonly intro: string;
  readonly serviceLineLabel: string;
  readonly serviceLinePlaceholder: string;
  readonly budgetBandLabel: string;
  readonly budgetBandPlaceholder: string;
  readonly nameLabel: string;
  readonly emailLabel: string;
  readonly phoneLabel: string;
  readonly phoneOptionalNote: string;
  readonly projectDescriptionLabel: string;
  readonly submitLabel: string;
  readonly submittingLabel: string;
  readonly errorSummaryHeading: string;
  readonly sendFailedHeading: string;
  readonly sendFailedBody: string;
  /**
   * Copy for `status: "rejected"` (remediation of `verify-report-final.md`
   * finding C2 — previously rendered nothing at all). Deliberately generic:
   * must not reveal which abuse-layer control tripped.
   */
  readonly rejectedHeading: string;
  readonly rejectedBody: string;
  readonly whatsappFallbackLabel: string;
  /** Shown only when JavaScript is unavailable — the form cannot be submitted then. */
  readonly noscriptHeading: string;
  readonly noscriptBody: string;
  readonly whatsappAsideHeading: string;
  readonly whatsappAsideBody: string;
  readonly whatsappCtaLabel: string;
  readonly whatsappOnlyBody: string;
};

/**
 * `/[locale]/gracias`, the brief form's confirmation route (task 6.8,
 * `specs/lead-capture/spec.md`, "Confirmation Route"). Reachable directly
 * without having submitted anything, so `body` must read sensibly standalone
 * and must NOT claim a submission was just received. It also does not
 * restate a response-time commitment — no such commitment has been settled
 * for lead intake (the retainer response window in `lib/content/
 * retainer.ts` is a different, post-launch maintenance commitment) — see
 * `app/[locale]/gracias/page.tsx`'s doc comment for the full reasoning.
 */
export type GraciasDictionary = {
  readonly heading: string;
  readonly body: string;
  readonly whatsappCtaLabel: string;
  readonly backToHomeLabel: string;
};

export type Dictionary = {
  readonly announcement: AnnouncementDictionary;
  readonly header: SiteHeaderDictionary;
  readonly footer: SiteFooterDictionary;
  readonly hero: HeroDictionary;
  readonly services: ServicesDictionary;
  readonly process: ProcessDictionary;
  readonly wayOfWorking: WayOfWorkingDictionary;
  readonly landingFaq: LandingFaqDictionary;
  readonly portfolio: PortfolioDictionary;
  readonly authority: AuthorityDictionary;
  readonly retainer: RetainerDictionary;
  readonly pricing: PricingDictionary;
  readonly pricingSummary: PricingSummaryDictionary;
  readonly caseStudy: CaseStudyDictionary;
  readonly brief: BriefDictionary;
  readonly gracias: GraciasDictionary;
};
