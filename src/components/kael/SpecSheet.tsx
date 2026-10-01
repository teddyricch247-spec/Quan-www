import React from 'react';
import { SPECS } from '../../data/kael';

/**
 * The model's quick facts as a definition list: label on the left, value
 * and a one-line note on the right, separated by hairlines. Reads like a
 * spec sheet rather than a grid of marketing cards. `only` limits it to a
 * subset (the home page shows five rows; /kael shows all of them).
 */
export const SpecSheet: React.FC<{ only?: string[] }> = ({ only }) => {
  const rows = only ? SPECS.filter((s) => only.includes(s.id)) : SPECS;

  return (
    <dl className="m-0 grid grid-cols-1 border-t border-line md:grid-cols-2 md:gap-x-16">
      {rows.map((row) => (
        <div
          key={row.id}
          className="grid grid-cols-[minmax(110px,0.8fr)_1.6fr] gap-x-6 gap-y-1 border-b border-line py-5"
        >
          <dt className="text-sm text-ink-3">{row.label}</dt>
          <dd className="m-0">
            <span className={`text-[1.0625rem] font-medium text-ink ${row.mono ? 'font-mono text-base' : ''}`}>
              {row.value}
            </span>
            {row.note ? <span className="mt-1 block text-sm leading-[1.55] text-ink-2">{row.note}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default SpecSheet;
