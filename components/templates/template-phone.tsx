import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/content/locales";
import type { Template } from "@/lib/content/templates";

/**
 * Server Component: one design running inside a phone, scrollable in place.
 *
 * **This embeds the real demo, not a tall screenshot.** The gallery below
 * already answers "what does it look like" with `TemplateCard`'s cropped
 * capture; the question this block answers is the one a still image cannot —
 * "what happens as I scroll it". For an invitation that is the whole product
 * (portada, cuenta regresiva, agendar, confirmación, galería), and a screenshot
 * of the masthead shows none of it. So the frame holds an `<iframe>` pointed at
 * the same `Commitment<string>` URL the card links to, which means the visitor
 * scrolls the deployed template itself and this component can never drift from
 * what ships.
 *
 * **The device is drawn, not implied.** The first version was a rounded
 * rectangle with a speaker slot, and it read as a bordered box rather than as a
 * phone — which matters, because the whole claim being made here is "this is
 * what your guests will see ON THEIR PHONE". A visible chassis with a bezel,
 * side buttons and a camera does that work; a border does not.
 *
 * **`?preview` on the src, and it is load-bearing.** Every invitation opens on
 * a full-screen "enter with or without music" gate. Inside a 280px frame that
 * gate is the entire preview: a visitor sees a curtain, not an invitation, and
 * cannot even dismiss it meaningfully since a demo has no music file. The
 * templates read that parameter and start past the gate — see
 * `ExperienceProvider` and the `.preview-embed` rule in each template's
 * `globals.css` over in the `electrocode-templates` repository. Biolinks have
 * no gate and simply ignore the parameter, so it is appended unconditionally
 * rather than branching on `template.family`.
 *
 * **Rendered only for a `set` demo, and the caller is expected to pass one.**
 * A `pending` demo has no URL to frame, and framing nothing would leave an
 * empty phone next to a heading promising a preview — the same "surface
 * rendered before its target exists" defect `TemplateCard`'s conditional link
 * and `portfolioLink()` both exist to prevent. `checkFamilyFeaturedTemplateIsLive`
 * (`lib/content/invariants.ts`) fails the build if a family's featured design
 * ever stops being deployed, so this returning `null` is a backstop, not the
 * expected path.
 *
 * **No `"use client"`.** Nothing here is interactive from React's side: the
 * scrolling happens inside the iframe's own document, which is the browser's
 * job. Making this a Client Component would ship JavaScript to move a scrollbar
 * the platform already moves.
 *
 * The demos are a separate origin (`electrocode-templates.vercel.app`), so
 * `sandbox` is deliberately absent: `allow-scripts` plus a cross-origin document
 * is already the isolation boundary, and the invitation templates need their own
 * scripts to run for the preview to be worth showing at all.
 */
export function TemplatePhone({
  template,
  locale,
}: {
  template: Template;
  locale: Locale;
}) {
  const { templates } = getDictionary(locale);
  const { demo } = template;

  if (demo.status !== "set") return null;

  /*
   * Appended with a literal `?` rather than through `URL`: every demo URL is
   * built by `deployed()` from one constant origin and carries no query of its
   * own, and `checkTemplateDemoMatchesItsSlug` fails the build if one ever
   * stops matching that shape. Constructing a `URL` here would be ceremony
   * around a string this repository already guarantees.
   */
  const previewSrc = `${demo.value}?preview=1`;

  return (
    <figure className="relative mx-auto w-full max-w-[300px] sm:max-w-[320px]">
      {/*
        The scroll cue. Absolutely positioned against the figure so it hangs off
        the phone's shoulder the way a sticker would, instead of taking a row in
        the flow and pushing the device down.

        **Only rendered from `lg` up.** Below that the header is a single
        column and the badge has nowhere to hang: it would sit on top of the
        screen it is pointing at. A visitor on a narrow screen is also already
        holding the thing the cue is asking them to do.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -left-24 z-20 hidden lg:block"
      >
        <div className="grid h-24 w-24 place-items-center rounded-full bg-accent-signal text-accent-signal-foreground shadow-lg">
          <span className="text-center text-sm leading-tight font-semibold">
            {templates.previewBadge}
          </span>
        </div>

        {/* The double chevron, drifting down inside the badge's shadow. */}
        <svg
          viewBox="0 0 24 20"
          className="animate-chevron-drift absolute top-[3.6rem] left-1/2 h-4 w-5 -translate-x-1/2 text-accent-signal-foreground"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4l8 6 8-6" />
          <path d="M4 11l8 6 8-6" />
        </svg>

        {/* The arrow sweeping from the badge down toward the screen. Drawn as
            one curve plus a two-stroke head rather than a marker, because a
            `marker-end` needs a document-unique id and this component can in
            principle appear twice on a page. */}
        <svg
          viewBox="0 0 120 140"
          className="absolute top-[5.5rem] left-10 h-32 w-28 text-accent-signal"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
        >
          <path d="M8 6 C 4 52, 26 96, 74 118" />
          <path d="M56 118 L 76 119 L 66 101" />
        </svg>
      </div>

      {/*
        The chassis. Three nested radii — chassis, bezel, screen — is what makes
        it read as moulded rather than as three stacked rectangles; each inner
        radius has to be smaller than the one outside it or the corners pinch.
      */}
      <div className="relative rounded-[2.6rem] bg-gradient-to-b from-neutral-100 to-neutral-300 p-[3px] shadow-[0_28px_60px_-24px_rgb(0_0_0/0.45)] dark:from-neutral-700 dark:to-neutral-900">
        {/* Side buttons. Decorative, so hidden from the accessibility tree. */}
        <span
          aria-hidden="true"
          className="absolute -right-[3px] top-[22%] h-14 w-[3px] rounded-r bg-neutral-400 dark:bg-neutral-600"
        />
        <span
          aria-hidden="true"
          className="absolute -left-[3px] top-[18%] h-8 w-[3px] rounded-l bg-neutral-400 dark:bg-neutral-600"
        />
        <span
          aria-hidden="true"
          className="absolute -left-[3px] top-[29%] h-8 w-[3px] rounded-l bg-neutral-400 dark:bg-neutral-600"
        />

        <div className="rounded-[2.45rem] bg-white p-2.5 pt-5 pb-6 dark:bg-neutral-950">
          {/* Earpiece row: two lens dots, the speaker slot, a sensor. */}
          <div aria-hidden="true" className="mb-2.5 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="h-1.5 w-12 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          </div>

          {/*
            The screen.

            **The scrollbar is hidden by the template, not from here.** A first
            attempt made this iframe 20px wider than its container and clipped
            the overflow, which is the only trick available to a parent against
            a cross-origin frame. It was the wrong fix twice over: it depends on
            guessing the platform's scrollbar width, and on every system with
            overlay scrollbars — which is all phones and macOS, i.e. most
            visitors — it hid nothing and cropped 20px off the preview instead.

            The rule lives on the document that actually owns the scrollbar: see
            `.preview-embed` in each template's `globals.css` in the
            `electrocode-templates` repository, scoped to the `?preview`
            parameter this component appends so a real client site keeps its
            scrollbar.
          */}
          <div className="relative aspect-[9/17] w-full overflow-hidden rounded-[0.35rem] bg-background">
            <iframe
              src={previewSrc}
              title={templates.previewFrameLabel.replace("{name}", template.name)}
              loading="lazy"
              className="h-full w-full border-0"
            />
          </div>

          {/* Home bar. */}
          <div
            aria-hidden="true"
            className="mx-auto mt-3 h-1.5 w-24 rounded-full bg-neutral-300 dark:bg-neutral-700"
          />
        </div>
      </div>

      <figcaption className="mt-4 text-center text-xs text-muted-foreground">
        {templates.previewHint}
      </figcaption>
    </figure>
  );
}
