/**
 * Site map — each route is also a "planet" in the solar system.
 * The order here drives orbit position + nav order.
 *
 * Color is the planet's signature tint — used in the nav dock,
 * 3D scene, and per-page accent gradient.
 */

/**
 * Planet "kind" — drives the surface treatment in the Planet.astro glyph.
 *
 *  gas-giant   : warped horizontal bands, soft atmosphere, no rings
 *  ringed      : gas giant + Saturn-style rings (used by the showpiece)
 *  rocky       : pockmarked craters, muted atmosphere — moon-like
 *  terrestrial : faint bands + a small ice cap and a couple of weather spots
 *  metallic    : conic-gradient lustre sweep, sharp specular highlight
 */
export type PlanetKind =
  | "gas-giant"
  | "ringed"
  | "rocky"
  | "terrestrial"
  | "metallic";

export type PageMeta = {
  id: string;
  title: string;
  href: string;
  blurb: string;
  /** Hex color for the planet surface */
  color: string;
  /** Hex color for the planet ring/glow accent */
  accent: string;
  /** Surface treatment used by the Planet glyph */
  kind: PlanetKind;
  /** Distance from sun (au-ish, drives orbit radius) */
  orbit: number;
  /** Relative size of the planet (1 = baseline) */
  size: number;
};

export const pages: PageMeta[] = [
  {
    id: "experience",
    title: "Experience",
    href: "/experience",
    blurb: "Where I've worked and led.",
    color: "#b8860b",
    accent: "#d4a85a",
    kind: "gas-giant",
    orbit: 2,
    size: 1.1,
  },
  {
    id: "projects",
    title: "Projects",
    href: "/projects",
    blurb: "Things I've built — shipped and in flight.",
    color: "#9a7009",
    accent: "#e6c275",
    kind: "ringed",
    orbit: 3,
    size: 1.25,
  },
  {
    id: "skills",
    title: "Skills",
    href: "/skills",
    blurb: "The tools I reach for.",
    color: "#a0a4ad",
    accent: "#d8dbe2",
    kind: "rocky",
    orbit: 4,
    size: 0.95,
  },
  {
    id: "education",
    title: "Education",
    href: "/education",
    blurb: "Where I've studied.",
    color: "#7a5c0e",
    accent: "#b8860b",
    kind: "terrestrial",
    orbit: 5,
    size: 1.0,
  },
  {
    id: "awards",
    title: "Awards",
    href: "/awards",
    blurb: "Recognition collected along the way.",
    color: "#a05a14",
    accent: "#e8a960",
    kind: "metallic",
    orbit: 6,
    size: 0.85,
  },
];

export const pagesById = Object.fromEntries(pages.map((p) => [p.id, p])) as Record<
  string,
  PageMeta
>;
