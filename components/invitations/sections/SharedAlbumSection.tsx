"use client";

import { CameraIcon } from "../decor/Icons";
import { Garland } from "../decor/LineBotanical";
import { DisplayHeading } from "../ui/DisplayHeading";
import { Reveal } from "../ui/Reveal";
import { useInvitation } from "../context/InvitationContext";

export function SharedAlbumSection() {
  const invitation = useInvitation();
  const { sharedAlbum } = invitation;

  if (!sharedAlbum) return null;

  return (
    <section className="papered relative overflow-hidden bg-band px-6 py-24 text-center">
      <Garland className="pointer-events-none absolute -top-4 left-1/2 w-[22rem] -translate-x-1/2 text-accent/70 sm:w-[30rem]" />

      <Reveal className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
        <DisplayHeading>{sharedAlbum.title}</DisplayHeading>
        <p className="mt-4 text-base text-muted sm:text-lg">{sharedAlbum.subtitle}</p>

        <div className="mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-page text-accent shadow-sm">
          <CameraIcon className="h-10 w-10 text-accent" />
        </div>

        {sharedAlbum.description && (
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink">
            {sharedAlbum.description}
          </p>
        )}

        <a
          href={sharedAlbum.albumUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pill mt-8 w-64 max-w-full"
        >
          {sharedAlbum.ctaLabel}
        </a>
      </Reveal>
    </section>
  );
}
