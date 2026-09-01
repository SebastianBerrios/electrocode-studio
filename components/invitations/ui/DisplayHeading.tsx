import { LeafDivider } from "../decor/LineBotanical";

export function DisplayHeading({
  children,
  className = "",
  ornament = true,
}: {
  children: React.ReactNode;
  className?: string;
  ornament?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <h2 className="font-display text-display-xl leading-tight text-ink">{children}</h2>
      {ornament && <LeafDivider className="mt-3 w-32 text-accent sm:w-40" />}
    </div>
  );
}
