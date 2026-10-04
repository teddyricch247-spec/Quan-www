import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Demo } from '../../data/demos';
import { demoPath } from '../../lib/routes';
import { DemoCover } from './DemoCover';

/** One demo as a card: cover, tags, title, summary. Used on the hub, on the
 *  Kael page and in "more demos", so a new demo shows up in all three. */
export const DemoCard: React.FC<{ demo: Demo }> = ({ demo }) => (
  <Link href={demoPath(demo.slug)} className="group block cursor-pointer">
    <div className="overflow-hidden rounded-[20px] border border-line">
      <DemoCover
        demo={demo}
        className="aspect-[16/10] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
    </div>
    <div className="mt-5 flex flex-wrap gap-2">
      {demo.tags.map((tag) => (
        <span key={tag} className="badge-pill badge-pill-neutral">
          {tag}
        </span>
      ))}
    </div>
    <h3 className="mb-0 mt-3 text-[1.375rem] font-medium leading-[1.2] tracking-[-0.025em] text-ink">{demo.title}</h3>
    <p className="mb-0 mt-2 max-w-[520px] text-[0.9375rem] leading-[1.65] text-ink-2">{demo.summary}</p>
    <span className="mt-4 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-ink">
      Play it
      <ArrowRight
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </span>
  </Link>
);

export default DemoCard;
