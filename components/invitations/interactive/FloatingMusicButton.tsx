"use client";

import { MusicNoteIcon, MusicOffIcon } from "../decor/Icons";
import { useExperience } from "./ExperienceProvider";

export function FloatingMusicButton() {
  const { entered, playing, toggleMusic, musicAvailable } = useExperience();

  if (!entered || !musicAvailable) return null;

  return (
    <button
      type="button"
      onClick={toggleMusic}
      aria-label={playing ? "Pausar música" : "Reproducir música"}
      aria-pressed={playing}
      className="fixed right-5 bottom-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#575531]/90 text-white shadow-lg backdrop-blur-sm transition hover:bg-[#fef9f0] hover:text-[#0f1015] md:top-4 md:right-4 md:bottom-auto"
    >
      {playing ? (
        <MusicNoteIcon className="h-6 w-6 animate-disc" />
      ) : (
        <MusicOffIcon className="h-6 w-6" />
      )}
    </button>
  );
}
