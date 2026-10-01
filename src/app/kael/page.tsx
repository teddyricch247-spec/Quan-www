import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Minus } from 'lucide-react';
import { Hero } from '../../components/Hero';
import { CodeIntegration } from '../../components/CodeIntegration';
import { LowPolyScene } from '../../components/LowPolyScene';
import { Section, Eyebrow, H2, H3, Prose } from '../../components/Section';
import { SpecSheet } from '../../components/kael/SpecSheet';
import { PipelineSteps } from '../../components/kael/PipelineSteps';
import { ThinkingLevels } from '../../components/kael/ThinkingLevels';
import { PricingTable } from '../../components/kael/PricingTable';
import { Faq } from '../../components/kael/Faq';
import { EXTERNAL, ROUTES } from '../../lib/routes';
import { ACCENT_GLASS_DARK_CLASS } from '../../lib/accents';
import { pageMetadata } from '../../lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Kael',
  description:
    'Kael is a composite intelligence system built for accurate coding, security, math and agentic work, behind an API that works with the SDKs you already use.',
  path: '/kael',
});

const ON_THIS_PAGE: { href: string; label: string }[] = [
  { href: '#overview', label: 'Overview' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#strengths', label: 'Strengths' },
  { href: '#thinking', label: 'Thinking' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#benchmarks', label: 'Benchmarks' },
  { href: '#data', label: 'Your data' },
  { href: '#integration', label: 'Integration' },
  { href: '#faq', label: 'FAQ' },
];

const STRENGTHS: { title: string; body: string }[] = [
  {
    title: 'Coding',
    body: 'Kael is built to write code with fewer bugs, and to catch the bugs that are already there. The check step reads a draft against your request before you see it, so a mistake a single pass would have shipped is more likely to be caught first.',
  },
  {
    title: 'Security',
    body: 'It catches security vulnerabilities in existing code, and it aims not to introduce them in the first place. Both matter: a model that only finds problems after writing them has already cost you a review cycle.',
  },
  {
    title: 'Software engineering',
    body: 'Real engineering tasks, like the distributed-cache refactor in the example below, not just single functions. These are the jobs where a small wrong assumption early on spreads through everything built on top of it.',
  },
  {
    title: 'Agentic work',
    body: 'Long, multi-step tasks where the model acts on its own earlier output. Accuracy matters more here than anywhere, because one wrong step is carried into every step after it.',
  },
  {
    title: 'Math',
    body: 'Multi-step reasoning where the answer has to hold up, not just look plausible. Higher thinking levels give Kael more room to work a problem through before it answers.',
  },
];

const REACH_FOR: string[] = [
  'You care more about a correct answer than a fast one.',
  'The work is code review, debugging, refactoring or security review.',
  'An agent will act on the output, and a wrong step is expensive.',
  'You already call a chat API and want to change as little as possible.',
  'Your work is in English.',
];

const LOOK_ELSEWHERE: string[] = [
  'You need the fastest possible response. Kael thinks longer than most models, on purpose.',
  'The work is writing-first: fiction, marketing copy, anything where style is the point.',
  'You need to send PDFs, video or other file types today. The beta takes text and images.',
  'You need a language other than English. Other languages have not been tested.',
  'You need weights you can download or run yourself. Kael is closed.',
];

export default function KaelPage() {
  return (
    <div className="w-full bg-white">
      <Hero
        accent="red"
        eyebrow="Kael, in beta"
        headline="The World's First Composite Intelligence."
        subhead="Kael is a system of specialist models that drafts, checks and refines every answer before it reaches you. It is built to catch bugs, security holes and wrong answers early, behind an API you already know how to call."
        cta={{ label: 'Get API Access', href: EXTERNAL.platform, external: true }}
        secondaryCta={{ label: 'Read the docs', href: EXTERNAL.platformDocs, external: true }}
      />

      {/* ================= OVERVIEW ================= */}
      <Section id="overview" pad="first">
        <nav aria-label="On this page" className="mb-[clamp(40px,6vh,64px)]">
          <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-[0.9375rem]">
            {ON_THIS_PAGE.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-ink-2 border-b border-transparent pb-0.5 transition-colors hover:border-ink hover:text-ink cursor-pointer"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Eyebrow>Overview</Eyebrow>
        <H2>The Facts, Up Front.</H2>
        <Prose className="mb-10">
          Everything you need to decide whether Kael fits, before the explanation. Limits, formats, what it
          accepts and what it does not. Each item below is covered in more detail further down the page.
        </Prose>
        <SpecSheet />
      </Section>

      {/* ================= HOW IT WORKS ================= */}
      <Section id="how-it-works">
        <div className="mb-[clamp(48px,7vh,72px)] grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <Eyebrow>How It Works</Eyebrow>
            <H2>Not One Model. A System Of Them.</H2>
            <Prose>
              Most AI companies ship one model and call it a day. Kael is a system, and we call it the Composite
              Intelligence System, or CIS. Behind a single API call, fine-tuned language models, small language
              models, retrieval and other specialist models work together as one: a draft is produced, then
              checked, then refined, the way a good engineering team works.
            </Prose>
            <Prose className="mt-5">
              You never see any of it. The request and the response look exactly like any other chat model’s: the
              same endpoints, the same message format, the same SDKs. The system is the part you don’t have to
              learn.
            </Prose>
          </div>
          <div className="h-[280px] sm:h-[340px] lg:h-[380px]">
            <LowPolyScene variant="orbit" accent="red" />
          </div>
        </div>

        <PipelineSteps />

        <div className="mt-[clamp(64px,9vh,104px)] grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
          <div>
            <H3>Why a system, not a bigger model</H3>
            <p className="mb-0 mt-3 max-w-[560px] text-[0.9375rem] leading-[1.7] text-ink-2">
              Models keep getting smarter, but not more accurate. The gap between impressive and correct is where
              bugs, vulnerabilities and confident wrong answers live. We believe the next gains come from systems
              of models checking one another, not from one ever-larger model, and that this holds well beyond
              coding.
            </p>
          </div>
          <div>
            <H3>Checked on the way in and the way out</H3>
            <p className="mb-0 mt-3 max-w-[560px] text-[0.9375rem] leading-[1.7] text-ink-2">
              CIS sees your request and the response before the response is sent. If something harmful is in
              either one, the system can stop it before it goes anywhere, instead of cleaning up after the fact.
            </p>
          </div>
          <div>
            <H3>Built on open-weight models, tuned for the system</H3>
            <p className="mb-0 mt-3 max-w-[560px] text-[0.9375rem] leading-[1.7] text-ink-2">
              Kael is not trained from scratch. Its models start from open-weight models and are fine-tuned so each
              one understands the environment it runs in and works properly inside CIS. The tuning data came from
              an earlier internal version of Kael and was not meant to add knowledge. It is the same idea as tuning
              a model to call tools more reliably. The weights are not released.
            </p>
          </div>
          <div>
            <H3>Your system prompt stays yours</H3>
            <p className="mb-0 mt-3 max-w-[560px] text-[0.9375rem] leading-[1.7] text-ink-2">
              A system with its own internal instructions and skills has a problem a single model doesn’t: your
              system prompt and ours can compete for authority. It was the hardest problem we solved, and the
              reason we tuned the models themselves instead of only wrapping them. You write your system prompt
              the way you would for any other model.
            </p>
          </div>
          <div className="md:col-span-2">
            <H3>Efficient inside</H3>
            <p className="mb-0 mt-3 max-w-[720px] text-[0.9375rem] leading-[1.7] text-ink-2">
              Running a whole system costs more tokens inside than running one model, and a lot of them are spent
              before an answer comes out. We put real effort into optimising CIS to keep output quality as high as
              possible while keeping that internal cost down.
            </p>
          </div>
        </div>
      </Section>

      {/* ================= STRENGTHS ================= */}
      <Section id="strengths">
        <Eyebrow>Strengths</Eyebrow>
        <H2>Where Kael Is Strongest.</H2>
        <Prose className="mb-10">
          Kael is built for people who want accuracy more than speed, and it shows most in technical work. These
          are the jobs it is tuned for.
        </Prose>

        <dl className="m-0 border-t border-line">
          {STRENGTHS.map((item) => (
            <div
              key={item.title}
              className="grid grid-cols-1 gap-x-10 gap-y-2 border-b border-line py-7 md:grid-cols-[0.55fr_1.45fr]"
            >
              <dt className="text-[1.0625rem] font-medium text-ink">{item.title}</dt>
              <dd className="m-0 max-w-[680px] text-[0.9375rem] leading-[1.7] text-ink-2">{item.body}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-[clamp(48px,7vh,72px)]">
          <H3>Is Kael the right fit?</H3>
          <p className="mb-6 mt-3 max-w-[620px] text-[0.9375rem] leading-[1.7] text-ink-2">
            It is not built for everything, and we would rather say so plainly. Kael can write a story, but that is
            not what it is tuned for.
          </p>
          <div className="card-panel overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-7 sm:p-8">
                <h4 className="m-0 mb-4 text-[1.0625rem] font-medium text-ink">Reach for Kael when</h4>
                <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
                  {REACH_FOR.map((line) => (
                    <li key={line} className="flex items-start gap-3 text-[0.9375rem] leading-[1.6] text-ink-2">
                      <Check className="mt-1 h-4 w-4 flex-none text-accent-red" strokeWidth={2} aria-hidden="true" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-line-soft bg-surface p-7 sm:p-8 md:border-l md:border-t-0">
                <h4 className="m-0 mb-4 text-[1.0625rem] font-medium text-ink">Look elsewhere when</h4>
                <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
                  {LOOK_ELSEWHERE.map((line) => (
                    <li key={line} className="flex items-start gap-3 text-[0.9375rem] leading-[1.6] text-ink-2">
                      <Minus className="mt-1 h-4 w-4 flex-none text-ink-3" strokeWidth={2} aria-hidden="true" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ================= THINKING ================= */}
      <Section id="thinking">
        <Eyebrow>Thinking</Eyebrow>
        <H2>Accuracy Takes Time. Here Is How Much.</H2>
        <Prose>
          Kael is slower than most models on purpose. It has five thinking levels, and you choose how much
          thinking a request gets. Pick a level to see what it costs and where it fits.
        </Prose>
        <Prose className="mb-10 mt-5">
          With thinking on, at any level, Kael takes about 2.2 times as long to think as an average AI model.
          Once it starts writing, the answer streams out between 220 and 340 tokens per second. With thinking
          switched off completely, the first word usually arrives within 0.7 to 3 seconds, at roughly 90 to 140
          tokens per second.
        </Prose>
        <ThinkingLevels />
      </Section>

      {/* ================= PRICING ================= */}
      <Section id="pricing">
        <Eyebrow>Pricing</Eyebrow>
        <H2>Pay For What You Use.</H2>
        <Prose className="mb-10">
          Pricing is usage-based, per million tokens. The three levels you can use today cost the same. The Z
          levels, when they launch, cost more because they send requests through a different internal route that
          produces better results.
        </Prose>
        <PricingTable />
        <div className="mt-8">
          <a
            href={EXTERNAL.platformPricing}
            className="inline-block border-b border-[#D5D5D1] pb-0.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink cursor-pointer"
          >
            See live pricing on the console →
          </a>
        </div>
      </Section>

      {/* ================= BENCHMARKS ================= */}
      <Section id="benchmarks">
        <Eyebrow>Benchmarks</Eyebrow>
        <H2>Independent Results First.</H2>
        <Prose>
          We haven’t published benchmark numbers for Kael yet, and we aren’t publishing numbers we ran ourselves.
          Independent evaluations, including the Artificial Analysis Intelligence Index, are in progress. When
          results come in, we plan to share them here.
        </Prose>
        <Prose className="mt-5">
          Until then, the best test is your own. Because Kael is a base-URL change, you can point the SDK you
          already use at it and run your hardest prompts in a few minutes.
        </Prose>
      </Section>

      {/* ================= YOUR DATA ================= */}
      <Section id="data">
        <Eyebrow>Your data</Eyebrow>
        <H2>What We Keep, And For How Long.</H2>
        <Prose className="mb-10">
          We don’t need your data. Kael isn’t trained on it, so there is nothing for us to gain from holding on to
          it. Here is exactly what we do keep.
        </Prose>

        <dl className="m-0 border-t border-line">
          {[
            {
              term: 'Normal requests',
              body: 'Held for up to 15 minutes so cache hits can be calculated. After that, they are not stored in a database.',
            },
            {
              term: 'Flagged requests',
              body: 'If the safety system flags a request or a response as harmful, we keep it until our support team has reviewed it. We do this to improve the safety system, and to keep a record in case of a dispute, for example when an account has been blocked or suspended and the account holder contacts us.',
            },
            {
              term: 'Training',
              body: 'Your requests are not used to train Kael. Its models start from open-weight models and are tuned on data generated by an earlier internal version of Kael.',
            },
          ].map((row) => (
            <div
              key={row.term}
              className="grid grid-cols-1 gap-x-10 gap-y-2 border-b border-line py-7 md:grid-cols-[0.55fr_1.45fr]"
            >
              <dt className="text-[1.0625rem] font-medium text-ink">{row.term}</dt>
              <dd className="m-0 max-w-[680px] text-[0.9375rem] leading-[1.7] text-ink-2">{row.body}</dd>
            </div>
          ))}
        </dl>

        <p className="mb-0 mt-6 max-w-[720px] text-sm leading-[1.65] text-ink-3">
          This is a plain-language summary. The{' '}
          <a
            href={EXTERNAL.platformPrivacy}
            className="border-b border-[#D5D5D1] text-ink-2 transition-colors hover:border-ink hover:text-ink cursor-pointer"
          >
            Privacy Policy
          </a>{' '}
          is the binding document.
        </p>
      </Section>

      {/* ================= INTEGRATION ================= */}
      <Section id="integration">
        <CodeIntegration />
        <a
          href={EXTERNAL.platformDocs}
          className="mt-8 inline-block border-b border-[#D5D5D1] pb-0.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink cursor-pointer"
        >
          Full docs and code samples →
        </a>
      </Section>

      {/* ================= WHERE TO USE IT ================= */}
      <Section id="where">
        <Eyebrow>Where to use it</Eyebrow>
        <H2>One System, Three Ways In.</H2>
        <Prose className="mb-10">
          The same Kael is behind all three. Pick the one that matches how you work.
        </Prose>
        <dl className="m-0 border-t border-line">
          {[
            {
              term: 'The API',
              body: 'For developers and teams who already call a model from their own software. This is the page you are on.',
              href: EXTERNAL.platform,
              external: true,
              cta: 'Developer platform',
            },
            {
              term: 'Quan Harness',
              body: 'Our coding agent, built on Kael. It works inside a real project environment with a file system, live preview and git.',
              href: ROUTES.harness,
              external: false,
              cta: 'About Harness',
            },
            {
              term: 'Quan Chat',
              body: 'Kael in a conversation, with deep reasoning and web access you can switch on from the composer.',
              href: ROUTES.chat,
              external: false,
              cta: 'About Chat',
            },
          ].map((row) => (
            <div
              key={row.term}
              className="grid grid-cols-1 gap-x-10 gap-y-2 border-b border-line py-7 md:grid-cols-[0.55fr_1.45fr]"
            >
              <dt className="text-[1.0625rem] font-medium text-ink">{row.term}</dt>
              <dd className="m-0 max-w-[680px]">
                <span className="block text-[0.9375rem] leading-[1.7] text-ink-2">{row.body}</span>
                {row.external ? (
                  <a
                    href={row.href}
                    className="mt-3 inline-block border-b border-[#D5D5D1] pb-0.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink cursor-pointer"
                  >
                    {row.cta} →
                  </a>
                ) : (
                  <Link
                    href={row.href}
                    className="mt-3 inline-block border-b border-[#D5D5D1] pb-0.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink cursor-pointer"
                  >
                    {row.cta} →
                  </Link>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* ================= FAQ ================= */}
      <Section id="faq">
        <Eyebrow>FAQ</Eyebrow>
        <H2>Questions People Ask.</H2>
        <Prose className="mb-10">
          The things developers ask first, answered straight. If something here is missing, the docs go deeper.
        </Prose>
        <Faq />
      </Section>

      {/* ================= CLOSING CTA BAND ================= */}
      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,14vh,150px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto">
          <div className="rounded-[28px] bg-surface px-[clamp(28px,6vw,64px)] py-[clamp(48px,8vh,76px)] text-center">
            <p
              className="mx-auto max-w-[560px] text-ink-2 leading-[1.6]"
              style={{ fontSize: 'clamp(1.0625rem, 1.3vw, 1.1875rem)' }}
            >
              Start at the default thinking level and move up when a task needs it. Usage-based pricing, with the
              exact numbers on the console.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href={EXTERNAL.platform} className={`btn-pill btn-pill-glass-dark ${ACCENT_GLASS_DARK_CLASS.red}`}>
                Get API Access
              </a>
              <a
                href={EXTERNAL.platformPricing}
                className="text-[0.9375rem] font-medium text-ink-2 transition-colors hover:text-ink cursor-pointer"
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
