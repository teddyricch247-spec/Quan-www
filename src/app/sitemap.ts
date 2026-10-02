import type { MetadataRoute } from 'next';
import { getAllPosts } from '../data/blog';
import { ROUTES } from '../lib/routes';
import { SITE_URL } from '../lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}${ROUTES.home}`, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}${ROUTES.kael}`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}${ROUTES.harness}`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}${ROUTES.chat}`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}${ROUTES.pricing}`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}${ROUTES.about}`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE_URL}${ROUTES.blog}`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}${ROUTES.legal}`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}${ROUTES.blog}/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...postRoutes];
}
