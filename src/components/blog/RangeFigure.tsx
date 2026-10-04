import React from 'react';

export interface RangeRow {
  label: string;
  low: number;
  high: number;
  highlight?: boolean;
}

/** A range bar chart: each row lights up the span between `low` and `high`
 *  on a shared axis. Same look as the speed bars on the Kael page. */
export const RangeFigure: React.FC<{
  rows: RangeRow[];
  axisMax: number;
  ticks: number[];
  unit: string;
  label: string;
}> = ({ rows, axisMax, ticks, unit, label }) => (
  <div role="group" aria-label={label}>
    <div className="flex flex-col gap-5">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-2 flex items-baseline justify-between gap-4 text-sm">
            <span className="text-ink">{row.label}</span>
            <span className="flex-none font-mono tabular-nums text-ink">
              {row.low}–{row.high} {unit}
            </span>
          </div>
          <div className="relative h-2.5 rounded-full bg-surface-2" aria-hidden="true">
            <span
              className={`absolute inset-y-0 rounded-full ${row.highlight ? 'bg-accent-red' : 'bg-ink'}`}
              style={{
                left: `${(row.low / axisMax) * 100}%`,
                width: `${((row.high - row.low) / axisMax) * 100}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
    <div className="mt-2 flex justify-between text-xs text-ink-3" aria-hidden="true">
      {ticks.map((t) => (
        <span key={t}>{t}</span>
      ))}
    </div>
  </div>
);

export default RangeFigure;
