"use client";

import { LINE_ICONS } from "../decor/Icons";
import { DialogTrigger } from "../interactive/DialogProvider";
import { Reveal } from "../ui/Reveal";
import { DisplayHeading } from "../ui/DisplayHeading";
import { useInvitation } from "../context/InvitationContext";
import type { PartyCard } from "@/lib/clients/types";

function Card({ card }: { card: PartyCard }) {
  const Icon = LINE_ICONS[card.icon] || LINE_ICONS.notes;
  const dialog = card.action.kind === "song" ? "song" : (`info:${card.id}` as const);

  return (
    <Reveal className="panel flex h-full flex-col items-center px-8 py-10 text-center">
      <h3 className="font-display text-2xl text-ink">{card.title}</h3>
      <Icon className="mt-6 h-16 w-16 text-accent" />
      <div className="mt-6 text-base text-muted md:flex-1">
        {card.body.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </div>
      <DialogTrigger dialog={dialog} className="pill mt-7 w-full max-w-60">
        {card.action.label}
      </DialogTrigger>
    </Reveal>
  );
}

export function PartySection() {
  const invitation = useInvitation();
  const { party } = invitation;

  if (!party || !party.cards || party.cards.length === 0) return null;

  return (
    <section className="papered bg-band px-6 py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <DisplayHeading>{party.title}</DisplayHeading>
        <p className="mt-4 text-base text-muted sm:text-lg">{party.subtitle}</p>
      </Reveal>

      <div
        className={`mx-auto mt-12 grid max-w-md grid-cols-1 gap-6 md:max-w-4xl md:grid-cols-2 ${
          party.cards.length > 2 ? "lg:max-w-6xl lg:grid-cols-3" : "lg:max-w-4xl lg:grid-cols-2"
        }`}
      >
        {party.cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
