# Quancis www

See `CHANGES.md` for what changed in each revision (newest first).

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
npm run lint     # type check (tsc --noEmit) + the content check below
npm run check    # content check only: links, anchors, share images, retired claims, the privacy-page guard (no install needed)
npm run build    # the real check — every route pre-renders at build time
npm run start    # serve the production build
```

No environment variables needed — this site has no backend of its own.

> **`npm install` and `npm run build` have still never been run against
> this repo** (`.github/workflows/ci.yml` now runs both, plus `npm run lint`, on every push, so the first push will show what breaks). It was written in a sandbox with no network. What *was*
> checked, in that sandbox: a full TypeScript pass over every file that was
> added or changed; a script that server-renders every blog post, the blog
> index, About and Contact and asserts on the HTML (one `<h1>`,
> JSON-LD present and valid JSON, platform links present, no raw markup
> leaking); and a content check over every post (internal links resolve,
> headings unique, table rows match their headers, share images exist).
> Tailwind styling and the 3D scenes were **not** seen on a screen. The
> first thing to do after cloning is `npm install && npm run build`, then
> open `/`, `/blog/best-of-n-to-mind-evolution`, `/about`, `/contact` and
> `/kael/demo` in a browser, on a phone as well as a desktop.

## Structure

```
src/app/                    routes — each page.tsx is the real implementation (no thin-wrapper split, this site is small enough not to need one)
src/app/blog/[slug]/        one statically generated page per post (generateStaticParams)
src/app/kael/demo/          the demo hub (/kael/demo) and, in [slug]/, one page per demo — see "Demos" below
src/app/sitemap.ts          sitemap.xml, generated at build time (lastmod from src/lib/seo.ts + demo and post dates)
src/app/robots.ts           robots.txt, generated at build time
src/app/feed.xml/route.ts   RSS feed of the blog, generated at build time (not linked in the page; feed readers find it through the <link rel="alternate"> on /blog)
src/app/error.tsx           friendly error page (same look as the 404)
src/app/about, contact, pricing/   company pages and the pricing overview
src/app/*/opengraph-image.png  the share image for that route (drawn by scripts/make-og.py, see "Share images")
src/components/             Hero, AskAnything, ProductShowcase, SystemStory, Section, PlaceholderNote, PlatformCta, JsonLd, BrandMark, LowPolyScene, CodeIntegration
src/components/kael/        the building blocks of the /kael page (spec sheet, models overview, pricing table, thinking levels, FAQ)
src/components/NotOpenYet.tsx  the closing band on /harness and /chat while those two are not public. Search for `<NotOpenYet` when they launch
src/components/DocPage.tsx  shared layout for the plain-language document pages (/privacy, /security)
scripts/check-content.mjs   `npm run check`: dependency-free content checks (see below)
src/components/blog/        PostBody (renders a post), Inline (links/bold/code), FlowFigure, BarFigure, RangeFigure, figures/index.tsx (every figure), figures/svg.tsx (drawing helpers), figures/theory.tsx and figures/more.tsx (the drawn SVG figures)
src/components/demos/       DemoCard, DemoCover (drawn SVG covers), GameFrame (the click-to-play player), Provenance ("made in chat")
src/components/three/       HeroCanvas.tsx — same WebGL hero as platform, accent tint now a prop. HeroBackdrop.tsx loads it as its own chunk when the browser is idle (not at all on Save-Data or 2G), so three.js is not in the first-load bundle
src/components/three/scenes/  the three home-page product scenes (kaelCube, harnessLaptop, chatComposer) + their shared runtime
src/components/three/SceneStage.tsx  lazy/pausing host for one scene
src/components/layout/      SiteShell, Navbar (glass drawer), Footer — no auth state, unlike platform's
src/lib/routes.ts           internal ROUTES + external platform./app.quancis.space URLs
src/lib/org.ts              company facts used on several pages: contact emails, address, owner
src/lib/seo.ts              site URL, per-page lastmod dates, metadata helper, all JSON-LD builders
src/lib/accents.ts          the three accent colors (red/harness/chat) as stable-reference constants
src/data/posts/*.ts         one file per blog post — see "Writing a blog post" below
src/data/blog.ts            the list of posts + helpers (reading time, related posts, authors)
src/data/blog-types.ts      the block types a post is made of
src/data/kael.ts            every number and string on /kael (the two models, levels, pricing, speed, limits, FAQ). Its source of truth is the Platform repo (backend/app/models/kael/config.py). Describe what a model is for, never how it works — edit here, not in the page
scripts/make-og.py          draws the share images and the logo
src/data/demos.ts           every demo (copy, controls, cover, origin story) — add a demo here
src/lib/demoFiles.ts        reads a demo's HTML file at build time for its line count / size (server-only)
public/demo-files/          the raw single-file HTML demos, served as-is at /demo-files/<file>
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
| `/` | red (no CTA) | hero, three product rows (each led by a 3D scene), "Kael, in brief" spec sheet (with links to Kael and to the demos), the "One Name. Built For Accuracy." story, a Developer Platform call-to-action |
| `/kael` | red | full page for both models (Kael Beta, Kael Pro Beta): spec sheet, models overview, thinking levels per model, pricing per model (input, cached input, output), data, integration, a Demos strip, FAQ. Benchmarks are deliberately number-free: independent results only, none self-reported |
| `/kael/demo` | red | the demo hub: cover cards, "how they were made", "a demo is not a benchmark". `/demo` and `/demo/<slug>` redirect here |
| `/kael/demo/[slug]` | red | one page per demo: click-to-play player, about, controls, spec list, more demos |
| `/harness` | harness (indigo) | harness-vs-agent positioning, the 3D "In Action" demo, the cloud environment. **Not open to the public yet**: the hero says so and the closing band is `<NotOpenYet>` (Kael API link + status page), not a Start button |
| `/chat` | chat (amber) | the "Ask Anything" composer as a **preview**: sending shows a note under the box, keeps what was typed and goes nowhere. **Not open to the public yet** (same `<NotOpenYet>` band as Harness) |
| `/pricing` | — | Kael per-token pricing (same data as `/kael`) + a note that Harness and Chat are not open and have no published price. States no price that isn't already on the site |
| `/about` | — | name origin, what the company cares about, the three products, who runs it, what Kael is built on, and what is not available yet |
| `/contact` | — | two mailboxes (support, business), what to include in a report, a note for evaluators, postal address |
| `/legal` | — | router page: Platform terms/privacy (external), this website (`/privacy`, `/security`), and a row saying Harness and Chat have no terms yet |
| `/privacy` | — | what this website collects (almost nothing), the cookies it sets (none), what each demo keeps in your browser, which CDNs a demo contacts after Play. Written from the code; `npm run check` fails if the code stops matching it |
| `/security` | — | how Kael handles requests (summary of the Kael page's data section), what is not claimed (no certification, SLA or model card), how to report a problem. Also `public/.well-known/security.txt` (renew its `Expires` line before 2027-10-11) |
| `/not-available` | — | status page for Harness and Chat (noindex, not in the sitemap, linked from the footer and the product pages). No sign-up or waitlist on purpose |
| `/blog`, `/blog/[slug]` | — | tag filter + statically generated post pages with table of contents, figures, references and related posts. `/feed.xml` is the RSS feed (not linked in the page, only advertised to feed readers) |

Redirects (`next.config.ts`): `/docs` goes to the platform docs; `/privacy-policy`, `/cookies`, `/cookie-policy` go to `/privacy`; `/terms`, `/terms-of-service` go to `/legal`; `/demo`, `/demos` and `/demo/<slug>` go to the matching `/kael/demo` page (permanent); `/examples` goes to `/kael/demo` (temporary). `/examples` used to be a gallery of placeholder cards with no real output in it; the demos are the real examples, so the page was removed. There is deliberately no `/pricing` redirect: the `/pricing` page itself covers both.

## Search and sharing

- **Structured data** (`components/JsonLd.tsx`, builders in `lib/seo.ts`): `Organization` + `WebSite` on every page (root layout); `SoftwareApplication` on `/kael` only (deliberately not on `/harness` or `/chat` while they are not open; add it back at launch); `FAQPage` on `/kael` (built from the same `FAQ` array the page renders, so they cannot drift); `BlogPosting` + `BreadcrumbList` on each post; `CollectionPage`, `AboutPage` and `ContactPage` on the index pages.
- **Share images**: see "Share images" below.
- **RSS**: `/feed.xml` exists and is advertised to feed readers through the `<link rel="alternate">` in the blog index's metadata. There is deliberately no visible "RSS" link: most visitors do not know what it is, and a browser shows the raw XML or downloads it, which looks broken.
- **Wordmark**: the logo is the `Q` mark plus the text "uancis". The text is `aria-hidden` and the link carries an `aria-label`, so screen readers say "Quancis" once, not "Quancis uancis".

## Writing a blog post

1. Copy a file in `src/data/posts/` (for example `introducing-kael.ts`) and rename it to the slug.
2. Fill in the fields. A post body is a list of blocks, built with helpers from `blog-types.ts`:

| Helper | Makes |
|---|---|
| `p("text")` | paragraph |
| `h2("Heading")`, `h3("Heading")` | headings. Every `h2` becomes a link in the "In this post" list (shown when a post has 4 or more) |
| `ul(...)`, `ol(...)` | lists |
| `quote("text", "who")` | block quote |
| `callout("Title", "text")` | boxed aside |
| `table("caption", [headers], [[row], ...])` | table |
| `code("python", "source", "caption")` | code block |
| `figure("figure-id", "caption", { label, url })` | a figure registered in `components/blog/figures/index.tsx` |

Inside any text: `[label](https://...)` link, `**bold**`, `*italic*`, `` `code` ``. Links that start with `/` are internal; links to quancis.space hosts are plain links; every other link opens in a new tab as an outside citation. Use curly quotes and apostrophes (`’`) in text so strings need no escaping.

3. Add `references` (the list printed under the post) for anything research-based, and `related` (slugs) for the "Keep reading" block.
4. Import the post in `src/data/blog.ts` and add it to `BLOG_POSTS`.
5. Add a line for it to `POSTS` in `scripts/make-og.py` and run `python3 scripts/make-og.py` to draw its share image (`public/og/<slug>.png`).
6. Set `date` to the **real** day you publish. Do not backdate. Set `updated` when you make a real edit.

To add a figure: add its id to `FigureId` in `blog-types.ts` and its element to `FIGURES`. Use `BarFigure` (bars), `RangeFigure` (ranges) or `FlowFigure` (steps). For a drawing rather than a chart, write a small component with the helpers in `components/blog/figures/svg.tsx` (`Svg`, `T`, `Arrow`, `ArrowDefs`, the `C` palette) in `theory.tsx` or `more.tsx`, give it an `aria-label` that says what it shows, and register it the same way. Keep the viewBox about 400 wide so the text stays readable on a phone, and say in the caption that it is an illustration if it is not a measurement. Chart numbers must be the numbers the cited source publishes, and the caption must say where they came from.

## Still needs real content before shipping

Nothing below was invented; each is left as an explicit flag:

- `/kael`'s benchmark numbers, once independent results exist (the section says so on purpose)
- Real product screenshots on `/harness` and `/chat` (the 3D scene covers the demo on `/harness`; `/chat` has the live composer)
- The two accent hex values (Harness, Chat): worth a quick visual check once rendered against the live hero shader
- **Launching Harness / Chat**: add the `app*` URLs back to `EXTERNAL` in `src/lib/routes.ts`, replace `<NotOpenYet>` on both pages with real buttons, bring back the `href` hand-off in `AskAnything`, restore `SoftwareApplication` structured data, publish their terms and privacy policy (the `/legal` row and `/privacy` text say so), and delete or repurpose `/not-available`
- A legal registration number or company registration details, if you want them on About/Contact. None were provided, so none appear

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
