import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ROUTES } from '../lib/routes';
import { ACCENT_BG_CLASS, ACCENT_HOVER_TEXT_CLASS, type AccentName } from '../lib/accents';
import { SceneStage, type SceneName } from './three/SceneStage';

interface Product {
  accent: AccentName;
  scene: SceneName;
  name: string;
  category: string;
  headline: string;
  body: string;
  /** Short facts, drawn from each product's own page. */
  points?: string[];
  /** Kael: the request formats it accepts, shown as code-style chips. */
  formats?: string[];
  href: string;
  cta: string;
  /** Screen-reader description of the animation. */
  stageLabel: string;
  /** Put the stage on the left (desktop). */
  flip?: boolean;
}

const PRODUCTS: Product[] = [
  {
    accent: 'red',
    scene: 'kael',
    name: 'Kael',
    category: 'The model, as an API.',
    headline: 'Many Models. One Answer.',
    body:
      'Kael is a system, not a single model: a draft is produced, checked, and refined before anything comes back to you. You call one endpoint, in the request format you already send.',
    formats: ['Chat Completions', 'Responses', 'Anthropic Messages'],
    href: ROUTES.kael,
    cta: 'Explore Kael',
    stageLabel:
      'Animation: a cube made of the Quancis brand mark charges up, bursts into pieces to reveal the name Kael, then snaps back together.',
  },
  {
    accent: 'harness',
    scene: 'harness',
    name: 'Quan Harness',
    category: 'The coding agent.',
    headline: 'Hand It A Task. Get It Back Done.',
    body:
      'Point Harness at a codebase and it reads, plans, edits, and checks its own work before handing anything back. It runs in a real project environment, in whatever stack you already use.',
    points: [
      'A live preview the moment something changes',
      'Git push and pull from a cloud file system',
      'MCP tools and skills for work beyond code',
    ],
    href: ROUTES.harness,
    cta: 'Explore Harness',
    stageLabel:
      'Animation: on a laptop, a task is typed into Quan Harness, the agent edits four files, and reports all bugs fixed with no errors.',
    flip: true,
  },
  {
    accent: 'chat',
    scene: 'chat',
    name: 'Quan Chat',
    category: 'The assistant.',
    headline: 'Just Ask. It Checks Before It Answers.',
    body:
      'The same system as the API and Harness, in a conversation. Every answer is checked before it reaches you.',
    points: [
      'Deep reasoning for the hard questions',
      'Web access for when the answer is out there',
      'One subscription, unlimited conversations',
    ],
    href: ROUTES.chat,
    cta: 'Try Quan Chat',
    stageLabel:
      'Animation: a question is typed into the Quan Chat composer, Kael thinks for a moment, then replies.',
  },
];

/**
 * The home page's product section (spec §3.1). Three rows, one per way
 * into Kael. Each row is led by a live 3D scene instead of an icon, so
 * the product is shown working rather than described.
 *
 * Rows alternate sides on desktop and stack stage-first on mobile. The
 * stages are the only motion on the page below the hero; there are no
 * entrance animations competing with them.
 */
export const ProductShowcase: React.FC = () => {
  return (
    <div id="products" className="mx-auto flex max-w-[1160px] flex-col gap-[clamp(72px,11vh,128px)]">
      {PRODUCTS.map((p) => (
        <article key={p.href} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14">
          <div className={`lg:col-span-7 ${p.flip ? 'lg:order-1' : 'lg:order-2'}`}>
            <SceneStage scene={p.scene} label={p.stageLabel} />
          </div>

          <div className={`lg:col-span-5 ${p.flip ? 'lg:order-2' : 'lg:order-1'}`}>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className={`h-2.5 w-2.5 flex-none ${ACCENT_BG_CLASS[p.accent]}`} />
              <span className="text-[0.9375rem] font-medium text-ink">{p.name}</span>
              <span className="text-[0.9375rem] text-ink-3">{p.category}</span>
            </div>

            <h3
              className="m-0 mt-5 font-medium text-ink leading-[1.12] tracking-[-0.034em]"
              style={{ fontSize: 'clamp(1.75rem, 3.1vw, 2.5rem)' }}
            >
              {p.headline}
            </h3>

            <p
              className="mt-5 max-w-[460px] text-ink-2 leading-[1.7]"
              style={{ fontSize: 'clamp(1rem, 1.25vw, 1.0625rem)' }}
            >
              {p.body}
            </p>

            {p.formats ? (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-sm text-ink-3">Accepts</span>
                {p.formats.map((f) => (
                  <span key={f} className="mono-pill">
                    {f}
                  </span>
                ))}
              </div>
            ) : null}

            {p.points ? (
              <ul className="mt-6 flex max-w-[460px] list-none flex-col gap-3 p-0">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-3 text-[0.9375rem] leading-[1.5] text-ink">
                    <span
                      aria-hidden="true"
                      className={`mt-[0.45em] h-1.5 w-1.5 flex-none ${ACCENT_BG_CLASS[p.accent]}`}
                    />
                    {pt}
                  </li>
                ))}
              </ul>
            ) : null}

            <Link href={p.href} className="btn-outline-pill mt-8">
              {p.cta}
              <ArrowUpRight className="h-[17px] w-[17px]" strokeWidth={1.8} />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
};

/** "Ready? Kael · Harness · Chat" — the footer-adjacent closing strip
 *  (spec §3.1: "No separate closing CTA needed — repeat the three
 *  tiles as a simple footer-adjacent strip"). */
export const ReadyStrip: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[1.0625rem]">
      <span className="text-ink-2">Ready?</span>
      {PRODUCTS.map((p, i) => (
        <React.Fragment key={p.href}>
          {i > 0 ? <span className="text-ink-3">·</span> : null}
          <Link
            href={p.href}
            className={`font-medium text-ink transition-colors ${ACCENT_HOVER_TEXT_CLASS[p.accent]}`}
          >
            {p.name}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProductShowcase;
