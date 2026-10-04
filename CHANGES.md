# Changes — 4 October 2026 (demos merge)

This revision merges the Kael demos work (hub, two game pages, `/demo` redirects, nav/footer/home/`/kael` links) into the 3 October SEO and content revision below. Both were built on the same base commit, so this was a normal three-way merge. Three files conflicted and were resolved by keeping both sides' intent.

## Conflicts resolved

- **`next.config.ts`** keeps the `/docs`, `/privacy` and `/terms` redirects **and** the `/demo`, `/demos`, `/demo/:slug` redirects (permanent), plus the `noindex` header on `/demo-files/*`.
- **`src/app/sitemap.ts`** uses the 3 October version (real `lastmod` from `PAGE_UPDATED`, no `changeFrequency`/`priority`) and adds the hub and every demo page, each with its own date.
- **`README.md`** lists both sets of routes, components and scripts.

## Adjusted so the two pieces fit together

- `PAGE_UPDATED` in `src/lib/seo.ts` has entries for `/kael/demo`; `/` and `/kael` were bumped because both changed.
- Demo pages now emit BreadcrumbList structured data (Home, Kael, Demos, demo), like the rest of the site.
- Each demo has its own share image (`public/og/demo-<slug>.png`) set through an optional `ogImage` field in `src/data/demos.ts`, and the hub has its own route image. All are drawn by `scripts/make-og.py` (new `DEMOS` list and `kael/demo` route entry). The old single generic image in `src/app/kael/demo/[slug]/` was removed because it applied to every demo.
- The hub's last paragraph now matches `/kael`: independent results come first, and are shared on the Kael page when they exist (it no longer says they "will" arrive).

## Checked, no change needed

The facts on the demo pages match the HTML files (arena size, AI counts, controls, Chess AI side and depth, localStorage use, CDN hosts, no external asset files), and every CSS class and helper the new components use exists.

## Before you push

- Run `npm install && npm run build`. This merge was checked with a syntax, import/export and stubbed type check, not a real build, and nothing was viewed in a browser.
- **Delete `src/app/blog/[slug]/opengraph-image.png` by hand if it exists in your repo.** The mobile sync never deletes files, and that file overrides the per-post share images.

---

# Changes — 3 October 2026

This revision is the SEO, content and company-page work applied on top of the developer's update of the same day. Where the developer and this work overlapped, the developer's version of the *feature* was kept and anything this work added was folded in. Details at the bottom.

## Fixed

- **Home page showed the "One Intelligence" section twice.** The developer's version already replaced one copy with the "Kael, in brief" spec sheet; that is kept.
- **Home title and description** now lead with what the product is: `Quancis — Kael Composite Intelligence, Harness & Chat` (the page's own canonical, from the developer's version, is kept).
- **Unverifiable claims removed.** "The World's First Composite Intelligence" is gone (the developer's Kael headline `Models That Check Each Other's Work.` and footer line are kept). The Kael page, FAQ and blog no longer say independent evaluations "are in progress"; they say independent evaluation is being sought.
- **Pricing was ambiguous.** "$2 input at up to an 80% cache hit rate" is now three plain numbers: $2 input, $0.40 cached input (up to 80% off), $6 output. These match the Platform backend (`customer_price_per_million`). The `/kael` pricing table gained a "Cached input" column, so `/pricing` shows it too. "Internal model calls are never billed to you" is now stated on `/kael`, `/pricing`, the FAQ and the blog.
- **Thinking levels.** The page said "five levels". It now says Off, Low, High and Max are available, z-low/z-high are not released, and Auto is not available yet. "Auto-thinking off" is gone.
- **Sitemap.** Real `lastmod` dates (`PAGE_UPDATED` in `src/lib/seo.ts`); `changeFrequency` and `priority` removed (Google ignores them); includes `/pricing`, `/about`, `/contact` and every post; `/examples` joins automatically once it has a real example.
- **Share images.** Every route and every blog post has its own image, drawn by `scripts/make-og.py`. Before, all pages shared one identical file.
- **404 page** links to useful places.

## Added

- `/contact`, `/examples` (placeholder gallery, `noindex` until real), blog engine (figures, tables, code, references, table of contents, related posts, author byline), and four posts: two new long-form and the two originals, expanded.
- Structured data builders in `src/lib/seo.ts`: Organization (with logo, address, contact points), WebSite, BreadcrumbList, SoftwareApplication (Kael, Harness, Chat), BlogPosting, CollectionPage, AboutPage, ContactPage. The developer's FAQPage block on `/kael` is kept.
- Links to the Developer Platform (platform.quancis.space) on the home page, Kael, Harness, Chat, About, Contact, Pricing, Legal, the 404, the blog index, every post and the examples page, with descriptive anchor text.
- Footer: Examples, Contact, postal address and support email. Redirects: `/docs` to the platform docs; `/privacy`, `/terms` and their long forms to `/legal`.
- `src/lib/org.ts` (contact details in one place), new FAQ entries (internal calls not billed, temperature ignored, streaming/tools/JSON mode, component names not published).

## How overlaps with the developer's update were resolved

| Area | Kept | Changed or added |
|---|---|---|
| `/about` | the developer's page and design | + JSON-LD, "What Kael is built on", "Not available yet", "Who is behind it" (owner, location, contact), Platform call-to-action; title is now "About Quancis" |
| `/pricing` | the developer's page | wording fix (no "produces better results"), billing rule, "Create a Kael API account" link, breadcrumb data |
| Navbar | the developer's (Pricing in the drawer) | nothing. About, Contact and Examples are footer links only. Add `Examples` to `NAV_LINKS` once it has real content |
| Footer | the developer's (Pricing, About, RSS, aria-hidden wordmark) | + Examples, Contact, address and support email |
| `/feed.xml`, `error.tsx` | the developer's | nothing |
| `JsonLd` component | same behaviour | now also accepts an array of nodes |
| Root layout JSON-LD | the same two @ids | the developer's inline Organization/WebSite block was replaced by `organizationJsonLd()`/`websiteJsonLd()` (adds logo, address, contact points) |
| Blog post JSON-LD | the developer's BlogPosting | replaced by a fuller one (real author, modified date, image, word count, breadcrumbs) |
| `/blog` | the developer's RSS `<link rel="alternate">` | new title/description, structured data, Platform call-to-action |
| `/kael` | the developer's headline and FAQ JSON-LD | + software-application and breadcrumb data, all the wording fixes above |
| `/harness` | the developer's "In Action" 3D section | + structured data, a Platform link |
| SceneStage, runtime.ts, Hero.tsx | the developer's, untouched | |

## Needs a human decision

- **"One subscription, unlimited use / unlimited conversations"** on `/harness`, `/chat` and the home page. Left as written. Check it holds for heavy users doing hard tasks before you keep promising it.
- **Request retention vs request timeout.** The site says requests are held up to 15 minutes. Confirm whether that is the same thing as the request time limit, and document the timeout if not.
- **Blog author.** Posts are bylined to Response Mosese, Owner. Change `AUTHORS` in `src/data/blog.ts` if you want another name.
- **Post dates.** The two new posts are dated 2026-10-02 and the originals 2026-10-01. Use the real publish day; do not backdate.
- **Pricing wording on `/pricing` and `/about`** was written by the developer; the changes above are small, but read them once.

## Corrections made in a second review of this work

A re-check of the blog posts against the papers found these, all now fixed:

- **Security post, overclaim.** It said the people who wrote the least secure code "were the ones who trusted it most". The Stanford study reports something narrower: people with the assistant wrote less secure code and were more likely to think it was secure, and those who trusted it less and engaged more with their prompts wrote fewer vulnerabilities. The text now says exactly that.
- **Security post, inconsistent years.** The table said Pearce 2021 while the reference said 2022. Both now say 2022 (the IEEE S&P publication year).
- **Research post, "more than four times".** The Snell et al. abstract and body word that efficiency gain slightly differently ("more than 4×" vs "up to 4× less compute"). It now says "about four times".
- **Research post, "far more capable frontier models".** The paper says "more capable". Fixed.
- **Research post, ablation chart label.** The row now reads "task-specific critic instructions" and says it is the paper's "Strategy/Question" prompts, which is what the paper defines it as.
- **Research post, Fusion-of-N reference** now notes it was published at ICLR 2026.
- **`next.config.ts` comment** still said there is no single destination for `/pricing`; there is now a `/pricing` page, so the comment was updated.

Also re-confirmed against the sources, with no change needed: every figure in the Mind Evolution charts (5.6, 55.6, 82.8, 95.6, 46.1, 71.1, 76.1, 91.1, 95.6 and the 472 / 280 / 174 calls), the 15.9% / 56% / 43% repeated-sampling figures, the Mixture-of-Agents 65.1% vs 57.5%, and Veracode's 45% / 86% / 88%.
