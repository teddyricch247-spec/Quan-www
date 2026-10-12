import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '../../components/Hero';
import { AskAnything } from '../../components/AskAnything';
import { LowPolyScene } from '../../components/LowPolyScene';
import { ROUTES } from '../../lib/routes';
import { JsonLd } from '../../components/JsonLd';
import { NotOpenYet } from '../../components/NotOpenYet';
import { breadcrumbJsonLd, pageMetadata } from '../../lib/seo';

const CHAT_DESCRIPTION =
  'The same Kael behind the API and behind Harness, in a conversation. Quan Chat is built but not open to the public yet.';

export const metadata: Metadata = pageMetadata({
  title: 'Quan Chat — Kael In A Conversation',
  description: CHAT_DESCRIPTION,
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
      {/* No SoftwareApplication structured data on purpose: Chat is not open yet. Add it back at launch. */}
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Quan Chat', path: '/chat' },
          ]),
        ]}
      />
      <Hero
        accent="chat"
        eyebrow="Quan Chat · Not open to the public yet"
        headline="Kael, In A Conversation."
        subhead="The same Kael behind the API and behind Harness,, in a conversation."
      />

      {/* ================= COMPOSER PREVIEW ================= */}
      <section className="px-[clamp(20px,5vw,48px)] pt-[clamp(64px,10vh,110px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <AskAnything />
      </section>

      {/* ================= WHAT MAKES IT DIFFERENT ================= */}
      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-16 items-center">
          <div>
            <span className={EYEBROW}>What Makes It Different</span>
            <h2 className={H2_CLASS} style={H2_STYLE}>
              Built For Accuracy, Not Speed.
            </h2>
            <p className={`${PROSE_CLASS} mb-5`} style={PROSE_STYLE}>
              Most chat products are tuned to answer fast. Chat is Kael, the same Kael behind the API and Harness,
              and Kael is built to be right: it thinks before it answers, and it takes longer than most assistants
              because of it.
            </p>
            <p className={PROSE_CLASS} style={PROSE_STYLE}>
              Requests and answers can also be screened, so a harmful request or response can be stopped before it
              is delivered, not after.
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
            reply than the quickest assistants you have used. The composer above is a preview of how it will look: a
            deep-reasoning toggle for more thinking on a hard question, and a web toggle so it can look things up.
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
          <NotOpenYet
            product="Quan Chat"
            instead={
              <>
                Chat runs on Kael, which you can call directly today through the Kael API, and the{' '}
                <Link
                  href={ROUTES.demo}
                  className="border-b border-[#D5D5D1] font-medium text-ink transition-colors hover:border-ink"
                >
                  demos
                </Link>{' '}
                show what it produces.
              </>
            }
          />
        </div>
      </section>
    </div>
  );
}
