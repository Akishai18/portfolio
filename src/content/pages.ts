/**
 * Site map — each route is also a "planet" in the solar system.
 * The order here drives orbit position + nav order.
 *
 * Color is the planet's signature tint — used in the nav dock,
 * 3D scene, and per-page accent gradient.
 */

export type PageMeta = {
  id: string;
  title: string;
  href: string;
  blurb: string;
  /** Hex color for the planet surface */
  color: string;
  /** Hex color for the planet ring/glow accent */
  accent: string;
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
    orbit: 5,
    size: 1.0,
  },
  {
    id: "contact",
    title: "Contact",
    href: "/contact",
    blurb: "Let's talk.",
    color: "#c0c5ce",
    accent: "#f4f5f7",
    orbit: 6,
    size: 0.8,
  },
];

export const pagesById = Object.fromEntries(pages.map((p) => [p.id, p])) as Record<
  string,
  PageMeta
>;
