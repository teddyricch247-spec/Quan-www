import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Minus } from 'lucide-react';
import { Hero } from '../../components/Hero';
import { CodeIntegration } from '../../components/CodeIntegration';
import { LowPolyScene } from '../../components/LowPolyScene';
import { Section, Eyebrow, H2, H3, Prose } from '../../components/Section';
import { SpecSheet } from '../../components/kael/SpecSheet';
import { ModelsOverview } from '../../components/kael/ModelsOverview';
import { ThinkingLevels } from '../../components/kael/ThinkingLevels';
import { PricingTable } from '../../components/kael/PricingTable';
import { Faq } from '../../components/kael/Faq';
import { DemoCard } from '../../components/demos/DemoCard';
import { JsonLd } from '../../components/JsonLd';
import { FAQ, SPEED } from '../../data/kael';
import { getAllDemos } from '../../data/demos';
import { EXTERNAL, ROUTES } from '../../lib/routes';
import { ACCENT_GLASS_DARK_CLASS } from '../../lib/accents';
import { breadcrumbJsonLd, pageMetadata, softwareApplicationJsonLd } from '../../lib/seo';

const KAEL_DESCRIPTION =
  'Kael is built for accurate coding, security, math and agentic work, in two models, Kael Beta and Kael Pro Beta, behind an API that works with the SDKs you already use.';

export const metadata: Metadata = pageMetadata({
  title: 'Kael API: Kael Beta and Kael Pro Beta for Code and Agents',
  description: KAEL_DESCRIPTION,
  path: '/kael',
});

const ON_THIS_PAGE: { href: string; label: string }[] = [
  { href: '#overview', label: 'Overview' },
  { href: '#models', label: 'Models' },
  { href: '#strengths', label: 'Strengths' },
  { href: '#thinking', label: 'Thinking' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#benchmarks', label: 'Benchmarks' },
  { href: '#data', label: 'Your data' },
  { href: '#integration', label: 'Integration' },
  { href: '#demos', label: 'Demos' },
  { href: '#faq', label: 'FAQ' },
];

const STRENGTHS: { title: string; body: string }[] = [
  {
    title: 'Coding',
    body: 'Kael is built to write code with fewer bugs, and to catch the bugs that are already there. It takes longer than most models because it favours a correct answer over a fast one.',
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

// Lets search engines show the questions people ask as rich results. Built
// from the same FAQ data the on-page accordion renders, so they cannot drift.
const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a.join(' ') },
  })),
};

export default function KaelPage() {
  return (
    <div className="w-full bg-white">
      <JsonLd
        data={[
          softwareApplicationJsonLd({
            name: 'Kael',
            path: '/kael',
            description: KAEL_DESCRIPTION,
            category: 'DeveloperApplication',
          }),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Kael', path: '/kael' },
          ]),
          FAQ_JSON_LD,
        ]}
      />
      <Hero
        accent="red"
        eyebrow="Kael, in beta"
        headline="Built To Be Right, Not Just Fast."
        subhead="Kael comes in two models, Kael Beta and Kael Pro Beta, built for accurate coding, security, math and agentic work. It thinks before it answers, behind an API you already know how to call."
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

      {/* ================= MODELS ================= */}
      <Section id="models">
        <div className="mb-[clamp(48px,7vh,72px)] grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <Eyebrow>Models</Eyebrow>
            <H2>Two Models. One API.</H2>
            <Prose>
              Kael comes as two models. <strong className="font-medium text-ink">Kael Beta</strong> is for most
              work: everyday reasoning, coding, debugging and review. <strong className="font-medium text-ink">Kael
              Pro Beta</strong> is the most thorough, for the hardest problems, and it costs more per token. Both
              are called the same way, with the same key, and take the same request formats. Only the model name
              changes.
            </Prose>
            <Prose className="mt-5">
              The request and the response look like any other chat model’s: the same endpoints, the same message
              format, the same SDKs. Quancis does not publish how Kael is built, and Kael will not say.
            </Prose>
          </div>
          <div className="h-[280px] sm:h-[340px] lg:h-[380px]">
            <LowPolyScene variant="orbit" accent="red" />
          </div>
        </div>

        <ModelsOverview />

        <div className="mt-[clamp(64px,9vh,104px)] grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
          <div>
            <H3>Built for accuracy</H3>
            <p className="mb-0 mt-3 max-w-[560px] text-[0.9375rem] leading-[1.7] text-ink-2">
              Models keep getting smarter, but not more accurate. The gap between impressive and correct is where
              bugs, vulnerabilities and confident wrong answers live. Kael is built to close that gap, and to say
              plainly where it does not. The research behind the idea is in{' '}
              <Link
                href="/blog/best-of-n-to-mind-evolution"
                className="border-b border-[#D5D5D1] font-medium text-ink transition-colors hover:border-ink"
              >
                From Best-of-N to Mind Evolution
              </Link>
              .
            </p>
          </div>
          <div>
            <H3>Screened for misuse</H3>
            <p className="mb-0 mt-3 max-w-[560px] text-[0.9375rem] leading-[1.7] text-ink-2">
              Requests and answers can be screened against the acceptable-use terms. If something harmful is in
              either one, it can be stopped before it goes anywhere, and a flagged request can be held for review.
              What is kept, and for how long, is in Your data below.
            </p>
          </div>
          <div className="md:col-span-2">
            <H3>Your system prompt stays yours</H3>
            <p className="mb-0 mt-3 max-w-[720px] text-[0.9375rem] leading-[1.7] text-ink-2">
              Write your system prompt the way you would for any other model. It defines the persona and the task:
              if it gives Kael a name, Kael uses it. Kael’s own rules rank above it, so a system prompt cannot make
              Kael claim to be a different AI product.
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
          Kael is slower than most models on purpose. Every request thinks before it answers: there is no setting
          that turns thinking off. You choose how much. Kael Beta has Low (the default), High and Max. Kael Pro
          Beta has z-low (the default) and z-high. A model accepts only its own levels. Pick a level to see what
          it costs and where it fits. There is no Auto level, where Kael decides for you.
        </Prose>
        <Prose className="mb-10 mt-5">
          At any level, Kael takes about 2.2 times as long to think as an average AI model. Once it starts
          writing, expect {SPEED.tpsLow} to {SPEED.tpsHigh} tokens per second, in every mode. The longer story,
          with a chart, is in{' '}
          <Link
            href="/blog/why-kael-is-slower-on-purpose"
            className="border-b border-[#D5D5D1] font-medium text-ink transition-colors hover:border-ink"
          >
            Why Kael Is Slower, On Purpose
          </Link>
          .
        </Prose>
        <ThinkingLevels />
      </Section>

      {/* ================= PRICING ================= */}
      <Section id="pricing">
        <Eyebrow>Pricing</Eyebrow>
        <H2>Pay For What You Use.</H2>
        <Prose className="mb-10">
          Pricing is usage-based, per million tokens, and each model has its own price. Kael Beta costs the same at
          Low, High and Max. Kael Pro Beta costs more per token, at both of its levels. You are billed once, for
          your input and the final answer, nothing else.
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
          Independent evaluation is being sought. When results exist, we plan to share them here.
        </Prose>
        <Prose className="mt-5">
          Until then, the best test is your own. Because Kael is a base-URL change, you can point the SDK you
          already use at it and run your hardest prompts in a few minutes.{' '}
          <a
            href={EXTERNAL.platform}
            className="border-b border-[#D5D5D1] font-medium text-ink transition-colors hover:border-ink"
          >
            Create a Kael API account
          </a>
          , or browse the{' '}
          <Link
            href={ROUTES.examples}
            className="border-b border-[#D5D5D1] font-medium text-ink transition-colors hover:border-ink"
          >
            examples page
          </Link>{' '}
          as we fill it with real outputs.
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
              body: 'Your requests are not used to train Kael.',
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

      {/* ================= DEMOS ================= */}
      <Section id="demos">
        <Eyebrow>Demos</Eyebrow>
        <H2>See What Kael Writes.</H2>
        <Prose className="mb-10">
          Games and simulations that Kael wrote from a single prompt in a chat window, with no tools, each as
          a single HTML file. Try them in your browser. They show something Kael wrote, not how often it gets things right,
          so they sit apart from the benchmarks above.
        </Prose>
        <ul className="m-0 grid list-none grid-cols-1 gap-x-10 gap-y-14 p-0 md:grid-cols-2">
          {getAllDemos().map((demo) => (
            <li key={demo.slug}>
              <DemoCard demo={demo} />
            </li>
          ))}
        </ul>
        <Link
          href={ROUTES.demo}
          className="mt-10 inline-block border-b border-[#D5D5D1] pb-0.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink cursor-pointer"
        >
          All demos and how they were made →
        </Link>
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
