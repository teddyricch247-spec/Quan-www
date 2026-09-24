'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import type { BlogPost, BlogTag } from '../../data/blog';

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(d);
}

export const BlogList: React.FC<{ posts: BlogPost[] }> = ({ posts }) => {
  const tags = useMemo(() => Array.from(new Set(posts.map((p) => p.tag))), [posts]);
  const [active, setActive] = useState<BlogTag | 'All'>('All');

  const filtered = active === 'All' ? posts : posts.filter((p) => p.tag === active);

  return (
    <div>
      {tags.length > 1 ? (
        <div className="mb-10 flex flex-wrap gap-2">
          {(['All', ...tags] as const).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActive(tag)}
              aria-pressed={active === tag}
              className={`h-9 px-4 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
                active === tag
                  ? 'bg-ink text-white border-ink'
                  : 'bg-white text-ink-2 border-line hover:border-ink-3 hover:text-ink'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      ) : null}

      <ul className="flex flex-col gap-2">
        {filtered.map((post) => (
          <li key={post.slug} className="border-t border-line-soft first:border-t-0">
            <Link
              href={`/blog/${post.slug}`}
              className="group block py-7 cursor-pointer"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="badge-pill badge-pill-neutral">{post.tag}</span>
                <time dateTime={post.date} className="text-sm text-ink-3">
                  {formatDate(post.date)}
                </time>
              </div>
              <h2 className="mt-3 mb-1.5 text-xl font-medium tracking-[-0.02em] text-ink transition-colors group-hover:text-ink-2">
                {post.title}
              </h2>
              <p className="max-w-[600px] text-[0.9375rem] leading-[1.6] text-ink-2">{post.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-ink-3">No posts tagged {active} yet.</p>
      ) : null}
    </div>
  );
};

export default BlogList;
