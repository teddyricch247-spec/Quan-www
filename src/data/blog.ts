export type BlogTag = 'Product' | 'Engineering' | 'Company';

export interface BlogPost {
  slug: string;
  title: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  excerpt: string;
  tag: BlogTag;
  body: string[];
}

/**
 * Spec §3.6: "No copy to draft beyond the page header — the rest is
 * whatever you actually publish." These two entries are sample/
 * placeholder content only, here so the list, tag filter, and
 * generateStaticParams()-driven detail route have something real to
 * render — replace or delete them once you have actual posts. Add a
 * new post by adding an object here; its page at /blog/[slug] is
 * generated automatically at build time.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-this-blog-is-built',
    title: 'How This Blog Is Built',
    date: '2026-01-01',
    tag: 'Engineering',
    excerpt: 'A quick look at how posts, tags, and static pages are generated on this site.',
    body: [
      "Every post on this blog is statically generated at build time from a small local data file (src/data/blog.ts) — no CMS wired up yet. Add a new entry to the posts array, and Next.js pre-renders its own page automatically via generateStaticParams() in app/blog/[slug]/page.tsx.",
      'That keeps things simple for now, and leaves the door open: swap the data source for a real CMS or headless API later without changing how the rest of the site renders — either keep it static and rebuild on publish, or add `export const revalidate = <seconds>` to pick up new posts without a full redeploy.',
    ],
  },
  {
    slug: 'welcome-to-the-quancis-blog',
    title: 'Welcome to the Quancis Blog',
    date: '2026-01-01',
    tag: 'Company',
    excerpt: 'Placeholder content demonstrating the list, tag filter, and an individual post page — replace with a real first post.',
    body: [
      'This post is placeholder content, included so the blog list, tag filtering, and this individual post template have something real to render before any posts exist yet.',
      "Replace it with your first real announcement, engineering note, or product update whenever you're ready to publish — the layout, date formatting, and tag styling will all carry over unchanged.",
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllTags(): BlogTag[] {
  return Array.from(new Set(BLOG_POSTS.map((p) => p.tag)));
}
