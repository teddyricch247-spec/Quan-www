import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '../../components/Hero';
import { AskAnything } from '../../components/AskAnything';
import { LowPolyScene } from '../../components/LowPolyScene';
import { EXTERNAL, ROUTES } from '../../lib/routes';
import { ACCENT_GLASS_DARK_CLASS } from '../../lib/accents';
import { pageMetadata } from '../../lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Quan Chat',
  description: 'The same composite intelligence behind the API and behind Harness — here, just talk to it.',
  path: '/chat',
});

const EYEBROW = 'text-xs font-medium tracking-[0.14em] uppercase text-ink-3';
const H2_CLASS = 'mt-3.5 mb-6 font-medium text-ink leading-[1.14] tracking-[-0.032em]';
const H2_STYLE = { fontSize: 'clamp(1.75rem, 3.3vw, 2.6rem)' } as const;
const PROSE_CLASS = 'max-w-[720px] text-ink-2 leading-[1.7]';
const PROSE_STYLE = { fontSize: 'clamp(1.0625rem, 1.4vw, 1.1875rem)' } as const;

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
        <div className="max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-16 items-center">
          <div>
            <span className={EYEBROW}>What Makes It Different</span>
            <h2 className={H2_CLASS} style={H2_STYLE}>
              Not One Model Guessing. A Whole System.
            </h2>
            <p className={`${PROSE_CLASS} mb-5`} style={PROSE_STYLE}>
              Most chat products put one model in front of you and hope for the best. Chat sits in front of the
              same draft-then-check system that powers Kael and Harness: behind each answer, a draft is written,
              checked against what you asked, and refined, and only the refined version reaches you.
            </p>
            <p className={PROSE_CLASS} style={PROSE_STYLE}>
              The system also looks at what comes in and what goes out, so a harmful request or response can be
              stopped before it is delivered, not after.
            </p>
          </div>
          <div className="h-[280px] sm:h-[340px] lg:h-[380px]">
            <LowPolyScene variant="pulse" accent="chat" />
          </div>
        </div>
      </section>

      {/* ================= ACCURACY OVER SPEED ================= */}
      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto">
          <span className={EYEBROW}>Accuracy Over Speed</span>
          <h2 className={H2_CLASS} style={H2_STYLE}>
            It Thinks Before It Answers.
          </h2>
          <p className={PROSE_CLASS} style={PROSE_STYLE}>
            Chat is built for getting the answer right, not for getting it first. That means it can take longer to
            reply than the quickest assistants you have used. The deep-reasoning toggle in the composer above lets
            you ask for more thinking on a hard question, and the web toggle lets it look things up.
          </p>
          <p className={`${PROSE_CLASS} mt-5`} style={PROSE_STYLE}>
            Because Chat runs on Kael, it is strongest at the same things Kael is: coding, security, software
            engineering, agentic work and math. It can write stories and other creative text, but that is not
            what it is tuned for, and Kael is currently built for English.
          </p>
          <Link
            href={ROUTES.kael}
            className="inline-block mt-8 text-[0.9375rem] font-medium text-ink border-b border-[#D5D5D1] hover:border-ink transition-colors cursor-pointer pb-0.5"
          >
            More about Kael →
          </Link>
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
              <a href={EXTERNAL.appChat} className={`btn-pill btn-pill-glass-dark ${ACCENT_GLASS_DARK_CLASS.chat}`}>
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
