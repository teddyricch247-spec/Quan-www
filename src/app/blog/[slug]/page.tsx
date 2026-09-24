import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getAllPosts, getPostBySlug } from '../../../data/blog';
import { ROUTES } from '../../../lib/routes';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// The parameterized-SSG case: every post's page is pre-rendered at
// build time from src/data/blog.ts, one static HTML page per slug.
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

// Any slug not returned above 404s instead of falling back to
// on-demand rendering — correct for a fully static blog. If this
// moves to a live CMS later, drop this line (or set it to true) and
// add revalidation instead.
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article', publishedTime: post.date },
  };
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(d);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    notFound();
    return null;
  }

  return (
    <article className="w-full bg-white px-[clamp(20px,5vw,48px)] pt-[clamp(56px,9vh,96px)] pb-[clamp(88px,14vh,150px)]">
      <div className="max-w-[680px] mx-auto">
        <Link
          href={ROUTES.blog}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Blog
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="badge-pill badge-pill-neutral">{post.tag}</span>
          <time dateTime={post.date} className="text-sm text-ink-3">
            {formatDate(post.date)}
          </time>
        </div>

        <h1
          className="mt-4 mb-8 font-medium text-ink leading-[1.12] tracking-[-0.034em]"
          style={{ fontSize: 'clamp(2rem, 4.4vw, 2.9rem)' }}
        >
          {post.title}
        </h1>

        <div className="flex flex-col gap-5">
          {post.body.map((paragraph, i) => (
            <p key={i} className="text-ink-2 leading-[1.75]" style={{ fontSize: '1.0625rem' }}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
