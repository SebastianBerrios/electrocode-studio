/**
 * Shape of a client digital wedding invitation.
 * Contains all couple data, event logistics, assets, music, and configuration.
 */

export type CoupleNames = {
  first: string;
  second: string;
};

export type CalendarEvent = {
  title: string;
  /** Start instant, ISO 8601 WITH an offset (e.g. `2026-10-10T13:30:00-05:00`). */
  startsAt: string;
  durationMinutes: number;
};

export type LineIcon =
  | "rings"
  | "confetti"
  | "camera"
  | "music"
  | "dress"
  | "notes"
  | "transport"
  | "lodging"
  | "gift";

export type EventBlock = {
  id: string;
  label: string;
  dayLabel: string;
  venue: string;
  address: string;
  icon: LineIcon;
  calendar: CalendarEvent;
};

export type GalleryPhoto = {
  src: string;
  alt: string;
};

export type PlaylistConfig = {
  title: string;
  subtitle: string;
  description?: string;
  ctaLabel: string;
  spotifyUrl: string;
};

export type SharedAlbumConfig = {
  title: string;
  subtitle: string;
  description?: string;
  ctaLabel: string;
  albumUrl: string;
};

export type SocialConfig = {
  title: string;
  subtitle: string;
  hashtag?: string;
  instagramUrl?: string;
};

export type PartyCardAction = {
  label: string;
  kind?: "song" | "info";
  modalTitle?: string;
  modalBody?: string[];
};

export type PartyCard = {
  id: string;
  title: string;
  body: string[];
  icon: LineIcon;
  action: PartyCardAction;
};

export type CopyAction = {
  label: string;
  value: string;
};

export type GiftAccount = {
  label: string;
  lines: string[];
  copyValue: string;
  copyActions?: CopyAction[];
};

export type InvitationThemeConfig = {
  preset: "noche-estrellada" | "magnolias-olive-ii" | "aurum-wine-ii" | "hojas" | string;
  tokens?: {
    page?: string;
    band?: string;
    bandAlt?: string;
    card?: string;
    ink?: string;
    muted?: string;
    accent?: string;
    soft?: string;
    btn?: string;
    btnInk?: string;
    brand?: string;
    onBrand?: string;
  };
};

export type InvitationConfig = {
  slug: string;
  theme?: InvitationThemeConfig;
  couple: CoupleNames;
  tagline: string;
  meta: {
    title: string;
    description: string;
  };
  displayDate: string;
  countdownTarget: string;
  welcome: {
    heading: string;
    subheading: string;
    withMusicLabel: string;
    withoutMusicLabel: string;
  };
  hero: {
    quote: string;
  };
  music: {
    src: string;
    title: string;
  };
  guests?: {
    title?: string;
    names?: string[];
    note?: string;
    message: string;
  };
  events: EventBlock[];
  rsvp: {
    title: string;
    subtitle: string;
    ctaLabel: string;
    whatsappNumber: string;
  };
  gallery: {
    title: string;
    subtitle: string;
    photos: GalleryPhoto[];
  };
  party: {
    title: string;
    subtitle: string;
    cards: PartyCard[];
  };
  playlist?: PlaylistConfig;
  gifts: {
    title: string;
    subtitle: string;
    modalTitle: string;
    modalIntro?: string;
    accounts: GiftAccount[];
  };
  social?: SocialConfig;
  sharedAlbum?: SharedAlbumConfig;
  footer: {
    credit: string;
    creditUrl: string;
  };
};
