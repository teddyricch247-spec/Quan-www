import type { Metadata } from 'next';
import Link from 'next/link';
import { ROUTES } from '../../lib/routes';
import { pageMetadata } from '../../lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'About',
  description:
    'Quancis builds Kael, a composite intelligence, and the products people use it through. Where the name comes from and what we care about.',
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

const PRODUCTS: { name: string; line: string; href: string }[] = [
  { name: 'Kael', line: 'The model itself, behind an API.', href: ROUTES.kael },
  { name: 'Quan Harness', line: 'An agent that works on your codebase.', href: ROUTES.harness },
  { name: 'Quan Chat', line: 'Kael, in a conversation.', href: ROUTES.chat },
];

export default function AboutPage() {
  return (
    <div className="w-full bg-white px-[clamp(20px,5vw,48px)] pt-[clamp(56px,9vh,96px)] pb-[clamp(88px,14vh,150px)]">
      <div className="max-w-[760px] mx-auto">
        <span className="page-eyebrow">Quancis</span>
        <h1 className="page-title mt-3.5">About Quancis.</h1>
        <p className="page-lead mt-4">
          We build Kael, a composite intelligence, and the products people use it through.
        </p>

        {/* ================= THE NAME ================= */}
        <section id="name" className={SECTION_CLASS}>
          <span className={EYEBROW_CLASS}>The name</span>
          <h2 className={H2_CLASS} style={H2_STYLE}>
            One Intelligence. A Whole System Inside It.
          </h2>
          <p className="max-w-[680px] text-ink-2 leading-[1.7]" style={PROSE_STYLE}>
            Quancis comes from <em className="not-italic text-ink">quán</em>, the Chinese word for the whole.
            Kael works the same way: many intelligences, one answer. Behind each reply, a draft is written,
            checked against what you asked, and refined, and only the refined version reaches you.
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

        {/* ================= WHERE WE ARE ================= */}
        <section id="status" className={SECTION_CLASS}>
          <span className={EYEBROW_CLASS}>Where we are</span>
          <h2 className={H2_CLASS} style={H2_STYLE}>
            Kael Is In Beta.
          </h2>
          <p className="max-w-[680px] text-ink-2 leading-[1.7]" style={PROSE_STYLE}>
            Things will change as we learn from real use. The blog is where we share what changes.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link href={ROUTES.blog} className={LINK_CLASS}>
              Read the blog →
            </Link>
            <a href="/feed.xml" className={LINK_CLASS}>
              RSS feed →
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
