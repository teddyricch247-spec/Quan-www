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

## Changes in this round

- **Hero**: cooler dark-navy palette (was neutral grey), the touch-release timing fix from the platform app's later revision (a tap now settles at once instead of hanging at full height for a second), and a new pointer-reactive vapor layer hovering along the box field's edge (`src/components/three/HeroCanvas.tsx`). The vapor shader is new code, written and statically checked in this environment but **not visually verified** — there's no GPU/browser available here to render it. Check it in a real browser before shipping; if anything looks off, the whole addition is the `fogScene`/`fogMaterial`/`fogUniforms` block plus a few call-sites, easy to isolate or revert.
- **Glass buttons**: replaced with the actual recipe shipped on platform (`.btn-pill-glass` / `.btn-pill-glass-dark` in `globals.css`) instead of an earlier approximation — a layered specular-streak technique, not a flat translucent fill.
- **Kael's Integration section**: now the same tab-switcher pattern as platform's homepage (Python/TypeScript/cURL/LangChain, animated switching, copy button) — see `src/components/CodeIntegration.tsx`. Still explicitly not a docs replacement (says so on the page); full request/response shapes, streaming, and error handling stay in the real docs.
- **Kael's closing CTA** now points to `/pricing` on the platform domain instead of the platform root.
- **Low-poly 3D visuals**: `src/components/LowPolyScene.tsx`, a small reusable Three.js component (flat-shaded primitives only, no loaded models) with three variants — `orbit` (Kael), `pipeline` (Harness), `pulse` (Chat) — each placed inline in that page's content, not full-hero-sized.
- **Harness page**: substantially rewritten with the harness-vs-agent distinction, the cloud project environment (file system, live preview, git, language flexibility), the multi-agent routing rationale, the precision-over-speed philosophy, and a comparison table. Named-competitor comparisons (Claude Code, Cursor, Replit, Lovable) are framed as factual capability differences, not disparagement — worth your own pass to confirm every claim still holds.

## Bug-fix pass

A deeper review after the round above turned up a few real issues, now fixed:

- **Fog placement (real bug)**: the vapor was centered on the box field's own edge constant, which — after tracing through the actual gradient math — sits directly under the hero's white bottom-fade overlay at 50–65% opacity. The fog would have been almost entirely washed out in production. Moved to its own, higher vertical center that clears that overlay with margin on every hero height.
- **`.btn-glass-outline` (real bug)**: set `border-color` with no `border-width`/`border-style`, and nothing in its actual usage (the Copy button) supplied those either — CSS defaults `border-style` to `none`, so this button would have rendered with **no visible border at all**. Given the full `border` shorthand now.
- **Glass buttons too dark**: `.btn-pill-glass-dark` and the matching tab indicator had a base fill opacity of 86–94%, nearly opaque, which is why the glass effect barely showed. Dropped to roughly 52–68% (kept high enough for legible white text) and boosted blur/saturate slightly so more of what's behind them actually shows through.
- Two dead-code cleanups (an unused `blockMats` array, a leftover `THREE.EventDispatcher` line from drafting) and an unused import.
- `LowPolyScene`'s `.material` pushes to the disposal array are now explicitly cast — Three.js's `Mesh.material` type can resolve to a union in some inference paths, so this removes any ambiguity regardless of exactly how that resolves once real types are installed.
- The clipboard copy button now only shows "Copied" on actual success and doesn't leave an unhandled promise rejection if the write fails.
- Rounded out the code-tab-switcher's ARIA wiring (`aria-controls`/`role="tabpanel"`/`aria-labelledby`) so the tabs are properly linked to their panel for screen readers.
- Tightened the fog's falloff band and clamped its noise value — minor robustness/fit polish, not corrections.

## A direct answer on "are these real pages"

Yes, once deployed: everything under `src/app` is statically generated at build time into real, standalone HTML pages with their own URL, title, and meta description — not a single-page app pretending to have routes. Share `https://www.quancis.space/kael` and it opens directly on that page; view-source shows real content, not an empty shell waiting on JavaScript; Google (and any other crawler) sees the same static HTML. All standard SSG behavior, nothing special added.

The catch: right now this is source code, not a live site. It becomes real the moment it's actually deployed to a domain — see the deploy steps below. Until then there's nothing at any URL to send anyone.

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

For Vercel specifically, don't rely on dashboard auto-detection alone —
set these explicitly in Project Settings → Build and Deployment:

| Setting | Value |
|---|---|
| Framework Preset | `Next.js` |
| Root Directory | *(empty, if this repo's root is the project root)* |
| Build Command | `next build` |
| Install Command | `npm install` |
| Output Directory | *(leave default — don't override, Next's builder handles it)* |
| Node.js Version | `24.x` |

`package.json` should also pin `"engines": { "node": "24.x" }` so it
doesn't depend on the dashboard setting alone. A `vercel.json` at the
repo root with `{ "framework": "nextjs", "buildCommand": "next build",
"installCommand": "npm install" }` pins the framework regardless of
what the dashboard shows.
