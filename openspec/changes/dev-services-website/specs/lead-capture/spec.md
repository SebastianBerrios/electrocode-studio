# Lead Capture Specification

## Purpose

The conversion path: a closing call to action on the landing, one channel a visitor can actually use, and — for whenever the brief form is mounted again — a validated submission contract with a confirmation endpoint. The backend that stores brief submissions is an open `sdd-design` fork; these requirements MUST be satisfiable by any backend choice.

## Requirements

### Requirement: Conversion Section Presence

> Amended 2026-08-09. This requirement used to read "The landing MUST include
> a brief form section (`#brief`) asking questions sufficient to identify the
> visitor's service line, project description, and contact method". The form is
> no longer mounted on the landing; the anchor, and the constraint that the
> conversion lives on the landing rather than on a `/contacto` route, are what
> survive. See "Offered Channels MUST Be Working Channels" below for why.

The landing MUST close on a conversion section anchored at `#brief`, and that section MUST be where the visitor acts — never a link onward to a dedicated `/[locale]/contacto` route.

The anchor id is load-bearing beyond this section: the header CTA, the hero's primary CTA, the "Cómo trabajamos" bento CTA and the footer link all target it, and none of those targets are structurally verified at build time.

#### Scenario: Conversion lives on the landing, not a separate route

- GIVEN the conversion section
- WHEN a visitor wants to start a conversation
- THEN they act from `#brief` on the landing, not from a `/[locale]/contacto` route

#### Scenario: The anchor every CTA points at exists

- GIVEN every internal CTA that targets `#brief`
- WHEN the landing renders
- THEN a section carrying `id="brief"` is present to receive them

### Requirement: Offered Channels MUST Be Working Channels

The conversion section MUST offer only channels that function for the visitor at the moment they are shown. It MUST NOT render a form whose backend is unconfigured, and it MUST NOT spend the section explaining that a channel is unavailable — an outage the visitor cannot act on is not conversion copy.

This is the same fail-closed discipline `lib/content/**` already applies to unresolved prices, retainer commitments and contact channels: an unresolved thing renders nothing, never a placeholder.

#### Scenario: No form is shown while its backend is unconfigured

- GIVEN the brief form's email provider environment variables are absent
- WHEN the conversion section renders
- THEN no form markup and no "form unavailable" explanation is rendered, and the section presents the channel that does work

#### Scenario: An unresolved channel renders nothing

- GIVEN `WHATSAPP.status` is `pending`
- WHEN the conversion section renders
- THEN no WhatsApp button is rendered at all, rather than a dead or placeholder `wa.me` link

### Requirement: Service Line Pre-Tagging

> Amended 2026-08-09. Scoped to the mounted form. It previously read
> unconditionally, and no shipped CTA has ever satisfied it: the pricing page's
> block-8 CTA points at WhatsApp, not at `#brief?line=`, and has since it
> shipped (tracked as verify finding W1, explicitly not fixed).

When the brief form is mounted and a visitor arrives at it via a pricing CTA for a specific line, that line MUST be pre-selected in the form.

#### Scenario: Arriving from a pricing CTA pre-fills the line

- GIVEN the brief form is mounted and a visitor activates Line B's pricing CTA
- WHEN the brief form opens
- THEN Line B is already selected

#### Scenario: Unmounted form owes nothing

- GIVEN the brief form is not mounted on any route
- WHEN this requirement is checked
- THEN it is vacuously satisfied, and no CTA is obliged to carry a `?line=` parameter

### Requirement: WhatsApp Conversion Path

> Amended 2026-08-09. Replaces "WhatsApp Escape Hatch". The name described a
> secondary route out of a primary one; with the form unmounted, WhatsApp is
> the primary — and only — path the landing offers. Its substance is unchanged
> and its independence from the form's backend is now structural rather than
> merely required: the conversion section does not import that backend.

A WhatsApp link MUST be visible on the landing's conversion section and MUST function without depending on the brief form's backend.

#### Scenario: WhatsApp works whether or not the form backend exists

- GIVEN the brief-form backend is not built or not configured
- WHEN a visitor uses the WhatsApp link
- THEN it opens a conversation with the studio's business number regardless

#### Scenario: WhatsApp number is not fabricated

- GIVEN the WhatsApp link's target number
- WHEN inspected
- THEN it is the studio's real business number, supplied as a content input, not a placeholder left in production

### Requirement: Submission Validation

The brief form MUST validate its required fields before treating a submission as successful. An invalid submission MUST NOT redirect to the confirmation route.

#### Scenario: Missing required field blocks confirmation

- GIVEN a submission missing a required field
- WHEN submitted
- THEN the visitor is not redirected to `/[locale]/gracias`

### Requirement: Confirmation Route

A successful brief submission MUST redirect to `/[locale]/gracias`, giving the conversion a measurable endpoint.

#### Scenario: Successful submission reaches the confirmation page

- GIVEN a valid brief submission
- WHEN it completes successfully
- THEN the visitor lands on `/[locale]/gracias`

### Requirement: Backend-Agnostic Contract

These requirements MUST hold regardless of whether the backend resolves to transactional email only or to persisted storage; no requirement here MUST assume a specific database or schema.

#### Scenario: Requirement set is satisfiable by email-only backend

- GIVEN the backend resolves to email-only delivery
- WHEN this spec's scenarios are checked
- THEN all of them still hold without requiring persisted storage
