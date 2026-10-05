import type { ReactNode } from "react";
import type { SectionId } from "@/types/portfolio";

interface SectionProps {
  id: SectionId;
  /** Large visible heading. Also names the section for assistive tech. */
  heading: string;
  /**
   * Whether this heading collapses into its nav tab on scroll. Only the first
   * section does; the rest scroll away normally.
   */
  collapsing?: boolean;
  children: ReactNode;
}

/**
 * One full-height slide in the right pane.
 *
 * When `collapsing`, the heading sits in a sticky wrapper at the top of the
 * section so it can collapse into the nav as the section scrolls — see
 * useCollapsingHeaders, which measures this wrapper to find the heading's
 * untransformed position. Nothing here may transform the wrapper itself.
 */
export function Section({
  id,
  heading,
  collapsing = false,
  children,
}: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="flex flex-col px-6 pb-16 lg:min-h-screen"
    >
      {/* -mx-6/px-6 lets the background span the full pane width while the
          text stays on the content gutter. */}
      <div
        className={
          collapsing ? "sticky top-0 z-20 -mx-6 bg-surface px-6 pt-4" : "pt-6 lg:pt-4"
        }
      >
        <h2
          id={headingId}
          className={`text-section leading-tight font-medium text-ink ${
            collapsing ? "origin-top-left will-change-[transform,opacity]" : ""
          }`}
        >
          {heading}
        </h2>
      </div>

      <div className="mt-8 lg:mt-10">{children}</div>
    </section>
  );
}
