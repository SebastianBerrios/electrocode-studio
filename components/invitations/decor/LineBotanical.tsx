/**
 * Constellation & Star line-art vocabulary.
 */

type DecorProps = { className?: string };

function Star({ x, y, r = 5 }: { x: number; y: number; r?: number }) {
  const w = r * 0.3;
  return (
    <path
      d={`M${x} ${y - r} Q${x + w} ${y - w} ${x + r} ${y} Q${x + w} ${y + w} ${x} ${y + r} Q${x - w} ${y + w} ${x - r} ${y} Q${x - w} ${y - w} ${x} ${y - r} Z`}
      fill="currentColor"
      stroke="none"
    />
  );
}

const SPECKS = [
  [12, 30, 1.1],
  [38, 14, 0.9],
  [64, 46, 1.2],
  [92, 20, 0.8],
  [118, 52, 1.1],
  [130, 22, 1.1],
  [152, 44, 1.3],
] as const;

function Constellation({
  points,
  scale = 1,
  rotate = 0,
  x = 0,
  y = 0,
}: {
  points: readonly (readonly [number, number, number?])[];
  scale?: number;
  rotate?: number;
  x?: number;
  y?: number;
}) {
  const line = points.map(([px, py], i) => `${i === 0 ? "M" : "L"}${px} ${py}`).join(" ");

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d={line} fill="none" stroke="currentColor" strokeWidth={0.8} opacity={0.55} />
      {points.map(([px, py, r], i) => (
        <Star key={i} x={px} y={py} r={r ?? 4} />
      ))}
    </g>
  );
}

const DIPPER = [
  [0, 0, 4.5],
  [22, -6, 3.5],
  [44, -8, 3],
  [64, -2, 3.5],
  [70, 16, 4],
  [50, 24, 3],
  [28, 18, 3.5],
] as const;

const ARC = [
  [0, 0, 3.5],
  [18, -12, 2.8],
  [38, -14, 3.2],
  [54, -4, 2.6],
] as const;

export function Garland({
  className,
  flipped = false,
}: DecorProps & { flipped?: boolean }) {
  const half = (
    <g>
      <Constellation points={DIPPER} x={16} y={38} scale={0.95} rotate={-8} />
      <Constellation points={ARC} x={104} y={22} scale={0.85} rotate={14} />
      <Constellation points={ARC} x={70} y={92} scale={0.6} rotate={-30} />
    </g>
  );

  return (
    <svg
      viewBox="0 0 340 170"
      className={className}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ overflow: "visible", transform: flipped ? "scaleY(-1)" : undefined }}
    >
      <g transform="translate(170 0)">
        {half}
        <g transform="scale(-1 1)">{half}</g>
      </g>
      {SPECKS.map(([x, y, r], index) => (
        <circle key={index} cx={170 + x - 85} cy={y} r={r} fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
}

export function LeafDivider({ className }: DecorProps) {
  return (
    <svg
      viewBox="0 0 320 40"
      className={className}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
    >
      <g strokeWidth={1} opacity={0.7}>
        <path d="M10 20h116" />
        <path d="M194 20h116" />
      </g>
      <Star x={160} y={20} r={9} />
      <Star x={138} y={20} r={3.5} />
      <Star x={182} y={20} r={3.5} />
    </svg>
  );
}

export function DateSprig({ className, mirrored = false }: DecorProps & { mirrored?: boolean }) {
  return (
    <svg
      viewBox="0 0 90 60"
      className={className}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      style={mirrored ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M62 12a20 20 0 1 0 0 36 24 24 0 0 1 0-36Z" fill="currentColor" stroke="none" />
      <Star x={30} y={20} r={4} />
      <Star x={16} y={38} r={2.6} />
      <Star x={40} y={44} r={2.2} />
    </svg>
  );
}
