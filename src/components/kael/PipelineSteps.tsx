'use client';

import React, { useEffect, useRef, useState } from 'react';

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: '01',
    title: 'Draft',
    body: 'A first pass at the answer is produced, the same way any single model would attempt it.',
  },
  {
    n: '02',
    title: 'Check',
    body: 'The draft is reviewed against your request before it ever reaches you, catching what a single pass tends to miss. For code, this is where bugs and security vulnerabilities get caught.',
  },
  {
    n: '03',
    title: 'Refine',
    body: 'The system corrects what the check found, and only the refined result comes back as the response.',
  },
];

type Phase = 'idle' | 'armed' | 'shown';

/**
 * Draft → Check → Refine, drawn as a rail that fills left to right with each
 * step settling in after it. This is the one place on the page that plays
 * an entrance, and it is a real sequence, so the numbering and the order
 * carry meaning.
 *
 * It never hides content from anyone who would not see the motion:
 *   idle   — server render and first paint: everything visible.
 *   armed  — only set when the list starts below the fold and the visitor
 *            has not asked for reduced motion; hides it until it scrolls in.
 *   shown  — visible, with the transition applied.
 * With reduced motion, or if IntersectionObserver is missing, it goes
 * straight to 'shown' with no animation.
 */
export const PipelineSteps: React.FC = () => {
  const listRef = useRef<HTMLOListElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const alreadyOnScreen = el.getBoundingClientRect().top < window.innerHeight * 0.85;
    if (reduce || alreadyOnScreen || !('IntersectionObserver' in window)) {
      setPhase('shown');
      return;
    }

    setPhase('armed');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase('shown');
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const armed = phase === 'armed';
  const shown = phase === 'shown';

  return (
    <ol ref={listRef} className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-10 p-0 sm:grid-cols-3">
      {STEPS.map((step, i) => (
        <li
          key={step.n}
          className={`${armed ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'} ${
            shown ? 'transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none' : ''
          }`}
          style={shown ? { transitionDelay: `${i * 220}ms` } : undefined}
        >
          <div className="relative h-px bg-line" aria-hidden="true">
            <span
              className={`absolute inset-y-0 left-0 w-full origin-left bg-accent-red ${
                armed ? 'scale-x-0' : 'scale-x-100'
              } ${shown ? 'transition-transform duration-[900ms] ease-out motion-reduce:transition-none' : ''}`}
              style={shown ? { transitionDelay: `${i * 220 + 150}ms` } : undefined}
            />
            <span className="absolute -top-[3px] left-0 h-[7px] w-[7px] rounded-full bg-accent-red" />
          </div>
          <div className="pt-5">
            <span className="font-mono text-xs text-ink-3">{step.n}</span>
            <h3 className="mb-2 mt-2.5 text-[1.0625rem] font-medium text-ink">{step.title}</h3>
            <p className="m-0 text-sm leading-[1.65] text-ink-2">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default PipelineSteps;
