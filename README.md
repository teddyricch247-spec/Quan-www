# Quancis www

See `CHANGES.md` for what changed in the 5 October 2026 revision.

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

> **`npm install` and `npm run build` have still never been run against
> this repo.** It was written in a sandbox with no network. What *was*
> checked, in that sandbox: a full TypeScript pass over every file that was
> added or changed; a script that server-renders every blog post, the blog
> index, About, Contact and Examples and asserts on the HTML (one `<h1>`,
> JSON-LD present and valid JSON, platform links present, no raw markup
> leaking); and a content check over every post (internal links resolve,
> headings unique, table rows match their headers, share images exist).
> Tailwind styling and the 3D scenes were **not** seen on a screen. The
> first thing to do after cloning is `npm install && npm run build`, then
> open `/`, `/blog/best-of-n-to-mind-evolution`, `/about`, `/contact` and
> `/examples` in a browser, on a phone as well as a desktop.

## Structure

```
src/app/                    routes — each page.tsx is the real implementation (no thin-wrapper split, this site is small enough not to need one)
src/app/blog/[slug]/        one statically generated page per post (generateStaticParams)
src/app/kael/demo/          the demo hub (/kael/demo) and, in [slug]/, one page per demo — see "Demos" below
src/app/sitemap.ts          sitemap.xml, generated at build time (lastmod from src/lib/seo.ts + demo and post dates)
src/app/robots.ts           robots.txt, generated at build time
src/app/feed.xml/route.ts   RSS feed of the blog, generated at build time
src/app/error.tsx           friendly error page (same look as the 404)
src/app/about, contact, pricing, examples/   company pages, the pricing overview, and the Kael examples gallery
src/app/*/opengraph-image.png  the share image for that route (drawn by scripts/make-og.py, see "Share images")
src/components/             Hero, AskAnything, ProductShowcase, SystemStory, Section, PlaceholderNote, PlatformCta, JsonLd, BrandMark, LowPolyScene, CodeIntegration
src/components/kael/        the building blocks of the /kael page (spec sheet, pricing table, thinking levels, pipeline, FAQ)
src/components/blog/        PostBody (renders a post), Inline (links/bold/code), FlowFigure, BarFigure, RangeFigure, figures/index.tsx (every figure), figures/svg.tsx (drawing helpers), figures/theory.tsx and figures/more.tsx (the drawn SVG figures)
src/components/examples/    ExamplesGallery (filterable cards)
src/components/demos/       DemoCard, DemoCover (drawn SVG covers), GameFrame (the click-to-play player), Provenance ("made in chat")
src/components/three/       HeroCanvas.tsx — same WebGL hero as platform, accent tint now a prop
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
src/data/examples.ts        the examples shown on /examples (all placeholders for now)
src/data/kael.ts            every number and string on /kael (specs, pricing, speed, FAQ) — edit here, not in the page
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
| `/` | red (no CTA) | hero, three product rows (each led by a 3D scene), "Kael, in brief" spec sheet (with links to Kael and to the demos), the "One Intelligence" story, a Developer Platform call-to-action |
| `/kael` | red | full model page: spec sheet, thinking levels, pricing (input, cached input, output), data, integration, a Demos strip, FAQ. Benchmarks are deliberately number-free: independent results only, none self-reported |
| `/kael/demo` | red | the demo hub: cover cards, "how they were made", "a demo is not a benchmark". `/demo` and `/demo/<slug>` redirect here |
| `/kael/demo/[slug]` | red | one page per demo: click-to-play player, about, controls, spec list, more demos |
| `/harness` | harness (indigo) | harness-vs-agent positioning, the 3D "In Action" demo, the cloud environment |
| `/chat` | chat (amber) | reuses the exact "Ask Anything" composer from platform's homepage, now handing off to `app.quancis.space/chat` instead of login |
| `/pricing` | — | Kael per-token pricing (same data as `/kael`) + a pointer to app pricing for Harness and Chat. States no price that isn't already on the site |
| `/about` | — | name origin, what the company cares about, the three products, who runs it, what Kael is built on, and what is not available yet |
| `/contact` | — | two mailboxes (support, business), what to include in a report, a note for evaluators, postal address |
| `/examples` | — | gallery of Kael outputs. **All placeholders**, so the page is `noindex` and out of the sitemap until a real example exists (see below) |
| `/legal` | — | router page only; links out to platform's and app's real Terms/Privacy |
| `/blog`, `/blog/[slug]` | — | tag filter + statically generated post pages with table of contents, figures, references and related posts. `/feed.xml` is the RSS feed |

Redirects (`next.config.ts`): `/docs` goes to the platform docs; `/privacy`, `/terms`, `/privacy-policy`, `/terms-of-service` go to `/legal`; `/demo`, `/demos` and `/demo/<slug>` go to the matching `/kael/demo` page (permanent). There is deliberately no `/pricing` redirect: the `/pricing` page itself covers both.

## Search and sharing

- **Structured data** (`components/JsonLd.tsx`, builders in `lib/seo.ts`): `Organization` + `WebSite` on every page (root layout); `SoftwareApplication` on `/kael`, `/harness` and `/chat`; `FAQPage` on `/kael` (built from the same `FAQ` array the page renders, so they cannot drift); `BlogPosting` + `BreadcrumbList` on each post; `CollectionPage`, `AboutPage` and `ContactPage` on the index pages.
- **Share images**: see "Share images" below.
- **RSS**: `/feed.xml`, linked from the blog index, the About page and the footer.
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

## The examples page

Everything in `src/data/examples.ts` is a placeholder. To publish a real example, replace the placeholder text with the exact prompt and the unedited output, set `recordedOn`, optionally add `stats`, and set `placeholder: false`. The moment one example is real the page becomes indexable and joins the sitemap on the next build. No other change. Add more by copying an entry.

## SEO: what is wired and what is not

In the code: unique title, description and canonical per page; per-route share images; Organization, WebSite, BreadcrumbList, SoftwareApplication (Kael, Harness, Chat), BlogPosting and ContactPage/AboutPage structured data; sitemap with real `lastmod`; robots.txt; RSS; one `<h1>` per page; server-rendered text.

Not in the code, and what actually moves rankings:

1. Add a **Domain property** for `quancis.space` in Google Search Console (DNS verification covers www, platform and app). Submit `https://www.quancis.space/sitemap.xml` and the platform's sitemap. Do the same in Bing Webmaster Tools.
2. Make sure `quancis.space` (no www) 301-redirects to `https://www.quancis.space`. That is a DNS/Vercel setting, not visible in this repo.
3. Earn links: Show HN, Product Hunt, a GitHub examples repo, AI directories, and independent benchmark results once they exist.
4. Keep publishing. One substantial post a week for a few months does more than any markup change.
5. Add real social profile URLs to `SOCIAL_PROFILES` in `src/lib/seo.ts` when they exist.
6. When you change a page's content, update its date in `PAGE_UPDATED` (`src/lib/seo.ts`).

## Share images

`python3 scripts/make-og.py` (needs `pip install pillow`) draws the 1200x630 image for every route and blog post plus `public/logo.png`. The route images live next to their `page.tsx` as `opengraph-image.png`. Blog posts cannot use that convention (one file would apply to every post), so each post names its own image in `ogImage` and the post page passes it explicitly. Demo pages work the same way: each demo names its image in `ogImage` in `src/data/demos.ts`, the page passes it explicitly, and `DEMOS` in the script draws it to `public/og/demo-<slug>.png`. The hub itself is a normal route image (`src/app/kael/demo/opengraph-image.png`). Edit titles in the script and re-run to refresh.

## Earlier changes

- **Hero**: cooler dark-navy palette (was neutral grey), the touch-release timing fix from the platform app's later revision (a tap now settles at once instead of hanging at full height for a second), and a new pointer-reactive vapor layer hovering along the box field's edge (`src/components/three/HeroCanvas.tsx`). The vapor shader is new code, written and statically checked in this environment but **not visually verified** — there's no GPU/browser available here to render it. Check it in a real browser before shipping; if anything looks off, the whole addition is the `fogScene`/`fogMaterial`/`fogUniforms` block plus a few call-sites, easy to isolate or revert.
- **Glass buttons**: replaced with the actual recipe shipped on platform (`.btn-pill-glass` / `.btn-pill-glass-dark` in `globals.css`) instead of an earlier approximation — a layered specular-streak technique, not a flat translucent fill.
- **Kael's Integration section**: now the same tab-switcher pattern as platform's homepage (Python/TypeScript/cURL/LangChain, animated switching, copy button) — see `src/components/CodeIntegration.tsx`. Still explicitly not a docs replacement (says so on the page); full request/response shapes, streaming, and error handling stay in the real docs.
- **Kael's closing CTA** now points to `/pricing` on the platform domain instead of the platform root.
- **Low-poly 3D visuals**: `src/components/LowPolyScene.tsx`, a small reusable Three.js component (flat-shaded primitives only, no loaded models) with three variants — `orbit` (Kael), `pipeline` (Harness), `pulse` (Chat) — each placed inline in that page's content, not full-hero-sized.
- **Harness page**: substantially rewritten with the harness-vs-agent distinction, the cloud project environment (file system, live preview, git, language flexibility), the multi-agent routing rationale, the precision-over-speed philosophy, and a comparison table. Named-competitor comparisons (Claude Code, Cursor, Replit, Lovable) are framed as factual capability differences, not disparagement — worth your own pass to confirm every claim still holds.

## Demos

`/kael/demo` is the hub; each demo has its own page at `/kael/demo/<slug>` with
the playable game on it. The demos, **Blockscape** (a voxel sandbox), **Ouroboros**
(3D snake survival) and **3D Chess** (with an AI opponent), were written by Kael
in a chat conversation as single HTML files, and the pages say so. Every demo
page and the hub also offer the HTML file as a download (an `<a download>` link
to the same file in `public/demo-files/`, so there is nothing extra to add). Every number
(lines, KB) is read from the HTML file at build time; nothing is typed in twice.

**Add a demo in two steps**

1. Put the finished single-file HTML in `public/demo-files/`.
2. Add an object to `DEMOS` in `src/data/demos.ts` (the file's header comment
   lists every field).

Optional: for a share image of its own, add the demo to `DEMOS` in
`scripts/make-og.py`, run it, and set `ogImage` on the demo. Without one, the
page shares the site's default card.

The hub, the new demo's page, the Demos strip on `/kael`, the "More demos" list
on the other demo pages and `sitemap.xml` all pick it up on the next build. A
cover is drawn automatically (`cover.art: 'generic'` needs no extra code); to use
a real screenshot instead, drop it in `public/` and set `cover.image`. To tell a
different origin story (made in Harness, made through the API) add a key to
`ORIGINS` in the same file.

**How it behaves**

- The player (`GameFrame`) shows the cover and only loads the game after Play, so
  the page stays light and nothing grabs the keyboard or plays sound by itself.
  Stop unloads it. "Open full screen in a new tab" opens the raw file, which is
  the reliable way to play on a phone (iPhone Safari cannot fullscreen an iframe,
  and a touch game inside a scrolling page fights the scroll).
- `/demo-files/*` is served with `X-Robots-Tag: noindex` (see `next.config.ts`) so
  the pages rank, not the raw files. It is deliberately **not** redirected.
- The nav highlights **Demos** (not Kael as well) on `/kael/demo/*`: when one nav
  link's path is nested in another's, only the more specific one is active.

**Things to know**

- The games load three.js from a public CDN (Ouroboros from unpkg, 3D Chess from
  jsDelivr, Blockscape from cdnjs, falling back to jsDelivr and unpkg only if
  that fails), so those hosts see the request. The demo pages say so. The
  site's Legal page says the site "doesn't set tracking cookies"; that is still
  true (Ouroboros keeps its best score in `localStorage`, Blockscape keeps its
  world in IndexedDB; nothing is sent anywhere), but you may want a line about
  the CDNs there.
- The HTML files are exactly as pasted from the chat; nothing in them was changed
  for this site, so they have no link back to Quancis. That is on purpose.
- Covers are drawn SVG, not screenshots (there was no browser or GPU where this
  was written). Replace them with real screenshots when you have them.
- Like the rest of this repo, **none of this was built or run** here (no network
  for `npm install`, no browser). It was type-checked against stubs and the game
  scripts were syntax-checked. Run `npm install && npm run build`, then play all
  three games on desktop and on a phone, before shipping.

## Home page product scenes

The home page's three product rows (`src/components/ProductShowcase.tsx`) are each led by a live 3D scene instead of an icon:

| Scene | File | Shows |
|---|---|---|
| `kael` | `three/scenes/kaelCube.ts` | a 4×4×4 cube whose faces are the brand mark charges, bursts, reveals the name, snaps shut |
| `harness` | `three/scenes/harnessLaptop.ts` | a modelled laptop: a task is typed, the agent edits four files, reports back |
| `chat` | `three/scenes/chatComposer.ts` | the real composer in 3D: a prompt is typed, Kael thinks, replies |

Ported from the dev's standalone demos. What changed in the port: sized from their container (the demos used `window` and appended to `<body>`); the `while (true)` async show and the GSAP timeline were rewritten as pure functions of time (nothing can leak, they pause with the scene, no GSAP dependency); the cube and laptop now show the real brand mark (the demos used a different pattern and red); the three.js r128 code was moved to the project's three r160 with environment lighting; scoped CSS; every GPU resource is disposed.

How they behave: `SceneStage` imports a scene (and three.js) only when its stage is within ~240px of the viewport, animates only while visible and the tab is foregrounded, frees its WebGL context once ~1800px away, drops pixel ratio if it cannot hold ~40fps, shows one still frame under `prefers-reduced-motion`, and keeps a static brand mark if WebGL is unavailable. Demo text is configurable: `<SceneStage scene="harness" prompt="..." />`, `<SceneStage scene="chat" prompt="..." reply="..." replyAsFile />`.

**Not visually verified.** There is no GPU or browser in the environment these were written in. The timelines, brand-mark face orientation and type-checking were verified numerically; lighting, exposure and framing were not seen on screen. Check each stage in a real browser (desktop and a phone) before shipping. The tunable constants are at the top of each scene file (`CFG`, `T`).

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

Nothing below was invented; each is left as an explicit flag:

- `/examples`: every example is a placeholder (see above)
- `/kael`'s benchmark numbers, once independent results exist (the section says so on purpose)
- Real product screenshots on `/harness` and `/chat` (the 3D scene covers the demo on `/harness`; `/chat` has the live composer)
- The two accent hex values (Harness, Chat): worth a quick visual check once rendered against the live hero shader
- Whether Harness/Chat really live at `app.quancis.space/harness` + `/chat` — used throughout since the spec used that pattern, but per the spec it's a call to confirm (see `src/lib/routes.ts`, `EXTERNAL`)
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
