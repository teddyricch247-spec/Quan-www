import type { Metadata } from 'next';
import Link from 'next/link';
import { PricingTable } from '../../components/kael/PricingTable';
import { EXTERNAL, ROUTES } from '../../lib/routes';
import { pageMetadata } from '../../lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Pricing',
  description:
    'Kael is billed per million tokens through the API. Quan Harness and Quan Chat share one subscription. How each is priced, and where to find the exact numbers.',
  path: '/pricing',
});

const LINK_CLASS =
  'inline-block border-b border-[#D5D5D1] pb-0.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink cursor-pointer';

const H2_STYLE = { fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)' } as const;
const PROSE_STYLE = { fontSize: '1.0625rem' } as const;

// One line per product: who it is for, and where to go. Mirrors the "Where
// to use it" section on the Kael page.
const WHICH_ONE: { need: string; name: string; href: string }[] = [
  { need: 'You are building with the model.', name: 'The Kael API', href: ROUTES.kael },
  { need: 'You want an agent working on your codebase.', name: 'Quan Harness', href: ROUTES.harness },
  { need: 'You want to ask it things.', name: 'Quan Chat', href: ROUTES.chat },
];

export default function PricingPage() {
  return (
    <div className="w-full bg-white px-[clamp(20px,5vw,48px)] pt-[clamp(56px,9vh,96px)] pb-[clamp(88px,14vh,150px)]">
      <div className="max-w-[920px] mx-auto">
        <span className="page-eyebrow">Quancis</span>
        <h1 className="page-title mt-3.5">Pricing.</h1>
        <p className="page-lead mt-4">
          Two ways to pay, one for each way of using Kael: by usage through the API, or by subscription through
          the app.
        </p>

        {/* ================= KAEL API ================= */}
        <section id="api" className="mt-[clamp(56px,9vh,96px)] scroll-mt-[100px]">
          <span className="text-xs font-medium tracking-[0.14em] uppercase text-ink-3">Kael API</span>
          <h2 className="mt-3.5 mb-5 font-medium text-ink leading-[1.14] tracking-[-0.032em]" style={H2_STYLE}>
            Pay For What You Use.
          </h2>
          <p className="mb-9 max-w-[720px] text-ink-2 leading-[1.7]" style={PROSE_STYLE}>
            Pricing is usage-based, per million tokens. The three levels you can use today cost the same. The Z
            levels, when they launch, cost more because they send requests through a different internal route that
            produces better results.
          </p>
          <PricingTable />
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <a href={EXTERNAL.platformPricing} className={LINK_CLASS}>
              See live pricing on the console →
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
            One Subscription.
          </h2>
          <p className="mb-9 max-w-[720px] text-ink-2 leading-[1.7]" style={PROSE_STYLE}>
            Harness, the coding agent, and Chat, the conversation, are covered by a single subscription. Exact
            pricing lives on the app.
          </p>
          <a href={EXTERNAL.appPricing} className="btn-pill btn-pill-dark inline-flex">
            See app pricing
          </a>
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
