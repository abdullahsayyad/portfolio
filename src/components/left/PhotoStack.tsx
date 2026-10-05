"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ImageRef } from "@/types/portfolio";

/**
 * The overlapping photo cards beside the name.
 *
 * Figma draws three cards at 214x252, each offset down-and-right from the one
 * behind it, with a barely-there skew on the first and last. This keeps the
 * design's back and front cards and drops the middle one, so the stack holds
 * two photos and keeps the same footprint. Every offset is a ratio of the card
 * width, so the whole stack scales from one `--card-w` value.
 *
 * With two photos the cards swap places on a timer, continuously, so each one
 * takes a turn at the front. Positions are applied as `transform` (not
 * `left`/`top`) so the swap animates on the compositor. Reduced-motion users
 * get a still stack.
 */

const CARD_RATIO = 252 / 214; // height / width, from the Figma card

/** Back, front. Index doubles as z-order. */
const SLOTS = [
  { x: 0, y: 0, skew: "0.19deg", border: "1px" },
  { x: 0.1968, y: 0.0986, skew: "-0.26deg", border: "2px" },
] as const;

const FRONT = SLOTS.length - 1;
const STACK_W = 1 + SLOTS[FRONT].x;
const STACK_H = CARD_RATIO * (1 + SLOTS[FRONT].y);
const STEP_MS = 3000;

export function PhotoStack({ photos }: { photos: ImageRef[] }) {
  const [offset, setOffset] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(motionQuery.matches);

    sync();
    motionQuery.addEventListener("change", sync);
    return () => motionQuery.removeEventListener("change", sync);
  }, []);

  // Photos fill the stack from the front backwards; a single photo leaves the
  // back card on the grey placeholder rather than repeating itself. Only a
  // full deck may cycle, since rotating a short one would bring an empty card
  // to the front.
  const deck: (ImageRef | undefined)[] = SLOTS.map((_, i) => photos[FRONT - i]);
  const running = photos.length >= SLOTS.length && !reduced;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setOffset((o) => o + 1), STEP_MS);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div
      className="relative shrink-0 [--card-w:clamp(160px,50vw,232px)] lg:[--card-w:clamp(160px,17vw,214px)]"
      style={{
        width: `calc(var(--card-w) * ${STACK_W})`,
        height: `calc(var(--card-w) * ${STACK_H})`,
      }}
    >
      {deck.map((photo, i) => {
        const slotIndex = (i + offset) % SLOTS.length;
        const slot = SLOTS[slotIndex];
        const isFront = slotIndex === FRONT;

        return (
          <div
            key={i}
            className="absolute top-0 left-0 overflow-hidden border-solid border-ink bg-line transition-transform duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              width: "var(--card-w)",
              height: `calc(var(--card-w) * ${CARD_RATIO})`,
              transform: `translate(calc(var(--card-w) * ${slot.x}), calc(var(--card-w) * ${slot.y * CARD_RATIO})) skewX(${slot.skew})`,
              borderWidth: slot.border,
              zIndex: slotIndex,
            }}
          >
            {photo ? (
              <Image
                src={photo.src}
                // Only the front card names the subject; the one behind it is
                // decorative and would just repeat in a screen reader.
                alt={isFront ? photo.alt : ""}
                fill
                sizes="(min-width: 1024px) 17vw, 40vw"
                className="object-cover"
                // Both cards are above the fold and the back one is at the
                // front within seconds, so neither should lazy-load.
                loading="eager"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
