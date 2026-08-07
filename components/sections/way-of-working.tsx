import {
  BadgeCheck,
  CircleDollarSign,
  ListChecks,
  RefreshCw,
  Unlock,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import { PROCESS } from "@/lib/content/process";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/content/locales";

/**
 * Server Component: landing section 3b, "Cómo trabajamos" — the reference
 * direction's six-card grid of reasons to work with the studio, added by the
 * green restyle.
 *
 * **Why this section is allowed to exist here at all.** The reference site's
 * equivalent block sits inside a run of sections built on social proof
 * (testimonial carousel, client-logo strip, review badge). None of those
 * were reproduced: this repo holds zero testimonials, and its content model
 * actively resists inventing them — `lib/content/authority.ts`'s type has no
 * field for a student, course, or review count precisely so the academy
 * block cannot claim scale. A six-card grid of *the studio's own published
 * commitments* is the one card in that run whose content this repo actually
 * has, so it is the one that got built.
 *
 * **Every card is traceable to data, not to copywriting.** See
 * `WayOfWorkingDictionary`'s doc comment for the key-by-key provenance. The
 * revision-rounds card renders `PROCESS.revisionRoundsIncluded` rather than
 * spelling the figure into the dictionary, so it cannot drift away from what
 * `components/sections/process.tsx` states two sections above it.
 *
 * The icons are decorative only (`aria-hidden`): each sits beside a real
 * `<h3>` that already names the card, so announcing them would be noise.
 */
type Card = {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly body: string;
};

export function WayOfWorking({ locale }: { locale: Locale }) {
  const { wayOfWorking } = getDictionary(locale);

  const cards: readonly Card[] = [
    { icon: CircleDollarSign, ...wayOfWorking.publishedPrice },
    { icon: UserRoundCheck, ...wayOfWorking.noMiddlemen },
    { icon: BadgeCheck, ...wayOfWorking.approvalGates },
    {
      icon: RefreshCw,
      title: wayOfWorking.revisionRounds.title,
      body: `${wayOfWorking.revisionRounds.bodyPrefix} ${PROCESS.revisionRoundsIncluded} ${wayOfWorking.revisionRounds.bodySuffix}`,
    },
    { icon: ListChecks, ...wayOfWorking.itemizedScope },
    { icon: Unlock, ...wayOfWorking.noLockIn },
  ];

  return (
    <section id="como-trabajamos" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="reveal mx-auto max-w-3xl text-center">
          <h2 className="text-4xl md:text-6xl">{wayOfWorking.heading}</h2>
          <p className="mt-5 text-base text-muted-foreground">
            {wayOfWorking.intro}
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <article
              key={card.title}
              style={{ animationDelay: `${index * 70}ms` }}
              className="reveal flex h-full flex-col gap-4 rounded-3xl border border-border bg-card p-7 transition-colors hover:border-foreground/30"
            >
              <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-accent-signal">
                <card.icon aria-hidden="true" className="size-5" />
              </span>
              <h3 className="text-lg text-card-foreground">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
