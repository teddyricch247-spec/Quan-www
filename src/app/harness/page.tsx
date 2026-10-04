import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Hero } from '../../components/Hero';
import { LowPolyScene } from '../../components/LowPolyScene';
import { SceneStage } from '../../components/three/SceneStage';
import { EXTERNAL, ROUTES } from '../../lib/routes';
import { ACCENT_GLASS_DARK_CLASS } from '../../lib/accents';
import { JsonLd } from '../../components/JsonLd';
import { breadcrumbJsonLd, pageMetadata, softwareApplicationJsonLd } from '../../lib/seo';

const HARNESS_DESCRIPTION =
  'Built on Kael, the same composite intelligence behind the API. Point it at a codebase and it plans, writes, and finishes the work — not just suggests it.';

export const metadata: Metadata = pageMetadata({
  title: 'Quan Harness — Cloud Coding Agent Built on Kael',
  description: HARNESS_DESCRIPTION,
  path: '/harness',
});

// What the Harness environment includes. Every row restates something this
// page already says in prose; nothing here claims anything about other tools.
const FEATURE_ROWS: { label: string; detail: string }[] = [
  {
    label: 'Live preview',
    detail: 'The project is deployed instantly, so you test the running thing in the browser, not just the code.',
  },
  { label: 'Your own language & framework', detail: 'Build in whatever stack you already use.' },
  {
    label: 'Cloud file system',
    detail: 'A full file manager scoped to your project. Browse, edit and move things freely with the built-in editor.',
  },
  { label: 'Git', detail: 'Push and pull to GitHub, just like local.' },
  {
    label: 'MCP and skills',
    detail: 'Connect your other tools through MCP, and give the agent skills for the specific jobs you need done.',
  },
  {
    label: 'An agent per task type',
    detail: 'Each kind of task is routed to a purpose-built agent, instead of one agent trying to do everything.',
  },
  {
    label: 'Runs in the cloud',
    detail: 'Send the task and get on with your day. You are notified when it is done.',
  },
];

export default function HarnessPage() {
  return (
    <div className="w-full bg-white">
      <JsonLd
        data={[
          softwareApplicationJsonLd({
            name: 'Quan Harness',
            path: '/harness',
            description: HARNESS_DESCRIPTION,
            category: 'DeveloperApplication',
          }),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Quan Harness', path: '/harness' },
          ]),
        ]}
      />
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

      {/* ================= IN ACTION ================= */}
      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <SceneStage
              scene="harness"
              label="Animation: on a laptop, a task is typed into Quan Harness, the agent edits four files, and reports all bugs fixed with no errors."
            />
          </div>
          <div className="lg:col-span-5">
            <span className="text-xs font-medium tracking-[0.14em] uppercase text-ink-3">In Action</span>
            <h2
              className="mt-3.5 mb-6 font-medium text-ink leading-[1.14] tracking-[-0.032em]"
              style={{ fontSize: 'clamp(1.75rem, 3.3vw, 2.6rem)' }}
            >
              Watch A Task Become A Change.
            </h2>
            <p className="max-w-[460px] text-ink-2 leading-[1.7]" style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.1875rem)' }}>
              A task goes in as plain language. Files change, the work is checked, and a report comes back with what
              was done.
            </p>
          </div>
        </div>
      </section>

      {/* ================= THE HARNESS, NOT JUST THE AGENT ================= */}
      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-16 items-center">
          <div>
            <span className="text-xs font-medium tracking-[0.14em] uppercase text-ink-3">The Harness</span>
            <h2
              className="mt-3.5 mb-6 font-medium text-ink leading-[1.14] tracking-[-0.032em]"
              style={{ fontSize: 'clamp(1.75rem, 3.3vw, 2.6rem)' }}
            >
              It&apos;s Not Just An Agent. It&apos;s What The Agent Runs In.
            </h2>
            <p className="max-w-[620px] text-ink-2 leading-[1.7]" style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.1875rem)' }}>
              Most coding agents <em className="not-italic font-medium text-ink">are</em> the whole product — you talk
              to them, they write code, that&apos;s the entire experience. Quan Harness is different: the agent is
              only one part of it. The harness is the environment that agent runs inside — the file system, the live
              preview, the deployment, the routing between specialized agents underneath. The agent does the work;
              the harness is what makes that work real, testable, and shippable, not just written.
            </p>
          </div>
          <div className="h-[280px] sm:h-[340px] lg:h-[380px]">
            <LowPolyScene variant="pipeline" accent="harness" />
          </div>
        </div>
      </section>

      {/* ================= THE ENVIRONMENT ================= */}
      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto">
          <span className="text-xs font-medium tracking-[0.14em] uppercase text-ink-3">The Environment</span>
          <h2
            className="mt-3.5 mb-6 font-medium text-ink leading-[1.14] tracking-[-0.032em]"
            style={{ fontSize: 'clamp(1.75rem, 3.3vw, 2.6rem)' }}
          >
            A Real Project Environment, Not A Chat Window.
          </h2>
          <p className="max-w-[720px] text-ink-2 leading-[1.7]" style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.1875rem)' }}>
            Many AI coding tools give you a conversation: you describe what you want, and they write code on a
            machine you run yourself. Harness gives you a project instead: a full file system scoped to what
            you&apos;re building, that you can browse and edit yourself with the built-in file editor, plus a live
            preview the moment something changes — so you&apos;re looking at the running thing, not just the code
            that&apos;s supposed to produce it.
          </p>
          <p className="max-w-[720px] mt-5 text-ink-2 leading-[1.7]" style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.1875rem)' }}>
            Push and pull to GitHub the same way you would locally. And you&apos;re not boxed into one language or
            framework — build in whatever stack you&apos;re already comfortable with.
          </p>
        </div>
      </section>

      {/* ================= THE AGENT ================= */}
      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto">
          <span className="text-xs font-medium tracking-[0.14em] uppercase text-ink-3">The Agent</span>
          <h2
            className="mt-3.5 mb-6 font-medium text-ink leading-[1.14] tracking-[-0.032em]"
            style={{ fontSize: 'clamp(1.75rem, 3.3vw, 2.6rem)' }}
          >
            One Task, The Right Agent For It.
          </h2>
          <p className="max-w-[720px] text-ink-2 leading-[1.7]" style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.1875rem)' }}>
            The agent side of Harness does more than write code — connect it to your other tools through MCP, give
            it skills for the specific things you need done, and it can act on all of it.
          </p>
          <p className="max-w-[720px] mt-5 text-ink-2 leading-[1.7]" style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.1875rem)' }}>
            But it isn&apos;t one enormous agent trying to be everything at once. Ask it to check your inbox and
            draft replies, and that hands off to an agent built for exactly that — not the same one that&apos;s
            mid-way through refactoring your auth flow. Most tools route every request through a single,
            increasingly complicated system prompt; when something breaks, it&apos;s hard to know why, and harder to
            fix without breaking something else. Harness routes each kind of task to a purpose-built agent instead —
            more predictable for you, easier for us to improve without the whole system shifting under it.
          </p>
        </div>
      </section>

      {/* ================= THE PHILOSOPHY ================= */}
      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto">
          <span className="text-xs font-medium tracking-[0.14em] uppercase text-ink-3">The Philosophy</span>
          <h2
            className="mt-3.5 mb-6 font-medium text-ink leading-[1.14] tracking-[-0.032em]"
            style={{ fontSize: 'clamp(1.75rem, 3.3vw, 2.6rem)' }}
          >
            Built To Be Right, Not Just Fast.
          </h2>
          <p className="max-w-[720px] text-ink-2 leading-[1.7]" style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.1875rem)' }}>
            Precision, accuracy, and completeness come first here — speed second. Where other agents wait for you to
            ask &quot;are there any bugs?&quot;, Harness flags what it notices along the way without being asked, as
            part of the work it&apos;s already doing, not a separate search for problems. You decide what to do with
            that — fix it now, later, or not at all — but you&apos;ll know about it either way.
          </p>
          <p className="max-w-[720px] mt-5 text-ink-2 leading-[1.7]" style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.1875rem)' }}>
            That means a task might take a little longer than the fastest tool you&apos;ve tried. It also means
            you&apos;re less likely to get back something that technically matches what you asked for but isn&apos;t
            actually good. And because everything runs in the cloud, you don&apos;t have to sit and watch it work —
            send the task, get on with your day, and get notified when it&apos;s done.
          </p>
        </div>
      </section>

      {/* ================= WHAT'S IN THE BOX ================= */}
      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto">
          <span className="text-xs font-medium tracking-[0.14em] uppercase text-ink-3">What&apos;s Inside</span>
          <h2
            className="mt-3.5 mb-8 font-medium text-ink leading-[1.14] tracking-[-0.032em]"
            style={{ fontSize: 'clamp(1.75rem, 3.3vw, 2.6rem)' }}
          >
            Everything In The Harness.
          </h2>

          <div className="card-panel overflow-hidden">
            <dl className="m-0">
              {FEATURE_ROWS.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-1 gap-x-8 gap-y-1.5 px-6 py-5 sm:grid-cols-[0.8fr_1.2fr] ${
                    i > 0 ? 'border-t border-line-soft' : ''
                  }`}
                >
                  <dt className="flex items-start gap-2 text-sm font-medium text-ink">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-accent-harness" strokeWidth={2} aria-hidden="true" />
                    <span>{row.label}</span>
                  </dt>
                  <dd className="m-0 text-sm leading-[1.6] text-ink-2">{row.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ================= BUILT ON KAEL ================= */}
      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto">
          <span className="text-xs font-medium tracking-[0.14em] uppercase text-ink-3">Built On Kael</span>
          <h2
            className="mt-3.5 mb-6 font-medium text-ink leading-[1.14] tracking-[-0.032em]"
            style={{ fontSize: 'clamp(1.75rem, 3.3vw, 2.6rem)' }}
          >
            The Same System As The API.
          </h2>
          <p className="max-w-[720px] text-ink-2 leading-[1.7]" style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.1875rem)' }}>
            Harness runs on Kael, so it shares Kael&apos;s character: accuracy over speed, strongest at code,
            security and multi-step engineering work. If you want the model without the agent around it, the same
            system is available as an API.
          </p>
          <Link
            href={ROUTES.kael}
            className="inline-block mt-8 text-[0.9375rem] font-medium text-ink border-b border-[#D5D5D1] hover:border-ink transition-colors cursor-pointer pb-0.5"
          >
            How Kael works →
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
              One subscription, unlimited use. See exact pricing on the app.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
              <a href={EXTERNAL.appHarness} className={`btn-pill btn-pill-glass-dark ${ACCENT_GLASS_DARK_CLASS.harness}`}>
                Start With Harness
              </a>
              <a
                href={EXTERNAL.appPricing}
                className="text-[0.9375rem] font-medium text-ink-2 hover:text-ink transition-colors cursor-pointer"
              >
                See pricing →
              </a>
            </div>
            <p className="mx-auto mb-0 mt-7 max-w-[520px] text-sm leading-[1.6] text-ink-3">
              Want the model without the agent? Harness runs on Kael, which you can call directly through the{' '}
              <a
                href={EXTERNAL.platform}
                className="border-b border-[#D5D5D1] font-medium text-ink-2 transition-colors hover:border-ink hover:text-ink"
              >
                Kael API
              </a>
              , or read how it works on the{' '}
              <Link
                href={ROUTES.kael}
                className="border-b border-[#D5D5D1] font-medium text-ink-2 transition-colors hover:border-ink hover:text-ink"
              >
                Kael page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
