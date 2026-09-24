import type { Metadata } from 'next';
import { Hero } from '../../components/Hero';
import { AskAnything } from '../../components/AskAnything';
import { PlaceholderNote } from '../../components/PlaceholderNote';
import { EXTERNAL } from '../../lib/routes';

export const metadata: Metadata = {
  title: 'Quan Chat',
  description: 'The same composite intelligence behind the API and behind Harness — here, just talk to it.',
};

export default function ChatPage() {
  return (
    <div className="w-full bg-white">
      <Hero
        accent="chat"
        eyebrow="Quan Chat"
        headline="Kael, In A Conversation."
        subhead="The same composite intelligence behind the API and behind Harness — here, just talk to it."
      />

      {/* ================= LIVE DEMO ================= */}
      <section className="px-[clamp(20px,5vw,48px)] pt-[clamp(64px,10vh,110px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <AskAnything />
      </section>

      {/* ================= WHAT MAKES IT DIFFERENT ================= */}
      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto">
          <span className="text-xs font-medium tracking-[0.14em] uppercase text-ink-3">What Makes It Different</span>
          <h2
            className="mt-3.5 mb-6 font-medium text-ink leading-[1.14] tracking-[-0.032em]"
            style={{ fontSize: 'clamp(1.75rem, 3.3vw, 2.6rem)' }}
          >
            Not A Wrapper. The Whole System.
          </h2>
          <p className="max-w-[720px] mb-6 text-ink-2 leading-[1.7]" style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.1875rem)' }}>
            Most chat products sit in front of one model and hope. Chat sits in front of the same draft-then-check
            system that powers Kael and Harness — every answer gets checked before it reaches you.
          </p>
          <PlaceholderNote label="Fill in" className="max-w-[720px]">
            specific differentiation vs. ChatGPT/Claude.ai once you have concrete points — feature-level specifics
            land better than a general claim.
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
              One subscription, unlimited conversations. See exact pricing on the app.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
              <a href={EXTERNAL.appChat} className="btn-pill btn-pill-glass-light">
                Start Chatting
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
