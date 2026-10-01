'use client';

import React, { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SPEED, STATUS_LABEL, THINKING_LEVELS } from '../../data/kael';

const AXIS_TICKS = [0, 100, 200, 300, 400];

/** Five segments; the first `filled` are lit. Ordinal position, not a score. */
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
 * Thinking-level picker plus the speed numbers.
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

  const activeIndex = Math.max(
    0,
    THINKING_LEVELS.findIndex((l) => l.id === activeId)
  );
  const active = THINKING_LEVELS[activeIndex];

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <fieldset className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
          <legend className="sr-only">Thinking level</legend>
          {THINKING_LEVELS.map((level, i) => {
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
                    <span className={`text-sm ${level.status === 'soon' ? 'text-ink-3' : 'text-ink-2'}`}>
                      {STATUS_LABEL[level.status]}
                    </span>
                  </span>
                  <Meter filled={i + 1} total={THINKING_LEVELS.length} />
                </label>
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
                <span className="badge-pill badge-pill-neutral">{STATUS_LABEL[active.status]}</span>
              </div>

              <p className="mb-0 mt-5 max-w-[520px] text-[1.0625rem] leading-[1.65] text-ink-2">{active.blurb}</p>

              <dl className="m-0 mt-7 grid grid-cols-2 gap-6 border-t border-line-soft pt-6">
                <div>
                  <dt className="text-sm text-ink-3">Input</dt>
                  <dd className="m-0 mt-1">
                    <span className="text-[2rem] font-medium leading-none tracking-[-0.03em] tabular-nums text-ink">
                      {active.input}
                    </span>
                    <span className="mt-1.5 block text-sm leading-[1.5] text-ink-2">
                      per 1M tokens, at up to 80% cache hit
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-3">Output</dt>
                  <dd className="m-0 mt-1">
                    <span className="text-[2rem] font-medium leading-none tracking-[-0.03em] tabular-nums text-ink">
                      {active.output}
                    </span>
                    <span className="mt-1.5 block text-sm leading-[1.5] text-ink-2">per 1M tokens</span>
                  </dd>
                </div>
              </dl>

              <p className="mb-0 mt-6 text-sm leading-[1.65] text-ink-2">
                {active.useFor ? (
                  <>
                    <span className="font-medium text-ink">Good for: </span>
                    {active.useFor}
                  </>
                ) : (
                  'Not released yet, and there is no launch date.'
                )}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="card-panel mt-6 p-7 sm:p-9">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="m-0 text-[1.0625rem] font-medium text-ink">Thinking on, at any level</h3>
            <p className="mb-0 mt-2 text-sm leading-[1.65] text-ink-2">
              Thinking takes about {SPEED.thinkingOn.thinkingTime} as long as an average AI model’s. Once it starts
              writing, the answer streams out fast.
            </p>
          </div>
          <div>
            <h3 className="m-0 text-[1.0625rem] font-medium text-ink">Thinking off</h3>
            <p className="mb-0 mt-2 text-sm leading-[1.65] text-ink-2">
              With auto-thinking off too, the first word usually arrives in {SPEED.thinkingOff.firstWordLow} to{' '}
              {SPEED.thinkingOff.firstWordHigh} seconds.
            </p>
          </div>
        </div>

        <figure className="m-0 mt-8" aria-label="Output speed in tokens per second, thinking on versus off">
          <div className="flex flex-col gap-5">
            <RangeBar
              label="Thinking on"
              low={SPEED.thinkingOn.tpsLow}
              high={SPEED.thinkingOn.tpsHigh}
              max={SPEED.tpsAxisMax}
              fillClass="bg-accent-red"
              reduce={reduce}
            />
            <RangeBar
              label="Thinking off"
              low={SPEED.thinkingOff.tpsLow}
              high={SPEED.thinkingOff.tpsHigh}
              max={SPEED.tpsAxisMax}
              fillClass="bg-ink"
              reduce={reduce}
            />
          </div>
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
