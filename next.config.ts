import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // This site has no per-request/per-user data, so every route under
  // src/app is statically generated at build time (SSG) by default —
  // that's the normal behavior of the App Router when a page does no
  // dynamic data fetching, no manual config needed to opt in.
  //
  // /blog/[slug] goes one step further and pre-renders each post from
  // generateStaticParams() (see src/app/blog/[slug]/page.tsx) — the
  // parameterized-SSG case. If the blog later moves to a live CMS and
  // needs fresh content without a full rebuild, add
  // `export const revalidate = <seconds>` to that page for ISR, or
  // `export const dynamic = 'force-dynamic'` for true per-request SSR —
  // no other files need to change.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
