"use client";

import { Countdown } from "../interactive/Countdown";
import { LeafDivider } from "../decor/LineBotanical";
import { Reveal } from "../ui/Reveal";
import { useInvitation } from "../context/InvitationContext";

export function CountdownSection() {
  const invitation = useInvitation();
  const guests = invitation.guests;

  return (
    <section className="papered bg-band-alt px-6 py-20">
      <Reveal className="mx-auto flex max-w-md flex-col items-center">
        <Countdown />
      </Reveal>

      {guests && (
        <Reveal className="mx-auto mt-20 max-w-md text-center">
          <h2 className="font-display text-display-xl text-ink">
            {guests.title ?? "Estás invitado"}
          </h2>
          <LeafDivider className="mx-auto mt-3 w-32 text-accent" />
          <p className="mt-8 text-base text-ink">{guests.message}</p>
        </Reveal>
      )}
    </section>
  );
}
