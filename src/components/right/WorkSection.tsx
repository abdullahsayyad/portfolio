import type { SectionId, Work, WorkListConfig } from "@/types/portfolio";
import { Section } from "./Section";
import { WorkTile } from "./WorkTile";

interface WorkSectionProps {
  id: SectionId;
  heading: string;
  items: Work[];
  config: WorkListConfig;
  collapsing?: boolean;
}

/** A headed list of tiles, trimmed to `config.limit`. */
export function WorkSection({
  id,
  heading,
  items,
  config,
  collapsing,
}: WorkSectionProps) {
  const shown = items.slice(0, config.limit);
  const hidden = items.length - shown.length;

  // Only offer "See more" when there is somewhere to go AND something extra
  // to see, so the button can never be a dead link.
  const showMore = Boolean(config.moreHref) && hidden > 0;

  return (
    <Section id={id} heading={heading} collapsing={collapsing}>
      <ul className="flex flex-col gap-12">
        {shown.map((item) => (
          <li key={item.id}>
            <WorkTile work={item} />
          </li>
        ))}
      </ul>

      {showMore && (
        <a
          href={config.moreHref}
          className="mt-12 inline-block text-nav leading-normal font-medium text-ink underline decoration-solid decoration-from-font transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          See more ({hidden} more)
        </a>
      )}
    </Section>
  );
}
