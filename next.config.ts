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

  // Addresses people commonly type or search for that would otherwise 404.
  //
  // The /docs, /privacy and /terms ones are temporary (307) on purpose, so
  // they can be pointed somewhere else later without browsers or search
  // engines remembering the old destination. There is deliberately no
  // /pricing redirect: /pricing is a real page (it covers both the API and
  // the apps).
  //
  // The demos live at /kael/demo (see src/app/kael/demo). People will type or
  // guess /demo, so send it, and /demo/<slug>, to the real place. Those are
  // permanent (308) so search engines keep only the /kael/demo URLs.
  //
  // Deliberately NOT redirected: /demo-files/*. That is where the raw
  // single-file HTML games are served from (public/demo-files), and the player
  // iframes load them from there.
  async redirects() {
    return [
      { source: '/docs', destination: 'https://platform.quancis.space/docs', permanent: false },
      { source: '/privacy', destination: '/legal', permanent: false },
      { source: '/terms', destination: '/legal', permanent: false },
      { source: '/privacy-policy', destination: '/legal', permanent: false },
      { source: '/terms-of-service', destination: '/legal', permanent: false },
      { source: '/demo', destination: '/kael/demo', permanent: true },
      { source: '/demos', destination: '/kael/demo', permanent: true },
      { source: '/demo/:slug', destination: '/kael/demo/:slug', permanent: true },
    ];
  },

  // The raw game files duplicate what their pages say, so keep them out of
  // search results; the pages at /kael/demo/<slug> are what should be found.
  // Playing them (in the page's iframe, or in a tab) is unaffected.
  async headers() {
    return [
      {
        source: '/demo-files/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
    ];
  },
};

export default nextConfig;
