import { Fragment } from "react";
import Image from "next/image";
import type { Profile } from "@/types/portfolio";
import { PhotoStack } from "./PhotoStack";
import { SocialLinks } from "./SocialLinks";

/**
 * The fixed left half of the design: photo stack + name, the About block, and
 * the social row pinned to the bottom.
 *
 * In Figma the identity + About group spans y 245–737 inside a 982px canvas,
 * which is exactly centred — so it is centred here rather than hard-positioned.
 */
export function IdentityPanel({ profile }: { profile: Profile }) {
  return (
    <aside className="flex flex-col px-gutter py-10 lg:h-screen lg:py-[39px]">
      <div className="flex flex-1 flex-col justify-center gap-[52px] pt-6 lg:pt-0">
        {/* Beside the stack on lg, as drawn. On small screens the name has too
            little room next to the photos, so it drops below a centred stack
            and steps down in size. */}
        <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:gap-3">
          <PhotoStack photos={profile.photos} />

          <div className="text-center lg:text-left">
            <h1 className="text-[20px] leading-snug font-normal text-ink lg:text-display lg:leading-normal">
              {profile.name}
            </h1>
            <p className="text-[13px] leading-normal font-medium text-muted lg:text-body">
              {profile.role}
            </p>

            {profile.locations.length > 0 && (
              <div className="mt-1.5 flex items-center justify-center gap-2 lg:justify-start">
                {profile.locations.map((location, i) => (
                  <Fragment key={location.code}>
                    {i > 0 && (
                      <span
                        aria-hidden="true"
                        className="text-body leading-none font-medium text-muted select-none"
                      >
                        /
                      </span>
                    )}
                    {/* Both flags carry white, so a hairline keeps their
                        edges readable against the white panel. */}
                    <Image
                      src={`/flags/${location.code}.svg`}
                      alt={location.label}
                      title={location.label}
                      width={18}
                      height={12}
                      className="h-3 w-[18px] rounded-[1px] object-cover ring-1 ring-line"
                    />
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-[688px]">
          <h2 className="text-nav leading-normal font-medium text-ink">
            {profile.aboutLabel}
          </h2>
          {/* Figma justified this copy, which stretches word spacing badly over
              two short lines. Left-aligned instead, for even spacing. The 26px
              gap to the label was likewise tightened so the two group. */}
          <p className="mt-2 text-body leading-normal font-medium text-muted">
            {profile.about}
          </p>
        </div>
      </div>

      {/* On mobile this panel stacks above the content, so the socials would
          land mid-page. They move to the footer below Contact instead —
          see the <footer> in app/page.tsx. */}
      <div className="mt-16 hidden justify-center lg:mt-auto lg:flex">
        <SocialLinks socials={profile.socials} />
      </div>
    </aside>
  );
}
