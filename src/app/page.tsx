import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '../components/Hero';
import { ProductShowcase, ReadyStrip } from '../components/ProductShowcase';
import { SystemStory } from '../components/SystemStory';
import { PlatformCta } from '../components/PlatformCta';
import { SpecSheet } from '../components/kael/SpecSheet';
import { Eyebrow, H2, Prose } from '../components/Section';
import { ROUTES } from '../lib/routes';
import { SITE_URL } from '../lib/seo';

const HOME_TITLE = 'Quancis — Kael Composite Intelligence, Harness & Chat';
const HOME_DESCRIPTION =
  'Kael drafts, checks and refines every answer. Use it through an OpenAI-compatible API, the Quan Harness coding agent, or Quan Chat.';

// The home page keeps the root layout's full title (no "| Quancis" suffix) but
// still gets its own canonical URL and og:url, like every other page.
export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: `${SITE_URL}/`,
    siteName: 'Quancis',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: HOME_TITLE, description: HOME_DESCRIPTION },
};

export default function HomePage() {
  return (
    <div className="w-full bg-white">
      <Hero
        compact
        accent="red"
        headline="One Model. Three Ways In."
        subhead="Quancis builds Kael, a composite intelligence — and the products people actually use it through."
      />

      <section className="px-[clamp(20px,5vw,48px)] pt-[clamp(48px,7vh,72px)] pb-[clamp(88px,14vh,150px)] scroll-mt-[100px]">
        <ProductShowcase />
      </section>

      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto">
          <Eyebrow>Kael, in brief</Eyebrow>
          <H2>The Model, At A Glance.</H2>
          <Prose className="mb-10">
            Kael is in beta. It is built for accuracy over speed, and it is strongest at coding, security,
            software engineering, agentic work and math. These are the facts a developer asks for first.
          </Prose>
          <SpecSheet only={['model-id', 'status', 'context', 'output', 'input', 'languages', 'formats', 'thinking']} />
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link
              href={ROUTES.kael}
              className="inline-block text-[0.9375rem] font-medium text-ink border-b border-[#D5D5D1] hover:border-ink transition-colors cursor-pointer pb-0.5"
            >
              Everything about Kael →
            </Link>
            <Link
              href={ROUTES.demo}
              className="inline-block text-[0.9375rem] font-medium text-ink border-b border-[#D5D5D1] hover:border-ink transition-colors cursor-pointer pb-0.5"
            >
              Play the games Kael built in chat →
            </Link>
          </div>
        </div>
      </section>

      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <SystemStory />
      </section>

      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(56px,9vh,96px)] scroll-mt-[100px]">
        <div className="mx-auto max-w-[1160px]">
          <PlatformCta
            heading="Building with an API? Start with Kael."
            body="Create an account on the Quancis Developer Platform, get a key, and point the SDK you already use at the Kael API. Sign-up is open to anyone while Kael is in beta."
          />
        </div>
      </section>

      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,180px)] scroll-mt-[100px]">
        <ReadyStrip />
      </section>
    </div>
  );
}
