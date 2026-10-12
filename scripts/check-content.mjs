#!/usr/bin/env node
/**
 * Content checks that need no install: run with `npm run check` (or
 * `node scripts/check-content.mjs`). It reads the source as text, so it runs in
 * a second and works before `npm install`. It checks the things that have gone
 * wrong on this site before:
 *
 *   1. every internal link (and every #anchor) points at something that exists
 *   2. every page has an <h1> (or a component that renders one)
 *   3. every indexable page has a share image, and is in the sitemap
 *   4. every blog post: figures exist, share image exists, related posts exist,
 *      dates make sense
 *   5. no retired claim comes back (thinking "Off", old speeds, how Kael works inside)
 *   6. the privacy page stays true: no cookies, analytics or storage in the
 *      site's own code, and the demos keep only what /privacy says they keep
 *
 * It does not replace `npm run lint` (types) or `npm run build`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));
const problems = [];
const fail = (msg) => problems.push(msg);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) walk(rel, out);
    else out.push(rel);
  }
  return out;
}

const srcFiles = walk('src').filter((f) => /\.(ts|tsx)$/.test(f));

// ---------------------------------------------------------------- routes
const routesSrc = read('src/lib/routes.ts');
const ROUTES = {};
for (const m of routesSrc.matchAll(/^\s+(\w+):\s*'(\/[^']*)'/gm)) ROUTES[m[1]] = m[2];

const postFiles = fs.readdirSync(path.join(root, 'src/data/posts')).filter((f) => f.endsWith('.ts'));
const postSlugs = postFiles.map((f) => f.replace(/\.ts$/, ''));
const demoSlugs = [...read('src/data/demos.ts').matchAll(/^\s+slug:\s*'([^']+)'/gm)].map((m) => m[1]);

// page.tsx files -> URL paths
const pageFiles = srcFiles.filter((f) => f.endsWith(`${path.sep}page.tsx`) && f.startsWith(`src${path.sep}app`));
const pages = new Map(); // url -> file
for (const f of pageFiles) {
  let url = '/' + path.dirname(path.relative('src/app', f)).split(path.sep).filter((s) => s !== '.').join('/');
  url = url.replace(/\/$/, '') || '/';
  if (url.includes('[slug]')) {
    const slugs = url.startsWith('/blog') ? postSlugs : demoSlugs;
    for (const s of slugs) pages.set(url.replace('[slug]', s), f);
  } else pages.set(url, f);
}
// redirects count as existing addresses
const redirects = new Map();
for (const m of read('next.config.ts').matchAll(/source:\s*'([^']+)',\s*destination:\s*'([^']+)'/g)) {
  redirects.set(m[1], m[2]);
}
const knownUrl = (u) =>
  pages.has(u) ||
  redirects.has(u) ||
  [...redirects.keys()].some((k) => k.includes(':') && new RegExp('^' + k.replace(/:[a-z]+/g, '[^/]+') + '$').test(u)) ||
  (u === '/feed.xml') ||
  u.startsWith('/demo-files/') && exists('public' + u) ||
  (u.startsWith('/og/') && exists('public' + u)) ||
  (u.startsWith('/.well-known/') && exists('public' + u));

// ids available on each page (page file + any text in it)
function idsFor(file) {
  const t = read(file);
  return new Set([...t.matchAll(/\bid=["{`']+([\w-]+)/g)].map((m) => m[1]));
}

// ---------------------------------------------------------------- 1. links
const links = []; // {from, url, anchor}
for (const f of srcFiles) {
  const t = read(f);
  // markdown links in posts
  for (const m of t.matchAll(/\]\((\/[^)\s]*)\)/g)) links.push({ from: f, raw: m[1] });
  // href="/x" and href: '/x'
  for (const m of t.matchAll(/href(?:=|:\s*)["'{`]*\{?["'`]?(\/[A-Za-z0-9/_#.-]*)["'`]/g)) links.push({ from: f, raw: m[1] });
  // ROUTES.x, ROUTES.x}#anchor, `${ROUTES.x}#anchor`, `${ROUTES.blog}/slug`
  for (const m of t.matchAll(/\bROUTES\.(\w+)(?!\w|\()\}?(#[\w-]+|\/[\w-]+)?/g)) {
    if (m[1] === 'has') continue;
    const base = ROUTES[m[1]];
    if (!base) {
      fail(`${f}: ROUTES.${m[1]} does not exist`);
      continue;
    }
    if (m[2] && m[2].startsWith('/') && m[1] !== 'blog') continue; // a path join we cannot judge, e.g. ROUTES.demo + slug
    if (m[2] && m[2].startsWith('/')) links.push({ from: f, raw: base + m[2] });
    else links.push({ from: f, raw: base + (m[2] ?? '') });
  }
}
const seen = new Set();
for (const { from, raw } of links) {
  const key = from + '|' + raw;
  if (seen.has(key)) continue;
  seen.add(key);
  const [url, anchor] = raw.split('#');
  if (url === '' ) continue;
  if (!knownUrl(url)) {
    fail(`${from}: link to ${raw} goes nowhere`);
    continue;
  }
  if (anchor && pages.has(url) && !url.startsWith('/blog/')) {
    if (!idsFor(pages.get(url)).has(anchor)) fail(`${from}: link to ${raw} but ${url} has no element with id="${anchor}"`);
  }
}

// ---------------------------------------------------------------- 2. h1
for (const [url, f] of pages) {
  const t = read(f);
  if (!/<h1\b|<Hero\b|<DocShell\b/.test(t) && !/not-found|error/.test(f)) fail(`${f}: no <h1> (or Hero/DocShell) on ${url}`);
  const h1s = (t.match(/<h1\b/g) ?? []).length + (t.match(/<Hero\b/g) ?? []).length + (t.match(/<DocShell\b/g) ?? []).length;
  if (h1s > 1) fail(`${f}: ${h1s} things render an <h1> on ${url}`);
}

// ---------------------------------------------------------------- 3. share images + sitemap
const sitemapSrc = read('src/app/sitemap.ts');
for (const [url, f] of pages) {
  const dir = path.dirname(f);
  const t = read(f);
  const noindex = /noindex:\s*true/.test(t);
  if (url.includes('/blog/') || url.startsWith('/kael/demo/')) continue; // images live in public/og
  if (!noindex && !fs.existsSync(path.join(root, dir, 'opengraph-image.png'))) fail(`${url}: no opengraph-image.png in ${dir}`);
  const routeKey = Object.entries(ROUTES).find(([, v]) => v === url)?.[0];
  if (routeKey && !noindex && routeKey !== 'home' && !new RegExp(`ROUTES\\.${routeKey}\\b`).test(sitemapSrc)) {
    fail(`${url}: indexable page is missing from src/app/sitemap.ts`);
  }
  if (routeKey && noindex && new RegExp(`ROUTES\\.${routeKey}\\b`).test(sitemapSrc)) fail(`${url}: noindex page is in the sitemap`);
}

// ---------------------------------------------------------------- 4. blog posts
const figureIds = new Set([...read('src/components/blog/figures/index.tsx').matchAll(/^\s+'?([a-z0-9-]+)'?:\s*[(<]/gm)].map((m) => m[1]));
const typeIds = [...read('src/data/blog-types.ts').matchAll(/\|\s*'([a-z0-9-]+)'/g)].map((m) => m[1]);
for (const id of typeIds) if (!figureIds.has(id)) fail(`blog-types.ts: figure '${id}' is declared but not drawn in figures/index.tsx`);
for (const slug of postSlugs) {
  const t = read(`src/data/posts/${slug}.ts`);
  const get = (k) => t.match(new RegExp(`${k}:\\s*'([^']+)'`))?.[1];
  if (get('slug') !== slug) fail(`posts/${slug}.ts: slug field is '${get('slug')}'`);
  const og = get('ogImage');
  if (!og || !exists('public' + og)) fail(`posts/${slug}.ts: share image ${og} is missing`);
  const date = get('date'), updated = get('updated');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '')) fail(`posts/${slug}.ts: date '${date}' is not YYYY-MM-DD`);
  if (updated && updated < date) fail(`posts/${slug}.ts: updated is before date`);
  for (const m of t.matchAll(/figure\(\s*'([a-z0-9-]+)'/g)) if (!figureIds.has(m[1])) fail(`posts/${slug}.ts: figure '${m[1]}' is not registered`);
  const rel = t.match(/related:\s*\[([^\]]*)\]/)?.[1] ?? '';
  for (const m of rel.matchAll(/'([^']+)'/g)) if (!postSlugs.includes(m[1])) fail(`posts/${slug}.ts: related post '${m[1]}' does not exist`);
}
// h2 headings unique within a post
for (const slug of postSlugs) {
  const t = read(`src/data/posts/${slug}.ts`);
  const hs = [...t.matchAll(/h2\(\s*'([^']+)'/g)].map((m) => m[1]);
  const dup = hs.filter((h, i) => hs.indexOf(h) !== i);
  if (dup.length) fail(`posts/${slug}.ts: duplicate h2 ${JSON.stringify(dup)}`);
}

// ---------------------------------------------------------------- 5. retired claims
const RETIRED = [
  [/composite intelligence/i, 'the "composite intelligence" description of Kael was retired (Quancis does not publish how Kael is built)'],
  [/up to about twenty|about twenty calls|~20 calls/i, 'the "up to about twenty calls" claim was retired'],
  [/draft,? check,? (?:and )?refine/i, 'the draft/check/refine description of Kael was retired'],
  [/internal calls?\b/i, 'talk of internal calls describes how Kael works inside'],
  [/fine-tuned (?:language )?models/i, 'describing Kael\'s components was retired'],
  [/with thinking off|thinking off\)|\bOff level\b|0\.7 to 3 seconds|90 to 140 tokens/i, 'Kael has no Off level; speed is 270 to 340 tokens/s in every mode'],
  [/220 to 340/, 'old speed range (now 270 to 340)'],
  [/supports streaming, tool calls and JSON mode/i, 'Kael does not enforce JSON mode'],
];
for (const f of srcFiles) {
  if (f.endsWith('check-content.mjs')) continue;
  const t = read(f);
  for (const [re, why] of RETIRED) if (re.test(t)) fail(`${f}: matches ${re}: ${why}`);
}

// ---------------------------------------------------------------- 6. the privacy page must stay true
const TRACKING = /document\.cookie|\b(?:localStorage|sessionStorage|indexedDB)\s*[.\[]|gtag\(|googletagmanager|google-analytics|plausible\.io|posthog|mixpanel|@vercel\/analytics|@vercel\/speed-insights|hotjar|clarity\.ms|fbq\(/i;
for (const f of srcFiles) {
  if (TRACKING.test(read(f))) fail(`${f}: uses cookies, browser storage or an analytics tool. /privacy says the site does not. Update /privacy first, then this check.`);
}
const pkg = JSON.parse(read('package.json'));
for (const dep of Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })) {
  if (/analytics|speed-insights|posthog|mixpanel|segment|sentry|hotjar|gtag/i.test(dep)) fail(`package.json: ${dep} may collect visitor data. /privacy says the site collects none.`);
}
// What each demo is documented (on /privacy) to keep in the browser.
const DOCUMENTED_STORAGE = { 'blockscape.html': true, 'ouroboros.html': true, 'fan-circuit.html': true, 'chess.html': false };
const ALLOWED_CDN = new Set(['unpkg.com', 'cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'www.w3.org']);
for (const f of fs.readdirSync(path.join(root, 'public/demo-files'))) {
  const t = read(`public/demo-files/${f}`);
  const uses = /localStorage|sessionStorage|indexedDB/.test(t);
  if (!(f in DOCUMENTED_STORAGE)) fail(`public/demo-files/${f}: a new demo. Check what it stores and which hosts it loads from, then list it on /privacy and in this script.`);
  else if (uses !== DOCUMENTED_STORAGE[f]) fail(`public/demo-files/${f}: browser storage use changed (now ${uses}). Update the table on /privacy and DOCUMENTED_STORAGE here.`);
  if (/document\.cookie/.test(t)) fail(`public/demo-files/${f}: sets a cookie. Update /privacy.`);
  for (const m of t.matchAll(/https?:\/\/([a-z0-9.-]+)\//gi)) {
    if (!ALLOWED_CDN.has(m[1])) fail(`public/demo-files/${f}: loads from ${m[1]}, which /privacy does not mention.`);
  }
}

// ---------------------------------------------------------------- result
if (problems.length) {
  console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:\n`);
  for (const p of problems) console.error('  - ' + p);
  console.error('');
  process.exit(1);
}
console.log(`check-content: ${pages.size} pages, ${postSlugs.length} posts, ${demoSlugs.length} demos, ${new Set(links.map((l) => l.raw)).size} distinct internal links. All good.`);
