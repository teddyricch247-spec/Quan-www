import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { EXTERNAL, ROUTES } from '../../lib/routes';
import { pageMetadata } from '../../lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Legal',
  description:
    'Where the terms and privacy policies live: the Kael API and Developer Platform, this website, and the status of Quan Harness and Quan Chat.',
  path: '/legal',
});

const LINK_CLASS =
  'font-medium text-ink border-b border-[#D5D5D1] hover:border-ink transition-colors cursor-pointer';

function LegalRow({
  title,
  note,
  links,
}: {
  title: string;
  note?: string;
  /** Leave out for a product that has no documents yet; the note then says so. */
  links?: { label: string; href: string; internal?: boolean }[];
}) {
  return (
    <div className="card-panel px-7 py-6 sm:px-8 sm:py-7">
      <h2 className="m-0 text-[1.0625rem] font-medium tracking-[-0.015em] text-ink">{title}</h2>
      {note ? <p className="mt-1.5 mb-0 text-sm leading-[1.6] text-ink-2">{note}</p> : null}
      {links ? (
        <div className="mt-4 flex flex-wrap items-center gap-2.5 text-[0.9375rem]">
          {links.map((link, i) => (
            <React.Fragment key={link.label}>
              {i > 0 ? (
                <span className="text-ink-3" aria-hidden="true">
                  ·
                </span>
              ) : null}
              {link.internal ? (
                <Link href={link.href} className={LINK_CLASS}>
                  {link.label}
                </Link>
              ) : (
                <a href={link.href} className={LINK_CLASS}>
                  {link.label}
                </a>
              )}
            </React.Fragment>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function LegalPage() {
  return (
    <div className="w-full bg-white px-[clamp(20px,5vw,48px)] pt-[clamp(56px,9vh,96px)] pb-[clamp(88px,14vh,150px)]">
      <div className="max-w-[720px] mx-auto">
        <span className="page-eyebrow">Quancis</span>
        <h1 className="page-title mt-3.5">Legal.</h1>
        <p className="page-lead mt-4">
          Kael, Harness, and Chat are separate products with their own terms. Here&apos;s where each one lives, and where things stand.
        </p>

        <div className="mt-12 flex flex-col gap-4">
          <LegalRow
            title="Kael / Developer API"
            links={[
              { label: 'Terms of Service', href: EXTERNAL.platformTerms },
              { label: 'Privacy Policy', href: EXTERNAL.platformPrivacy },
            ]}
          />
          <LegalRow
            title="This website"
            note="www.quancis.space: what it collects, the cookies it sets and what the demos keep in your browser."
            links={[
              { label: 'Privacy and cookies', href: ROUTES.privacy, internal: true },
              { label: 'Security and data handling', href: ROUTES.security, internal: true },
            ]}
          />
          <LegalRow
            title="Quan Harness & Quan Chat"
            note="Not open to the public yet, so they have no terms or privacy policy yet. Both will be published before anyone is asked to accept them."
            links={[{ label: 'Where they stand', href: ROUTES.notAvailable, internal: true }]}
          />
        </div>

        <div className="mt-16 pt-12 border-t border-line-soft">
          <h2 className="m-0 text-[1.0625rem] font-medium tracking-[-0.015em] text-ink">
            What Kael Does With Your Requests
          </h2>
          <p className="mt-3 max-w-[560px] text-ink-2 leading-[1.7]" style={{ fontSize: '0.9375rem' }}>
            Requests are held for up to 15 minutes so cache hits can be calculated, and after that they are not
            stored in a database. If our safety system flags a request or response as harmful, we keep it until our
            support team has reviewed it. Requests are not used to train Kael.
          </p>
          <p className="mt-3 max-w-[560px] text-ink-2 leading-[1.7]" style={{ fontSize: '0.9375rem' }}>
            This is a summary. The Privacy Policy above is the binding document. The{' '}
            <Link href={ROUTES.security} className={LINK_CLASS}>
              security and data handling page
            </Link>{' '}
            and the{' '}
            <Link href={`${ROUTES.kael}#data`} className={LINK_CLASS}>
              Kael page
            </Link>{' '}
            explain it in more detail.
          </p>
        </div>

        <div className="mt-12 pt-12 border-t border-line-soft">
          <h2 className="m-0 text-[1.0625rem] font-medium tracking-[-0.015em] text-ink">Cookies &amp; Analytics</h2>
          <p className="mt-3 max-w-[560px] text-ink-2 leading-[1.7]" style={{ fontSize: '0.9375rem' }}>
            This website has no accounts, sets no cookies and runs no analytics or advertising scripts. Some of the
            demos save small settings, such as a best score, in your own browser; that never leaves your device. The{' '}
            <Link href={ROUTES.privacy} className={LINK_CLASS}>
              privacy and cookies page
            </Link>{' '}
            has the full list. Anything tied to your account lives on the product you sign into, and is covered by
            that product&apos;s privacy policy above.
          </p>
        </div>

        <div className="mt-12 pt-12 border-t border-line-soft">
          <h2 className="m-0 text-[1.0625rem] font-medium tracking-[-0.015em] text-ink">Questions</h2>
          <p className="mt-3 max-w-[560px] text-ink-2 leading-[1.7]" style={{ fontSize: '0.9375rem' }}>
            Write to us on the{' '}
            <Link href={ROUTES.contact} className={LINK_CLASS}>
              contact page
            </Link>
            , or manage your account and read the full policies on the{' '}
            <a href={EXTERNAL.platform} className={LINK_CLASS}>
              Quancis Developer Platform
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
