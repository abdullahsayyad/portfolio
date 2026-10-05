import Image from "next/image";
import type { SocialLink } from "@/types/portfolio";

/**
 * Figma exports these three at mismatched sizes (16 / 16 / 32px) and uneven
 * gaps (222px, then 200px), which reads as a drafting slip rather than intent.
 * They are rendered here at one size on an even rhythm, keeping the design's
 * wide spread on desktop and collapsing to something sane on small screens.
 */
export function SocialLinks({ socials }: { socials: SocialLink[] }) {
  if (socials.length === 0) return null;

  return (
    <ul className="flex items-center gap-12 lg:gap-[clamp(3rem,13vw,13.5rem)]">
      {socials.map((social) => (
        <li key={social.platform}>
          <a
            href={social.href}
            target="_blank"
            rel="me noreferrer"
            aria-label={social.label}
            className="block text-ink opacity-100 transition-opacity hover:opacity-55 focus-visible:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            <Image
              src={`/icons/${social.platform}.svg`}
              alt=""
              width={16}
              height={16}
              className="size-4"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
