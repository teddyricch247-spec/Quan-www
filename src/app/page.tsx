import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '../components/Hero';
import { ProductTiles, ReadyStrip } from '../components/ProductTiles';
import { SpecSheet } from '../components/kael/SpecSheet';
import { Eyebrow, H2, Prose } from '../components/Section';
import { ROUTES } from '../lib/routes';
import { SITE_URL } from '../lib/seo';

const HOME_TITLE = 'Quancis — One Model. Three Ways In.';
const HOME_DESCRIPTION =
  'Quancis builds Kael, a composite intelligence, and the products people actually use it through: Kael, Quan Harness, and Quan Chat.';

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
        <ProductTiles />
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
          <Link
            href={ROUTES.kael}
            className="mt-8 inline-block text-[0.9375rem] font-medium text-ink border-b border-[#D5D5D1] hover:border-ink transition-colors cursor-pointer pb-0.5"
          >
            Everything about Kael →
          </Link>
        </div>
      </section>

      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto">
          <h2
            className="m-0 mb-6 font-medium text-ink leading-[1.14] tracking-[-0.032em]"
            style={{ fontSize: 'clamp(1.75rem, 3.3vw, 2.6rem)' }}
          >
            One Intelligence. A Whole System Inside It.
          </h2>

          <p className="max-w-[720px] text-ink-2 leading-[1.7]" style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.1875rem)' }}>
            Quancis comes from <em className="not-italic">quán</em>, the Chinese word for the whole. Not a fragment.
            Not a committee of parts pretending to be one thing. The whole. The entire system, working as a single
            intelligence. It&apos;s how a company works: hundreds of people, hundreds of tools, and the world only
            sees one name on the door. That&apos;s Quancis. You see one. Behind it, everything.
          </p>

          <p
            className="max-w-[720px] mt-[clamp(24px,3.5vh,34px)] text-ink-2 leading-[1.7]"
            style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.1875rem)' }}
          >
            That principle is why Kael, the model inside Quancis, is built as a system instead of a bigger model:
            many intelligences working as one, each checking the others&apos; work before an answer reaches you. We
            built two products on top of it.{' '}
            <strong className="text-ink font-medium">Quan Harness</strong> takes that system and turns it loose on a
            codebase — a coding agent that plans, writes, and ships.{' '}
            <strong className="text-ink font-medium">Quan Chat</strong> takes the same system and puts it in a
            conversation — an assistant that reasons the way the whole system does. Both came out of the same single
            month of work.
          </p>
        </div>
      </section>

      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,180px)] scroll-mt-[100px]">
        <ReadyStrip />
      </section>
    </div>
  );
}
