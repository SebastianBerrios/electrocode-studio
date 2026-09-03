"use client";

import type { InvitationConfig } from "@/lib/clients/types";
import { InvitationProvider } from "./context/InvitationContext";
import { ExperienceProvider } from "./interactive/ExperienceProvider";
import { DialogProvider } from "./interactive/DialogProvider";
import { FloatingMusicButton } from "./interactive/FloatingMusicButton";
import { WelcomeGate } from "./interactive/WelcomeGate";
import { HeroSection } from "./sections/HeroSection";
import { CountdownSection } from "./sections/CountdownSection";
import { EventsSection } from "./sections/EventsSection";
import { GallerySection } from "./sections/GallerySection";
import { PartySection } from "./sections/PartySection";
import { PlaylistSection } from "./sections/PlaylistSection";
import { GiftsSection } from "./sections/GiftsSection";
import { SocialSection } from "./sections/SocialSection";
import { FooterSection } from "./sections/FooterSection";
import "./styles/invitation.css";
import { useEffect } from "react";

export function InvitationView({ invitation }: { invitation: InvitationConfig }) {
  useEffect(() => {
    document.documentElement.classList.add("reveal-ready");
    if (new URLSearchParams(window.location.search).has("preview")) {
      document.documentElement.classList.add("preview-embed");
    }
  }, []);

  return (
    <InvitationProvider value={invitation}>
      <ExperienceProvider>
        <DialogProvider>
          <div className="invitation-wrapper selection:bg-[#575531] selection:text-[#fef9f0]">
            <WelcomeGate />

            <main>
              <HeroSection />
              <CountdownSection />
              <EventsSection />
              <GallerySection />
              <PartySection />
              <PlaylistSection />
              <GiftsSection />
              <SocialSection />
            </main>

            <FooterSection />
            <FloatingMusicButton />
          </div>
        </DialogProvider>
      </ExperienceProvider>
    </InvitationProvider>
  );
}
