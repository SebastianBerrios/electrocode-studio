import { Faq } from "@/components/pricing/faq";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/content/locales";

/**
 * Server Component: landing section 7b, the FAQ block, added by the green
 * restyle. The reference direction answers objections on the home page
 * immediately before its final conversion push; here it sits between
 * Retainer (7) and the Brief form (8), so the last thing a visitor reads
 * before the form is the answer to whatever was stopping them.
 *
 * **This component owns no copy.** It is a placement and a framing line.
 * Every question, every answer, and the block heading come from
 * `components/pricing/faq.tsx` reading `pricing.faq` — the same component
 * instance the pricing page renders. That is deliberate: the same objection
 * answered two different ways on two pages is exactly the kind of drift this
 * repo's content model is built to prevent, and it is what copying the FAQ
 * into a second dictionary section would have caused.
 *
 * The consequence worth naming: this content now appears on two routes. That
 * is presentational duplication of a single source, not a second set of
 * claims — and one of those answers (`codeOwnershipPendingAnswer`) is
 * honestly pending, so it is now pending in two places at once rather than
 * settled in one and pending in the other.
 */
export function FaqSection({ locale }: { locale: Locale }) {
  const { landingFaq } = getDictionary(locale);

  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="mx-auto max-w-3xl px-4">
        <div className="reveal">
          <Faq
            locale={locale}
            headingClassName="text-center text-4xl md:text-6xl"
            intro={landingFaq.intro}
          />
        </div>
      </div>
    </section>
  );
}
