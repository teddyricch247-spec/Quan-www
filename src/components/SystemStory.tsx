import React from 'react';

const STEPS: { title: string; body: string }[] = [
  {
    title: 'Draft',
    body: 'A first pass at the answer is produced, the way any single model would attempt it.',
  },
  {
    title: 'Check',
    body: 'That draft is reviewed against the request before it reaches you, catching what one pass tends to miss.',
  },
  {
    title: 'Refine',
    body: 'The system corrects what the check found, and only the refined result comes back.',
  },
];

/**
 * "One Intelligence. A Whole System Inside It." — the why behind the
 * three products above. The three steps are a genuine sequence (the same
 * draft, check, refine loop described on /kael), so they are drawn as one:
 * brand-mark squares on a hairline spine, the last one in the brand red.
 */
export const SystemStory: React.FC = () => {
  return (
    <div className="mx-auto grid max-w-[1160px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-6">
        <h2
          className="m-0 mb-6 font-medium text-ink leading-[1.14] tracking-[-0.032em]"
          style={{ fontSize: 'clamp(1.75rem, 3.3vw, 2.6rem)' }}
        >
          One Intelligence. A Whole System Inside It.
        </h2>

        <p className="max-w-[540px] text-ink-2 leading-[1.7]" style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.1875rem)' }}>
          Quancis comes from <em className="not-italic text-ink">quán</em>, the Chinese word for the whole. Not a
          fragment, and not a committee of parts pretending to be one thing. It&apos;s how a company works: hundreds
          of people and tools, and the world sees one name on the door.
        </p>

        <p
          className="mt-[clamp(20px,3vh,28px)] max-w-[540px] text-ink-2 leading-[1.7]"
          style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.1875rem)' }}
        >
          Kael works the same way: many intelligences, one answer. The API, Harness, and Chat are three ways of
          reaching the same system.
        </p>
      </div>

      <ol className="m-0 list-none p-0 lg:col-span-6 lg:pt-3">
        {STEPS.map((step, i) => {
          const last = i === STEPS.length - 1;
          return (
            <li key={step.title} className="relative flex gap-5 pb-9 last:pb-0">
              {!last ? <span aria-hidden="true" className="absolute left-[7px] top-6 bottom-0 w-px bg-line" /> : null}
              <span
                aria-hidden="true"
                className={`relative mt-[0.4em] h-[15px] w-[15px] flex-none ${last ? 'bg-accent-red' : 'bg-ink'}`}
              />
              <div>
                <h3 className="m-0 text-[1.0625rem] font-medium tracking-[-0.015em] text-ink">{step.title}</h3>
                <p className="mt-1.5 max-w-[440px] text-[0.9375rem] leading-[1.65] text-ink-2">{step.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default SystemStory;
