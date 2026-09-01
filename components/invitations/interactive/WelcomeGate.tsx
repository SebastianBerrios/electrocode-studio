"use client";

import { Garland, LeafDivider } from "../decor/LineBotanical";
import { useInvitation } from "../context/InvitationContext";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { useExperience } from "./ExperienceProvider";

export function WelcomeGate() {
  const { entered, enter, musicAvailable } = useExperience();
  const invitation = useInvitation();
  const { couple, tagline, welcome } = invitation;

  useBodyScrollLock(!entered);

  if (entered) return null;

  return (
    <div
      data-welcome-gate
      className="papered fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-band px-8 text-center"
    >
      <Garland className="pointer-events-none absolute -top-2 left-1/2 w-[24rem] -translate-x-1/2 text-accent sm:w-[32rem]" />
      <Garland
        flipped
        className="pointer-events-none absolute -bottom-2 left-1/2 w-[24rem] -translate-x-1/2 text-accent sm:w-[32rem]"
      />

      <div className="relative z-10 flex max-w-xl flex-col items-center">
        <LeafDivider className="w-32 text-accent" />

        <p className="mt-6 text-lg text-ink sm:text-xl">{welcome.heading}</p>

        <h1 className="mt-4 flex flex-wrap items-center justify-center gap-x-3 font-display text-5xl leading-none text-ink sm:text-6xl">
          {couple.first}
          <span
            aria-hidden
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand text-2xl text-on-brand sm:h-14 sm:w-14"
          >
            &amp;
          </span>
          {couple.second}
        </h1>

        <span className="mt-5 h-px w-64 bg-accent/50 sm:w-80" />
        <p className="mt-4 font-display text-2xl text-muted">{tagline}</p>

        {musicAvailable && (
          <p className="mt-8 text-sm text-ink/80">{welcome.subheading}</p>
        )}

        <div className="mt-4 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          {musicAvailable ? (
            <>
              <button type="button" onClick={() => enter(true)} className="pill">
                {welcome.withMusicLabel}
              </button>
              <button
                type="button"
                onClick={() => enter(false)}
                className="pill bg-brand text-on-brand"
              >
                {welcome.withoutMusicLabel}
              </button>
            </>
          ) : (
            <button type="button" onClick={() => enter(false)} className="pill">
              Ingresar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
