"use client";

import { ChevronDownIcon, QuoteMark } from "../decor/Icons";
import { DateSprig, Garland } from "../decor/LineBotanical";
import { useInvitation } from "../context/InvitationContext";

export function HeroSection() {
  const invitation = useInvitation();
  const { couple, tagline, displayDate, hero } = invitation;

  return (
    <section className="papered relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-band px-6 py-24 text-center">
      <Garland className="pointer-events-none absolute -top-2 left-1/2 w-[26rem] -translate-x-1/2 text-accent sm:w-[34rem]" />
      <Garland
        flipped
        className="pointer-events-none absolute -bottom-2 left-1/2 w-[26rem] -translate-x-1/2 text-accent sm:w-[34rem]"
      />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <div className="flex w-full items-center justify-center gap-4">
          <DateSprig className="w-16 text-accent sm:w-20" mirrored />
          <p className="text-lg tracking-[0.06em] text-muted sm:text-xl">{displayDate}</p>
          <DateSprig className="w-16 text-accent sm:w-20" />
        </div>

        <h1 className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 leading-none text-ink sm:gap-x-5">
          <span className="font-display text-hero-name">{couple.first}</span>
          <span
            aria-hidden
            className="grid h-[0.62em] w-[0.62em] shrink-0 place-items-center rounded-full bg-brand font-display leading-none text-on-brand"
            style={{ fontSize: "var(--text-hero-name)" }}
          >
            <span className="text-[0.4em] leading-none">&amp;</span>
          </span>
          <span className="font-display text-hero-name">{couple.second}</span>
        </h1>

        <span className="mt-6 h-px w-64 bg-accent/50 sm:w-96" />

        <p className="mt-5 font-display text-2xl text-muted sm:text-3xl">{tagline}</p>

        <figure className="mt-12 flex flex-col items-center gap-3">
          <QuoteMark className="h-5 w-7 text-soft sm:h-6 sm:w-8" />
          <blockquote className="max-w-lg text-base leading-relaxed text-ink sm:text-lg">
            {hero.quote}
          </blockquote>
          <QuoteMark className="h-5 w-7 text-soft sm:h-6 sm:w-8" flipped />
        </figure>
      </div>

      <ChevronDownIcon className="animate-chevron relative z-10 mt-12 h-5 w-9 text-muted/80" />
    </section>
  );
}
