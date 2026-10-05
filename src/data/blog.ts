import { ORG } from '../lib/org';
import { countWords } from './blog-types';
import type { Author, BlogListItem, BlogPost, BlogTag } from './blog-types';
import { post as introducingKael } from './posts/introducing-kael';
import { post as whyKaelIsSlower } from './posts/why-kael-is-slower-on-purpose';
import { post as bestOfNToMindEvolution } from './posts/best-of-n-to-mind-evolution';
import { post as aiCodeSecurity } from './posts/ai-generated-code-security-review';
import { post as thinkingBehindKael } from './posts/the-thinking-behind-kael';

export type { BlogPost, BlogTag, BlogListItem } from './blog-types';

/**
 * Add a post: create a file in src/data/posts (copy an existing one),
 * import it here and add it to BLOG_POSTS. Its page at /blog/[slug], its
 * share image, its entry in the sitemap and in /feed.xml are all generated
 * automatically. See README.md ("Writing a blog post") for the block types,
 * inline formatting and the share-image script.
 *
 * Dates: use the real day you publish. Do not backdate: search engines read
 * `date` and `updated`, and they should be true.
 */
export const BLOG_POSTS: BlogPost[] = [
  thinkingBehindKael,
  bestOfNToMindEvolution,
  aiCodeSecurity,
  introducingKael,
  whyKaelIsSlower,
];

/** Authors, keyed by the `author` field on a post. */
export const AUTHORS: Record<string, Author> = {
  'response-mosese': { name: ORG.owner, role: ORG.ownerRole },
};

export function getAuthor(post: BlogPost): Author {
  return AUTHORS[post.author] ?? { name: ORG.name, role: 'Quancis' };
}

export function getAllPosts(): BlogPost[] {
  // Newest first. Equal dates return 0 so the sort (stable) keeps the order the
  // posts are listed in above, instead of an undefined order.
  return [...BLOG_POSTS].sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllTags(): BlogTag[] {
  return Array.from(new Set(BLOG_POSTS.map((p) => p.tag)));
}

export function getWordCount(post: BlogPost): number {
  return countWords(post.body);
}

/** Reading time at ~220 words a minute, never less than one minute. */
export function getReadingMinutes(post: BlogPost): number {
  return Math.max(1, Math.round(getWordCount(post) / 220));
}

/** The post's last meaningful edit, falling back to its publish date. */
export function getModifiedDate(post: BlogPost): string {
  return post.updated ?? post.date;
}

/** Posts to suggest at the end of `post`: its `related` list, topped up with the newest others. */
export function getRelatedPosts(post: BlogPost, count = 2): BlogPost[] {
  const picked: BlogPost[] = [];
  for (const slug of post.related ?? []) {
    const found = getPostBySlug(slug);
    if (found && found.slug !== post.slug) picked.push(found);
  }
  for (const other of getAllPosts()) {
    if (picked.length >= count) break;
    if (other.slug !== post.slug && !picked.includes(other)) picked.push(other);
  }
  return picked.slice(0, count);
}

/** A slim shape for the client-side blog index, so post bodies are not sent to the browser. */
export function toListItem(post: BlogPost): BlogListItem {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    tag: post.tag,
    minutes: getReadingMinutes(post),
  };
}

/** Format an ISO date as e.g. "2 October 2026" (UTC, so it never shifts by timezone). */
export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
