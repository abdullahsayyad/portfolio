"use client";

import { useMemo, useRef } from "react";
import type {
  ContactContent,
  NavSection,
  PortfolioContent,
  SectionId,
  Work,
} from "@/types/portfolio";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useCollapsingHeaders } from "@/hooks/useCollapsingHeaders";
import { SiteNav } from "./SiteNav";
import { SectionDots } from "./SectionDots";
import { Section } from "./Section";
import { WorkSection } from "./WorkSection";

interface ContentPanelProps {
  sections: NavSection[];
  projects: Work[];
  products: Work[];
  contact: ContactContent;
  lists: PortfolioContent["lists"];
}

export function ContentPanel({
  sections,
  projects,
  products,
  contact,
  lists,
}: ContentPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Stable across renders, so the observer is not torn down every paint.
  const ids = useMemo<SectionId[]>(
    () => sections.map((section) => section.id),
    [sections],
  );
  const active = useActiveSection(containerRef, ids);
  useCollapsingHeaders(containerRef, ids);

  return (
    <div
      ref={containerRef}
      className="no-scrollbar relative border-t border-line lg:h-screen lg:overflow-y-auto lg:overscroll-contain lg:border-t-0 lg:border-l"
    >
      <SiteNav sections={sections} active={active} />
      <SectionDots sections={sections} active={active} />

      <WorkSection
        id="projects"
        heading="Projects"
        items={projects}
        config={lists.projects}
        collapsing={ids[0] === "projects"}
      />

      <WorkSection
        id="products"
        heading="Products"
        items={products}
        config={lists.products}
      />

      {/* Not drawn in Figma — built from the design's own type scale. The
          heading comes from the content ("Get in touch") rather than the nav
          label, so the section does not read "Contact" twice. */}
      <Section id="contact" heading={contact.heading}>
        <div className="max-w-[420px]">
          <p className="text-small leading-normal font-medium text-muted">
            {contact.body}
          </p>
          <a
            href={`mailto:${contact.email}`}
            className="mt-6 inline-block text-nav leading-normal font-medium text-ink underline decoration-solid decoration-from-font transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            {contact.email}
          </a>
        </div>
      </Section>
    </div>
  );
}
