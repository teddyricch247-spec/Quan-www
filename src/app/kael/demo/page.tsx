import type { Metadata } from 'next';
import Link from 'next/link';
import { DemoCard } from '../../../components/demos/DemoCard';
import { Provenance } from '../../../components/demos/Provenance';
import { Section, Eyebrow, H2, Prose } from '../../../components/Section';
import { JsonLd } from '../../../components/JsonLd';
import { getAllDemos } from '../../../data/demos';
import { EXTERNAL, ROUTES, demoPath } from '../../../lib/routes';
import { ACCENT_GLASS_DARK_CLASS } from '../../../lib/accents';
import { SITE_URL, breadcrumbJsonLd, pageMetadata } from '../../../lib/seo';
import { getDemoFileStats } from '../../../lib/demoFiles';

export const metadata: Metadata = pageMetadata({
  title: 'Kael Demos',
  description:
    'Playable 3D games that Kael wrote in a chat window, with no building tools, as single HTML files. Play them in your browser.',
  path: ROUTES.demo,
});

// Statically generated: the list, the cards and the file sizes are all read
// from src/data/demos.ts and public/demo-files/ at build time.
export default function DemoHubPage() {
  const demos = getAllDemos();

  const listJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Kael demos',
    itemListElement: demos.map((demo, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: demo.title,
      url: `${SITE_URL}${demoPath(demo.slug)}`,
    })),
  };

  return (
    <div className="w-full bg-white">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: ROUTES.home },
            { name: 'Kael', path: ROUTES.kael },
            { name: 'Demos', path: ROUTES.demo },
          ]),
          listJsonLd,
        ]}
      />

      {/* ================= HEADER ================= */}
      <header className="px-[clamp(20px,5vw,48px)] pb-[clamp(48px,7vh,72px)] pt-[clamp(56px,9vh,96px)]">
        <div className="mx-auto max-w-[1160px]">
          <span className="page-eyebrow">Kael · Demos</span>
          <h1 className="page-title mt-3.5">Built In Chat.</h1>
          <p className="page-lead mt-4" style={{ maxWidth: 640 }}>
            Playable 3D games that Kael wrote in a chat window, with no building tools, each as a single HTML
            file. Play them here, in your browser.
          </p>
          <p className="mb-0 mt-5 text-sm text-ink-3">
            <a
              href="#how"
              className="border-b border-[#D5D5D1] pb-0.5 text-ink-2 transition-colors hover:border-ink hover:text-ink cursor-pointer"
            >
              How they were made
            </a>
          </p>
        </div>
      </header>

      {/* ================= THE DEMOS ================= */}
      <Section id="demos">
        <ul className="m-0 grid list-none grid-cols-1 gap-x-10 gap-y-14 p-0 md:grid-cols-2">
          {demos.map((demo) => (
            <li key={demo.slug}>
              <DemoCard demo={demo} />
              <FileFacts file={demo.file} />
            </li>
          ))}
        </ul>
      </Section>

      {/* ================= HOW THEY WERE MADE ================= */}
      <Section id="how">
        <Eyebrow>How they were made</Eyebrow>
        <H2>Just A Chat Window.</H2>
        <Prose className="mb-10">
          Every demo here was made in a conversation with Kael. Kael had no building tools, and wrote each
          one as a single HTML file, as text in the chat. What you play is that file.
        </Prose>
        <Provenance origin="kael-chat" />
      </Section>

      {/* ================= WHAT THIS SHOWS ================= */}
      <Section id="what-it-shows">
        <Eyebrow>What this shows</Eyebrow>
        <H2>A Demo Is Not A Benchmark.</H2>
        <Prose>
          These show something Kael wrote, not how often it gets things right, and we aren’t publishing numbers
          we ran ourselves. Independent results come first; when results exist, we plan to share them on the
          Kael page.
        </Prose>
        <Prose className="mt-5">
          We’ll add more demos here as we make them. The best test is still your own prompt.
        </Prose>
        <Link
          href={`${ROUTES.kael}#benchmarks`}
          className="mt-8 inline-block border-b border-[#D5D5D1] pb-0.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink cursor-pointer"
        >
          Benchmarks on the Kael page →
        </Link>
      </Section>

      {/* ================= CLOSING CTA BAND ================= */}
      <section className="scroll-mt-[100px] px-[clamp(20px,5vw,48px)] pb-[clamp(88px,14vh,150px)]">
        <div className="mx-auto max-w-[1160px]">
          <div className="rounded-[28px] bg-surface px-[clamp(28px,6vw,64px)] py-[clamp(48px,8vh,76px)] text-center">
            <p
              className="mx-auto max-w-[560px] leading-[1.6] text-ink-2"
              style={{ fontSize: 'clamp(1.0625rem, 1.3vw, 1.1875rem)' }}
            >
              Want to see what Kael does with your own prompt? Call it from your code, or talk to it in Quan
              Chat.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href={EXTERNAL.platform} className={`btn-pill btn-pill-glass-dark ${ACCENT_GLASS_DARK_CLASS.red}`}>
                Get API Access
              </a>
              <Link
                href={ROUTES.chat}
                className="cursor-pointer text-[0.9375rem] font-medium text-ink-2 transition-colors hover:text-ink"
              >
                About Quan Chat →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/** "2,725 lines · 90 KB · single HTML file", read from the file itself. */
function FileFacts({ file }: { file: string }) {
  const stats = getDemoFileStats(file);
  if (!stats) return null;
  return (
    <p className="mb-0 mt-3 text-sm text-ink-3">
      Single HTML file · {stats.lines} lines · {stats.kb} KB
    </p>
  );
}
