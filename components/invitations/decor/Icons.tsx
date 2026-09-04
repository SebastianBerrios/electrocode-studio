/**
 * Line-art icon set.
 */

type IconProps = {
  className?: string;
  title?: string;
};

function Svg({
  className,
  title,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {children}
    </svg>
  );
}

export function RingsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="23" cy="32" r="17" />
      <circle cx="41" cy="32" r="17" />
    </Svg>
  );
}

export function GlassesIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 16h12l-3 13a3 3 0 0 1-6 0Z" />
      <path d="M26 29v15" />
      <path d="M21 46h10" />
      <path d="M32 16h12l-3 13a3 3 0 0 1-6 0Z" />
      <path d="M38 29v15" />
      <path d="M33 46h10" />
    </Svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="10" y="20" width="40" height="30" rx="3" />
      <circle cx="30" cy="35" r="9" />
      <path d="M22 20l3-6h12l3 6" />
      <rect x="40" y="25" width="6" height="4" rx="1" />
    </Svg>
  );
}

export function MusicIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M26 42V16l20-4v26" />
      <circle cx="21" cy="43" r="5" />
      <circle cx="41" cy="39" r="5" />
    </Svg>
  );
}

/** Suit and dress on hangers — the dress-code card. */
export function DressIcon(props: IconProps) {
  return (
    <Svg {...props}>
      {/* Suit / Tuxedo (left) */}
      <path d="M21 13a2.5 2.5 0 1 0 0 5c-1.5 0-1.5 1.5 0 2.5v2" />
      <path d="M12 28l9-5.5 9 5.5" />
      <path d="M13 27.5V49h16V27.5" />
      <path d="M16.5 25.5L21 34l4.5-8.5" />
      <path d="M19 24.5h4l-2 1.5 2 1.5h-4l2-1.5Z" />
      <line x1="15" y1="36" x2="18" y2="36" />
      <line x1="21" y1="38" x2="21" y2="44" strokeDasharray="0.1 3" />

      {/* Formal Dress (right) */}
      <path d="M43 13a2.5 2.5 0 1 0 0 5c-1.5 0-1.5 1.5 0 2.5v2" />
      <path d="M37 25c2 3 6 2 6 2s4 1 6-2l-2 8h-8Z" />
      <line x1="39" y1="23" x2="38" y2="25" />
      <line x1="47" y1="23" x2="48" y2="25" />
      <path d="M39 33l-6 16c4 1 16 1 20 0l-6-16" />
      <line x1="39" y1="33" x2="47" y2="33" />
      <path d="M42 35c-1 6-2 10-3 14" />
      <path d="M44 35c1 6 2 10 3 14" />
    </Svg>
  );
}

export function NotesIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="16" y="14" width="32" height="38" rx="3" />
      <path d="M26 14v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
      <path d="M24 28h16M24 36h16M24 44h10" />
    </Svg>
  );
}

export function GiftIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="12" y="26" width="40" height="24" rx="2" />
      <path d="M10 20h44v6H10z" />
      <path d="M32 20v30" />
      <path d="M32 20c-5 0-11-1-11-5s6-2 11 5Z" />
      <path d="M32 20c5 0 11-1 11-5s-6-2-11 5Z" />
    </Svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="12" y="12" width="40" height="40" rx="11" />
      <circle cx="32" cy="32" r="10" />
      <circle cx="44" cy="20" r="2" fill="currentColor" />
    </Svg>
  );
}

export function ConfettiIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 50 26 24l14 14Z" />
      <path d="M14 50 22 42" />
      <path d="M40 24c2-5 7-7 11-5" />
      <path d="M44 34c5-1 8-5 7-10" />
      <path d="M34 16c1-4 5-6 9-5" />
      <circle cx="50" cy="20" r="1.6" fill="currentColor" />
      <circle cx="42" cy="44" r="1.6" fill="currentColor" />
      <circle cx="54" cy="34" r="1.6" fill="currentColor" />
      <path d="m47 12 1.6 3.2 3.4.5-2.5 2.4.6 3.4-3.1-1.6-3 1.6.5-3.4-2.4-2.4 3.4-.5Z" />
    </Svg>
  );
}

export function TransportIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="12" y="14" width="40" height="32" rx="4" />
      <path d="M12 26h40" />
      <path d="M12 36h40" />
      <path d="M26 14v12M38 14v12" />
      <circle cx="21" cy="50" r="4" />
      <circle cx="43" cy="50" r="4" />
      <path d="M16 42h4M44 42h4" />
    </Svg>
  );
}

export function LodgingIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M10 26 32 12l22 14" />
      <path d="M14 26v24h36V26" />
      <path d="M20 44h24" />
      <path d="M20 44v-6a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v6" />
      <path d="M24 35v-3h8v3" />
      <path d="M20 44v4M44 44v4" />
    </Svg>
  );
}

export function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M32 54S8 40 8 24a13 13 0 0 1 24-7 13 13 0 0 1 24 7c0 16-24 30-24 30Z"
      />
    </svg>
  );
}

export function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M4 4l20 16L44 4" />
    </svg>
  );
}

export function QuoteMark({
  className,
  flipped = false,
}: {
  className?: string;
  flipped?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 48 36"
      className={className}
      aria-hidden
      style={flipped ? { transform: "rotate(180deg)" } : undefined}
    >
      <path
        fill="currentColor"
        d="M20 36H4V20C4 9 10 2 20 0v6c-5 2-8 6-8 11h8v19Zm24 0H28V20C28 9 34 2 44 0v6c-5 2-8 6-8 11h8v19Z"
      />
    </svg>
  );
}

export function MusicNoteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M20 3.5v11.2a3.3 3.3 0 1 1-1.8-2.9V7.1l-7.4 1.6v8.7a3.3 3.3 0 1 1-1.8-2.9V5.9l11-2.4Z"
      />
    </svg>
  );
}

export function MusicOffIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M20 3.5v11.2a3.3 3.3 0 1 1-1.8-2.9V7.1l-7.4 1.6v8.7a3.3 3.3 0 1 1-1.8-2.9V5.9l11-2.4Z"
      />
      <line
        x1="3"
        y1="3"
        x2="21"
        y2="21"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const LINE_ICONS = {
  rings: RingsIcon,
  confetti: ConfettiIcon,
  camera: CameraIcon,
  music: MusicIcon,
  dress: DressIcon,
  notes: NotesIcon,
  transport: TransportIcon,
  lodging: LodgingIcon,
  gift: GiftIcon,
} as const;

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
