"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryPhoto } from "@/lib/clients/types";

export function GalleryCarousel({ photos }: { photos: GalleryPhoto[] }) {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [active, setActive] = useState(0);

  const scrollTo = useCallback((index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    if (!track || !slide) return;

    track.scrollTo({
      left: slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const centre = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let smallest = Number.POSITIVE_INFINITY;

      Array.from(track.children).forEach((child, index) => {
        const slide = child as HTMLElement;
        const distance = Math.abs(slide.offsetLeft + slide.clientWidth / 2 - centre);
        if (distance < smallest) {
          smallest = distance;
          nearest = index;
        }
      });

      setActive(nearest);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="w-full">
      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-[calc(50%-8.5rem)] pt-2 pb-6 md:px-[calc(50%-11rem)] lg:px-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, index) => (
          <li
            key={photo.src}
            className={`polaroid w-68 shrink-0 snap-center transition-transform duration-500 md:w-[22rem] lg:w-[26rem] ${
              index === active ? "scale-100" : "scale-[0.92]"
            }`}
          >
            <div className="relative aspect-4/3 w-full overflow-hidden bg-band">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 416px, (min-width: 768px) 352px, 272px"
                className="object-cover"
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-2 flex justify-center gap-3">
        {photos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => scrollTo(index)}
            aria-label={`Ver foto ${index + 1} de ${photos.length}`}
            aria-current={index === active}
            className={`h-2.5 w-2.5 rounded-full transition ${
              index === active ? "bg-brand" : "bg-accent/35"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
