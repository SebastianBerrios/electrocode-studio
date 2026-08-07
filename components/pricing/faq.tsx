import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/content/locales";

/**
 * Server Component: the pricing page's FAQ block, native `<details>/
 * <summary>`. Task 4.5. **Rejected: Radix/shadcn accordion** per design.md
 * D10 — costs a client boundary + a dependency for something the platform
 * already gives for free, keyboard-operable, no JS required.
 *
 * `specs/pricing/spec.md`'s "FAQ Objection Coverage" names four mandatory
 * objections. Three are answered from settled facts (launch pricing,
 * revision rounds + retainer, retainer cancellation terms — all sourced
 * from `lib/dictionaries/es.ts`'s `pricing.faq`, itself derived from
 * `lib/content/pricing.ts`/`lib/content/retainer.ts`'s real data, never a
 * new invented claim). The fourth, code ownership, has not been supplied
 * this batch — rendered honestly as pending rather than a fabricated policy.
 * See apply-progress.md's open items.
 *
 * **Heading level, corrected 2026-08-01 (remediation of
 * `verify-report-final.md` finding W9)**: this block's own heading was
 * `<h3>` while it is the block's ONLY heading — every other pricing-page
 * block (Line A/C/B/D, terms) has its `<h2>` rendered by
 * `app/[locale]/precios/page.tsx` one level above its content, so this was
 * the one block heading at the wrong level. Raised to `<h2>` to match its
 * siblings; nothing nests under it (`<details>/<summary>` are not headings).
 */
export function Faq({
  locale,
  headingClassName = "text-2xl font-medium text-card-foreground md:text-3xl",
  headingId,
  intro,
}: {
  locale: Locale;
  /**
   * Overridable so the landing can render the same block under its own
   * centred section-heading scale (`components/sections/faq-section.tsx`)
   * without this component learning about page layouts. Defaults to the
   * pricing page's original classes, so that call site is unchanged.
   */
  headingClassName?: string;
  /** Set when a caller needs to reference this heading from `aria-labelledby`. */
  headingId?: string;
  /**
   * Optional framing paragraph rendered between the heading and the
   * questions. The landing supplies one; the pricing page does not, because
   * there the block already sits under the page's own pricing narrative.
   */
  intro?: string;
}) {
  const { faq } = getDictionary(locale).pricing;

  const entries: readonly [string, string][] = [
    [faq.priceReasonQuestion, faq.priceReasonAnswer],
    [faq.laterChangesQuestion, faq.laterChangesAnswer],
    [faq.codeOwnershipQuestion, faq.codeOwnershipPendingAnswer],
    [faq.howToLeaveQuestion, faq.howToLeaveAnswer],
  ];

  return (
    <div>
      <h2 id={headingId} className={headingClassName}>
        {faq.heading}
      </h2>
      {intro ? (
        <p className="mx-auto mt-5 max-w-2xl text-center text-base text-muted-foreground">
          {intro}
        </p>
      ) : null}
      <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
        {entries.map(([question, answer]) => (
          <details key={question} className="group p-5">
            <summary className="cursor-pointer list-none text-sm font-medium text-card-foreground marker:content-none">
              {question}
              <span
                aria-hidden="true"
                className="float-right text-muted-foreground transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
