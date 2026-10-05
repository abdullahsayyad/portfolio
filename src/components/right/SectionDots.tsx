"use client";

import type { NavSection, SectionId } from "@/types/portfolio";
import { scrollToSection } from "@/lib/scroll";

interface SectionDotsProps {
  sections: NavSection[];
  active: SectionId;
}

/**
 * The three 10px circles on the far right of the design, one per section.
 *
 * Figma draws all three at 10px in #d9d9d9 with no selected state. They are
 * smaller here and the active one is filled in muted grey rather than black,
 * so the indicator reads as a quiet marker rather than a control.
 */
export function SectionDots({ sections, active }: SectionDotsProps) {
  return (
    <div className="fixed top-1/2 right-6 z-10 hidden -translate-y-1/2 lg:block">
      <ul className="flex flex-col gap-2.5">
        {sections.map((section) => {
          const isActive = section.id === active;

          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => scrollToSection(section.id)}
                aria-label={`Go to ${section.label}`}
                aria-current={isActive ? "true" : undefined}
                className={`block size-[6px] cursor-pointer rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${
                  isActive ? "bg-muted" : "bg-line hover:bg-muted/50"
                }`}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
