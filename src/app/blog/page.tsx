import type { Metadata } from 'next';
import { BlogList } from './BlogList';
import { getAllPosts, toListItem } from '../../data/blog';
import { JsonLd } from '../../components/JsonLd';
import { PlatformCta } from '../../components/PlatformCta';
import { breadcrumbJsonLd, collectionPageJsonLd, pageMetadata } from '../../lib/seo';

const TITLE = 'Blog — AI Systems Research and Engineering Notes';
const DESCRIPTION =
  'Long-form notes from Quancis: how AI systems spend extra compute, the security of AI-written code, and the thinking behind Kael and how to use it.';

export const metadata: Metadata = {
  ...pageMetadata({ title: TITLE, description: DESCRIPTION, path: '/blog' }),
  // pageMetadata sets `alternates` (canonical); this adds the feed to it.
  alternates: { canonical: '/blog', types: { 'application/rss+xml': '/feed.xml' } },
};

// No dynamic data fetching here — this page (and every post it links
// to) is statically generated at build time from src/data/blog.ts.
// Only a slim list item per post goes to the client component, not the
// post bodies.
export default function BlogIndexPage() {
  const posts = getAllPosts().map(toListItem);

  return (
    <div className="w-full bg-white px-[clamp(20px,5vw,48px)] pt-[clamp(56px,9vh,96px)] pb-[clamp(88px,14vh,150px)]">
      <JsonLd
        data={[
          collectionPageJsonLd({ name: 'Quancis Blog', description: DESCRIPTION, path: '/blog' }),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
          ]),
        ]}
      />
      <div className="max-w-[760px] mx-auto">
        <span className="page-eyebrow">Quancis</span>
        <h1 className="page-title mt-3.5">From Quancis.</h1>
        <p className="page-lead mt-4">
          Research write-ups, engineering notes and product updates from the team building Kael.
        </p>

        <div className="mt-14">
          <BlogList posts={posts} />
        </div>

        <PlatformCta className="mt-16" />
      </div>
    </div>
  );
}
