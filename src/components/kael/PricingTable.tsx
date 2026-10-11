import React from 'react';
import { MODELS, PRICE_NOTE } from '../../data/kael';

/**
 * Plain reference table for pricing, one row per model. Every level of a model
 * costs the same, so levels are listed in a column rather than getting a row
 * each. A real <table> so it is easy to scan, works for screen readers and
 * scrolls sideways inside its own container on narrow screens instead of
 * breaking the page width.
 */
export const PricingTable: React.FC = () => {
  return (
    <div>
      <div className="card-panel overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-[0.9375rem]">
          <caption className="sr-only">Kael pricing by model, per 1M tokens</caption>
          <thead>
            <tr className="bg-surface text-sm text-ink-2">
              <th scope="col" className="px-6 py-4 font-medium">
                Model
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                Thinking levels
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
            {MODELS.map((model) => (
              <tr key={model.id} className="border-t border-line-soft">
                <th scope="row" className="px-6 py-5 font-medium text-ink">
                  {model.name}
                  <span className="mt-1 block font-mono text-xs font-normal text-ink-3">{model.id}</span>
                </th>
                <td className="px-6 py-5 text-ink-2">
                  {model.levels.map((level) => (level === model.defaultLevel ? `${level} (default)` : level)).join(', ')}
                </td>
                <td className="px-6 py-5 text-right font-mono text-ink">{model.input}</td>
                <td className="px-6 py-5 text-right font-mono text-ink">{model.cachedInput}</td>
                <td className="px-6 py-5 text-right font-mono text-ink">{model.output}</td>
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
