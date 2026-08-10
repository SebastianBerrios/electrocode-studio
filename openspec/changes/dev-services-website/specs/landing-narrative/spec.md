# Landing Narrative Specification

## Purpose

The landing page (`/[locale]`) as one continuous sales argument, told in a fixed section order that follows the prospect's question sequence rather than an org chart.

## Requirements

### Requirement: Fixed Section Order

The landing MUST render its sections in this order: (1) Hero, (2) Servicios, (3) Proceso, (3b) Cómo trabajamos, (4) Proyectos, (5) Autoridad, (6) Precios summary, (7b) FAQ, (8) Brief form + WhatsApp, (9) Footer.

Sections 3b and 7b were inserted by the green restyle. They are additions between the originally-numbered sections, never reorderings of them: the remaining sequence still reads top to bottom exactly as it did.

**Section 7 (Retainer/Mantenimiento) has been removed from the landing**, and its number is retired rather than reused, so the sections that follow keep the numbers they have always had. The landing no longer pitches the maintenance retainer anywhere: line D is also filtered out of the Servicios accordion in section 2. The retainer remains a product the studio sells — see the Retainer Placement Contract below for where it now lives and what MUST stay true of it.

- **3b, "Cómo trabajamos"** — the reference direction's six-card "why work with us" grid. Every card MUST restate a commitment already held as data in `lib/content/**`; it MUST NOT claim speed, quality, or scale, none of which exist as facts in this repo. It sits after Proceso because five of its six cards qualify commitments Proceso has just introduced.
- **7b, "FAQ"** — the landing's objection block, rendered through the SAME `components/pricing/faq.tsx` and the same `pricing.faq` dictionary entries the pricing page uses. It MUST NOT hold its own questions, answers, or heading. It sits immediately before the Brief form so the last thing read before the form is the answer to whatever was stopping the visitor.

There is deliberately NO separate closing CTA band, even though the reference direction has one: sections 8 and 9 already close the page on the conversion form followed by a full-width dark-green footer, so a third closing element between them would repeat the same call twice in a row.

#### Scenario: Section order matches the specified sequence

- GIVEN the rendered landing page
- WHEN sections are enumerated top to bottom
- THEN they appear in the order Hero, Servicios, Proceso, Cómo trabajamos, Proyectos, Autoridad, Precios, FAQ, Brief/WhatsApp, Footer, with no Retainer section between Precios and FAQ

#### Scenario: The "Cómo trabajamos" grid makes no unsourced claim

- GIVEN the six cards in section 3b
- WHEN each card's statement is traced
- THEN it resolves to an existing value in `lib/content/**` or to an existing answer in `pricing.faq`, and no card asserts a delivery speed, a quality level, or a scale figure

### Requirement: Hero Section Contract

The hero MUST reuse `HeroParallax` and display real, curated shipped work, plus a statement of what is sold.

#### Scenario: Hero renders from curated data, not a hardcoded array

- GIVEN the curated project set in the content model
- WHEN the hero renders
- THEN its cards are derived from that data, not a literal array in `app/page.tsx`

### Requirement: Servicios Section Contract

The Servicios section MUST present all four service lines as self-identification cards, each linking to its pricing block and its available proof.

#### Scenario: Each service card routes to pricing and proof

- GIVEN a service line with at least one associated project
- WHEN its card is activated
- THEN it links to that line's pricing block
- AND to its available project proof

### Requirement: Proceso Section Contract

The Proceso section MUST describe a defined sequence (discovery, proposal, build, handover) and state a response-time commitment sourced from content data, not a hardcoded string.

#### Scenario: Response-time claim is data-driven

- GIVEN the Proceso section's stated response time
- WHEN the underlying content value changes
- THEN the rendered claim changes without a component code edit

### Requirement: Proyectos Section Contract

The Proyectos section MUST render the curated 6–8 project grid and hand off to individual case studies.

#### Scenario: Grid links to case studies, not external URLs for unlinkable work

- GIVEN a project with `evidence` of `gated`, `not-deployed`, or `no-visual`
- WHEN its grid card is activated
- THEN it opens the internal case-study route, not an external link

### Requirement: Autoridad Section Placement

The ElectroCode Academy authority block MUST render as landing section 5, positioned before pricing, and MUST NOT appear as a card inside the Proyectos grid.

#### Scenario: Academy is not counted among curated projects

- GIVEN the Proyectos grid's curated project count
- WHEN the academy block is checked
- THEN it is absent from that grid's card set

### Requirement: Precios Summary Section Contract

The Precios section MUST summarize pricing across the four lines and link to `/[locale]/precios` for full detail.

#### Scenario: Summary omits full package detail

- GIVEN the landing's pricing summary
- WHEN compared to `/[locale]/precios`
- THEN it shows only a subset, not the full tier anatomy, and a visible link to the full page

### Requirement: Retainer Placement Contract

The landing MUST NOT present the maintenance retainer — neither as its own section nor as a Servicios card for line D. This replaces the former "Retainer Section Contract", which required a landing section that no longer exists.

Removing it from the landing MUST NOT remove it from the site. The retainer's published commitments MUST remain reachable, and wherever they are presented they MUST still be commitment values (per the trust-signals capability) rather than a case study, since line D has no possible project proof. `/[locale]/precios` is that home: its line-D block renders the same `RETAINER_COMMITMENTS` alongside the plan prices.

Line D MUST remain a member of the service catalogue: `SERVICE_LINES`, the pricing page's line-D block, the footer's Servicios column, and the brief form's service-line selector are all unaffected by the landing's omission. Hiding a line from the landing is a narrative decision and MUST be expressed as a filter at the projection boundary, never by deleting the line from `lib/content/**`.

#### Scenario: The landing does not pitch the retainer

- GIVEN the rendered landing page
- WHEN its sections and its Servicios cards are enumerated
- THEN no section presents retainer commitments and no Servicios card names line D

#### Scenario: Retainer commitments survive on the pricing page

- GIVEN `/[locale]/precios`
- WHEN its line-D block renders
- THEN it displays commitment values from `RETAINER_COMMITMENTS`, not a portfolio-style project card

#### Scenario: The catalogue still holds four lines

- GIVEN `SERVICE_LINES`
- WHEN its keys are enumerated
- THEN A, B, C and D are all present, and D is reachable from the footer, the pricing page and the brief form

### Requirement: Conversion Section Contract

The Brief form + WhatsApp section MUST offer both a qualifying brief form and a one-tap WhatsApp link, per the `lead-capture` capability.

#### Scenario: Both conversion paths are present

- GIVEN the conversion section
- WHEN rendered
- THEN a brief form and a WhatsApp link are both visible

### Requirement: Copy Voice Constraint

Landing copy MUST NOT fabricate headcount (e.g. phrases implying a development team where the studio is solo-operated).

#### Scenario: No invented-team phrasing

- GIVEN any landing section's copy
- WHEN reviewed against the copy voice rule
- THEN it contains no phrase asserting a team of developers or employees
