# Quancis www

The public marketing site — `www.quancis.space`. Next.js 16 (App Router),
React 19, TypeScript, Tailwind CSS 4, Three.js for the hero. A separate,
lightweight repo from the platform app on purpose: zero auth, zero
dashboard code, nothing here talks to a database or an API.

Built from `quancis-site-spec.html` (Part 3: the www site) reusing the
design system already shipped in the platform app's `globals.css` /
`HeroCanvas.tsx` / `BrandMark.tsx`, per that spec's own instruction not
to invent a second visual language.

## Setup

```
npm install
npm run dev      # local dev, http://localhost:3000
npm run lint     # tsc --noEmit (type check)
npm run build    # the real check — every route pre-renders at build time
npm run start    # serve the production build
```

No environment variables needed — this site has no backend of its own.

> **This repo was generated in a sandboxed environment with no network
> access, so `npm install` / `npm run build` were never actually run
> against it.** Every file was hand-written against the exact dependency
> versions in `package.json` (matching the platform app's own), and
> checked with a standalone `tsc` pass for syntax/type errors, dead
> imports, and broken internal references — but the very first thing to
> do after cloning is `npm install && npm run build` to confirm it's
> clean end to end.

## Structure

```
src/app/                    routes — each page.tsx is the real implementation (no thin-wrapper split, this site is small enough not to need one)
src/app/blog/[slug]/        one statically generated page per post (generateStaticParams)
src/app/sitemap.ts          sitemap.xml, generated at build time
src/app/robots.ts           robots.txt, generated at build time
src/components/             Hero, AskAnything, ProductTiles, PlaceholderNote, BrandMark
src/components/three/       HeroCanvas.tsx — same WebGL hero as platform, accent tint now a prop
src/components/layout/      SiteShell, Navbar (glass drawer), Footer — no auth state, unlike platform's
src/lib/routes.ts           internal ROUTES + external platform./app.quancis.space URLs
src/lib/accents.ts          the three accent colors (red/harness/chat) as stable-reference constants
src/data/blog.ts            blog post content — see "Blog content" below
src/app/globals.css         ported design system + the 2 new accent tokens + .btn-pill-glass
```

## Rendering: SSG, with a documented path to SSR/ISR

Every route here does zero per-request data fetching, so the whole site
is statically generated at build time (SSG) — that's the App Router's
default behavior, nothing special had to be configured for it.

`/blog/[slug]` is the clearest example: `generateStaticParams()` in that
file pre-renders one HTML page per post from `src/data/blog.ts` at build
time, and `dynamicParams = false` means an unknown slug 404s rather than
rendering on demand.

If the blog moves to a live CMS later and needs fresh content without a
full rebuild, that's a one-line change in `src/app/blog/page.tsx` and
`src/app/blog/[slug]/page.tsx`:
- `export const revalidate = <seconds>` → ISR (static, but refreshes periodically)
- `export const dynamic = 'force-dynamic'` → true per-request SSR

Nothing else in the app needs to change either way.

## Pages

| Route | Accent | Notes |
|---|---|---|
| `/` | red (no CTA) | 3 product tiles + the "One Intelligence" section |
| `/kael` | red | benchmarks section is a flagged placeholder — no numbers invented |
| `/harness` | harness (indigo) | positioning section has a "Fill in" flag for real differentiation copy; screenshots/demo also flagged |
| `/chat` | chat (amber) | reuses the exact "Ask Anything" composer from platform's homepage, now handing off to `app.quancis.space/chat` instead of login |
| `/legal` | — | router page only; links out to platform's and app's real Terms/Privacy |
| `/blog`, `/blog/[slug]` | — | tag filter + statically generated post pages |

## Blog content

`src/data/blog.ts` ships with **two placeholder posts** (clearly marked
as such in-file) so the list, tag filter, and an individual post page
have something real to render. Replace or delete them before launch —
add a new post by adding an object to that array; its page is generated
automatically.

## Still needs real content before shipping

Carried over from the spec's own Part 4 — nothing below was invented,
each is left as an explicit in-page flag instead:

- `/kael`'s benchmark numbers
- `/harness` and `/chat`'s positioning sections (differentiation vs. named competitors)
- Screenshots/demo media on `/harness` and `/chat`
- The two new accent hex values — worth a quick visual check once rendered against the live hero shader
- Whether Harness/Chat really live at `app.quancis.space/harness` + `/chat` — used throughout since the spec used that pattern, but per the spec it's a call to confirm (see `src/lib/routes.ts`, `EXTERNAL`)
- Blog content itself (see above)

## Deploy

No static export — deploys anywhere Next.js runs (Vercel, `next start`
behind Node, etc.). No `output: 'export'` in `next.config.ts` since App
Router's default static optimization already covers every route here.
