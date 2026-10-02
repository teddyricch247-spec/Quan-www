import { getAllPosts } from '../../data/blog';
import { ROUTES } from '../../lib/routes';
import { SITE_URL } from '../../lib/seo';

// Generated once at build time, like every blog page.
export const dynamic = 'force-static';

const escapeXml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const rssDate = (iso: string): string => new Date(`${iso}T00:00:00Z`).toUTCString();

export function GET(): Response {
  const posts = getAllPosts();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}${ROUTES.blog}/${post.slug}`;
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${rssDate(post.date)}</pubDate>`,
        `      <category>${escapeXml(post.tag)}</category>`,
        `      <description>${escapeXml(post.excerpt)}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const lastBuildDate = posts.length > 0 ? rssDate(posts[0].date) : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Quancis</title>
    <link>${SITE_URL}${ROUTES.blog}</link>
    <description>Product news, engineering notes, and the occasional deep dive.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
