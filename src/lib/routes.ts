// Internal routes — this repo only. Zero auth, zero dashboard, so this
// map is intentionally much smaller than the platform app's.
export const ROUTES = {
  home: '/',
  kael: '/kael',
  demo: '/kael/demo',
  harness: '/harness',
  chat: '/chat',
  pricing: '/pricing',
  examples: '/examples',
  about: '/about',
  contact: '/contact',
  legal: '/legal',
  blog: '/blog',
  // Holding page for Quan Harness / Quan Chat while they are not public.
  notAvailable: '/not-available',
} as const;

export type RouteKey = keyof typeof ROUTES;

/** A demo's own page: /kael/demo/<slug>. */
export const demoPath = (slug: string): string => `${ROUTES.demo}/${slug}`;

/** The raw single-file HTML for a demo, served from public/demo-files/.
 *  Kept on a different prefix from the pages so the two can never collide. */
export const DEMO_FILES_DIR = '/demo-files';
export const demoFileUrl = (file: string): string => `${DEMO_FILES_DIR}/${file}`;

// Routes whose hero is the dark HeroCanvas section — the header starts
// transparent over these and crosses to the glass pill on scroll. Every
// other page (pricing, examples, about, contact, legal, blog, blog posts) has no
// dark hero, so the header stays in the "scrolled" glass-pill state the whole time.
export const HERO_ROUTES: ReadonlySet<string> = new Set([
  ROUTES.home,
  ROUTES.kael,
  ROUTES.harness,
  ROUTES.chat,
]);

// This is a separate, lightweight repo/Vercel project from the other
// two Quancis properties (per the site spec, §Part 3 intro) — so links
// to them are plain external URLs, not Next.js routes.
export const EXTERNAL = {
  platform: 'https://platform.quancis.space',
  platformPricing: 'https://platform.quancis.space/pricing',
  platformDocs: 'https://platform.quancis.space/docs',
  platformTerms: 'https://platform.quancis.space/terms-of-service',
  platformPrivacy: 'https://platform.quancis.space/privacy-policy',
  // Quan Harness and Quan Chat are not open to the public yet, so every
  // link that used to go to app.quancis.space goes to the holding page.
  // To launch: restore these to the https://app.quancis.space/... URLs
  // (app, /harness, /chat, /pricing, /terms-of-service, /privacy-policy).
  app: '/not-available',
  appHarness: '/not-available',
  appChat: '/not-available',
  appPricing: '/not-available',
  appTerms: '/not-available',
  appPrivacy: '/not-available',
} as const;

/** Hosts that belong to Quancis. Links to these are plain, same-owner
 *  links (no new tab, no rel="noopener"); everything else is treated as an
 *  outside citation. */
export const OWN_HOSTS: readonly string[] = ['quancis.space', 'www.quancis.space', 'platform.quancis.space', 'app.quancis.space'];
