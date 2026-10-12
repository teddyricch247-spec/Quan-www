import type { Metadata } from 'next';
import Link from 'next/link';
import { PricingTable } from '../../components/kael/PricingTable';
import { EXTERNAL, ROUTES } from '../../lib/routes';
import { JsonLd } from '../../components/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '../../lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Pricing',
  description:
    'Kael is billed per million tokens through the API. Quan Harness and Quan Chat are planned as one subscription and are not open to the public yet, so no app price is published.',
  path: '/pricing',
});

const LINK_CLASS =
  'inline-block border-b border-[#D5D5D1] pb-0.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink cursor-pointer';

const H2_STYLE = { fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)' } as const;
const PROSE_STYLE = { fontSize: '1.0625rem' } as const;

// One line per product: who it is for, and where to go. Mirrors the "Where
// to use it" section on the Kael page.
const WHICH_ONE: { need: string; name: string; href: string }[] = [
  { need: 'You are building with Kael.', name: 'The Kael API', href: ROUTES.kael },
  { need: 'You want an agent working on your codebase.', name: 'Quan Harness', href: ROUTES.harness },
  { need: 'You want to ask it things.', name: 'Quan Chat', href: ROUTES.chat },
];

export default function PricingPage() {
  return (
    <div className="w-full bg-white px-[clamp(20px,5vw,48px)] pt-[clamp(56px,9vh,96px)] pb-[clamp(88px,14vh,150px)]">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Pricing', path: '/pricing' },
        ])}
      />
      <div className="max-w-[920px] mx-auto">
        <span className="page-eyebrow">Quancis</span>
        <h1 className="page-title mt-3.5">Pricing.</h1>
        <p className="page-lead mt-4">
          Kael is priced by usage, through the API, today. Quan Harness and Quan Chat are planned as one
          subscription and are not open to the public yet.
        </p>

        {/* ================= KAEL API ================= */}
        <section id="api" className="mt-[clamp(56px,9vh,96px)] scroll-mt-[100px]">
          <span className="text-xs font-medium tracking-[0.14em] uppercase text-ink-3">Kael API</span>
          <h2 className="mt-3.5 mb-5 font-medium text-ink leading-[1.14] tracking-[-0.032em]" style={H2_STYLE}>
            Pay For What You Use.
          </h2>
          <p className="mb-9 max-w-[720px] text-ink-2 leading-[1.7]" style={PROSE_STYLE}>
            Pricing is usage-based, per million tokens, and each model has its own price. Kael Beta costs the
            same at Low, High and Max. Kael Pro Beta, the most thorough model, costs more per token at both of
            its levels. You are billed once, for your input and the final answer, nothing else.
          </p>
          <PricingTable />
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <a href={EXTERNAL.platformPricing} className={LINK_CLASS}>
              See live pricing on the console →
            </a>
            <a href={EXTERNAL.platform} className={LINK_CLASS}>
              Create a Kael API account →
            </a>
            <Link href={`${ROUTES.kael}#thinking`} className={LINK_CLASS}>
              How the thinking levels differ →
            </Link>
          </div>
        </section>

        {/* ================= HARNESS + CHAT ================= */}
        <section id="app" className="mt-[clamp(64px,10vh,112px)] scroll-mt-[100px]">
          <span className="text-xs font-medium tracking-[0.14em] uppercase text-ink-3">
            Quan Harness &amp; Quan Chat
          </span>
          <h2 className="mt-3.5 mb-5 font-medium text-ink leading-[1.14] tracking-[-0.032em]" style={H2_STYLE}>
            Not Open Yet.
          </h2>
          <p className="mb-9 max-w-[720px] text-ink-2 leading-[1.7]" style={PROSE_STYLE}>
            Harness, the coding agent, and Chat, the conversation, are built but not open to the public, so there is
            no app pricing to show. The plan is a single subscription covering both. We will publish the price here
            when they open, and not before.
          </p>
          <Link href={ROUTES.notAvailable} className="btn-pill btn-pill-dark inline-flex">
            Where Harness and Chat stand
          </Link>
        </section>

        {/* ================= WHICH ONE ================= */}
        <section id="which" className="mt-[clamp(64px,10vh,112px)] scroll-mt-[100px]">
          <span className="text-xs font-medium tracking-[0.14em] uppercase text-ink-3">Not sure which?</span>
          <h2 className="mt-3.5 mb-8 font-medium text-ink leading-[1.14] tracking-[-0.032em]" style={H2_STYLE}>
            Start From What You Want To Do.
          </h2>
          <ul className="card-panel m-0 list-none overflow-hidden p-0">
            {WHICH_ONE.map((row, i) => (
              <li key={row.name} className={i > 0 ? 'border-t border-line-soft' : ''}>
                <Link
                  href={row.href}
                  className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-6 py-5 transition-colors hover:bg-surface cursor-pointer"
                >
                  <span className="text-[0.9375rem] text-ink-2">{row.need}</span>
                  <span className="text-[0.9375rem] font-medium text-ink">{row.name} →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
