import React from 'react';
import { MODELS } from '../../data/kael';

/**
 * The two Kael models side by side: what each is for, its ID, its levels and
 * its price. Replaces the old three-step "how it works" rail. It says what
 * each model is for and never how an answer is produced (see the note at the
 * top of src/data/kael.ts).
 */
export const ModelsOverview: React.FC = () => (
  <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2">
    {MODELS.map((model, i) => (
      <li key={model.id} className="card-panel flex flex-col p-7 sm:p-9">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={`h-[15px] w-[15px] flex-none ${i === MODELS.length - 1 ? 'bg-accent-red' : 'bg-ink'}`}
          />
          <h3 className="m-0 text-[1.375rem] font-medium leading-[1.2] tracking-[-0.025em] text-ink">{model.name}</h3>
        </div>
        <p className="mb-0 mt-2 font-mono text-sm text-ink-3">{model.id}</p>
        <p className="mb-0 mt-5 text-[0.9375rem] leading-[1.65] text-ink-2">{model.bestFor}</p>

        <dl className="m-0 mt-6 grid grid-cols-1 gap-y-3 border-t border-line-soft pt-5 text-[0.9375rem]">
          <div className="flex justify-between gap-6">
            <dt className="text-ink-3">Thinking levels</dt>
            <dd className="m-0 text-right text-ink">{model.levels.join(', ')}</dd>
          </div>
          <div className="flex justify-between gap-6">
            <dt className="text-ink-3">Default level</dt>
            <dd className="m-0 text-right text-ink">{model.defaultLevel}</dd>
          </div>
          <div className="flex justify-between gap-6">
            <dt className="text-ink-3">Input / cached / output</dt>
            <dd className="m-0 text-right font-mono text-ink">
              {model.input} / {model.cachedInput} / {model.output}
            </dd>
          </div>
        </dl>
        <p className="mb-0 mt-3 text-xs text-ink-3">USD per 1M tokens.</p>
      </li>
    ))}
  </ul>
);

export default ModelsOverview;
