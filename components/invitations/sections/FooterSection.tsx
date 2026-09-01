"use client";

import { Garland } from "../decor/LineBotanical";
import { AddToCalendar } from "../interactive/AddToCalendar";
import { DialogTrigger } from "../interactive/DialogProvider";
import { Reveal } from "../ui/Reveal";
import { useInvitation } from "../context/InvitationContext";

const QUICK_LINK = "text-base text-accent transition hover:text-on-brand";

export function FooterSection() {
  const invitation = useInvitation();
  const { couple, tagline, events, footer } = invitation;

  return (
    <footer className="papered relative overflow-hidden bg-band-alt">
      <Reveal className="mx-auto flex max-w-md flex-col items-center gap-8 px-6 py-24 text-center">
        <h2 className="flex flex-wrap items-center justify-center gap-x-3 font-display text-4xl leading-none text-ink sm:text-5xl">
          {couple.first}
          <span
            aria-hidden
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-xl text-on-brand"
          >
            &amp;
          </span>
          {couple.second}
        </h2>
        <p className="-mt-4 font-display text-xl text-accent">{tagline}</p>

        <nav className="flex flex-col items-center gap-4">
          <DialogTrigger dialog="song" className={QUICK_LINK}>
            Sugerir canción
          </DialogTrigger>
          {events && events.length > 0 && (
            <AddToCalendar
              event={events[0]}
              label="Agendar matrimonio"
              className={QUICK_LINK}
            />
          )}
        </nav>
      </Reveal>

      <Garland
        flipped
        className="pointer-events-none absolute -bottom-2 left-1/2 w-[22rem] -translate-x-1/2 text-accent/70 sm:w-[28rem]"
      />

      <div className="relative bg-band py-6 text-center text-sm text-muted">
        <p>
          {footer?.credit ?? "ElectroCode Studio"} <span aria-hidden>🧡</span>{" "}
          <a
            href={footer?.creditUrl ?? "https://electrocode.lat"}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition hover:text-ink"
          >
            para {couple.first} y {couple.second}
          </a>
        </p>
      </div>
    </footer>
  );
}
