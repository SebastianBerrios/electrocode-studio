"use client";

import { GiftIcon } from "../decor/Icons";
import { DialogTrigger } from "../interactive/DialogProvider";
import { Reveal } from "../ui/Reveal";
import { DisplayHeading } from "../ui/DisplayHeading";
import { useInvitation } from "../context/InvitationContext";

export function GiftsSection() {
  const invitation = useInvitation();
  const { gifts } = invitation;

  if (!gifts || !gifts.accounts || gifts.accounts.length === 0) return null;

  return (
    <section className="papered bg-band-alt px-6 py-20">
      <Reveal className="mx-auto max-w-xl text-center">
        <DisplayHeading>{gifts.title}</DisplayHeading>
        <p className="mt-4 text-base text-accent sm:text-lg">{gifts.subtitle}</p>
        <GiftIcon className="mx-auto mt-6 h-16 w-16 text-accent" />
        <DialogTrigger dialog="gifts" className="pill mt-8 w-56 max-w-full">
          Ver más
        </DialogTrigger>
      </Reveal>
    </section>
  );
}
