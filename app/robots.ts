import type { MetadataRoute } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://swanza.com";

// Reference: seo-strategy.md §8 — Crawl and Indexing Directives
// Disallow all authenticated app routes from crawling
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/book/",
          "/customer/",
          "/cleaner/",
          "/admin/",
          "/sign-in",
          "/sign-up",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
