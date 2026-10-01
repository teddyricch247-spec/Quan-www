import type { Metadata } from 'next';

export const SITE_URL = 'https://www.quancis.space';

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
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const full = `${title} | Quancis`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: full,
      description,
      url: `${SITE_URL}${path}`,
      siteName: 'Quancis',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: full,
      description,
    },
  };
}
