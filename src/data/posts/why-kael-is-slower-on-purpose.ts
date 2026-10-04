import { callout, figure, h2, p, table, ul } from '../blog-types';
import type { BlogPost } from '../blog-types';

export const post: BlogPost = {
  slug: 'why-kael-is-slower-on-purpose',
  title: 'Why Kael Is Slower, On Purpose',
  seoTitle: 'Why Kael Is Slower: Thinking Levels, Speed and Pricing Explained',
  date: '2026-10-01',
  updated: '2026-10-02',
  tag: 'Engineering',
  author: 'response-mosese',
  excerpt:
    'Kael thinks about 2.2 times longer than an average AI model, then writes fast. The numbers, the thinking levels, what each costs, and when to turn thinking off.',
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
      'Every Kael answer is drafted, checked against your request and refined before you see it, and that takes work. If you want the background, [Introducing Kael](/blog/introducing-kael) describes the design. This post is about what the design costs you in time, and how to decide how much of that time to spend.'
    ),

    h2('What slow means in numbers'),
    p(
      'With thinking on, at any level, Kael spends about 2.2 times as long thinking as an average AI model does. Once it starts writing, though, the answer streams quickly, at roughly 220 to 340 tokens per second. So the wait is at the front. The text itself arrives at a good clip.'
    ),
    p(
      'With thinking off, the first word usually arrives within 0.7 to 3 seconds, and the output runs at roughly 90 to 140 tokens per second. That is the quickest Kael gets.'
    ),
    figure(
      'speed-ranges',
      'Output speed once Kael starts writing. These ranges are what we usually see, not guarantees. Time to the first word is a separate figure: 0.7 to 3 seconds with thinking off, and longer with thinking on.'
    ),
    p(
      'We do not have published worst-case latency numbers for long prompts yet, and we would rather say that than imply otherwise.'
    ),

    h2('Choosing how much Kael thinks'),
    p(
      'You choose how much thinking a request gets, and the setting does more than a simple on-off switch. It changes how the system works on the request. Three levels are available today, plus off.'
    ),
    table(
      'Thinking levels and prices, per 1 million tokens. Cached input is billed at up to 80% off the standard input rate. Prices for Off and Auto are not listed separately here; the console shows exact numbers.',
      ['Level', 'Status', 'Input', 'Cached input', 'Output'],
      [
        ['Off', 'Available', '—', '—', '—'],
        ['Low (default)', 'Available', '$2', '$0.40', '$6'],
        ['High', 'Available', '$2', '$0.40', '$6'],
        ['Max', 'Available', '$2', '$0.40', '$6'],
        ['Auto', 'Not available yet', '—', '—', '—'],
        ['z-low, z-high', 'Not released, no date', '$6', 'Not announced', '$15'],
      ]
    ),
    p(
      'Two notes on that table. First, the z levels are not out. They are the highest levels of thinking and send requests through a different internal route that costs more; we will say more when there is a date. An Auto level, where Kael decides how much to think, is also not available yet. Second, the billing rule is simple and worth repeating: you pay for your own input tokens and the final output tokens only. The extra calls Kael makes inside the system, which can run to about twenty on a hard task, are never billed to you. The console has the exact numbers for your account.'
    ),

    h2('Rules of thumb'),
    ul(
      '**Start at Low.** It is the default for a reason. Most requests do not need more.',
      '**Move up to High or Max** when being right matters more than being quick: a security review, a large refactor, a bug that touches several files. The [research on spending extra compute](/blog/best-of-n-to-mind-evolution) points the same way: how much extra effort pays off depends on how hard the problem is.',
      '**Turn thinking off** when the question is simple and you want the fastest reply Kael can give.'
    ),

    h2('When Kael is the wrong tool'),
    p(
      'None of this makes Kael right for every job. If you need the fastest response available, if your work is mostly creative writing, if you need PDFs, video or a language other than English today, or if you need downloadable or self-hosted weights, there are better fits. If you need the answer to be correct, and a few extra seconds are a fair price for that, that is what Kael is for.'
    ),
    callout(
      'See the difference on your own prompts',
      'Run the same hard prompt at Low and at High through the [Kael API](https://platform.quancis.space) and compare the answers and the wait. Because Kael is not deterministic, run each a few times. Prices are on the [Kael API pricing](https://platform.quancis.space/pricing) page, and our [examples](/examples) page will show real outputs as we add them.'
    ),
  ],
};
