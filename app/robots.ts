import type { MetadataRoute } from "next";

/**
 * Block all search engines from crawling the site.
 *
 * Rationale: the site is password-gated to invited guests only. Even though
 * the password page itself is the only publicly-reachable route, we don't
 * want it indexed. After the wedding (or whenever the site goes truly
 * public), simply delete this file or change `disallow` to "".
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
