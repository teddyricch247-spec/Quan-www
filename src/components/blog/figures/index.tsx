import React from 'react';
import type { FigureId } from '../../../data/blog-types';
import { FlowFigure } from '../FlowFigure';
import { BarFigure } from '../BarFigure';
import { RangeFigure } from '../RangeFigure';

/**
 * Every figure used in a blog post lives here, keyed by the id a post names
 * in its `figure(...)` block. The numbers in the charts are the numbers the
 * cited papers and reports publish; each figure's caption in the post says
 * where they come from. Diagrams that illustrate an idea (rather than report
 * a measurement) say so in their caption.
 */
export const FIGURES: Record<FigureId, React.ReactElement> = {
  'three-families': (
    <FlowFigure
      label="Three ways to use many samples: Best-of-N picks one, Fusion-of-N writes a new answer from all of them, Mind Evolution improves the pool over several generations."
      lanes={[
        {
          title: 'Best-of-N',
          note: 'Pick the winner.',
          steps: [
            { label: 'Sample N answers', detail: 'Independent attempts at the same prompt.' },
            { label: 'Score each one', detail: 'A verifier, a reward model or a test suite.' },
            { label: 'Return the top scorer', detail: 'The other N − 1 are thrown away.', highlight: true },
          ],
        },
        {
          title: 'Fusion-of-N',
          note: 'Write a new answer from the pool.',
          steps: [
            { label: 'Sample N answers', detail: 'Same pool as before.' },
            { label: 'Show them all to a fusor', detail: 'A strong LLM reads every candidate.' },
            { label: 'Return a synthesis', detail: 'It can take the best parts of several.', highlight: true },
          ],
        },
        {
          title: 'Mind Evolution',
          note: 'Improve the pool, generation by generation.',
          steps: [
            { label: 'Sample a population', detail: 'Many complete candidate solutions.' },
            { label: 'Evaluate with feedback', detail: 'A checker scores each one and says what is wrong.' },
            { label: 'Critic and author rewrite', detail: 'Parents are picked by score and recombined.' },
            { label: 'Return the best survivor', detail: 'When one passes, or the budget runs out.', highlight: true },
          ],
          loop: 'Steps two and three repeat. Separate “islands” of candidates evolve on their own so the pool stays diverse.',
        },
      ]}
    />
  ),

  'repeated-sampling': (
    <BarFigure
      label="Share of SWE-bench Lite issues solved: 15.9 percent with one sample, 56 percent with 250 samples, against 43 percent for the best single-attempt result at the time."
      rows={[
        {
          label: 'One sample',
          value: 15.9,
          note: 'DeepSeek-Coder-V2-Instruct, one attempt per issue.',
        },
        {
          label: '250 samples',
          value: 56,
          highlight: true,
          note: 'Same model, same benchmark: the share of issues where at least one of 250 attempts worked.',
        },
        {
          label: 'Best single-attempt result at the time',
          value: 43,
          note: 'Reported by the authors, using more capable frontier models.',
        },
      ]}
    />
  ),

  travelplanner: (
    <BarFigure
      label="Success rate on the TravelPlanner validation set with Gemini 1.5 Flash: one pass 5.6 percent, Best-of-N 55.6 percent, sequential revision 82.8 percent, Mind Evolution 95.6 percent."
      rows={[
        { label: 'One pass', value: 5.6, note: '1 model call.' },
        {
          label: 'Best-of-N',
          value: 55.6,
          note: 'Up to 800 independent candidates; about 472 model calls per problem on average.',
        },
        {
          label: 'Sequential revision',
          value: 82.8,
          note: 'Ten candidates, each revised for up to 80 turns; about 280 calls per problem.',
        },
        {
          label: 'Mind Evolution',
          value: 95.6,
          highlight: true,
          note: 'About 174 calls per problem on average, with the same 800-candidate ceiling.',
        },
      ]}
    />
  ),

  'mind-evolution-ablation': (
    <BarFigure
      label="Mind Evolution ablation on TravelPlanner: 46.1 percent with the evolutionary search alone, rising to 95.6 percent as the critic, task prompts, textual feedback and LLM-chosen resets are added."
      rows={[
        { label: 'Evolutionary search alone', value: 46.1, note: 'No critic, no task prompts, no textual feedback.' },
        { label: '+ critic', value: 71.1, note: 'A separate “critic” turn before the author rewrites.' },
        { label: '+ task-specific critic instructions', value: 76.1, note: 'The paper’s “Strategy/Question” prompts.' },
        {
          label: '+ textual feedback from the evaluator',
          value: 91.1,
          note: 'The checker says in words what is wrong, not just a score.',
        },
        { label: '+ LLM-chosen island resets (full method)', value: 95.6, highlight: true },
      ]}
    />
  ),

  'kael-loop': (
    <FlowFigure
      label="Inside one Kael request: a draft is written, checked against the request, then refined, and only the refined answer is returned."
      lanes={[
        {
          title: 'One request to Kael',
          note: 'Request in, refined answer out.',
          steps: [
            { label: 'Draft', detail: 'A first answer, the way any single model would attempt it.' },
            {
              label: 'Check',
              detail: 'The draft is reviewed against what you asked. For code: bugs and security issues.',
            },
            { label: 'Refine', detail: 'The system corrects what the check found.', highlight: true },
          ],
          loop: 'Easy requests can take as few as one internal call. Hard ones use up to about twenty, retrieval included.',
        },
      ]}
    />
  ),

  'speed-ranges': (
    <RangeFigure
      label="Output speed in tokens per second: 220 to 340 with thinking on, 90 to 140 with thinking off."
      unit="tokens/sec"
      axisMax={400}
      ticks={[0, 100, 200, 300, 400]}
      rows={[
        { label: 'Thinking on, any level', low: 220, high: 340, highlight: true },
        { label: 'Thinking off', low: 90, high: 140 },
      ]}
    />
  ),

  'security-pipeline': (
    <FlowFigure
      label="A review pipeline for machine-written code: generate, static analysis, tests including abuse cases, a model check, then human review of the risky parts."
      lanes={[
        {
          title: 'A review pipeline for machine-written code',
          note: 'Each layer catches things the one before it misses.',
          steps: [
            { label: 'Generate', detail: 'The assistant writes the change.' },
            { label: 'Static analysis', detail: 'CodeQL, Semgrep or Bandit, plus a secret scanner.' },
            { label: 'Tests, with abuse cases', detail: 'Not only “does it work” but “can it be misused”.' },
            { label: 'A model check', detail: 'A separate pass with a security-focused brief.' },
            {
              label: 'Human review',
              detail: 'Authorisation, data access and anything that touches money.',
              highlight: true,
            },
          ],
        },
      ]}
    />
  ),

  'veracode-failures': (
    <BarFigure
      label="Share of Veracode test cases that ended with insecure code: 45 percent overall, 86 percent for cross-site scripting, 88 percent for log injection."
      rows={[
        {
          label: 'All test cases',
          value: 45,
          note: '80 coding tasks across more than 100 models; the code contained a flaw from the OWASP Top 10 classes.',
        },
        { label: 'Cross-site scripting (CWE-80)', value: 86, highlight: true },
        { label: 'Log injection (CWE-117)', value: 88, highlight: true },
      ]}
    />
  ),
};
