import React from 'react';

const STEPS: { title: string; body: string }[] = [
  {
    title: 'Accuracy over speed',
    body: 'Kael thinks before it answers, and takes longer than most models on purpose.',
  },
  {
    title: 'Two models',
    body: 'Kael Beta for most work. Kael Pro Beta, the most thorough, for the hardest problems.',
  },
  {
    title: 'Honest limits',
    body: 'Text and images in, English only, and no benchmark numbers until independent results exist.',
  },
];

/**
 * "One Name. Built For Accuracy." — the why behind the three products above.
 * The three points say what Kael is for, never how it produces an answer. They
 * are drawn as brand-mark squares on a hairline spine, the last one in the
 * brand red.
 */
export const SystemStory: React.FC = () => {
  return (
    <div className="mx-auto grid max-w-[1160px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-6">
        <h2
          className="m-0 mb-6 font-medium text-ink leading-[1.14] tracking-[-0.032em]"
          style={{ fontSize: 'clamp(1.75rem, 3.3vw, 2.6rem)' }}
        >
          One Name. Built For Accuracy.
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
          Kael is that idea applied to answers: one Kael, in two models, built to be right. The API, Harness, and
          Chat are three ways of reaching it.
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
