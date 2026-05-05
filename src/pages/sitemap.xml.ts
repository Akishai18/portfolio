import type { APIRoute } from "astro";
import { pages } from "../content/pages";

/**
 * Dynamic sitemap.xml.
 *
 * Generated at build time from `content/pages.ts` so adding a new route
 * via the page registry automatically gets it indexed. The home page is
 * added explicitly because it isn't a member of the page registry.
 *
 * Google reads this when crawling — submit it once in Search Console and
 * Google polls it on its own schedule from then on.
 */

export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL("https://akishai.com")).toString().replace(/\/$/, "");
  const lastmod = new Date().toISOString().slice(0, 10);

  const urls = [
    { loc: `${base}/`, priority: "1.0", changefreq: "monthly" },
    ...pages.map((p) => ({
      loc: `${base}${p.href}`,
      priority: "0.8",
      changefreq: "monthly",
    })),
  ];

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        ({ loc, priority, changefreq }) =>
          `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`,
      )
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
