"use client";

import { LINE_ICONS } from "../decor/Icons";
import { LeafDivider } from "../decor/LineBotanical";
import { AddToCalendar } from "../interactive/AddToCalendar";
import { Reveal } from "../ui/Reveal";
import { useInvitation } from "../context/InvitationContext";
import type { EventBlock } from "@/lib/clients/types";
import { googleMapsUrl } from "../lib/maps";

function EventCard({ event }: { event: EventBlock }) {
  const Icon = LINE_ICONS[event.icon] || LINE_ICONS.rings;

  return (
    <Reveal className="panel flex h-full flex-col items-center px-6 py-12 text-center sm:px-10">
      <Icon className="h-16 w-16 shrink-0 text-accent" />

      <div className="mt-6 flex min-h-[7rem] sm:min-h-[8.5rem] md:min-h-[10.5rem] items-center justify-center">
        <h3 className="font-display text-display-xl leading-tight text-ink">{event.label}</h3>
      </div>
      <LeafDivider className="mt-3 w-32 shrink-0 text-accent" />

      <div className="mt-8 flex w-full flex-col items-center">
        <h4 className="font-display text-2xl text-ink">Día</h4>
        <div className="mt-2 flex min-h-[2.5rem] items-center justify-center text-center">
          <p className="text-base text-muted">{event.dayLabel}</p>
        </div>
        <div className="mt-5 w-full">
          <AddToCalendar event={event} className="pill w-full" />
        </div>
      </div>

      <div className="mt-10 flex w-full flex-1 flex-col items-center">
        <h4 className="font-display text-2xl text-ink">Lugar</h4>
        <div className="mt-2 flex min-h-[4rem] flex-col items-center justify-center text-center">
          <p className="text-base text-muted">{event.venue}</p>
          <p className="text-base text-muted">{event.address}</p>
        </div>
        <div className="mt-auto w-full pt-5">
          <a
            href={googleMapsUrl(event.venue, event.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="pill w-full block text-center"
          >
            ¿Cómo llegar?
          </a>
        </div>
      </div>
    </Reveal>
  );
}

export function EventsSection() {
  const invitation = useInvitation();

  return (
    <section className="papered bg-band px-6 py-20">
      <div className="mx-auto grid max-w-md grid-cols-1 gap-8 md:max-w-4xl md:grid-cols-2">
        {invitation.events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
