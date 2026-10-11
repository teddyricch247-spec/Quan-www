import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '../../components/JsonLd';
import { PlatformCta } from '../../components/PlatformCta';
import { ADDRESS_LINE, ORG } from '../../lib/org';
import { ROUTES } from '../../lib/routes';
import { aboutPageJsonLd, breadcrumbJsonLd, pageMetadata } from '../../lib/seo';

const ABOUT_DESCRIPTION =
  'Quancis builds Kael, in two models, and the products people use it through. Where the name comes from, what we care about, what we do not publish and what is not available yet.';

export const metadata: Metadata = pageMetadata({
  title: 'About Quancis',
  description: ABOUT_DESCRIPTION,
  path: '/about',
});

const LINK_CLASS =
  'inline-block border-b border-[#D5D5D1] pb-0.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink cursor-pointer';

const H2_STYLE = { fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)' } as const;
const PROSE_STYLE = { fontSize: '1.0625rem' } as const;
const H2_CLASS = 'mt-3.5 mb-5 font-medium text-ink leading-[1.14] tracking-[-0.032em]';
const EYEBROW_CLASS = 'text-xs font-medium tracking-[0.14em] uppercase text-ink-3';
const SECTION_CLASS = 'mt-[clamp(56px,9vh,96px)] scroll-mt-[100px]';

// Each belief restates something the product pages already say; nothing new
// is claimed here.
const BELIEFS: { title: string; body: string }[] = [
  {
    title: 'Accuracy over speed.',
    body: 'Kael thinks longer than most models, on purpose. We would rather you wait a little for the right answer than get a wrong one quickly.',
  },
  {
    title: 'Honest limits.',
    body: 'We say what Kael is not for as plainly as what it is good at, and we are not publishing benchmark numbers we ran ourselves. Independent results come first.',
  },
  {
    title: 'Your requests are yours.',
    body: 'Requests are not used to train Kael. What we do keep, and for how long, is written out in plain language on the Kael page and the Legal page.',
  },
];

// From the business brief's "not available yet" list. Plain statements of
// what does not exist today, so nobody has to guess.
const NOT_YET: string[] = [
  'A model card or formal technical report',
  'Uptime or SLA figures (the rate limits are published, in the docs and on the Kael page)',
  'Published benchmark results',
  'An Auto thinking level, where Kael decides how much to think',
  'Support for PDFs, video and other file types',
  'Support for languages other than English',
];

const PRODUCTS: { name: string; line: string; href: string }[] = [
  { name: 'Kael', line: 'The system itself, behind an API.', href: ROUTES.kael },
  { name: 'Quan Harness', line: 'An agent that works on your codebase.', href: ROUTES.harness },
  { name: 'Quan Chat', line: 'Kael, in a conversation.', href: ROUTES.chat },
];

export default function AboutPage() {
  return (
    <div className="w-full bg-white px-[clamp(20px,5vw,48px)] pt-[clamp(56px,9vh,96px)] pb-[clamp(88px,14vh,150px)]">
      <JsonLd
        data={[
          aboutPageJsonLd({ name: 'About Quancis', description: ABOUT_DESCRIPTION, path: '/about' }),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />
      <div className="max-w-[760px] mx-auto">
        <span className="page-eyebrow">Quancis</span>
        <h1 className="page-title mt-3.5">About Quancis.</h1>
        <p className="page-lead mt-4">
          We build Kael, in two models, and the products people use it through.
        </p>

        {/* ================= THE NAME ================= */}
        <section id="name" className={SECTION_CLASS}>
          <span className={EYEBROW_CLASS}>The name</span>
          <h2 className={H2_CLASS} style={H2_STYLE}>
            One Intelligence. A Whole System Inside It.
          </h2>
          <p className="max-w-[680px] text-ink-2 leading-[1.7]" style={PROSE_STYLE}>
            Quancis comes from <em className="not-italic text-ink">quán</em>, the Chinese word for the whole.
            Kael is that idea applied to answers: one Kael, in two models, built to be right rather than quick.
            Kael Beta is for most work. Kael Pro Beta is the most thorough, for the hardest problems.
          </p>
        </section>

        {/* ================= WHAT WE CARE ABOUT ================= */}
        <section id="beliefs" className={SECTION_CLASS}>
          <span className={EYEBROW_CLASS}>What we care about</span>
          <h2 className={H2_CLASS} style={H2_STYLE}>
            Built To Be Right.
          </h2>
          <dl className="m-0 border-t border-line">
            {BELIEFS.map((belief) => (
              <div
                key={belief.title}
                className="grid grid-cols-1 gap-x-10 gap-y-2 border-b border-line py-7 md:grid-cols-[0.55fr_1.45fr]"
              >
                <dt className="text-[1.0625rem] font-medium text-ink">{belief.title}</dt>
                <dd className="m-0 max-w-[560px] text-[0.9375rem] leading-[1.7] text-ink-2">{belief.body}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link href={`${ROUTES.kael}#data`} className={LINK_CLASS}>
              What Kael keeps →
            </Link>
            <Link href={ROUTES.legal} className={LINK_CLASS}>
              Legal →
            </Link>
          </div>
        </section>

        {/* ================= THREE WAYS IN ================= */}
        <section id="products" className={SECTION_CLASS}>
          <span className={EYEBROW_CLASS}>What we make</span>
          <h2 className={H2_CLASS} style={H2_STYLE}>
            One System, Three Ways In.
          </h2>
          <ul className="card-panel m-0 list-none overflow-hidden p-0">
            {PRODUCTS.map((product, i) => (
              <li key={product.name} className={i > 0 ? 'border-t border-line-soft' : ''}>
                <Link
                  href={product.href}
                  className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-6 py-5 transition-colors hover:bg-surface cursor-pointer"
                >
                  <span className="text-[0.9375rem] font-medium text-ink">{product.name}</span>
                  <span className="text-[0.9375rem] text-ink-2">{product.line} →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ================= WHAT KAEL IS BUILT ON ================= */}
        <section id="built-on" className={SECTION_CLASS}>
          <span className={EYEBROW_CLASS}>What we publish</span>
          <h2 className={H2_CLASS} style={H2_STYLE}>
            What We Do Not Publish.
          </h2>
          <p className="max-w-[680px] text-ink-2 leading-[1.7]" style={PROSE_STYLE}>
            Quancis does not publish how Kael is built or which components it uses, and Kael will not say. The
            weights are closed. What we do publish is what each model is for, what it costs, its limits and what
            we keep from your requests.
          </p>
        </section>

        {/* ================= WHERE WE ARE ================= */}
        <section id="status" className={SECTION_CLASS}>
          <span className={EYEBROW_CLASS}>Where we are</span>
          <h2 className={H2_CLASS} style={H2_STYLE}>
            Kael Is In Beta.
          </h2>
          <p className="max-w-[680px] text-ink-2 leading-[1.7]" style={PROSE_STYLE}>
            Things will change as we learn from real use. The blog is where we share what changes. Here is what
            is not there yet, so nobody has to guess:
          </p>
          <ul className="m-0 mt-5 flex list-disc flex-col gap-2 pl-6 text-[1rem] leading-[1.65] text-ink-2 marker:text-ink-3">
            {NOT_YET.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link href={ROUTES.blog} className={LINK_CLASS}>
              Read the blog →
            </Link>
            <a href="/feed.xml" className={LINK_CLASS}>
              RSS feed →
            </a>
          </div>
        </section>

        {/* ================= WHO IS BEHIND IT ================= */}
        <section id="team" className={SECTION_CLASS}>
          <span className={EYEBROW_CLASS}>Who we are</span>
          <h2 className={H2_CLASS} style={H2_STYLE}>
            Who Is Behind It.
          </h2>
          <p className="max-w-[680px] text-ink-2 leading-[1.7]" style={PROSE_STYLE}>
            Quancis is owned and run by {ORG.owner}, from {ORG.address.region}, {ORG.address.country}. Write to us
            at{' '}
            <a href={`mailto:${ORG.email.business}`} className="border-b border-[#D5D5D1] font-medium text-ink transition-colors hover:border-ink">
              {ORG.email.business}
            </a>{' '}
            or on the{' '}
            <Link href={ROUTES.contact} className="border-b border-[#D5D5D1] font-medium text-ink transition-colors hover:border-ink">
              contact page
            </Link>
            . Our address is {ADDRESS_LINE}.
          </p>
        </section>

        <PlatformCta
          className="mt-[clamp(56px,9vh,96px)]"
          heading="Start with the API."
          body="The Quancis Developer Platform is where you create an account, get an API key, read the documentation and see the pricing. Sign-up is open to anyone while Kael is in beta."
        />
      </div>
    </div>
  );
}
