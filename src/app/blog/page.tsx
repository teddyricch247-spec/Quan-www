import type { Metadata } from 'next';
import { BlogList } from './BlogList';
import { getAllPosts } from '../../data/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Product news, engineering notes, and the occasional deep dive.',
};

// No dynamic data fetching here — this page (and every post it links
// to) is statically generated at build time from src/data/blog.ts.
export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="w-full bg-white px-[clamp(20px,5vw,48px)] pt-[clamp(56px,9vh,96px)] pb-[clamp(88px,14vh,150px)]">
      <div className="max-w-[760px] mx-auto">
        <span className="page-eyebrow">Quancis</span>
        <h1 className="page-title mt-3.5">From Quancis.</h1>
        <p className="page-lead mt-4">Product news, engineering notes, and the occasional deep dive.</p>

        <div className="mt-14">
          <BlogList posts={posts} />
        </div>
      </div>
    </div>
  );
}
