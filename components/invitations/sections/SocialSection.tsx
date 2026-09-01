"use client";

import { InstagramIcon } from "../decor/Icons";
import { Garland } from "../decor/LineBotanical";
import { Reveal } from "../ui/Reveal";
import { DisplayHeading } from "../ui/DisplayHeading";
import { useInvitation } from "../context/InvitationContext";

export function SocialSection() {
  const invitation = useInvitation();
  const { social } = invitation;

  if (!social) return null;

  return (
    <section className="papered relative overflow-hidden bg-band px-6 py-24 text-center">
      <Garland className="pointer-events-none absolute -top-4 left-1/2 w-[22rem] -translate-x-1/2 text-accent/70 sm:w-[30rem]" />

      <Reveal className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
        <DisplayHeading>{social.title}</DisplayHeading>
        <p className="mt-4 text-base text-muted sm:text-lg">{social.subtitle}</p>

        <InstagramIcon className="mt-8 h-16 w-16 text-accent" />

        {social.hashtag && (
          <a
            href={social.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 rounded-lg bg-page px-6 py-3 font-display text-3xl text-ink transition hover:text-muted sm:text-4xl"
          >
            {social.hashtag}
          </a>
        )}

        {social.instagramUrl && (
          <a
            href={social.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pill pill--outline mt-8 w-64 max-w-full"
          >
            Ver en Instagram
          </a>
        )}
      </Reveal>
    </section>
  );
}
