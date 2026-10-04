import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import {
  formatPostDate,
  getAllPosts,
  getAuthor,
  getModifiedDate,
  getPostBySlug,
  getReadingMinutes,
  getRelatedPosts,
  getWordCount,
} from '../../../data/blog';
import { JsonLd } from '../../../components/JsonLd';
import { PlatformCta } from '../../../components/PlatformCta';
import { PostBody, PostReferences, PostToc } from '../../../components/blog/PostBody';
import { ROUTES } from '../../../lib/routes';
import { SITE_NAME, absoluteUrl, blogPostingJsonLd, breadcrumbJsonLd } from '../../../lib/seo';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// The parameterized-SSG case: every post's page is pre-rendered at
// build time from src/data/posts, one static HTML page per slug.
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
  const path = `/blog/${post.slug}`;
  const title = post.seoTitle ?? post.title;
  const social = `${post.title} | ${SITE_NAME}`;
  // Each post names its own 1200x630 share image (public/og/<slug>.png).
  // It is set here rather than as an opengraph-image file because a file
  // in this folder would apply to every post.
  const image = { url: post.ogImage, width: 1200, height: 630, alt: post.title };
  return {
    title,
    description: post.excerpt,
    keywords: post.keywords,
    authors: [{ name: getAuthor(post).name }],
    alternates: { canonical: path },
    openGraph: {
      title: social,
      description: post.excerpt,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: getModifiedDate(post),
      authors: [getAuthor(post).name],
      tags: post.keywords,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: social,
      description: post.excerpt,
      images: [post.ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    notFound();
    return null;
  }

  const author = getAuthor(post);
  const modified = getModifiedDate(post);
  const path = `/blog/${post.slug}`;
  const related = getRelatedPosts(post);

  return (
    <article className="w-full bg-white px-[clamp(20px,5vw,48px)] pt-[clamp(56px,9vh,96px)] pb-[clamp(88px,14vh,150px)]">
      <JsonLd
        data={[
          blogPostingJsonLd({
            title: post.title,
            description: post.excerpt,
            path,
            datePublished: post.date,
            dateModified: modified,
            authorName: author.name,
            image: post.ogImage,
            wordCount: getWordCount(post),
            keywords: post.keywords,
            section: post.tag,
          }),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: ROUTES.blog },
            { name: post.title, path },
          ]),
        ]}
      />
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
            {formatPostDate(post.date)}
          </time>
          <span className="text-sm text-ink-3">{getReadingMinutes(post)} min read</span>
        </div>

        <h1
          className="mt-4 mb-5 font-medium text-ink leading-[1.12] tracking-[-0.034em]"
          style={{ fontSize: 'clamp(2rem, 4.4vw, 2.9rem)' }}
        >
          {post.title}
        </h1>

        <p className="m-0 mb-10 text-sm leading-[1.6] text-ink-3">
          By <span className="font-medium text-ink-2">{author.name}</span>, {author.role}
          {modified !== post.date ? (
            <>
              {' '}
              · Updated <time dateTime={modified}>{formatPostDate(modified)}</time>
            </>
          ) : null}
        </p>

        <PostToc blocks={post.body} />
        <PostBody blocks={post.body} />
        {post.references && post.references.length > 0 ? <PostReferences references={post.references} /> : null}

        {related.length > 0 ? (
          <section aria-labelledby="related-heading" className="mt-16 border-t border-line pt-10">
            <h2 id="related-heading" className="m-0 text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
              Keep reading
            </h2>
            <ul className="m-0 mt-5 flex list-none flex-col gap-5 p-0">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} className="group block cursor-pointer">
                    <span className="text-[1.0625rem] font-medium text-ink transition-colors group-hover:text-ink-2">
                      {r.title}
                    </span>
                    <span className="mt-1 block text-[0.9375rem] leading-[1.6] text-ink-2">{r.excerpt}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <PlatformCta className="mt-16" />
      </div>
    </article>
  );
}
