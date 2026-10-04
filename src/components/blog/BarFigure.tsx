import React from 'react';

export interface BarRow {
  label: string;
  value: number;
  /** Text shown at the right of the row. Defaults to "<value>%". */
  valueLabel?: string;
  note?: string;
  highlight?: boolean;
}

/**
 * Horizontal bar chart in plain HTML. Each row is a label and a value on one
 * line with the bar underneath, so it reads the same on a phone as on a
 * desktop. The numbers are always printed, so the chart never depends on
 * reading a bar's length.
 */
export const BarFigure: React.FC<{ rows: BarRow[]; label: string; max?: number }> = ({
  rows,
  label,
  max = 100,
}) => (
  <div role="group" aria-label={label} className="flex flex-col gap-5">
    {rows.map((row) => (
      <div key={row.label}>
        <div className="mb-1.5 flex items-baseline justify-between gap-4 text-sm">
          <span className="text-ink">{row.label}</span>
          <span className="flex-none font-mono tabular-nums text-ink">{row.valueLabel ?? `${row.value}%`}</span>
        </div>
        <div className="h-2.5 rounded-full bg-surface-2" aria-hidden="true">
          <div
            className={`h-full rounded-full ${row.highlight ? 'bg-accent-red' : 'bg-ink-3'}`}
            style={{ width: `${Math.min(100, Math.max(0, (row.value / max) * 100))}%` }}
          />
        </div>
        {row.note ? <p className="mb-0 mt-1.5 text-[0.8125rem] leading-[1.5] text-ink-3">{row.note}</p> : null}
      </div>
    ))}
  </div>
);

export default BarFigure;
