'use client';

import React, { useMemo, useState } from 'react';
import type { ExampleCategory, KaelExample } from '../../data/examples';
import { EXAMPLE_MODEL_ID } from '../../data/examples';
import { EXTERNAL } from '../../lib/routes';

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(d);
}

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <dt className="text-xs text-ink-3">{label}</dt>
    <dd className="m-0 mt-0.5 font-mono text-sm tabular-nums text-ink">{value}</dd>
  </div>
);

const ExampleCard: React.FC<{ example: KaelExample }> = ({ example }) => {
  const { stats } = example;
  return (
    <article className="card-panel p-6 sm:p-8" aria-labelledby={`example-${example.id}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge-pill badge-pill-neutral">{example.category}</span>
        <span className="badge-pill badge-pill-neutral">Thinking: {example.level}</span>
        <span className="font-mono text-xs text-ink-3">{EXAMPLE_MODEL_ID}</span>
        {example.placeholder ? (
          <span
            className="badge-pill"
            style={{
              background: 'var(--color-warning-soft)',
              borderColor: 'var(--color-warning-border)',
              color: 'var(--color-warning)',
            }}
          >
            Placeholder
          </span>
        ) : null}
      </div>

      <h2
        id={`example-${example.id}`}
        className="m-0 mt-4 text-[1.25rem] font-medium leading-[1.25] tracking-[-0.02em] text-ink"
      >
        {example.title}
      </h2>
      <p className="mb-0 mt-2 max-w-[640px] text-[0.9375rem] leading-[1.65] text-ink-2">{example.summary}</p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="min-w-0">
          <p className="m-0 mb-2 text-sm font-medium text-ink">Prompt</p>
          <pre
            tabIndex={0}
            className="m-0 max-h-[360px] overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-surface px-4 py-3.5 font-mono text-[0.8125rem] leading-[1.65] text-ink-2"
          >
            {example.prompt}
          </pre>
        </div>
        <div className="min-w-0">
          <p className="m-0 mb-2 text-sm font-medium text-ink">Output</p>
          <pre
            tabIndex={0}
            className="m-0 max-h-[360px] overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-code-bg px-4 py-3.5 font-mono text-[0.8125rem] leading-[1.65] text-code-ink"
          >
            {example.output}
          </pre>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-t border-line-soft pt-5">
        <dl className="m-0 flex flex-wrap gap-x-8 gap-y-3">
          <Stat label="Input tokens" value={stats?.inputTokens !== undefined ? stats.inputTokens.toLocaleString('en-US') : '—'} />
          <Stat label="Output tokens" value={stats?.outputTokens !== undefined ? stats.outputTokens.toLocaleString('en-US') : '—'} />
          <Stat label="Time" value={stats?.seconds !== undefined ? `${stats.seconds}s` : '—'} />
          <Stat label="Recorded" value={example.recordedOn ? formatDate(example.recordedOn) : '—'} />
        </dl>
        <a
          href={EXTERNAL.platform}
          className="border-b border-[#D5D5D1] pb-0.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink"
        >
          Run your own on the Kael API
        </a>
      </div>
    </article>
  );
};

/**
 * Filterable list of examples. Every example is in the server-rendered
 * HTML ("All" is the initial state), so the filter only narrows what is
 * already there.
 */
export const ExamplesGallery: React.FC<{ examples: KaelExample[] }> = ({ examples }) => {
  const categories = useMemo(() => Array.from(new Set(examples.map((e) => e.category))), [examples]);
  const [active, setActive] = useState<ExampleCategory | 'All'>('All');

  const filtered = active === 'All' ? examples : examples.filter((e) => e.category === active);

  return (
    <div>
      {categories.length > 1 ? (
        <div className="mb-8 flex flex-wrap gap-2">
          {(['All', ...categories] as const).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              aria-pressed={active === category}
              className={`h-9 px-4 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
                active === category
                  ? 'bg-ink text-white border-ink'
                  : 'bg-white text-ink-2 border-line hover:border-ink-3 hover:text-ink'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex flex-col gap-5">
        {filtered.map((example) => (
          <ExampleCard key={example.id} example={example} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-ink-3">No {active} examples yet.</p>
      ) : null}
    </div>
  );
};

export default ExamplesGallery;
