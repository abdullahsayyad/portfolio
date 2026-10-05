"use client";

import type { NavSection, SectionId } from "@/types/portfolio";
import { scrollToSection } from "@/lib/scroll";

interface SiteNavProps {
  sections: NavSection[];
  active: SectionId;
}

/**
 * Figma spreads the three items across the pane and underlines the active one
 * ("Products" in the mock). Sticky so it survives the pane scrolling.
 *
 * On desktop its opacity is driven by useCollapsingHeaders: hidden while a
 * section's large heading is showing, faded in as that heading collapses onto
 * the matching tab. The ids here are the hook's anchors.
 */
export function SiteNav({ sections, active }: SiteNavProps) {
  return (
    <nav
      id="site-nav"
      aria-label="Sections"
      /* h-0 makes the nav a pure overlay so it consumes no flow space and the
         section heading can sit flush against the top of the pane. Its own
         box is also the collapse anchor — see useCollapsingHeaders. */
      className="sticky top-0 z-30 h-0"
    >
      <ul className="flex items-center justify-between bg-surface/95 px-6 py-[15px] backdrop-blur-sm">
        {sections.map((section) => {
          const isActive = section.id === active;

          return (
            <li key={section.id}>
              <a
                id={`nav-${section.id}`}
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection(section.id);
                }}
                className={`text-nav leading-normal font-medium decoration-solid decoration-from-font transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${
                  isActive
                    ? "text-ink-soft underline"
                    : "text-muted-soft hover:text-ink-soft"
                }`}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
