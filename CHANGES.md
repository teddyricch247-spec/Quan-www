# Changes — 11 October 2026 (dev review fixes: Harness/Chat, legal, blog, hero, checks)

Everything from the Dev's read-through that was not "wait for more content". **Not run:** `npm install` / `npm run build` (no network here), and nothing was seen on a screen or a phone. What *was* run: `npm run check` (new, passes; it fails on the original files for the anchor and the stale claims), a syntax pass over every `.ts`/`.tsx` file, a type check of the data layer and of the changed components against stand-in types, and a render of the redrawn blog figures.

## Fixed

- **Harness and Chat no longer lead nowhere.** No button or link on the site goes to a holding page as if it were a product. `/harness` and `/chat` say "Not open to the public yet" in the hero; their closing band (`components/NotOpenYet.tsx`) says it plainly and offers what works today (Get Kael API Access, and a link to the status page). The "Start With…" buttons and "See pricing" links are gone, and so are the `app*` entries in `EXTERNAL` (`lib/routes.ts`), so nothing can point at them by accident. No waitlist, as asked.
- **"Ask Anything" keeps what you typed.** Sending no longer navigates or clears the box. It shows a note under it (not open yet, nothing was sent anywhere) with links to the API and the demos. The send control is now a real button.
- **`/not-available`** is now a status page: what is not open, what to use today, what happens when they open. Still noindex, linked from the footer ("Harness & Chat status") and the product pages.
- **Legal.** `/legal` has three rows: Kael / Developer API, This website, and Quan Harness & Quan Chat (no terms or privacy policy yet, and the page says they will be published before anyone is asked to accept them). Footer "App pricing" / "Harness & Chat App" removed; Contact and Pricing no longer link to app pricing.
- **Broken anchor** `/kael#how-it-works` removed (the paragraph that used it was rewritten).
- **Structured data:** `SoftwareApplication` removed from `/harness` and `/chat` while they are not open.
- **Hero / three.js:** `HeroBackdrop` loads `HeroCanvas` (and three.js with it) as its own chunk when the browser is idle, fades it in, and skips it on Save-Data and 2G. Phones still get it. Not measured; run Lighthouse before and after.
- **"Available through our apps"** removed from the Kael spec sheet, FAQ, security page and the Introducing Kael table (the apps are not open); the home page tags Harness and Chat "Not open yet"; the Kael page's "Three Ways In" intro says the API is the only one open today.
- **Dead code removed:** `/examples` (page, gallery, data and share image; the URL still redirects to `/kael/demo`) and the unused `PipelineSteps.tsx`.

## Blog: decision taken

The Platform rule is "say what Kael is for, never how it produces an answer", and About says Quancis does not publish how Kael is built. The posts now follow it. The research stays; claims about Kael's inside do not.

- **Why Kael Is Slower, On Purpose**: rewritten with 270 to 340 tokens/s in every mode, no Off and no Auto, the two models, and a price table built from `src/data/kael.ts` (`SPEED`, `LIMITS`, `MODELS`), so it cannot drift from `/kael` again. Figures redrawn: speed range, the wait (Kael vs an average model, only the 2.2x thinking time drawn to scale), and the Kael Beta levels without "Off".
- **Introducing Kael**: no "Composite Intelligence System", no draft/check/refine, no "up to about twenty calls", no "JSON mode" claim, two models. Describes what Kael is for, how to call it, what the beta does and does not do.
- **From Best-of-N to Mind Evolution** and **AI-Written Code Has a Security Problem**: the paragraphs that described Kael's loop now say the research informs the thinking and that how Kael is built is not published. **The Thinking Behind Kael**: dropped the retired keyword and made one sentence read as an idea, not a mechanism. (It was already labelled "Theory, not a spec".)
- Figures `kael-loop` and `kael-request-path` deleted. All five posts got `updated: 2026-10-11`; links to `/examples` now point at `/kael/demo`.

## Added

- **`/security`** (Security and data handling) and **`/privacy`** (Privacy and cookies), both in the footer, `/legal` and the sitemap, each with a share image. `public/.well-known/security.txt`.
- **The cookie answer**: the site sets no cookies and has no analytics. Three of the four demos (Ouroboros, Fan Circuit, Blockscape) save small things in the visitor's own browser (local storage, and IndexedDB for Blockscape), and the demos load three.js from unpkg, jsDelivr or cdnjs after Play is pressed. `/privacy` says exactly that.
- **`npm run check`** (`scripts/check-content.mjs`, no dependencies): internal links and `#anchors`, one `<h1>` per page, share images and sitemap, blog figures/dates/related posts, retired claims, and a guard that fails if the site's code starts using cookies, storage or an analytics package, or a demo changes what it stores, without `/privacy` being updated. `npm run lint` now runs the type check and this. `.github/workflows/ci.yml` runs lint and `next build` on every push.

## Please check before shipping

- **`/privacy` and `/security` are plain-language descriptions of the code, not legal advice.** Confirm three statements only you can: the site is hosted on Vercel (inferred from `vercel.json`), there is no bug-bounty programme, and nothing is promised about how long emails are kept (the page says only that they are used to answer you). Have the policy text reviewed if you need it to be binding.
- ESLint was **not** added: it cannot be installed or tested here, and a config that has never run is worse than none. `lint` is the type check plus the content check.
- Not built, on purpose: a status page (it would have to show real uptime), a changelog and a press kit (they need facts and dates only you have), and no waitlist.
- Share images were redrawn only for the pages whose wording changed (harness, chat, pricing, legal) and drawn for the two new pages. Blog and demo images were not regenerated.

# Merge — 11 October 2026 (fixed-8 + the two-models/Fan Circuit push)

Two lines of work from the same base (`89a2cde`) were merged:

- **fixed-8** (demo fixes, new covers, hero, footer, `/examples` removed), and
- **the Dev's push** (Kael is two models, Fan Circuit demo, `/not-available`).

Auto-merged cleanly: about, chat, kael, demo covers, game frame, footer, routes, SEO, make-og. Hand-resolved:

- `/examples` stays **removed** (it redirects to `/kael/demo`). The Dev's wording edits to that page and to `src/data/examples.ts` were dropped with it, and its `PAGE_UPDATED` entry too.
- `src/data/kael.ts`: took the Dev's limits wording. It replaces the wrong "up to 8 minutes per request" with "stream, or set a client timeout of 30 minutes or more" (`LIMITS.clientTimeoutMinutes`).
- `README.md`: kept the shorter fixed-8 README (the examples/SEO/earlier-changes sections stay gone).
- `CHANGES.md`: both entries kept, newest first.

# Changes — 11 October 2026 (demo fixes, new covers, hero, footer, /examples)

## Fixed

- **Hero on a phone.** Every hero height is now in `svh` (with a plain-`vh` fallback for browsers that do not know it) instead of mixing `svh` with `vh` padding, and the canvas follows the hero itself with a `ResizeObserver` instead of only the window's resize event, so it can no longer be drawn for a stale size. A pending orientation timer is also cleared on unmount. **Not reproduced on a real phone** (the site cannot be built or run in the sandbox this was done in, so this is a fix for the likely causes, not a confirmed one); if the jump is still there on your phone, tell me which phone and browser.
- **Footer RSS link** removed, and the one on About. The feed itself (`/feed.xml`) still works and is still advertised to feed readers; there is just no visible link, because a browser shows raw XML or downloads it.
- **`/examples`** removed. Every card was a placeholder ("none of it was produced by Kael"). The demos are the real examples. `/examples` now redirects to `/kael/demo`; the footer link, sitemap entry, share-image script entry and README section are gone; the links on `/kael` and `/chat` point at the demos.
- **Demo player.** The cover now stays up under a "Loading" label until the demo has loaded (it used to cut to a black box for the seconds three.js takes to arrive), with a hint and a link after 12 seconds if it has not. On a phone, "Open full screen" is a real button under the player instead of a grey line.
- **Covers cropped on phones.** On a phone the player is taller than wide (350 by 460), so `slice` cropped the sides off every cover (the snake's head, half the fan). The new covers keep their subject in the middle 300px.

## Changed

- **Demo covers** redrawn (`DemoCover.tsx`): perspective and lighting, glow, soft shadows, light grain and vignette, in place of flat clip-art. Still SVG, still no asset files; still replaced by `cover.image` if you set one.

## Not touched, on purpose

- `public/demo-files/*.html`. The site says these are the exact files Kael wrote (Chess with one disclosed edit), so patching them would make that page untrue. Anything wrong in them is Kael's output to report, not to quietly fix.
- Blog posts. Three still link to `/examples`; the redirect covers them.

# Changes — 10 October 2026 (Kael is two models; Platform is the source of truth)

Checked against the Platform repo (`backend/app/models/kael/config.py`, `frontend/src/components/docs/facts.ts`). Blog posts and their figures were **not** touched, as asked.

## Changed

- **Two models, not one.** Kael Beta (`kael-beta`; levels Low default, High, Max; $3.00 input / $0.60 cached / $10.00 output per 1M tokens) and Kael Pro Beta (`kael-pro-beta`; levels z-low default, z-high; $8.00 / $1.60 / $25.00). `src/data/kael.ts` is rewritten around `MODELS`; the thinking-level picker, pricing table and spec sheet read from it. New `ModelsOverview` component replaces the "how it works" rail on `/kael`.
- **Speed.** Every level thinks first (about 2.2x an average AI model's time, unchanged), then writes at 270 to 340 tokens per second in every mode. The "Off" level, "Auto" and the 1-second / first-word figures are gone. Published limits added: 150 requests a minute, 30 concurrent. (The first draft said 8 minutes per request; that was wrong. The Platform's 480 s ceiling applies to each stage of a request, so one can run for about 24 minutes. The site now says to stream, or set a client timeout of 30 minutes or more.)
- **No mechanism claims.** Draft/check/refine, "composite intelligence", fine-tuned small models, retrieval and "up to ~20 calls" are removed from the pages; the copy says what Kael is for. About says plainly that Quancis does not publish how Kael is built. Pages touched: home, `/kael`, `/pricing`, `/about`, `/chat`, `/harness`, `/contact`, `/examples`, footer, product showcase, "system story", site metadata and structured data.
- `/examples`: levels changed to Low / High / Max / z-low / z-high (no Off). Superseded: the page was removed on 11 October, see above.
- Share cards redrawn for `/`, `/kael`, `/kael/demo`, `/about` and the default (`scripts/make-og.py`); `PAGE_UPDATED` bumped for the changed pages.

## Added

- **Demo: Fan Circuit** (`public/demo-files/fan-circuit.html`, byte-identical to the file supplied). A working 3D circuit: two AA cells, an OFF / LOW / HIGH switch and a fan motor. Made by Kael Pro Beta at z-low from one prompt, 57,613 tokens, 463,640 ms. Its page shows the exact prompt, model, level, tokens and time. New drawn cover (`CircuitArt`), share card, `kind: 'simulation'` labels and `WebApplication` structured data.
- **One-take wording on every demo** (hub, demo pages, Kael page, card text): a single prompt in a chat interface, no tools, no follow-up. Fields `madeWith`, `editNote` and `kind` added to `src/data/demos.ts`.

## To check

- **3D Chess is not a pure one-take file.** The 4 October entry below records hand fixes made after Kael's reply. Its page now carries an `editNote` saying so. If `chess.html` is Kael's original, delete `editNote` in `demos.ts`.
- **`src/components/kael/PipelineSteps.tsx` is unused.** Delete it by hand (files were not deleted in this delivery).
- **Blog posts and figures still contain old facts** (old single-model price table, Off/Auto levels, 220-340 tok/s and 0.7-3 s figures, "supports JSON mode", draft-check-refine and fine-tuned-model descriptions). Left alone on request.
- "Knowledge cutoff: July 2026" on `/kael` is carried over; not in Platform's config, so unverified.

# Changes — 5 October 2026 (Harness/Chat links, "system" wording)

## Changed

- **Every link to Quan Harness / Quan Chat on app.quancis.space now goes to a new holding page, `/not-available`** (`src/app/not-available/page.tsx`). It says the two products are built but not open for public use. The pages, copy and buttons for Harness and Chat are unchanged; only where the links lead. The `app*` entries in `EXTERNAL` (`src/lib/routes.ts`) all point to `/not-available`, with a comment on how to restore them at launch. The page is `noindex` and not in the sitemap.
- **"Model" became "system" where Kael is described as the product**: home headline ("One System. Three Ways In."), "The System, At A Glance", the product-row category, About, Pricing "which one", the Harness and Chat cross-links, and the share-image alt text. Technical uses ("model ID", `kael-beta` as the model name, "extra model calls") are unchanged.

# Changes — 5 October 2026 (new research post and drawn figures)

## Added

- **New post: "Scratch Paper, Second Drafts and Many Students: The Thinking Behind Kael"** (`src/data/posts/the-thinking-behind-kael.ts`, `/blog/the-thinking-behind-kael`). About 2,700 words, 12 minute read, 11 sections, 11 references. It covers tokens and embeddings, prefill, the KV cache, decode, why more context sharpens prediction, thinking, a second student who improves a draft, many differently taught students, a ladder of the three ideas, what it costs, and where the theory is weak. It is dated 2026-10-05, so it is first on the blog index and in the RSS feed with no other change.
- **It is written as design philosophy on purpose.** A callout near the top says it is the thinking behind Kael and not a description of its internals, and the post never says what happens inside a request. The file has a comment saying to keep it that way when editing.
- **16 drawn (SVG) figures**, so readers can see what they are reading:
  - 9 in the new post (`components/blog/figures/theory.tsx`): tokens to numbers, prefill and the KV cache, decode (animated), king minus man plus woman, context narrowing a prediction, scratch paper, the second student, many students, the ladder.
  - 7 in the four existing posts (`components/blog/figures/more.tsx`): Best-of-N picker (one), Mind Evolution islands (one), layered security review and SQL injection (two), the path of a Kael request (one), the wait before the first word and the thinking levels (two).
  - Shared pieces are in `components/blog/figures/svg.tsx`. Each is a self-contained SVG with a text description for screen readers, sized to stay readable on a phone. Their captions say they are illustrations, not measurements.
- **One animation**, the decode loop, with its CSS at the end of `globals.css` ("Blog figures"). It switches off under `prefers-reduced-motion`.
- Share image `public/og/the-thinking-behind-kael.png`, and the matching line in `POSTS` in `scripts/make-og.py`. Only this one image was drawn; the existing images were not regenerated.

## Changed

- The four existing posts each gained their figures, `updated: '2026-10-05'` (a real edit), and, for two of them, a "Keep reading" link to the new post.
- `/blog` is now dated 2026-10-05 in `PAGE_UPDATED` (`src/lib/seo.ts`).
- `FigureId` in `blog-types.ts` and `FIGURES` in `figures/index.tsx` list the 16 new ids.

## Merged with the 4 October demo work

This revision was built on top of the working tree that already held the uncommitted 4 October changes (Blockscape, the 3D Chess fixes, download buttons; entry below). None of those files were touched. Three files were edited by both sides and were merged by hand or with a three-way merge, with no conflicts: `CHANGES.md` (both entries kept, this one first), `README.md` and `scripts/make-og.py` (the new post's card sits in `POSTS`, Blockscape's in `DEMOS`). Nothing is committed; both sets of changes are in the working tree.

## Checked, and not checked

- Type-checked the blog data, `PostBody` and every figure against stubs, with no errors. Server-rendered all five posts through the real `PostBody`: no raw markup leaking, no duplicate headings, every internal link and `related` slug resolves, every figure id exists. Rendered all 16 figures in headless Chromium at phone width and looked at each.
- **Not run:** `npm install` and `npm run build`, as with earlier revisions (no network here). Tailwind styling around the figures was not seen. Run the build, then open `/blog` and `/blog/the-thinking-behind-kael` on a phone and a desktop.
- Every reference in the new post is an arXiv paper whose title and number were written from memory of the papers. Open each link once before you ship.

## Needs a human decision

- **Section 10, "Where the theory is weak"** cites two papers that cut against the second-student idea (self-correction without outside feedback can fail, and written reasoning is not always the real reasoning). It makes the post more credible and it matches what the other posts already say. Remove it if you would rather not have it, but nothing else in the post depends on it.
- **The date.** Dated today. Change it if you publish on another day.

---

# Changes — 4 October 2026 (Blockscape, chess fixes, downloads)

## New demo: Blockscape

- `public/demo-files/blockscape.html` (a voxel sandbox, three.js r128, single file) and a `blockscape` entry in `src/data/demos.ts`, with its own drawn cover (`cover.art: 'voxel'`, new `VoxelArt` in `DemoCover.tsx`) and share card (`public/og/demo-blockscape.png`, from `scripts/make-og.py`).
- New optional `cdnFallbacks` field on a demo: Blockscape tries cdnjs first and only then jsDelivr and unpkg, and the demo page now says so.
- The page's facts were read from the file: eight biomes, ten hotbar blocks, a 600 second day, IndexedDB saves with a localStorage fallback, the controls and the settings.

## 3D Chess fixes (`public/demo-files/chess.html`)

- **Board**: it now has black and white squares (it was light and dark wood, which read as a muddy brown), thin gold grid lines, a gold frame and a–h / 1–8 labels, all drawn into one canvas texture. The old board also had its colours the wrong way round: a1 was a light square. It is dark now, as on a real board. Pieces were tuned (ivory and ebony) to stay readable on it.
- **Select and legal moves**: clicking one of your pieces now lifts it and fills its square, puts a green dot on every legal destination, tints capture squares red with a ring, keeps the last move in amber and puts a red glow under a king in check. The old markers were thin, low-opacity shapes that vanished on the light squares.
- **Captures**: no more tumbling. The captured piece lifts off, turns, glides along a smooth arc with a glow and sparkles, and lowers itself upright onto a felt tray at the side (black pieces on the right, white on the left). After Undo the trays are rebuilt from the move history. The cannon-es physics engine was removed, so the page no longer loads it.
- **AI is on by default** (you play White, Black is the AI). The button still toggles it.
- **Fixed on the way**: knights were written as "P" in the move list (and bishops "N", rooks "B", queens "R", kings "Q") because of an off-by-one in the piece-letter lookup. The camera also pulls back on portrait screens (up to 44 units, zoom limit 50) so the board and both trays fit on a tall phone.
- The demo page text, tags, controls, tech list and cover were updated to match (no more "physics").

## Download buttons

- Every demo page has a "Download the HTML file" link next to "Open full screen", and the hub has a "Download" link under each card. They are plain `<a download>` links to `/demo-files/<file>`, so any demo added later gets them with no extra work. The downloaded file still loads three.js from a CDN, so it needs a connection.

## What was and was not checked

- Checked: both game scripts parse; the chess script was run against stubbed three.js and DOM objects and played through select, a move, an AI reply, a capture (the piece reaches its tray slot), a recapture, en passant, castling, Undo (trays rebuilt) and New; Blockscape was scanned for undefined names and its real game loop was run against stubs (world generation, streaming, walking, flying, dig and place, a time-of-day sweep, about 700 frames, no errors); `demos.ts` passes `tsc --strict`; the edited TSX files parse; the cover SVGs were rendered and looked at.
- **Not checked: any of it in a real browser or on a GPU.** There was none, and no network for `npm install`. Look first at the chess board's colours and the float animation timing, then at a phone.

---

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
