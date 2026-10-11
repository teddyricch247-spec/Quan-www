import type { Metadata } from 'next';
import Link from 'next/link';
import { EXTERNAL, ROUTES } from '../../lib/routes';
import { pageMetadata } from '../../lib/seo';

// Every link that used to go to app.quancis.space (Quan Harness and Quan
// Chat) lands here until those two products open to the public. It is
// noindex and left out of the sitemap on purpose. When they launch, point
// the `app*` entries in lib/routes.ts back at the real URLs.
export const metadata: Metadata = pageMetadata({
  title: 'Not available yet',
  description: 'Quan Harness and Quan Chat are built, but not open for public use yet.',
  path: ROUTES.notAvailable,
  noindex: true,
});

export default function NotAvailablePage() {
  return (
    <div className="w-full bg-white px-[clamp(20px,5vw,48px)] pt-[clamp(56px,9vh,96px)] pb-[clamp(88px,14vh,150px)]">
      <div className="max-w-[720px] mx-auto">
        <span className="page-eyebrow">Quan Harness &amp; Quan Chat</span>
        <h1 className="page-title mt-3.5">Not Available Yet.</h1>
        <p className="page-lead mt-4">
          Quan Harness and Quan Chat are built, but they are not open for public use right now. We will announce
          it here when that changes.
        </p>
        <p className="mt-6 max-w-[560px] text-ink-2 leading-[1.7]" style={{ fontSize: '0.9375rem' }}>
          Both run on Kael, and Kael is available today through the API. You can sign up on the Developer
          Platform and call it from your own code.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a href={EXTERNAL.platform} className="btn-pill btn-pill-dark inline-flex">
            Get API Access
          </a>
          <Link href={ROUTES.kael} className="btn-pill btn-pill-light inline-flex">
            About Kael
          </Link>
        </div>

        <p className="mt-12 max-w-[560px] text-ink-3 leading-[1.7]" style={{ fontSize: '0.875rem' }}>
          You can still read about what they will do:{' '}
          <Link href={ROUTES.harness} className="border-b border-[#D5D5D1] font-medium text-ink hover:border-ink transition-colors">
            Quan Harness
          </Link>{' '}
          and{' '}
          <Link href={ROUTES.chat} className="border-b border-[#D5D5D1] font-medium text-ink hover:border-ink transition-colors">
            Quan Chat
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
