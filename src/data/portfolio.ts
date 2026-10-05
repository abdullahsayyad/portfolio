import type { NavSection, PortfolioContent } from "@/types/portfolio";

/**
 * The single source of truth for page content.
 *
 * Real values: name, role and the About copy come from the Figma design.
 * PLACEHOLDER values: the contact copy and the Instagram handle are invented
 * stand-ins so the layout can be seen with real-shaped content. Replace the
 * blocks marked PLACEHOLDER below — nothing else needs to change.
 */

export const navSections: NavSection[] = [
  { id: "projects", label: "Projects" },
  { id: "products", label: "Products" },
  { id: "contact", label: "Contact" },
];

export const portfolio: PortfolioContent = {
  profile: {
    name: "Abdullah Sayyad",
    role: "Software Engineer",
    aboutLabel: "About me",
    // Design copy, with "machine leaning" corrected to "machine learning".
    about:
      "I build machine learning & deep learning models, systems and that occasional agent that just behaves.",
    locations: [
      { code: "IN", label: "India" },
      { code: "BH", label: "Bahrain" },
    ],
    // Listed front-to-back: the first entry is the topmost, most visible card.
    // The stack holds two, and they swap places on a loop.
    photos: [
      { src: "/profile photos/pic1.jpeg", alt: "Abdullah Sayyad" },
      { src: "/profile photos/pic2.jpeg", alt: "Abdullah Sayyad" },
    ],
    socials: [
      {
        platform: "github",
        label: "GitHub",
        href: "https://github.com/abdullahsayyad",
      },
      {
        platform: "instagram",
        label: "Instagram",
        href: "https://instagram.com/", // PLACEHOLDER — add your handle
      },
      {
        platform: "linkedin",
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/abdullahsayyad",
      },
    ],
    email: "abdullahsayyad.dev@gmail.com",
  },

  // Real. Sourced from the GitHub repo; cover composed from the repo's own
  // example output (left half raw imagery, right half predicted mask).
  projects: [
    {
      id: "satellite-imagery-segmentation",
      title: "Satellite Imagery Segmentation",
      description:
        "A U-Net that labels every pixel of high-resolution satellite imagery as building, road, water, vegetation or bare land, at 86% test accuracy.",
      image: {
        src: "/projects/satellite-imagery-segmentation.webp",
        alt: "Aerial view split down the middle: raw satellite imagery on the left, the model's colour-coded segmentation mask on the right.",
      },
      href: "https://github.com/abdullahsayyad/Satellite-Imagery-Segmentation-U-Net",
    },
    {
      id: "daisy-web-engine",
      title: "Daisy Web Engine",
      description:
        "A domain routing and application serving engine written in Rust, mapping incoming HTTP requests to the right hosted app with minimal overhead.",
      // The repo's own logo. SVGs are served unoptimised by Next, so this
      // needs no next.config change.
      image: {
        src: "/projects/daisy-web-engine.svg",
        alt: "The Daisy project logo.",
      },
      href: "https://github.com/abdullahsayyad/Daisy-Web-Engine",
    },
    // Add further projects here in the same shape. Drop a cover in
    // /public/projects and point `image.src` at it; omit `image` entirely to
    // fall back to the design's grey placeholder block.
  ],

  // Real. Cover is the account's "a!" mark, redrawn as vector paths because
  // Instagram only serves its profile picture at 100x100.
  products: [
    {
      id: "instagram-content-agent",
      title: "Instagram Content Agent",
      description:
        "An AI agent that handles content creation for Instagram, turning an idea into ready-to-post captions and creative without the manual grind.",
      image: {
        src: "/projects/instagram-content-agent.svg",
        alt: "The Aha! Daily logo: a white italic “a!” on black.",
      },
      // The live account the agent runs.
      href: "https://www.instagram.com/the.aha.daily/",
    },
  ],

  // ---- PLACEHOLDER — replace these ----------------------------------------
  contact: {
    heading: "Get in touch",
    body: "Open to work on machine learning systems, agent infrastructure and the messy parts in between. The fastest way to reach me is email.",
    email: "abdullahsayyad.dev@gmail.com",
  },
  // ---- end PLACEHOLDER ----------------------------------------------------

  // How many tiles the home page shows per section.
  //
  // `moreHref` is intentionally unset: the /projects and /products pages do
  // not exist yet. Once you build them, set the href here and the "See more"
  // button appears on its own as soon as a list grows past `limit`.
  lists: {
    projects: { limit: 3 },
    products: { limit: 3 },
  },
};
