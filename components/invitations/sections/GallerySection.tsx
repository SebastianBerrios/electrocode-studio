"use client";

import { CameraIcon } from "../decor/Icons";
import { GalleryCarousel } from "../interactive/GalleryCarousel";
import { Reveal } from "../ui/Reveal";
import { DisplayHeading } from "../ui/DisplayHeading";
import { useInvitation } from "../context/InvitationContext";

export function GallerySection() {
  const invitation = useInvitation();
  const { gallery } = invitation;

  if (!gallery || !gallery.photos || gallery.photos.length === 0) return null;

  return (
    <section className="papered overflow-hidden bg-band-alt py-20">
      <Reveal className="mx-auto max-w-2xl px-6 text-center">
        <DisplayHeading>{gallery.title}</DisplayHeading>
        <p className="mt-4 text-base text-accent sm:text-lg">{gallery.subtitle}</p>
        <CameraIcon className="mx-auto mt-6 h-14 w-14 text-accent" />
      </Reveal>

      <div className="mt-10">
        <GalleryCarousel photos={gallery.photos} />
      </div>
    </section>
  );
}
