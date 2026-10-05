"use client";

import { useEffect, useState, type RefObject } from "react";
import type { SectionId } from "@/types/portfolio";

/**
 * Tracks which section is crossing the middle of the viewport, so the nav
 * underline and the dot indicator both follow the scroll position.
 *
 * The observer root has to change with the breakpoint: on lg+ the right pane
 * is its own scroll container, below that the document scrolls.
 */
export function useActiveSection(
  containerRef: RefObject<HTMLElement | null>,
  ids: readonly SectionId[],
): SectionId {
  const [active, setActive] = useState<SectionId>(ids[0]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    let observer: IntersectionObserver | undefined;

    const connect = () => {
      observer?.disconnect();

      observer = new IntersectionObserver(
        (entries) => {
          // A narrow band at the centre means at most a couple of sections
          // qualify; the one covering most of the band wins.
          const winner = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

          if (winner) setActive(winner.target.id as SectionId);
        },
        {
          root: desktop.matches ? containerRef.current : null,
          rootMargin: "-50% 0px -45% 0px",
          threshold: 0,
        },
      );

      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    };

    connect();
    desktop.addEventListener("change", connect);

    return () => {
      desktop.removeEventListener("change", connect);
      observer?.disconnect();
    };
  }, [containerRef, ids]);

  return active;
}
