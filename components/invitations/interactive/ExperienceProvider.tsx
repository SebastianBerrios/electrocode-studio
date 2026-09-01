"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useInvitation } from "../context/InvitationContext";

type ExperienceValue = {
  entered: boolean;
  enter: (withMusic: boolean) => void;
  playing: boolean;
  toggleMusic: () => void;
  musicAvailable: boolean;
};

const ExperienceContext = createContext<ExperienceValue | null>(null);

export function useExperience(): ExperienceValue {
  const value = useContext(ExperienceContext);
  if (!value) {
    throw new Error("useExperience must be used inside <ExperienceProvider>");
  }
  return value;
}

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const invitation = useInvitation();
  const [entered, setEntered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("preview")) {
      queueMicrotask(() => {
        setEntered(true);
      });
    }
  }, []);

  const configured = (invitation.music?.src?.length ?? 0) > 0;
  const musicAvailable = configured && !loadFailed;

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  }, []);

  const enter = useCallback(
    (withMusic: boolean) => {
      setEntered(true);
      if (withMusic && musicAvailable) play();
    },
    [musicAvailable, play],
  );

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    play();
  }, [play, playing]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);

    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);
    return () => {
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
    };
  }, []);

  const value = useMemo(
    () => ({ entered, enter, playing, toggleMusic, musicAvailable }),
    [entered, enter, playing, toggleMusic, musicAvailable],
  );

  return (
    <ExperienceContext.Provider value={value}>
      {configured && (
        <audio
          ref={audioRef}
          src={invitation.music.src}
          loop
          preload="none"
          onError={() => setLoadFailed(true)}
        />
      )}
      {children}
    </ExperienceContext.Provider>
  );
}
