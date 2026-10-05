# Portfolio — Abdullah Sayyad

Single-page portfolio built from the Figma design
([file `Ki2Gq1R7Ic88kQk7tvKibJ`, frame `6:3`](https://www.figma.com/design/Ki2Gq1R7Ic88kQk7tvKibJ/Untitled?node-id=6-3)).

Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Editing content

**All page content lives in one file: [`src/data/portfolio.ts`](src/data/portfolio.ts).**
Nothing else needs to change to update the site.

The blocks marked `PLACEHOLDER` there — every project, every product, the
contact copy, and the three social URLs — are invented stand-ins. Replace them.
The name, role and About copy are real, taken from the design.

### Adding a project from a GitHub repo

The Projects list is real content; Products and Contact are still placeholders.

For each repo, add one entry to `projects` in `src/data/portfolio.ts`:

```ts
{
  id: "kebab-case-id",
  title: "Human Title",
  description: "One or two sentences.",
  image: { src: "/projects/<id>.webp", alt: "..." },
  href: "https://github.com/<user>/<repo>",
}
```

Covers live in `public/projects/`. The tile crops square (`object-cover`), so
a wide figure centre-crops badly — the satellite cover was composed by cutting
the repo's own two-panel output in half and joining raw imagery to predicted
mask, giving a square that still shows the before/after. Any repo image needs
similar treatment, or just omit `image` to get the design's grey block.

### Flags under the role

`profile.locations` renders slash-separated flags under the role line:

```ts
locations: [
  { code: "IN", label: "India" },
  { code: "BH", label: "Bahrain" },
],
```

`code` is an ISO 3166-1 alpha-2 code that must match a file in
`public/flags/<code>.svg`. To add a country, drop its SVG there and add the
entry. An empty array hides the row.

Note these are real SVG assets, not emoji — flag emoji do not render on
Windows, which shows the two-letter code instead.

Photos for the stack beside your name live in `public/profile photos/` and are
listed in `profile.photos`:

```ts
photos: [
  { src: "/profile photos/pic1.jpeg", alt: "Abdullah Sayyad" },
  // add pic2, pic3 here
],
```

**Order matters: the list runs front-to-back.** The first entry is the topmost,
fully visible card; later entries sit behind it and only show as thin edges.

The design draws exactly three cards. Any slot left empty keeps the grey
placeholder from the mock, so the layout holds with one, two, or three photos.
The same applies to `image` on a project or product.

**The stack cycles** so each photo takes a turn at the front: while hovered on
devices with a pointer, and continuously on touch devices, where hover never
fires (`(hover: hover)` decides which). It holds still under
`prefers-reduced-motion`, and with fewer than two photos there is nothing to
cycle, so it stays static. Timing is `STEP_MS` in `PhotoStack.tsx`.

A deck shorter than three repeats its photos across the cards rather than
leaving gaps, so a blank grey card can never rotate to the front.

Cards are 214x252 (ratio 0.85) and photos are cropped with `object-cover`, so
a tall phone photo (9:16) loses roughly a third of its height, top and bottom.
Frame accordingly, or set `object-position` in `PhotoStack.tsx` to bias the
crop.

### Section size and "See more"

`lists` caps how many tiles each section shows on the home page:

```ts
lists: {
  projects: { limit: 3 },
  products: { limit: 3 },
},
```

The `/projects` and `/products` pages do not exist yet, so `moreHref` is
deliberately unset. Once you build them, add it:

```ts
projects: { limit: 3, moreHref: "/projects" },
```

The "See more" button renders only when `moreHref` is set **and** the list is
longer than `limit`, so it can never become a dead link.

## Structure

```
src/
  app/            layout (Inter, metadata) + page (the 743/769 split)
  components/
    left/         IdentityPanel, PhotoStack, SocialLinks   — the fixed panel
    right/        ContentPanel, SiteNav, SectionDots,
                  WorkTile, Section                        — the scrolling pane
  data/           portfolio.ts  ← the only file you edit for content
  types/          the content model
  hooks/          useActiveSection (scroll-spy)
  lib/            scrollToSection
```

Design tokens (colour, type scale, the `38px` gutter) are defined once as
Tailwind v4 theme variables in [`src/app/globals.css`](src/app/globals.css).

## How the page behaves

The left panel is fixed on `lg` and up. The right pane is its own scroll
container holding three full-height sections, each with a large heading. The
nav underline and the dot indicator both follow scroll position via
`useActiveSection`, and clicking either scrolls to that section.

**Collapsing heading (desktop).** The page opens with the first section's
title at full size, flush to the top, and the nav hidden. Over the next 140px
of scroll that title shrinks onto its own nav tab and the nav fades in as it
lands — `useCollapsingHeaders`. It plays once, as an intro: later sections
scroll normally and the nav stays put.

The nav is `h-0`, a pure overlay, so it takes no flow space and the title can
sit flush against the top. This runs at every breakpoint — the scroll
container differs (the right pane on `lg`, the document below it), so progress
is measured against the nav's own box: it is `sticky top-0`, so its top is the
line headings pin to whichever element is scrolling. Both scrollers are
listened to, since scroll does not bubble from an element to the window.

Three constraints if you touch this:

- Only the first nav section collapses. `Section`/`WorkSection` take a
  `collapsing` prop and `ContentPanel` passes it for `ids[0]` only; the hook
  reads `ids[0]` to match. Both must agree, or the heading will be measured
  while it is not sticky.

- `Section` measures the heading's sticky wrapper to find its untransformed
  position. The wrapper is full-bleed (`-mx-6 px-6`), so the hook adds the
  heading's `offsetLeft/offsetTop` back. Transforming the wrapper itself, or
  changing that padding without updating the hook, makes titles land off their
  tab by exactly one gutter.
- The hook writes styles straight to the DOM inside a `requestAnimationFrame`.
  It must not be converted to React state — it runs on every scroll frame.

Tune the feel with `COLLAPSE_DISTANCE` in `useCollapsingHeaders.ts`.

Scrollbars are hidden on both scrollers (the document and the right pane) via
the `no-scrollbar` utility in `globals.css`. Scrolling itself is untouched —
wheel, trackpad, touch, keyboard and the nav/dot controls all still work. On
desktop the dot indicator is the remaining visual cue for scroll position.

Whenever the user prefers reduced motion the collapse is switched off
entirely: headings stay full size and the nav stays visible. Below `lg` the
two panels stack, the document scrolls instead of the pane, and the dot
indicator is hidden.

Mobile also reshapes two blocks that were too cramped side by side. Project
tiles stack — cover on top at full width, title and description beneath —
because a phone left the copy in a ~210px column running to five or six lines;
full width roughly halves that. In the left panel the photo stack is centred
with the name below it at a smaller size, rather than squeezed beside it.

The social icons move out of the left panel into a footer below Contact, so they sit at the true bottom of the page rather than
mid-scroll — they are rendered in both places and shown one at a time by
breakpoint (`page.tsx` footer vs. `IdentityPanel`).

Note the Contact heading comes from `contact.heading` ("Get in touch") rather
than the nav label, so the section does not read "Contact" twice.

## Planned

An `/admin` page for editing content. `src/data/portfolio.ts` exports a plain
`PortfolioContent` object typed in `src/types/portfolio.ts`, so swapping the
static export for a database or CMS fetch is a one-file change — no component
touches the data shape directly.
