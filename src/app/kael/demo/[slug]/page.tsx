import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { DemoCard } from '../../../../components/demos/DemoCard';
import { DemoCover } from '../../../../components/demos/DemoCover';
import { GameFrame } from '../../../../components/demos/GameFrame';
import { Provenance } from '../../../../components/demos/Provenance';
import { JsonLd } from '../../../../components/JsonLd';
import { ORIGINS, getAllDemos, getDemoBySlug, type DemoControl } from '../../../../data/demos';
import { ROUTES, demoFileUrl, demoPath } from '../../../../lib/routes';
import { SITE_NAME, SITE_URL, absoluteUrl, breadcrumbJsonLd } from '../../../../lib/seo';
import { getDemoFileStats } from '../../../../lib/demoFiles';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// One statically generated page per demo, from src/data/demos.ts. An unknown
// slug 404s instead of rendering on demand, the same as /blog/[slug].
export function generateStaticParams() {
  return getAllDemos().map((demo) => ({ slug: demo.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const demo = getDemoBySlug(slug);
  if (!demo) return {};
  const path = demoPath(demo.slug);
  const title = `${demo.title}, a Kael demo`;
  const social = `${title} | ${SITE_NAME}`;
  // Each demo can name its own 1200x630 share image (public/og/). It is set
  // here rather than as an opengraph-image file because a file in this
  // folder would apply to every demo, the same reason the blog does it.
  const image = demo.ogImage
    ? { url: demo.ogImage, width: 1200, height: 630, alt: `${demo.title}, a Kael demo` }
    : { url: '/og/default.png', width: 1200, height: 630, alt: 'Quancis' };
  return {
    title,
    description: demo.summary,
    alternates: { canonical: path },
    openGraph: {
      title: social,
      description: demo.summary,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      type: 'website',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: social,
      description: demo.summary,
      images: [image.url],
    },
  };
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(d);
}

const LINK_CLASS =
  'inline-block border-b border-[#D5D5D1] pb-0.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink cursor-pointer';

function ControlList({ title, items }: { title: string; items: DemoControl[] }) {
  return (
    <div className="p-7 sm:p-8">
      <h3 className="m-0 mb-5 text-[1.0625rem] font-medium text-ink">{title}</h3>
      <ul className="m-0 flex list-none flex-col gap-4 p-0">
        {items.map((c) => (
          <li key={c.input} className="flex flex-col gap-1.5 text-[0.9375rem] leading-[1.6] text-ink-2">
            <span>
              <span className="mono-pill">{c.input}</span>
            </span>
            <span>{c.action}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function DemoPage({ params }: PageProps) {
  const { slug } = await params;
  const demo = getDemoBySlug(slug);
  if (!demo) {
    notFound();
    return null;
  }

  const stats = getDemoFileStats(demo.file);
  const others = getAllDemos().filter((d) => d.slug !== demo.slug);
  const fileHref = demoFileUrl(demo.file);
  const url = `${SITE_URL}${demoPath(demo.slug)}`;

  const gameJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: demo.title,
    description: demo.summary,
    url,
    datePublished: demo.date,
    gamePlatform: 'Web browser',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };

  const spec: { term: string; body: string }[] = [
    { term: 'Format', body: 'A single self-contained HTML file' },
    ...(stats ? [{ term: 'Size', body: `${stats.lines} lines, ${stats.kb} KB` }] : []),
    { term: 'Built with', body: demo.tech.join(', ') },
    { term: 'Saves', body: demo.storage },
    { term: 'Published', body: formatDate(demo.date) },
  ];

  return (
    <article className="w-full bg-white px-[clamp(20px,5vw,48px)] pb-[clamp(88px,14vh,150px)] pt-[clamp(40px,6vh,64px)]">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: ROUTES.home },
            { name: 'Kael', path: ROUTES.kael },
            { name: 'Demos', path: ROUTES.demo },
            { name: demo.title, path: demoPath(demo.slug) },
          ]),
          gameJsonLd,
        ]}
      />
      <div className="mx-auto max-w-[1160px]">
        <Link
          href={ROUTES.demo}
          className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-ink-2 transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Demos
        </Link>

        {/* ================= HEADER ================= */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="badge-pill">{ORIGINS[demo.origin].label}</span>
          {demo.tags.map((tag) => (
            <span key={tag} className="badge-pill badge-pill-neutral">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="page-title mt-4">{demo.title}.</h1>
        <p className="page-lead mt-4">{demo.tagline}</p>

        {/* ================= PLAYER ================= */}
        <div className="mt-10">
          <GameFrame src={fileHref} fileHref={fileHref} title={demo.title}>
            <DemoCover demo={demo} className="h-full" />
          </GameFrame>
          <p className="mb-0 mt-5 max-w-[720px] text-sm leading-[1.65] text-ink-3">
            Playing loads its libraries from {demo.cdnHosts.join(' and ')}, a public CDN, so that host sees the
            request like any other
            {demo.cdnFallbacks && demo.cdnFallbacks.length > 0
              ? ` (and, only if that fails, ${demo.cdnFallbacks.join(' and ')})`
              : ''}
            . Nothing you do in the game is sent to us. The downloaded file does the same when you open it.
          </p>
        </div>

        {/* ================= ABOUT + SPEC ================= */}
        <div className="mt-[clamp(56px,9vh,96px)] grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-[1.3fr_0.7fr]">
          <section id="about" className="scroll-mt-[100px]">
            <span className="page-eyebrow">About</span>
            <h2
              className="mb-6 mt-3.5 font-medium leading-[1.14] tracking-[-0.032em] text-ink"
              style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)' }}
            >
              What You’re Playing.
            </h2>
            <div className="flex max-w-[680px] flex-col gap-5">
              {demo.description.map((paragraph, i) => (
                <p key={i} className="m-0 leading-[1.75] text-ink-2" style={{ fontSize: '1.0625rem' }}>
                  {paragraph}
                </p>
              ))}
            </div>

            <h3 className="mb-4 mt-10 text-[1.0625rem] font-medium text-ink">What’s in it</h3>
            <ul className="m-0 flex max-w-[680px] list-none flex-col gap-3 p-0">
              {demo.highlights.map((line) => (
                <li key={line} className="flex items-start gap-3 text-[0.9375rem] leading-[1.6] text-ink-2">
                  <span className="mt-[0.55rem] h-1.5 w-1.5 flex-none bg-accent-red" aria-hidden="true" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>

          <aside aria-label="Details">
            <dl className="m-0 border-t border-line">
              {spec.map((row) => (
                <div key={row.term} className="grid grid-cols-[0.45fr_1fr] gap-x-6 border-b border-line py-4">
                  <dt className="text-sm font-medium text-ink">{row.term}</dt>
                  <dd className="m-0 text-sm leading-[1.6] text-ink-2">{row.body}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        {/* ================= CONTROLS ================= */}
        <section id="controls" className="mt-[clamp(56px,9vh,96px)] scroll-mt-[100px]">
          <span className="page-eyebrow">Controls</span>
          <h2
            className="mb-6 mt-3.5 font-medium leading-[1.14] tracking-[-0.032em] text-ink"
            style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)' }}
          >
            How To Play.
          </h2>
          <div className="card-panel overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <ControlList title="Keyboard and mouse" items={demo.controls.desktop} />
              <div className="border-t border-line-soft bg-surface md:border-l md:border-t-0">
                <ControlList title="Touch" items={demo.controls.touch} />
              </div>
            </div>
          </div>
        </section>

        {/* ================= HOW IT WAS MADE ================= */}
        <section id="how" className="mt-[clamp(56px,9vh,96px)] scroll-mt-[100px]">
          <Provenance origin={demo.origin} variant="compact" />
        </section>

        {/* ================= MORE DEMOS ================= */}
        {others.length > 0 ? (
          <section id="more" className="mt-[clamp(56px,9vh,96px)] scroll-mt-[100px]">
            <span className="page-eyebrow">More</span>
            <h2
              className="mb-8 mt-3.5 font-medium leading-[1.14] tracking-[-0.032em] text-ink"
              style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)' }}
            >
              More Demos.
            </h2>
            <ul className="m-0 grid list-none grid-cols-1 gap-x-10 gap-y-12 p-0 md:grid-cols-2">
              {others.map((other) => (
                <li key={other.slug}>
                  <DemoCard demo={other} />
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Link href={ROUTES.demo} className={LINK_CLASS}>
                All demos →
              </Link>
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
