// Internal routes — this repo only. Zero auth, zero dashboard, so this
// map is intentionally much smaller than the platform app's.
export const ROUTES = {
  home: '/',
  kael: '/kael',
  harness: '/harness',
  chat: '/chat',
  legal: '/legal',
  blog: '/blog',
} as const;

export type RouteKey = keyof typeof ROUTES;

// Routes whose hero is the dark HeroCanvas section — the header starts
// transparent over these and crosses to the glass pill on scroll. Every
// other page (legal, blog, blog posts) has no dark hero, so the header
// stays in the "scrolled" glass-pill state the whole time.
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
  app: 'https://app.quancis.space',
  appHarness: 'https://app.quancis.space/harness',
  appChat: 'https://app.quancis.space/chat',
  appPricing: 'https://app.quancis.space/pricing',
  appTerms: 'https://app.quancis.space/terms-of-service',
  appPrivacy: 'https://app.quancis.space/privacy-policy',
} as const;
