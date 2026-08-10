import Image from "next/image";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/content/locales";
import type { Template } from "@/lib/content/templates";

/**
 * Server Component: one design in a family's gallery.
 *
 * **The tile is not a link, and that is the designed state — not an
 * oversight.** `Template.demo` is a `Commitment<string>` and every entry is
 * `pending` today, because no template is deployed. The reference direction's
 * gallery hangs a "ver ejemplo" on every card; putting one here would point at
 * nothing. This is the same call `portfolioLink()` (`lib/content/
 * projections.ts`) makes for a project whose case study has not shipped, and
 * the same defect class — a link rendered before its target exists — that this
 * change set has already had to fix four times.
 *
 * The `set` branch below is therefore unreachable with today's data and is
 * written anyway: filling one `demo` in `lib/content/templates.ts` is all a
 * deployment should cost, with no component edit and no second review of this
 * file.
 *
 * **The frame crops rather than letter-boxes.** Captures are portrait phone
 * screens (420×840 at 2×); a gallery of full-height phones is a grid of
 * slivers. `aspect-[3/4]` with `object-top` shows each design's masthead — the
 * part that actually distinguishes one from another — and lets the rest fall
 * outside the frame. `object-top`, never `object-center`: centring a 1:2 image
 * in a 3:4 box crops the header off the top, which is the one region every
 * template uses to establish its identity.
 */
export function TemplateCard({
  template,
  locale,
}: {
  template: Template;
  locale: Locale;
}) {
  const { templates } = getDictionary(locale);
  const { demo } = template;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-[3/4] overflow-hidden border-b border-border/60">
        <Image
          src={template.preview.asset}
          alt={template.preview.alt[locale]}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-medium text-card-foreground">
          {template.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {template.direction[locale]}
        </p>
        {/* Pushed to the bottom so the label lines up across a row of cards
            whose descriptions are different lengths. */}
        <p className="mt-auto pt-2 text-xs text-muted-foreground">
          <span className="font-semibold text-card-foreground">
            {templates.bestForLabel}:
          </span>{" "}
          {template.bestFor[locale]}
        </p>

        {demo.status === "set" ? (
          <a
            href={demo.value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-accent-signal underline underline-offset-4"
          >
            {templates.demoCta}
          </a>
        ) : null}
      </div>
    </article>
  );
}
