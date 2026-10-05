import type { Metadata } from 'next';
import { ORG } from './org';

export const SITE_URL = 'https://www.quancis.space';
export const SITE_NAME = 'Quancis';

/**
 * Real profile URLs for the company (GitHub, LinkedIn, X, ...). Left empty on
 * purpose: nothing here is invented. Add them when they exist and they are
 * emitted as `sameAs` in the Organization structured data.
 */
export const SOCIAL_PROFILES: readonly string[] = [];

/**
 * When each page's content last changed in a way a reader would notice.
 * The sitemap publishes these as <lastmod>. Google only trusts lastmod when
 * it is consistently accurate, so update a date when you meaningfully edit
 * that page, and not otherwise. (Blog posts carry their own `date` /
 * `updated` in src/data/posts.)
 */
export const PAGE_UPDATED: Record<string, string> = {
  '/': '2026-10-04',
  '/kael': '2026-10-04',
  '/kael/demo': '2026-10-04',
  '/harness': '2026-10-02',
  '/chat': '2026-10-02',
  '/pricing': '2026-10-03',
  '/examples': '2026-10-02',
  '/about': '2026-10-03',
  '/contact': '2026-10-02',
  '/blog': '2026-10-05',
  '/legal': '2026-10-02',
};

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  /** Set to keep a page out of search results (e.g. a page that is still all placeholder). */
  noindex?: boolean;
}

/**
 * Per-page metadata with the fields that have to be set per page.
 *
 * The root layout sets openGraph/twitter once. A page that only sets a
 * title and description inherits that root openGraph unchanged, which
 * means every page would share the home page's og:title and og:url — so
 * a shared /kael link would present itself as the home page. This helper
 * sets title, description, canonical, og:url and the twitter card for the
 * page itself. (Each route folder also carries its own opengraph-image
 * file so the share image is attached to the page, not dropped when the
 * page's openGraph replaces the root's.)
 */
export function pageMetadata({ title, description, path, noindex = false }: PageMetadataInput): Metadata {
  const full = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: full,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: full,
      description,
    },
  };
}

// ---------------------------------------------------------------------------
// Structured data (JSON-LD). Rendered with <JsonLd /> — see components/JsonLd.
// Only facts that are true and visible on the site are included: no ratings,
// no review counts, no prices that are not published as a fixed price.
// ---------------------------------------------------------------------------

export type JsonLdNode = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationJsonLd(): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: ORG.name,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/logo.png'),
      width: 512,
      height: 512,
    },
    description:
      'Quancis builds Kael, a composite intelligence system, and the products people use it through: the Kael API, the Quan Harness coding agent and Quan Chat.',
    email: ORG.email.business,
    founder: { '@type': 'Person', name: ORG.owner },
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORG.address.street,
      addressRegion: ORG.address.region,
      addressCountry: ORG.address.countryCode,
    },
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'customer support', email: ORG.email.support, availableLanguage: 'English' },
      { '@type': 'ContactPoint', contactType: 'business enquiries', email: ORG.email.business, availableLanguage: 'English' },
    ],
    ...(SOCIAL_PROFILES.length > 0 ? { sameAs: [...SOCIAL_PROFILES] } : {}),
  };
}

export function websiteJsonLd(): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'en',
    publisher: { '@id': ORG_ID },
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export type AppCategory = 'DeveloperApplication' | 'UtilitiesApplication';

export function softwareApplicationJsonLd(app: {
  name: string;
  path: string;
  description: string;
  category: AppCategory;
}): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    url: absoluteUrl(app.path),
    description: app.description,
    applicationCategory: app.category,
    operatingSystem: 'Web',
    publisher: { '@id': ORG_ID },
  };
}

export function blogPostingJsonLd(post: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  image: string;
  wordCount: number;
  keywords: readonly string[];
  section: string;
}): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: absoluteUrl(post.path),
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(post.path) },
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: { '@type': 'Person', name: post.authorName },
    publisher: { '@id': ORG_ID },
    image: absoluteUrl(post.image),
    wordCount: post.wordCount,
    keywords: post.keywords.join(', '),
    articleSection: post.section,
    inLanguage: 'en',
  };
}

export function collectionPageJsonLd(page: { name: string; description: string; path: string }): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: page.name,
    description: page.description,
    url: absoluteUrl(page.path),
    isPartOf: { '@id': WEBSITE_ID },
  };
}

export function aboutPageJsonLd(page: { name: string; description: string; path: string }): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: page.name,
    description: page.description,
    url: absoluteUrl(page.path),
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
  };
}

export function contactPageJsonLd(page: { name: string; description: string; path: string }): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: page.name,
    description: page.description,
    url: absoluteUrl(page.path),
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
  };
}
