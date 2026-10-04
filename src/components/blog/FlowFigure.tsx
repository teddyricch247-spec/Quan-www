import React from 'react';
import { ArrowDown, ArrowRight, Repeat } from 'lucide-react';

export interface FlowStep {
  label: string;
  detail?: string;
  /** The step that produces the result. Drawn with the red accent. */
  highlight?: boolean;
}

export interface FlowLane {
  title: string;
  note?: string;
  steps: FlowStep[];
  /** A line under the lane that explains repetition. */
  loop?: string;
}

/**
 * A process diagram built from HTML boxes rather than a fixed-size SVG, so
 * the text stays readable on a phone: steps sit side by side on wide
 * screens and stack, with down arrows, on narrow ones.
 */
export const FlowFigure: React.FC<{ lanes: FlowLane[]; label: string }> = ({ lanes, label }) => (
  <div role="group" aria-label={label} className="flex flex-col gap-8">
    {lanes.map((lane) => (
      <div key={lane.title}>
        <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <p className="m-0 text-[0.9375rem] font-medium text-ink">{lane.title}</p>
          {lane.note ? <span className="text-sm text-ink-3">{lane.note}</span> : null}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          {lane.steps.map((step, i) => (
            <React.Fragment key={step.label}>
              {i > 0 ? (
                <span aria-hidden="true" className="flex flex-none items-center justify-center text-ink-3">
                  <ArrowDown className="h-4 w-4 sm:hidden" strokeWidth={1.8} />
                  <ArrowRight className="hidden h-4 w-4 sm:block" strokeWidth={1.8} />
                </span>
              ) : null}
              <div
                className={`flex-1 rounded-xl border px-4 py-3 ${
                  step.highlight ? 'border-accent-red bg-danger-soft' : 'border-line bg-white'
                }`}
              >
                <div className="text-[0.9375rem] font-medium leading-[1.35] text-ink">{step.label}</div>
                {step.detail ? (
                  <div className="mt-1 text-[0.8125rem] leading-[1.5] text-ink-2">{step.detail}</div>
                ) : null}
              </div>
            </React.Fragment>
          ))}
        </div>

        {lane.loop ? (
          <p className="mb-0 mt-3 flex items-start gap-2 text-[0.8125rem] leading-[1.5] text-ink-3">
            <Repeat className="mt-0.5 h-3.5 w-3.5 flex-none" strokeWidth={1.8} aria-hidden="true" />
            <span>{lane.loop}</span>
          </p>
        ) : null}
      </div>
    ))}
  </div>
);

export default FlowFigure;
