import type { Metadata } from 'next';
import { Check, Minus } from 'lucide-react';
import { Hero } from '../../components/Hero';
import { PlaceholderNote } from '../../components/PlaceholderNote';
import { LowPolyScene } from '../../components/LowPolyScene';
import { EXTERNAL } from '../../lib/routes';
import { ACCENT_GLASS_DARK_CLASS } from '../../lib/accents';

export const metadata: Metadata = {
  title: 'Quan Harness',
  description:
    'Built on Kael, the same composite intelligence behind the API. Point it at a codebase and it plans, writes, and finishes the work — not just suggests it.',
};

const COMPARISON_ROWS: { label: string; harness: string; typical: string }[] = [
  { label: 'Live preview', harness: 'Deployed instantly, test it in the browser', typical: 'Terminal only' },
  { label: 'Your own language & framework', harness: 'Whatever stack you already use', typical: 'Often locked to one' },
  { label: 'Cloud file system', harness: 'Full file manager, move things freely', typical: 'Limited or none' },
  { label: 'Git', harness: 'Push and pull, just like local', typical: 'Varies' },
  { label: 'Agent architecture', harness: 'A purpose-built agent per task type', typical: 'One agent for everything' },
];

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
            Most AI coding tools — Claude Code, Cursor, and others like them — give you a conversation: you describe
            what you want, they write code in your terminal. Harness gives you a project instead: a full file system
            scoped to what you&apos;re building, that you can browse and edit yourself with the built-in file editor,
            plus a live preview the moment something changes — so you&apos;re looking at the running thing, not just
            the code that&apos;s supposed to produce it.
          </p>
          <p className="max-w-[720px] mt-5 text-ink-2 leading-[1.7]" style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.1875rem)' }}>
            Push and pull to GitHub the same way you would locally. And unlike browser-based builders such as Replit
            or Lovable, you&apos;re not boxed into one language or framework — build in whatever stack you&apos;re
            already comfortable with.
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

      {/* ================= COMPARISON ================= */}
      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <div className="max-w-[1160px] mx-auto">
          <span className="text-xs font-medium tracking-[0.14em] uppercase text-ink-3">At A Glance</span>
          <h2
            className="mt-3.5 mb-8 font-medium text-ink leading-[1.14] tracking-[-0.032em]"
            style={{ fontSize: 'clamp(1.75rem, 3.3vw, 2.6rem)' }}
          >
            Where It Fits.
          </h2>

          <div className="card-panel overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-[1.3fr_1fr_1fr] text-sm">
              <div className="hidden sm:block px-6 py-4 border-b border-line-soft bg-surface" />
              <div className="hidden sm:flex items-center px-6 py-4 border-b border-line-soft bg-surface font-medium text-ink">
                Quan Harness
              </div>
              <div className="hidden sm:flex items-center px-6 py-4 border-b border-line-soft bg-surface font-medium text-ink-2">
                Typical coding agents
              </div>

              {COMPARISON_ROWS.map((row, i) => {
                const rowBorder = i > 0 ? 'border-t border-line-soft' : '';
                return (
                  <div key={row.label} className="contents">
                    <div className={`px-6 py-5 font-medium text-ink ${rowBorder}`}>{row.label}</div>
                    <div className={`flex items-start gap-2 px-6 py-2.5 sm:py-5 text-ink-2 ${rowBorder}`}>
                      <Check className="mt-0.5 h-4 w-4 flex-none text-accent-harness" strokeWidth={2} />
                      <span>{row.harness}</span>
                    </div>
                    <div className={`flex items-start gap-2 px-6 pb-5 sm:py-5 text-ink-3 ${rowBorder}`}>
                      <Minus className="mt-0.5 h-4 w-4 flex-none" strokeWidth={2} />
                      <span>{row.typical}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="mt-4 text-sm text-ink-3">
            Our own read on how we differ, in the spirit of a fair comparison — not every tool above works
            identically, and this will get more specific as we publish real benchmarks alongside it.
          </p>
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
          </div>
        </div>
      </section>
    </div>
  );
}
