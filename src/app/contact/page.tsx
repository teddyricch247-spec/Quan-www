import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { JsonLd } from '../../components/JsonLd';
import { ORG, ADDRESS_LINE } from '../../lib/org';
import { EXTERNAL, ROUTES } from '../../lib/routes';
import { breadcrumbJsonLd, contactPageJsonLd, pageMetadata } from '../../lib/seo';

const DESCRIPTION =
  'Contact Quancis: support for Kael, Quan Harness and Quan Chat, and enquiries about partnerships, press and independent evaluation.';

export const metadata: Metadata = pageMetadata({
  title: 'Contact Quancis',
  description: DESCRIPTION,
  path: '/contact',
});

const LINK =
  'border-b border-[#D5D5D1] font-medium text-ink transition-colors hover:border-ink';

const CHANNELS = [
  {
    heading: 'Support',
    email: ORG.email.support,
    subject: 'Quancis support',
    body: 'Account and billing questions, API errors, bugs, and anything that is not working the way the docs say it should.',
  },
  {
    heading: 'Business and general enquiries',
    email: ORG.email.business,
    subject: 'Quancis enquiry',
    body: 'Partnerships, press, independent evaluation, and everything else.',
  },
] as const;

const INCLUDE = [
  'Which product: the Kael API, Quan Harness or Quan Chat.',
  'The email address on your account.',
  'For the API: the model ID, the thinking level, the time of the request with its timezone, and any request ID that came back.',
  'The exact error message, copied rather than paraphrased.',
  'What you expected to happen and what happened instead.',
] as const;

const SELF_SERVE = [
  { label: 'Kael API documentation', href: EXTERNAL.platformDocs },
  { label: 'Kael API pricing', href: EXTERNAL.platformPricing },
  { label: 'Quan Harness and Quan Chat pricing', href: EXTERNAL.appPricing },
  { label: 'Sign in or create an account', href: EXTERNAL.platform },
] as const;

export default function ContactPage() {
  return (
    <div className="w-full bg-white px-[clamp(20px,5vw,48px)] pt-[clamp(56px,9vh,96px)] pb-[clamp(88px,14vh,150px)]">
      <JsonLd
        data={[
          contactPageJsonLd({ name: 'Contact Quancis', description: DESCRIPTION, path: '/contact' }),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        ]}
      />
      <div className="max-w-[760px] mx-auto">
        <span className="page-eyebrow">Company</span>
        <h1 className="page-title mt-3.5">Contact Us.</h1>
        <p className="page-lead mt-4">
          Questions, bug reports, partnership or press enquiries. Write to the right address and we will read it.
        </p>

        <ul className="m-0 mt-12 grid list-none gap-4 p-0 sm:grid-cols-2">
          {CHANNELS.map((channel) => (
            <li key={channel.email} className="card-panel flex flex-col px-7 py-6">
              <h2 className="m-0 text-[1.125rem] font-medium tracking-[-0.02em] text-ink">{channel.heading}</h2>
              <p className="mb-0 mt-2 flex-1 text-[0.9375rem] leading-[1.65] text-ink-2">{channel.body}</p>
              <a
                href={`mailto:${channel.email}?subject=${encodeURIComponent(channel.subject)}`}
                className="mt-5 inline-flex items-center gap-2 break-all text-[0.9375rem] font-medium text-ink"
              >
                <Mail className="h-4 w-4 flex-none" strokeWidth={1.8} aria-hidden="true" />
                <span className="border-b border-[#D5D5D1] transition-colors hover:border-ink">{channel.email}</span>
              </a>
            </li>
          ))}
        </ul>

        <section className="mt-16" aria-labelledby="include-heading">
          <h2 id="include-heading" className="m-0 text-[1.5rem] font-medium tracking-[-0.025em] text-ink">
            What to include
          </h2>
          <p className="mb-0 mt-4 text-[1.0625rem] leading-[1.75] text-ink-2">
            A short message with the right details gets a useful answer faster. For a problem report:
          </p>
          <ul className="m-0 mt-4 flex list-disc flex-col gap-2 pl-6 text-[1rem] leading-[1.65] text-ink-2 marker:text-ink-3">
            {INCLUDE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-16" aria-labelledby="self-serve-heading">
          <h2 id="self-serve-heading" className="m-0 text-[1.5rem] font-medium tracking-[-0.025em] text-ink">
            Find it yourself
          </h2>
          <ul className="m-0 mt-4 flex list-none flex-col gap-2.5 p-0 text-[1rem]">
            {SELF_SERVE.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={LINK}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link href={ROUTES.legal} className={LINK}>
                Terms and privacy policies
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-16" aria-labelledby="evaluators-heading">
          <h2 id="evaluators-heading" className="m-0 text-[1.5rem] font-medium tracking-[-0.025em] text-ink">
            For researchers and evaluators
          </h2>
          <div className="mt-4 flex flex-col gap-4 text-[1.0625rem] leading-[1.75] text-ink-2">
            <p className="m-0">
              If you plan to run an independent evaluation of Kael, please write to{' '}
              <a href={`mailto:${ORG.email.business}?subject=${encodeURIComponent('Kael evaluation')}`} className={LINK}>
                {ORG.email.business}
              </a>{' '}
              first and tell us what you intend to run.
            </p>
            <p className="m-0">
              Three things to know up front. Kael comes as two models, Kael Beta and Kael Pro Beta, so say which one
              you used. It accepts sampling settings such as temperature but does not use them, so output is not deterministic and runs
              can vary. And the safety system can flag requests; flagged requests are held for review. The{' '}
              <Link href="/kael" className={LINK}>
                Kael page
              </Link>{' '}
              has the full specification.
            </p>
          </div>
        </section>

        <section className="mt-16" aria-labelledby="address-heading">
          <h2 id="address-heading" className="m-0 text-[1.5rem] font-medium tracking-[-0.025em] text-ink">
            Where we are
          </h2>
          <address className="mt-4 text-[1.0625rem] not-italic leading-[1.75] text-ink-2">
            {ORG.name}
            <br />
            {ADDRESS_LINE}
          </address>
          <p className="mb-0 mt-4 text-[1rem] leading-[1.7] text-ink-2">
            Want to know who we are first? Read{' '}
            <Link href={ROUTES.about} className={LINK}>
              about Quancis
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
