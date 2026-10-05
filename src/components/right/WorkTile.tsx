import Image from "next/image";
import type { Work } from "@/types/portfolio";

/**
 * The "Project tile" from the design: a bordered square image with a hairline
 * skew, and a title + description block beside it. Products reuse it verbatim.
 *
 * Below `lg` the two stack instead. Side by side on a phone left the copy in a
 * ~210px column running to five or six lines beside a much shorter image;
 * stacking gives the text the full width and roughly halves that.
 */

/** Shared by both the link and non-link wrappers. */
const LAYOUT = "flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-3";

export function WorkTile({ work }: { work: Work }) {
  const content = (
    <>
      {/* 215 x 216 in Figma — square to within a pixel, so the ratio holds the
          height and only the width needs to change per breakpoint. */}
      <div
        className="relative w-full shrink-0 overflow-hidden border-2 border-solid border-ink bg-line lg:w-[clamp(150px,15vw,215px)]"
        style={{
          // Set here rather than via `aspect-[215/216]`: Tailwind reads the
          // slash as its modifier separator and emits no rule for it, which
          // silently leaves the box with no height.
          aspectRatio: "215 / 216",
          transform: "skewX(-0.26deg)",
        }}
      >
        {work.image ? (
          <Image
            src={work.image.src}
            alt={work.image.alt}
            fill
            sizes="(min-width: 1024px) 15vw, 100vw"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="lg:max-w-[292px]">
        {/* Figma only ever showed a single-line "Project Title", so its
            leading-normal was never tested against a wrap. Tightened for
            titles that run to two lines. */}
        <h3 className="text-display leading-tight font-medium text-ink">
          {work.title}
        </h3>
        <p className="text-small leading-normal font-medium text-muted">
          {work.description}
        </p>
      </div>
    </>
  );

  if (work.href) {
    return (
      <a
        href={work.href}
        target="_blank"
        rel="noreferrer"
        className={`${LAYOUT} transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink`}
      >
        {content}
      </a>
    );
  }

  return <article className={LAYOUT}>{content}</article>;
}
