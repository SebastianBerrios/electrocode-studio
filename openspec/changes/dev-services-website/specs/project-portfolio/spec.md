# Project Portfolio Specification

## Purpose

The curated project set (4–8 entries), how it projects into `HeroParallax`, how it renders as the landing's portfolio grid, and the honest degradation rules for missing visual evidence.

## Requirements

### Requirement: Curated Set Size

> Amended 2026-07-31, remediation of `verify-report-final.md` finding C7. This
> requirement originally set the floor at 6. The `fix/merge-duplicate-project`
> slice correctly merged the `blu-biolink` entry into `blucafe` once both were
> found to be the same project filed twice under the wrong service line — real
> content did not shrink, a double-count was corrected, and the honest count
> dropped from 6 to 5 as a direct, deliberate consequence of that correction.
> No invariant enforced the floor at the time, so the drop below 6 shipped
> unnoticed until `sdd-verify` caught it as a spec violation with no code
> defect behind it.
>
> The floor is lowered to 4, matching the hero's own floor
> (`HERO_FLOOR`/`checkHeroFloor` in `lib/content/invariants.ts`) rather than
> inventing a padded sixth entry to satisfy the old number. Below 4 the hero
> itself already fails to build (`checkHeroFloor`), so a curated-set floor
> below that number would be unenforceable in practice; a floor above it, with
> no sixth honest project ready to publish, would only pressure a future
> editor to pad the set with a duplicate or an unconsented entry — exactly
> what this requirement's own "no padding" clause forbids. The ceiling of 8
> and the ambition to grow past 5 as more case studies land are unchanged;
> only the enforced floor moves.

The published, `featured` project set MUST contain between 4 and 8 distinct entries — no padding with duplicates.

#### Scenario: No duplicate entries

- GIVEN the featured project set
- WHEN entries are compared by `slug`
- THEN no two entries are duplicates of the same project

#### Scenario: The curated set does not drop below the floor

- GIVEN the featured project set
- WHEN its size is checked at build time
- THEN a count below 4 or above 8 fails the build — the floor is a checked
  invariant, not merely a reviewer's expectation

### Requirement: Showcase Projection Is Derived, Not Literal

> Amended 2026-08-09 by the showcase-marquee change. This was "Hero Projection
> Preserves Prop Contract", and it required `HeroParallax` to keep receiving
> `{ title, link, thumbnail }[]`. That component was deleted, so a requirement
> to preserve its prop shape now protects nothing and would block a projection
> from carrying what its real consumer needs — which is exactly what happened:
> `toShowcaseTiles()` replaces the `.src` string with the `StaticImageData`
> itself (so `next/image` gets intrinsic dimensions and a blur placeholder)
> and the reused title with the asset's real per-locale alt text.
>
> The part of this requirement that was never about the component survives
> verbatim below: the rendering surface gets a PROJECTION, never the entity,
> and never a hand-written literal.

The landing's project showcase MUST consume a projection of `Project[]`
computed from the content model. It MUST NOT receive the full `Project`
entity, and the projection function — not hand-duplicated literals — MUST be
the data source.

#### Scenario: The showcase renders from curated data, not a hardcoded array

- GIVEN the curated project set in the content model
- WHEN the showcase renders
- THEN its tiles are derived from that data by a projection function, not a literal array in a component

### Requirement: Showcase Track Coverage

> Added 2026-08-09, replacing "Row Derivation From Array Length". That
> requirement constrained `HeroParallax`'s row splitting so a 6–8 entry set
> never produced an empty row, and its scenarios pinned the `useSpring`/
> `useTransform` motion values. The component is gone and the motion with it —
> the marquee is CSS `@keyframes`, not scroll-linked springs — so those
> scenarios no longer describe anything. The underlying concern does survive,
> and it is the same concern in a new form: a set too small for the layout
> leaves visible emptiness. For a parallax that was an empty row; for a
> marquee it is a blank strip at the trailing edge of the loop.

Each marquee track MUST be at least as wide as the widest supported viewport,
so no blank strip appears at any point in the loop. This is a joint property
of the tile count and the tile width; neither alone determines it.

#### Scenario: A track outruns the viewport

- GIVEN the curated set at its minimum size
- WHEN a marquee track's width is measured against a 1920px viewport
- THEN the track is wider

#### Scenario: The tile-count half is enforced at build time

- GIVEN a curated set that drops below the showcase floor
- WHEN the production build runs
- THEN it fails, naming the floor and why the marquee needs it

### Requirement: Conditional Card Link Target

Each showcase tile's link target MUST depend on whether the link is internal (a case-study route) or external (a live client URL). Internal links MUST NOT open in a new tab; external links MAY.

#### Scenario: Internal case-study link stays in the same tab

- GIVEN a project with `evidence` of `gated`, `not-deployed`, or `no-visual`
- WHEN its tile link is inspected
- THEN it does not carry `target="_blank"` and navigates to the internal case-study route

#### Scenario: External live link may open in a new tab

- GIVEN a project with `evidence: live` and a working external URL
- WHEN its tile link is inspected
- THEN it points at the external URL

### Requirement: Evidence State Rendering

> Amended 2026-08-09 by the showcase-marquee change. The table is unchanged in
> substance; what changed is where each state can be satisfied.
>
> The caveat that `gated` and `not-deployed` require used to be a paragraph
> under the screenshot in the portfolio grid. A tile in a moving row cannot
> carry a paragraph, so on the showcase it is a chip pinned to the image, and
> the project's own full `evidence.disclosure` line is rendered on the case
> study the tile links to. The obligation is unchanged and non-negotiable —
> the screenshot must never travel without its caveat, because a sanitized
> internal dashboard shown bare reads as a public product. Only the form the
> caveat takes is surface-dependent.
>
> `no-visual` is the state the marquee cannot satisfy at all: a tile IS a
> screenshot. Those projects are filtered out of the showcase rather than
> faked into it, which is the same rule the hero followed for the same reason
> — but with the grid gone it now means such a project has no landing surface
> at all. That is an accepted, recorded consequence, not an oversight: it is
> reversed by obtaining a consented capture, not by code. The build still
> fails if a project is absent for ANY other reason (see "Showcase Consistency
> With The Curated Set").

Each project MUST render according to exactly one of four evidence states.

| State | Renders |
|---|---|
| `live` | Screenshot + external link |
| `gated` | Authorized sanitized screenshot + explicit note that the product sits behind a login |
| `not-deployed` | Locally captured screenshot + note that no public deployment exists |
| `no-visual` | Text-only card that still reads as complete, on any surface that can render one |

#### Scenario: `no-visual` degrades honestly

- GIVEN a project with `evidence: no-visual`
- WHEN its card renders
- THEN it shows no broken image frame and no gray box passed off as a screenshot

#### Scenario: A screenshot never travels without its caveat

- GIVEN a project with `evidence` of `gated` or `not-deployed`
- WHEN its screenshot renders on any surface
- THEN the caveat for that state renders with it, in whatever form that surface supports

### Requirement: Showcase Consistency With The Curated Set

> Amended after `sdd-verify` finding W10. This requirement originally demanded
> the grid and hero render "the same set of projects — no project appears in one
> but not the other". That is not achievable and was never intended to be: the
> hero is an image-driven parallax, so a project with no visual evidence cannot
> appear there without rendering a broken or fake image frame — exactly what the
> `no-visual` evidence state exists to prevent. Left unamended this would have
> surfaced as a false CRITICAL when PR 3a ships the grid.
>
> Amended again 2026-08-09 by the showcase-marquee change, which retitled it
> from "Portfolio Grid Consistency With Hero". The grid is gone and the hero
> no longer shows work, so there are no longer two rendered surfaces to
> compare. The subset rule is now measured against the curated set itself —
> and it matters MORE than it did, not less. A divergence used to mean the
> page contradicted itself somewhere a reader could see. With the showcase as
> the only place client work appears on the landing, a project silently
> dropped from it has vanished from the site with nothing left to contradict.

The showcase's entries MUST be a **subset** of the curated (`featured: true`)
set.

Every project in the curated set with visual evidence MUST appear in the
showcase. A curated project MAY be absent from it, and the ONLY permitted
reason is that it has no visual evidence (`evidence.state: "no-visual"`),
because a tile cannot honestly render without a screenshot.

Any other divergence is a defect: it means the landing is hiding work the
content model says the studio has done.

#### Scenario: The showcase draws only from the curated set

- GIVEN the featured project set
- WHEN the showcase's entries are compared against it
- THEN every showcase entry appears in the curated set

#### Scenario: An absent project is absent because it has no image

- GIVEN a curated project absent from the showcase
- WHEN its evidence state is inspected
- THEN it is `no-visual`

#### Scenario: A project with imagery cannot be dropped from the showcase

- GIVEN a featured project whose evidence carries media
- WHEN the showcase projection is built
- THEN that project is present in it, and its absence fails the build

### Requirement: No Self-Referential Links

No project entry MUST have `link` resolve to `/`.

#### Scenario: The former "Blu Finances" self-link is gone

- GIVEN any project entry
- WHEN its `link` value is checked
- THEN it never equals `/`
