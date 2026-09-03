"use client";

import { MusicIcon } from "../decor/Icons";
import { LeafDivider } from "../decor/LineBotanical";
import { DisplayHeading } from "../ui/DisplayHeading";
import { Reveal } from "../ui/Reveal";
import { useInvitation } from "../context/InvitationContext";

export function PlaylistSection() {
  const invitation = useInvitation();
  const playlist = invitation.playlist;

  if (!playlist) return null;

  return (
    <section className="papered bg-page px-6 py-20 text-center">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center">
        <LeafDivider className="w-28 text-accent" />
        <DisplayHeading className="mt-4">{playlist.title}</DisplayHeading>
        <p className="mt-4 text-base text-muted sm:text-lg">{playlist.subtitle}</p>

        <div className="mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-band text-brand shadow-sm">
          <MusicIcon className="h-10 w-10 text-accent" />
        </div>

        {playlist.description && (
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink">
            {playlist.description}
          </p>
        )}

        <a
          href={playlist.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pill mt-8 w-64 max-w-full"
        >
          {playlist.ctaLabel}
        </a>
      </Reveal>
    </section>
  );
}
