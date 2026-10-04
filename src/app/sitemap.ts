import type { MetadataRoute } from 'next';
import { EXAMPLES_ARE_LIVE } from '../data/examples';
import { getAllPosts, getModifiedDate } from '../data/blog';
import { getAllDemos } from '../data/demos';
import { ROUTES, demoPath } from '../lib/routes';
import { PAGE_UPDATED, SITE_URL } from '../lib/seo';

// Auto-generated at build time. Every URL is on the canonical www host.
// <lastmod> comes from PAGE_UPDATED (pages), each demo's own date and each
// post's own dates, so it only changes when content does. changeFrequency and
// priority are not set: Google ignores them.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: string[] = [
    ROUTES.home,
    ROUTES.kael,
    ROUTES.demo,
    ROUTES.harness,
    ROUTES.chat,
    ROUTES.pricing,
    ROUTES.about,
    ROUTES.contact,
    ROUTES.blog,
    ROUTES.legal,
    // /examples joins the sitemap automatically once it holds at least one
    // real (non-placeholder) example. Until then the page is noindex.
    ...(EXAMPLES_ARE_LIVE ? [ROUTES.examples] : []),
  ];

  const staticEntries: MetadataRoute.Sitemap = pages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(PAGE_UPDATED[path] ?? '2026-10-03'),
  }));

  // One entry per demo page. The raw HTML files in /demo-files are not listed
  // (and are served noindex, see next.config.ts): the pages are what should rank.
  const demoEntries: MetadataRoute.Sitemap = getAllDemos().map((demo) => ({
    url: `${SITE_URL}${demoPath(demo.slug)}`,
    lastModified: new Date(demo.date),
  }));

  const postEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}${ROUTES.blog}/${post.slug}`,
    lastModified: new Date(getModifiedDate(post)),
  }));

  return [...staticEntries, ...demoEntries, ...postEntries];
}
