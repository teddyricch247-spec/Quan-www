import type { Metadata } from 'next';
import { Hero } from '../../components/Hero';
import { PlaceholderNote } from '../../components/PlaceholderNote';
import { EXTERNAL } from '../../lib/routes';

export const metadata: Metadata = {
  title: 'Quan Harness',
  description:
    'Built on Kael, the same composite intelligence behind the API. Point it at a codebase and it plans, writes, and finishes the work — not just suggests it.',
};

export default function HarnessPage() {
  return (
    <div className="w-full bg-white">
      <Hero
        accent="harness"
        eyebrow="Quan Harness"
        headline="An Agent That Ships."
        subhead="Built on Kael, the same composite intelligence behind the API. Point it at a codebase and it plans, writes, and finishes the work — not just suggests it."
        cta={{ label: 'Start With Harness', href: EXTERNAL.appHarness, external: true }}
      />

      {/* ================= WHAT IT DOES ================= */}
      <section className="px-[clamp(20px,5vw,48px)] py-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto">
          <span className="text-xs font-medium tracking-[0.14em] uppercase text-ink-3">What It Does</span>
          <h2
            className="mt-3.5 mb-6 font-medium text-ink leading-[1.14] tracking-[-0.032em]"
            style={{ fontSize: 'clamp(1.75rem, 3.3vw, 2.6rem)' }}
          >
            From Task To Shipped.
          </h2>
          <p className="max-w-[720px] text-ink-2 leading-[1.7]" style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.1875rem)' }}>
            Describe the change. Harness reads the codebase, plans the change, writes it, and checks its own work
            before handing it back — the same draft-then-check discipline that makes Kael what it is, applied to
            your repo.
          </p>
        </div>
      </section>

      {/* ================= POSITIONING ================= */}
      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto">
          <span className="text-xs font-medium tracking-[0.14em] uppercase text-ink-3">Positioning</span>
          <h2
            className="mt-3.5 mb-6 font-medium text-ink leading-[1.14] tracking-[-0.032em]"
            style={{ fontSize: 'clamp(1.75rem, 3.3vw, 2.6rem)' }}
          >
            Where It Fits.
          </h2>
          <p className="max-w-[720px] mb-6 text-ink-2 leading-[1.7]" style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.1875rem)' }}>
            If you&apos;ve used other coding agents, Harness will feel familiar to drive and different to trust — it
            inherits Kael&apos;s check-your-own-work step rather than handing back a first draft.
          </p>
          <PlaceholderNote label="Fill in" className="max-w-[720px]">
            your actual differentiation points once you have them — specific benchmarks or workflow details beat a
            general claim.
          </PlaceholderNote>
        </div>
      </section>

      {/* ================= SCREENSHOTS / DEMO ================= */}
      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto">
          <span className="text-xs font-medium tracking-[0.14em] uppercase text-ink-3">See It Work</span>
          <PlaceholderNote label="Placeholder" className="mt-3.5 max-w-[720px]">
            Product screenshots or a short demo clip.
          </PlaceholderNote>
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
              One subscription, unlimited use. See exact pricing on the app.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
              <a href={EXTERNAL.appHarness} className="btn-pill btn-pill-glass-light">
                Start With Harness
              </a>
              <a
                href={EXTERNAL.appPricing}
                className="text-[0.9375rem] font-medium text-ink-2 hover:text-ink transition-colors cursor-pointer"
              >
                See pricing →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
