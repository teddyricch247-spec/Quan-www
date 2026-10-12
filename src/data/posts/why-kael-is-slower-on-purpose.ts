import { callout, figure, h2, p, table, ul } from '../blog-types';
import type { BlogPost } from '../blog-types';
import { LIMITS, MODELS, SPEED, THINKING_LEVELS } from '../kael';

// The numbers in this post (speed, limits, models, levels, prices) are read from
// src/data/kael.ts, the one file the /kael page also reads, so the two cannot
// drift apart again. Change them there.
const levelLabel = (id: string): string => THINKING_LEVELS.find((l) => l.id === id)?.label ?? id;

const PRICE_ROWS: string[][] = MODELS.map((m) => [
  m.name,
  m.levels.map((id) => `${levelLabel(id)}${id === m.defaultLevel ? ' (default)' : ''}`).join(', '),
  m.input,
  m.cachedInput,
  m.output,
]);

export const post: BlogPost = {
  slug: 'why-kael-is-slower-on-purpose',
  title: 'Why Kael Is Slower, On Purpose',
  seoTitle: 'Why Kael Is Slower: Thinking Levels, Speed and Pricing Explained',
  date: '2026-10-01',
  updated: '2026-10-11',
  tag: 'Engineering',
  author: 'response-mosese',
  excerpt: `Kael thinks about ${SPEED.thinkingTime} longer than an average AI model, then writes at ${SPEED.tpsLow} to ${SPEED.tpsHigh} tokens per second. The numbers, the two models and their thinking levels, and what each costs.`,
  keywords: [
    'Kael speed',
    'Kael thinking levels',
    'Kael API pricing',
    'AI model latency',
    'accuracy vs speed',
  ],
  ogImage: '/og/why-kael-is-slower-on-purpose.png',
  related: ['introducing-kael', 'ai-generated-code-security-review'],
  body: [
    p(
      'Kael takes longer to answer than most models. That is not a limitation we are working around. It is the trade we chose: accuracy over speed.'
    ),
    p(
      'Kael thinks before it answers, at every level, and thinking takes time. [The Thinking Behind Kael](/blog/the-thinking-behind-kael) explains why we believe it is worth it. This post is about what it costs you in time, and how to decide how much of that time to spend.'
    ),

    h2('What slow means in numbers'),
    p(
      `At any level, Kael spends about ${SPEED.thinkingTime} as long thinking as an average AI model does. Once it starts writing, though, the answer streams quickly, at roughly ${SPEED.tpsLow} to ${SPEED.tpsHigh} tokens per second, in every mode. So the wait is at the front. The text itself arrives at a good clip.`
    ),
    p(
      'There is no setting that turns thinking off: every level thinks first. Kael Pro Beta, the more thorough model, is slower again.'
    ),
    figure(
      'speed-ranges',
      'Output speed once Kael starts writing. This is the range we usually see, not a guarantee. Time to the first word is not a fixed figure: it depends on the level and on the request.'
    ),
    figure(
      'wait-at-the-front',
      'The shape of the wait, as a schematic. Kael thinks for about 2.2 times as long as an average AI model before the first word, and the text then arrives quickly. Only the thinking time is drawn to that ratio; the drawing is not otherwise to scale, and the other model’s writing speed is not shown.'
    ),
    p(
      `We do not have published worst-case latency numbers for long prompts yet, and we would rather say that than imply otherwise. Hard requests can run for many minutes, so stream the response, or set your client’s timeout to ${LIMITS.clientTimeoutMinutes} minutes or more.`
    ),

    h2('Choosing how much Kael thinks'),
    p(
      'Kael comes in two models, and each has its own thinking levels. Kael Beta accepts Low (the default), High and Max. Kael Pro Beta accepts z-low (the default) and z-high. A model accepts only its own levels. A higher level thinks for longer before the first word, so the request takes more time and can use more tokens.'
    ),
    figure(
      'thinking-stack',
      'The Kael Beta levels pictured as scratch paper. A schematic: it shows that each level allows more thinking, not how much any level uses.'
    ),
    table(
      'Models, levels and prices, per 1 million tokens, as of 8 October 2026. Cached input is billed 80% below the input price, and only for the part of a request that hits the cache. Every level of a model costs the same per token. The console has the exact numbers.',
      ['Model', 'Levels', 'Input', 'Cached input', 'Output'],
      PRICE_ROWS
    ),
    p(
      'The billing rule is simple and worth repeating: you are billed once, for your own input tokens and the final output tokens. Nothing else is added to your bill. The price per token does not change with the level, but a higher level thinks for longer, so it can use more tokens.'
    ),

    h2('Rules of thumb'),
    ul(
      '**Start with Kael Beta at Low.** It is the default for a reason. Most requests do not need more.',
      '**Move up to High or Max** when being right matters more than being quick: a security review, a large refactor, a bug that touches several files. The [research on spending extra compute](/blog/best-of-n-to-mind-evolution) points the same way: how much extra effort pays off depends on how hard the problem is.',
      '**Use Kael Pro Beta** for the hardest problems, where its extra thoroughness is worth a higher price per token.',
      '**Want the quickest reply Kael can give?** Use Kael Beta at Low. There is no off switch, and Low is its quickest level.'
    ),

    h2('When Kael is the wrong tool'),
    p(
      'None of this makes Kael right for every job. If you need the fastest response available, if your work is mostly creative writing, if you need PDFs, video or a language other than English today, or if you need downloadable or self-hosted weights, there are better fits. If you need the answer to be correct, and a few extra seconds are a fair price for that, that is what Kael is for.'
    ),
    callout(
      'See the difference on your own prompts',
      'Run the same hard prompt at Low and at High through the [Kael API](https://platform.quancis.space) and compare the answers and the wait. Because Kael is not deterministic, run each a few times. Prices are on the [Kael API pricing](https://platform.quancis.space/pricing) page, and the [demos](/kael/demo) show real outputs, each with the exact prompt, model, level, tokens and time.'
    ),
  ],
};
