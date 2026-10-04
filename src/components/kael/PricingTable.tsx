import React from 'react';
import { PRICE_NOTE, STATUS_LABEL, THINKING_LEVELS } from '../../data/kael';

/**
 * Plain reference table for pricing. A real <table> so it is easy to scan,
 * works for screen readers and scrolls sideways inside its own container on
 * narrow screens instead of breaking the page width.
 */
export const PricingTable: React.FC = () => {
  return (
    <div>
      <div className="card-panel overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left text-[0.9375rem]">
          <caption className="sr-only">Kael pricing by thinking level, per 1M tokens</caption>
          <thead>
            <tr className="bg-surface text-sm text-ink-2">
              <th scope="col" className="px-6 py-4 font-medium">
                Thinking level
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-right font-medium">
                Input
              </th>
              <th scope="col" className="px-6 py-4 text-right font-medium">
                Cached input
              </th>
              <th scope="col" className="px-6 py-4 text-right font-medium">
                Output
              </th>
            </tr>
          </thead>
          <tbody>
            {THINKING_LEVELS.map((level) => (
              <tr key={level.id} className="border-t border-line-soft">
                <th scope="row" className="px-6 py-5 font-medium text-ink">
                  {level.label}
                </th>
                <td className={`px-6 py-5 ${level.status === 'soon' ? 'text-ink-3' : 'text-ink-2'}`}>
                  {STATUS_LABEL[level.status]}
                </td>
                <td className="px-6 py-5 text-right font-mono text-ink">{level.input}</td>
                <td className="px-6 py-5 text-right font-mono text-ink">{level.cachedInput ?? '—'}</td>
                <td className="px-6 py-5 text-right font-mono text-ink">{level.output}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 max-w-[720px] text-sm leading-[1.6] text-ink-3">{PRICE_NOTE}</p>
    </div>
  );
};

export default PricingTable;
