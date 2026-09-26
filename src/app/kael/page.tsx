import type { Metadata } from 'next';
import { Hero } from '../../components/Hero';
import { PlaceholderNote } from '../../components/PlaceholderNote';
import { CodeIntegration } from '../../components/CodeIntegration';
import { LowPolyScene } from '../../components/LowPolyScene';
import { EXTERNAL } from '../../lib/routes';
import { ACCENT_GLASS_DARK_CLASS } from '../../lib/accents';

export const metadata: Metadata = {
  title: 'Kael',
  description:
    "Kael outperforms every AI model that has EVER existed at coding, mathematics, and agentic work — behind an API you already know how to call.",
};

export default function KaelPage() {
  return (
    <div className="w-full bg-white">
      <Hero
        accent="red"
        eyebrow="The Model"
        headline="The World's First Composite Intelligence."
        subhead={
          <>
            Kael outperforms every AI model that has <span className="highlight-ever text-white">EVER</span> existed
            at coding, mathematics, and agentic work — behind an API you already know how to call.
          </>
        }
        cta={{ label: 'Get API Access', href: EXTERNAL.platform, external: true }}
      />

      {/* ================= HOW IT WORKS ================= */}
      <section className="px-[clamp(20px,5vw,48px)] py-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-16 items-center mb-[clamp(48px,7vh,72px)]">
            <div>
              <span className="text-xs font-medium tracking-[0.14em] uppercase text-ink-3">How It Works</span>
              <h2
                className="mt-3.5 mb-6 font-medium text-ink leading-[1.14] tracking-[-0.032em]"
                style={{ fontSize: 'clamp(1.75rem, 3.3vw, 2.6rem)' }}
              >
                Not One Model. A System Of Them.
              </h2>
              <p className="max-w-[620px] text-ink-2 leading-[1.7]" style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.1875rem)' }}>
                Most AI companies ship one model and call it a day. Kael is a system: a draft is produced, then
                checked, then refined, by a coordinated set of specialist intelligences working as one — the same
                way a great company works. You call one API. Behind it, a whole system does the work.
              </p>
            </div>
            <div className="h-[280px] sm:h-[340px] lg:h-[380px]">
              <LowPolyScene variant="orbit" accent="red" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-[1160px]">
            {[
              {
                n: '01',
                title: 'Draft',
                body: 'A first pass at the answer gets produced — the same way any single model would attempt it.',
              },
              {
                n: '02',
                title: 'Check',
                body: 'That draft is reviewed against the request before it ever reaches you, catching what a single pass tends to miss.',
              },
              {
                n: '03',
                title: 'Refine',
                body: 'The system corrects what the check found, and only the refined result comes back as the response.',
              },
            ].map((step) => (
              <div key={step.n} className="rounded-2xl border border-line bg-white p-6">
                <span className="font-mono text-xs text-ink-3">{step.n}</span>
                <h3 className="mt-3 mb-2 text-[1.0625rem] font-medium text-ink">{step.title}</h3>
                <p className="text-sm leading-[1.6] text-ink-2">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BENCHMARKS ================= */}
      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto">
          <span className="text-xs font-medium tracking-[0.14em] uppercase text-ink-3">Benchmarks</span>
          <h2
            className="mt-3.5 mb-6 font-medium text-ink leading-[1.14] tracking-[-0.032em]"
            style={{ fontSize: 'clamp(1.75rem, 3.3vw, 2.6rem)' }}
          >
            How Kael Compares.
          </h2>
          <PlaceholderNote label="Placeholder" className="max-w-[720px]">
            Insert real benchmark numbers and comparisons once available — no figures invented here.
          </PlaceholderNote>
        </div>
      </section>

      {/* ================= INTEGRATION ================= */}
      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto">
          <CodeIntegration />
          <a
            href={EXTERNAL.platformDocs}
            className="inline-block mt-8 text-[0.9375rem] font-medium text-ink border-b border-[#D5D5D1] hover:border-ink transition-colors cursor-pointer pb-0.5"
          >
            Full docs and code samples →
          </a>
        </div>
      </section>

      {/* ================= CLOSING CTA BAND ================= */}
      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,14vh,150px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto">
          <div className="rounded-[28px] bg-surface px-[clamp(28px,6vw,64px)] py-[clamp(48px,8vh,76px)] text-center">
            <p
              className="mx-auto max-w-[560px] text-ink-2 leading-[1.6]"
              style={{ fontSize: 'clamp(1.0625rem, 1.3vw, 1.1875rem)' }}
            >
              Simple, usage-based pricing. Pay for what you use, see the exact numbers on the console.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href={EXTERNAL.platformPricing} className={`btn-pill btn-pill-glass-dark ${ACCENT_GLASS_DARK_CLASS.red}`}>
                See Pricing
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
