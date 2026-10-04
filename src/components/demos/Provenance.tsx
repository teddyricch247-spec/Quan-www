import React from 'react';
import Link from 'next/link';
import { ORIGINS, type DemoOrigin } from '../../data/demos';
import { ROUTES } from '../../lib/routes';

/**
 * The "how was this made" statement, written once (ORIGINS in
 * src/data/demos.ts) and shown two ways:
 *   full    the hub page: a heading's worth of three facts in a row
 *   compact the demo pages: the one-line version with a link to the full one
 */
export const Provenance: React.FC<{ origin: DemoOrigin; variant?: 'full' | 'compact' }> = ({
  origin,
  variant = 'full',
}) => {
  const story = ORIGINS[origin];

  if (variant === 'compact') {
    return (
      <div className="card-panel flex flex-wrap items-center justify-between gap-x-8 gap-y-3 px-6 py-5 sm:px-7">
        <div className="flex flex-wrap items-center gap-3">
          <span className="badge-pill">{story.label}</span>
          <p className="m-0 max-w-[560px] text-[0.9375rem] leading-[1.6] text-ink-2">{story.short}</p>
        </div>
        <Link
          href={`${ROUTES.demo}#how`}
          className="inline-block border-b border-[#D5D5D1] pb-0.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink cursor-pointer"
        >
          How these were made →
        </Link>
      </div>
    );
  }

  return (
    <dl className="m-0 border-t border-line">
      {story.facts.map((fact) => (
        <div
          key={fact.title}
          className="grid grid-cols-1 gap-x-10 gap-y-2 border-b border-line py-7 md:grid-cols-[0.55fr_1.45fr]"
        >
          <dt className="text-[1.0625rem] font-medium text-ink">{fact.title}</dt>
          <dd className="m-0 max-w-[680px] text-[0.9375rem] leading-[1.7] text-ink-2">{fact.body}</dd>
        </div>
      ))}
    </dl>
  );
};

export default Provenance;
