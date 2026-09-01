"use client";

import { DialogTrigger } from "../interactive/DialogProvider";
import { Reveal } from "../ui/Reveal";
import { DisplayHeading } from "../ui/DisplayHeading";
import { useInvitation } from "../context/InvitationContext";

export function RsvpSection() {
  const invitation = useInvitation();
  const { rsvp } = invitation;

  if (!rsvp) return null;

  return (
    <section id="rsvp" className="papered bg-band-alt px-6 py-20">
      <Reveal className="mx-auto max-w-xl text-center">
        <DisplayHeading>{rsvp.title}</DisplayHeading>
        <p className="mt-4 text-base text-muted sm:text-lg">{rsvp.subtitle}</p>
        <DialogTrigger dialog="rsvp" className="pill mt-8 w-72 max-w-full">
          {rsvp.ctaLabel}
        </DialogTrigger>
      </Reveal>
    </section>
  );
}
