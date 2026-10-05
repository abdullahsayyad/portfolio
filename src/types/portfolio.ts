/**
 * Content model for the portfolio.
 *
 * Everything rendered on the page is derived from these types, so the future
 * /admin page only has to produce a `PortfolioContent` object — swapping the
 * static `src/data/portfolio.ts` for a DB or CMS fetch is a one-file change.
 */

export type SocialPlatform = "github" | "instagram" | "linkedin";

export interface SocialLink {
  platform: SocialPlatform;
  /** Accessible name, e.g. "GitHub". */
  label: string;
  href: string;
}

export interface ImageRef {
  src: string;
  alt: string;
}

/** A place shown as a flag under the role line. */
export interface Location {
  /** ISO 3166-1 alpha-2, uppercase. Must match /public/flags/<code>.svg */
  code: string;
  /** Country name, used as the flag's alt text. */
  label: string;
}

export interface Profile {
  name: string;
  role: string;
  /** Label above the bio. The design reads "About me". */
  aboutLabel: string;
  about: string;
  /** Rendered under the role, slash-separated. Empty array hides the row. */
  locations: Location[];
  /**
   * The stacked cards beside the name. The stack holds exactly two, which
   * swap places on a loop; extra entries are ignored, and with only one the
   * back card stays on the grey placeholder and nothing moves.
   */
  photos: ImageRef[];
  socials: SocialLink[];
  email: string;
}

/** A tile in the Projects or Products list. Both use the same layout. */
export interface Work {
  id: string;
  title: string;
  description: string;
  /** Omit to render the grey placeholder block from the design. */
  image?: ImageRef;
  /** Makes the whole tile a link when present. */
  href?: string;
}

/** Controls how much of a list the home page shows. */
export interface WorkListConfig {
  /** Most tiles to render on the home page. */
  limit: number;
  /**
   * Where "See more" points, e.g. "/projects".
   *
   * Leave undefined until that page actually exists: the button renders only
   * when this is set AND the list is longer than `limit`, so it can never
   * become a dead link.
   */
  moreHref?: string;
}

export interface ContactContent {
  heading: string;
  body: string;
  email: string;
}

/** The right pane's three nav targets, in order. */
export type SectionId = "projects" | "products" | "contact";

export interface NavSection {
  id: SectionId;
  label: string;
}

export interface PortfolioContent {
  profile: Profile;
  projects: Work[];
  products: Work[];
  contact: ContactContent;
  lists: Record<"projects" | "products", WorkListConfig>;
}
