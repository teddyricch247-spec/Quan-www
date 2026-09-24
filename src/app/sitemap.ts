import type { MetadataRoute } from 'next';
import { getAllPosts } from '../data/blog';

const SITE_URL = 'https://www.quancis.space';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/kael`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/harness`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/chat`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/legal`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...postRoutes];
}
