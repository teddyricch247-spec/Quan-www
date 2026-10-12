import type { Metadata } from 'next';
import Link from 'next/link';
import { EXTERNAL, ROUTES } from '../../lib/routes';
import { ORG } from '../../lib/org';
import { pageMetadata } from '../../lib/seo';

// The status page for Quan Harness and Quan Chat while they are not open to
// the public. Nothing on the site sends people here as a dead end any more:
// the product pages say "not open yet" themselves and link here for detail.
// It is noindex and left out of the sitemap on purpose. There is deliberately
// no sign-up or waitlist. At launch, delete this page (and its link from the
// footer) or turn it into a changelog.
export const metadata: Metadata = pageMetadata({
  title: 'Harness and Chat: status',
  description: 'Quan Harness and Quan Chat are built, but not open for public use yet. What that means and what you can use today.',
  path: ROUTES.notAvailable,
  noindex: true,
});

const LINK_CLASS = 'border-b border-[#D5D5D1] font-medium text-ink transition-colors hover:border-ink';

const STATUS: { name: string; href: string; line: string }[] = [
  {
    name: 'Quan Harness',
    href: ROUTES.harness,
    line: 'The coding agent. Built on Kael. Not open to the public.',
  },
  {
    name: 'Quan Chat',
    href: ROUTES.chat,
    line: 'Kael in a conversation. Not open to the public.',
  },
];

export default function NotAvailablePage() {
  return (
    <div className="w-full bg-white px-[clamp(20px,5vw,48px)] pt-[clamp(56px,9vh,96px)] pb-[clamp(88px,14vh,150px)]">
      <div className="max-w-[720px] mx-auto">
        <span className="page-eyebrow">Quan Harness &amp; Quan Chat</span>
        <h1 className="page-title mt-3.5">Not Open Yet.</h1>
        <p className="page-lead mt-4">
          Quan Harness and Quan Chat are built, but they are not open for public use. There is no sign-up, no app to
          log in to and no published price yet.
        </p>

        <ul className="card-panel mt-10 m-0 list-none overflow-hidden p-0">
          {STATUS.map((row, i) => (
            <li key={row.name} className={i > 0 ? 'border-t border-line-soft' : ''}>
              <Link
                href={row.href}
                className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-6 py-5 transition-colors hover:bg-surface"
              >
                <span className="text-[0.9375rem] font-medium text-ink">{row.name}</span>
                <span className="text-[0.9375rem] text-ink-2">{row.line}</span>
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="m-0 mt-14 text-[1.0625rem] font-medium tracking-[-0.015em] text-ink">What you can use today</h2>
        <p className="mt-3 max-w-[560px] text-ink-2 leading-[1.7]" style={{ fontSize: '0.9375rem' }}>
          Both run on Kael, and Kael is available now through the API, in two models. Sign-up is open to anyone while
          it is in beta. The{' '}
          <Link href={ROUTES.demo} className={LINK_CLASS}>
            demos
          </Link>{' '}
          show what Kael produces, and the{' '}
          <Link href={ROUTES.pricing} className={LINK_CLASS}>
            pricing page
          </Link>{' '}
          has the API prices.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={EXTERNAL.platform} className="btn-pill btn-pill-dark inline-flex">
            Get API Access
          </a>
          <Link href={ROUTES.kael} className="btn-pill btn-pill-light inline-flex">
            About Kael
          </Link>
        </div>

        <h2 className="m-0 mt-14 text-[1.0625rem] font-medium tracking-[-0.015em] text-ink">When they open</h2>
        <p className="mt-3 max-w-[560px] text-ink-2 leading-[1.7]" style={{ fontSize: '0.9375rem' }}>
          We will say so on the home page and the blog, and the terms and privacy policy for both will be published
          before anyone is asked to accept them. Until then the{' '}
          <Link href={ROUTES.legal} className={LINK_CLASS}>
            legal page
          </Link>{' '}
          covers what does exist. Questions are welcome at{' '}
          <a href={`mailto:${ORG.email.business}`} className={LINK_CLASS}>
            {ORG.email.business}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
