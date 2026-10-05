"use client";

import { useEffect, type RefObject } from "react";
import type { SectionId } from "@/types/portfolio";

/** Scroll distance over which a full-size heading becomes its nav tab. */
const COLLAPSE_DISTANCE = 140;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Collapses the FIRST section's large heading into its nav tab as that section
 * scrolls, and fades the nav in behind it.
 *
 * Only the first section animates — it is the landing view, so the effect
 * plays once as an intro. Later sections scroll normally and the nav stays
 * put, which keeps the page from repeating the move on every section.
 *
 * The heading is measured against the tab it belongs to and interpolated onto
 * it, so at full collapse the two occupy the same box at the same size — the
 * crossfade between them then reads as one element shrinking into place.
 *
 * Runs at every breakpoint. The scroll container differs (the right pane on
 * lg, the document below it), so progress is measured against the nav's own
 * box: the nav is `sticky top-0`, so its top *is* the line headings pin to,
 * whichever element happens to be scrolling. Both scrollers are listened to,
 * since scroll events do not bubble from an element to the window.
 *
 * Styles are written straight to the DOM inside a rAF rather than through
 * React state: this runs on every scroll frame and must not re-render.
 *
 * Disabled under `prefers-reduced-motion`, where the heading stays full size
 * and the nav stays visible.
 */
export function useCollapsingHeaders(
  containerRef: RefObject<HTMLElement | null>,
  ids: readonly SectionId[],
) {
  useEffect(() => {
    const pane = containerRef.current;
    if (!pane) return;

    const firstId = ids[0];
    if (!firstId) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nav = document.getElementById("site-nav");
    let frame = 0;

    /** Hand every element back to the stylesheet. */
    const clear = () => {
      if (nav) {
        nav.style.opacity = "1";
        nav.style.pointerEvents = "";
      }
      const heading = document.getElementById(`${firstId}-heading`);
      if (heading) {
        heading.style.removeProperty("transform");
        heading.style.removeProperty("opacity");
      }
    };

    const render = () => {
      frame = 0;

      const section = document.getElementById(firstId);
      const heading = document.getElementById(`${firstId}-heading`);
      const tab = document.getElementById(`nav-${firstId}`);
      const wrapper = heading?.parentElement;
      if (!section || !heading || !tab || !wrapper || !nav) return;

      // The nav is sticky at top:0, so its own top is the line the heading
      // pins to — correct for both the pane scroller and the document.
      const anchor = nav.getBoundingClientRect().top;
      const stickOffset = parseFloat(getComputedStyle(section).paddingTop) || 0;
      const sectionTop = section.getBoundingClientRect().top;
      // Saturates at 1 and stays there for every later section, which is what
      // keeps the nav visible once it has faded in.
      const t = clamp01((anchor - sectionTop - stickOffset) / COLLAPSE_DISTANCE);

      // `wrapper` is never transformed, so it reports a reliable origin. The
      // heading's own offset within it must be added back: the wrapper is
      // full-bleed (-mx-6 px-6) and padded, so its box starts above and to the
      // left of the text. Without this the heading lands off its tab.
      const wrapperRect = wrapper.getBoundingClientRect();
      const from = {
        left: wrapperRect.left + heading.offsetLeft,
        top: wrapperRect.top + heading.offsetTop,
      };
      const to = tab.getBoundingClientRect();
      const scale =
        parseFloat(getComputedStyle(tab).fontSize) /
        parseFloat(getComputedStyle(heading).fontSize);

      heading.style.transform =
        `translate(${(to.left - from.left) * t}px, ${(to.top - from.top) * t}px)` +
        ` scale(${1 - (1 - scale) * t})`;
      // Cross-fade only in the last stretch, where the two are nearly the same
      // size in the same place, so the swap reads as one element rather than
      // two overlapping copies of the word.
      heading.style.opacity = String(clamp01((0.96 - t) / 0.12));

      const navOpacity = clamp01((t - 0.84) / 0.12);
      nav.style.opacity = String(navOpacity);
      nav.style.pointerEvents = navOpacity < 0.5 ? "none" : "";
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(render);
    };

    const listen = (on: boolean) => {
      const fn = on ? "addEventListener" : "removeEventListener";
      // Either the pane or the document scrolls depending on breakpoint, and
      // scroll does not bubble, so both are watched.
      pane[fn]("scroll", onScroll, { passive: true } as AddEventListenerOptions);
      window[fn]("scroll", onScroll, { passive: true } as AddEventListenerOptions);
      window[fn]("resize", onScroll);
    };

    const apply = () => {
      listen(false);
      if (reduced.matches) {
        clear();
        return;
      }
      listen(true);
      render();
    };

    apply();
    reduced.addEventListener("change", apply);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      listen(false);
      reduced.removeEventListener("change", apply);
      clear();
    };
  }, [containerRef, ids]);
}
