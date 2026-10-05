import type { SectionId } from "@/types/portfolio";

/** Scrolls a section into view, respecting the user's motion preference. */
export function scrollToSection(id: SectionId) {
  const el = document.getElementById(id);
  if (!el) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}
