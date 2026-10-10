'use client';

import React, { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MODELS, MODEL_BY_ID, SPEED, THINKING_LEVELS, type ThinkingLevel } from '../../data/kael';

const AXIS_TICKS = [0, 100, 200, 300, 400];

/** Segments for one model's levels; the first `filled` are lit. Ordinal position, not a score. */
const Meter: React.FC<{ filled: number; total: number }> = ({ filled, total }) => (
  <span className="flex items-center gap-1" aria-hidden="true">
    {Array.from({ length: total }, (_, i) => (
      <span
        key={i}
        className={`h-1.5 w-5 rounded-full transition-colors duration-300 ${i < filled ? 'bg-accent-red' : 'bg-surface-2'}`}
      />
    ))}
  </span>
);

const RangeBar: React.FC<{
  label: string;
  low: number;
  high: number;
  max: number;
  fillClass: string;
  reduce: boolean;
}> = ({ label, low, high, max, fillClass, reduce }) => (
  <div>
    <div className="mb-2 flex items-baseline justify-between gap-4 text-sm">
      <span className="text-ink-2">{label}</span>
      <span className="font-mono text-ink">
        {low}–{high} tokens/sec
      </span>
    </div>
    <div className="relative h-2.5 rounded-full bg-surface-2">
      <motion.span
        className={`absolute inset-y-0 rounded-full ${fillClass}`}
        style={{ left: `${(low / max) * 100}%`, width: `${((high - low) / max) * 100}%`, originX: 0 }}
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.9 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  </div>
);

/**
 * Model and thinking-level picker, plus the speed numbers.
 *
 * Each model owns its own levels (Kael Beta: Low, High, Max. Kael Pro Beta:
 * z-low, z-high), so the picker is one radio group split under a heading per
 * model. A level costs what its model costs; the detail panel says so.
 *
 * The picker is a native radio group (visually hidden inputs + styled
 * labels), so arrow keys, focus and screen-reader semantics are the
 * browser's own. Choosing a level swaps the detail panel with a short
 * cross-fade — motion that answers the click and nothing else.
 */
export const ThinkingLevels: React.FC = () => {
  const groupId = useId();
  const reduce = useReducedMotion() ?? false;
  const [activeId, setActiveId] = useState<string>(THINKING_LEVELS[0].id);

  const active: ThinkingLevel = THINKING_LEVELS.find((l) => l.id === activeId) ?? THINKING_LEVELS[0];
  const activeModel = MODEL_BY_ID[active.model];
  const isDefault = activeModel.defaultLevel === active.id;

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <fieldset className="m-0 flex min-w-0 flex-col gap-6 border-0 p-0">
          <legend className="sr-only">Model and thinking level</legend>
          {MODELS.map((model) => {
            const levels = THINKING_LEVELS.filter((l) => l.model === model.id);
            return (
              <div key={model.id} className="flex flex-col gap-2">
                <div className="mb-1 flex items-baseline justify-between gap-4 px-1">
                  <span className="text-sm font-medium text-ink">{model.name}</span>
                  <span className="font-mono text-xs text-ink-3">{model.id}</span>
                </div>
                {levels.map((level, i) => {
                  const inputId = `${groupId}-${level.id}`;
                  return (
                    <div key={level.id}>
                      <input
                        id={inputId}
                        type="radio"
                        name={groupId}
                        value={level.id}
                        checked={level.id === activeId}
                        onChange={() => setActiveId(level.id)}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor={inputId}
                        className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-line bg-white px-5 py-4 transition-colors hover:border-[#D2D2CD] peer-checked:border-ink peer-checked:shadow-[0_0_0_1px_var(--color-ink)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-blue"
                      >
                        <span className="flex flex-col">
                          <span className="text-[1.0625rem] font-medium text-ink">{level.label}</span>
                          <span className="text-sm text-ink-2">
                            {model.defaultLevel === level.id ? 'Default' : 'Available'}
                          </span>
                        </span>
                        <Meter filled={i + 1} total={levels.length} />
                      </label>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </fieldset>

        <div className="card-panel min-h-[320px] p-7 sm:p-9" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -8 }}
              transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="m-0 text-[1.75rem] font-medium leading-none tracking-[-0.03em] text-ink">
                  {active.label}
                </h3>
                <span className="badge-pill badge-pill-neutral">{activeModel.name}</span>
                {isDefault ? <span className="badge-pill badge-pill-neutral">Default</span> : null}
              </div>

              <p className="mb-0 mt-5 max-w-[520px] text-[1.0625rem] leading-[1.65] text-ink-2">{active.blurb}</p>

              <dl className="m-0 mt-7 grid grid-cols-2 gap-6 border-t border-line-soft pt-6">
                <div>
                  <dt className="text-sm text-ink-3">Input</dt>
                  <dd className="m-0 mt-1">
                    <span className="text-[2rem] font-medium leading-none tracking-[-0.03em] tabular-nums text-ink">
                      {activeModel.input}
                    </span>
                    <span className="mt-1.5 block text-sm leading-[1.5] text-ink-2">
                      per 1M tokens, or {activeModel.cachedInput} when cached
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-3">Output</dt>
                  <dd className="m-0 mt-1">
                    <span className="text-[2rem] font-medium leading-none tracking-[-0.03em] tabular-nums text-ink">
                      {activeModel.output}
                    </span>
                    <span className="mt-1.5 block text-sm leading-[1.5] text-ink-2">per 1M tokens</span>
                  </dd>
                </div>
              </dl>

              <p className="mb-0 mt-6 text-sm leading-[1.65] text-ink-2">
                <span className="font-medium text-ink">Good for: </span>
                {active.useFor}
              </p>
              <p className="mb-0 mt-3 text-sm leading-[1.65] text-ink-3">
                Set it with <span className="font-mono text-ink-2">reasoning_effort</span>
                {`: "${active.id}"`}, on {activeModel.name} only.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="card-panel mt-6 p-7 sm:p-9">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="m-0 text-[1.0625rem] font-medium text-ink">Every level thinks first</h3>
            <p className="mb-0 mt-2 text-sm leading-[1.65] text-ink-2">
              Thinking takes about {SPEED.thinkingTime} as long as an average AI model’s, at any level. There is
              no Off setting. Higher levels wait longer before the first word.
            </p>
          </div>
          <div>
            <h3 className="m-0 text-[1.0625rem] font-medium text-ink">Then it writes fast</h3>
            <p className="mb-0 mt-2 text-sm leading-[1.65] text-ink-2">
              Once it starts writing, expect {SPEED.tpsLow} to {SPEED.tpsHigh} tokens per second, in every mode.
            </p>
          </div>
        </div>

        <figure className="m-0 mt-8" aria-label="Output speed in tokens per second, once Kael starts writing">
          <RangeBar
            label="Output speed, all levels"
            low={SPEED.tpsLow}
            high={SPEED.tpsHigh}
            max={SPEED.tpsAxisMax}
            fillClass="bg-accent-red"
            reduce={reduce}
          />
          <div className="mt-2 flex justify-between text-xs text-ink-3" aria-hidden="true">
            {AXIS_TICKS.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </figure>
      </div>
    </div>
  );
};

export default ThinkingLevels;
