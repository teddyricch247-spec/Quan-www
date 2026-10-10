/**
 * Everything the /kael page states as a fact lives in this one file, so a
 * price, a limit or an answer is changed in exactly one place and every
 * section (spec sheet, thinking-level picker, pricing table, FAQ, home
 * page) updates together.
 *
 * Source of truth: the Quan Platform. Models, levels and prices come from
 * backend/app/models/kael/config.py (KAEL_BETA, KAEL_PRO_BETA) and are
 * mirrored by frontend/src/components/docs/facts.ts there. Limits come from
 * backend/app/rate_limit.py. If a number here and the Platform disagree, the
 * Platform wins: fix this file.
 *
 * Rule carried over from the Platform: say what each model is FOR, never how
 * Kael produces an answer (no steps, passes, call counts, components or
 * providers). The blog posts are the one place that discusses the research
 * behind the idea, and they are not edited with this file.
 *
 * Last checked against the Platform: 2026-10-10 (prices as of 2026-10-08).
 */

// ---------------------------------------------------------------------------
// Models, thinking levels and pricing
// ---------------------------------------------------------------------------

export type ModelId = 'kael-beta' | 'kael-pro-beta';
export type LevelId = 'low' | 'high' | 'max' | 'z-low' | 'z-high';

export interface ModelInfo {
  id: ModelId;
  name: string;
  /** One line: what it is for. */
  bestFor: string;
  /** Levels this model accepts, in order. A model accepts only its own. */
  levels: LevelId[];
  defaultLevel: LevelId;
  /** USD per 1M tokens, as display strings. Cached input is exactly 20% of input. */
  input: string;
  cachedInput: string;
  output: string;
}

export const MODELS: ModelInfo[] = [
  {
    id: 'kael-beta',
    name: 'Kael Beta',
    bestFor: 'Most work: everyday reasoning, coding, debugging and review. The lower-priced model.',
    levels: ['low', 'high', 'max'],
    defaultLevel: 'low',
    input: '$3.00',
    cachedInput: '$0.60',
    output: '$10.00',
  },
  {
    id: 'kael-pro-beta',
    name: 'Kael Pro Beta',
    bestFor: 'The hardest problems, where extra thoroughness is worth a higher price per token.',
    levels: ['z-low', 'z-high'],
    defaultLevel: 'z-low',
    input: '$8.00',
    cachedInput: '$1.60',
    output: '$25.00',
  },
];

export const MODEL_BY_ID: Record<ModelId, ModelInfo> = {
  'kael-beta': MODELS[0],
  'kael-pro-beta': MODELS[1],
};

export interface ThinkingLevel {
  id: LevelId;
  label: string;
  model: ModelId;
  /** What the level is. */
  blurb: string;
  /** Where it fits. */
  useFor: string;
}

export const THINKING_LEVELS: ThinkingLevel[] = [
  {
    id: 'low',
    label: 'Low',
    model: 'kael-beta',
    blurb: 'The default for Kael Beta, and its quickest level. Kael still thinks before it answers.',
    useFor: 'Everyday questions, quick edits and short answers.',
  },
  {
    id: 'high',
    label: 'High',
    model: 'kael-beta',
    blurb: 'More thinking before the first word than Low.',
    useFor: 'Debugging, code review and problems with several steps.',
  },
  {
    id: 'max',
    label: 'Max',
    model: 'kael-beta',
    blurb: 'The most thinking Kael Beta does, and the slowest to start.',
    useFor: 'Security reviews, large refactors, and anything you will act on without checking.',
  },
  {
    id: 'z-low',
    label: 'z-low',
    model: 'kael-pro-beta',
    blurb: 'The default for Kael Pro Beta, the more thorough model.',
    useFor: 'Demanding work.',
  },
  {
    id: 'z-high',
    label: 'z-high',
    model: 'kael-pro-beta',
    blurb: 'The most thorough level Kael offers.',
    useFor: 'The hardest problems, and work you will act on without checking.',
  },
];

export const PRICE_NOTE =
  'Prices are per 1M tokens. Cached input is billed at $0.60 on Kael Beta and $1.60 on Kael Pro Beta, which is 80% below the input price, and only for the part of a request that actually hits the cache. Every level of a model costs the same per token; a higher level thinks for longer, so a request takes more time and can use more tokens. You are billed once, for your input and the final answer, nothing else. See the console for the exact numbers.';

// ---------------------------------------------------------------------------
// Speed
// ---------------------------------------------------------------------------

export const SPEED = {
  /** How long Kael thinks, compared with an average AI model. Any level. */
  thinkingTime: '2.2×',
  /** Output speed once Kael starts writing: the same in every mode. */
  tpsLow: 270,
  tpsHigh: 340,
  /** Upper end of the axis used by the range bar. */
  tpsAxisMax: 400,
} as const;

// ---------------------------------------------------------------------------
// Limits (Platform: backend/app/rate_limit.py, shown in the Platform docs)
// ---------------------------------------------------------------------------

export const LIMITS = {
  requestsPerMinute: 150,
  concurrentRequests: 30,
  timeoutMinutes: 8,
} as const;

// ---------------------------------------------------------------------------
// Spec sheet
// ---------------------------------------------------------------------------

export interface Spec {
  id: string;
  label: string;
  value: string;
  note?: string;
  mono?: boolean;
}

export const SPECS: Spec[] = [
  {
    id: 'model-id',
    label: 'Model IDs',
    value: 'kael-beta, kael-pro-beta',
    mono: true,
    note: 'Two models. The string you pass as "model".',
  },
  { id: 'status', label: 'Status', value: 'Beta', note: 'Things will change as we learn from real use.' },
  { id: 'context', label: 'Context window', value: '1M tokens', note: 'Input per request.' },
  { id: 'output', label: 'Max output', value: '128k tokens', note: 'Per response.' },
  {
    id: 'input',
    label: 'Input',
    value: 'Text and images',
    note: 'PDFs, video and other file types are on the way, not in the beta yet.',
  },
  { id: 'output-type', label: 'Output', value: 'Text' },
  {
    id: 'languages',
    label: 'Languages',
    value: 'English',
    note: 'Other languages have not been tested, so they are not listed as supported.',
  },
  { id: 'cutoff', label: 'Knowledge cutoff', value: 'July 2026' },
  {
    id: 'formats',
    label: 'API formats',
    value: 'Chat Completions, Responses API, Anthropic Messages',
    note: 'Use the SDK you already have.',
  },
  { id: 'weights', label: 'Weights', value: 'Closed', note: 'Available through the API and our apps.' },
  {
    id: 'thinking',
    label: 'Thinking levels',
    value: 'Kael Beta: Low, High, Max. Kael Pro Beta: z-low, z-high',
    note: 'Every level thinks first. There is no Off setting and no Auto level.',
  },
  {
    id: 'limits',
    label: 'Rate limits',
    value: `${LIMITS.requestsPerMinute} requests a minute, ${LIMITS.concurrentRequests} at once`,
    note: `Per account, across both models. A request can run for up to ${LIMITS.timeoutMinutes} minutes.`,
  },
  {
    id: 'speed',
    label: 'Speed',
    value: 'Accuracy over speed',
    note: `Expect ${SPEED.tpsLow} to ${SPEED.tpsHigh} tokens per second in every mode. Details in the Thinking section below.`,
  },
];

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export interface FaqItem {
  q: string;
  a: string[];
}

export const FAQ: FaqItem[] = [
  {
    q: 'Is Kael one model?',
    a: [
      'No. Kael comes as two models: Kael Beta (kael-beta) and Kael Pro Beta (kael-pro-beta). Kael Beta is for most work. Kael Pro Beta is the most thorough, for the hardest problems, and it costs more per token.',
      'You call either one the same way, with the same key and the same request formats. Only the model name changes.',
    ],
  },
  {
    q: 'Will it work with the SDK I already use?',
    a: [
      'Yes. Kael accepts Chat Completions, the Responses API and the Anthropic Messages format, so existing SDKs and tools work without a custom client.',
      'For OpenAI-style requests you change the base URL and the model name (kael-beta or kael-pro-beta) and keep the rest of your code.',
    ],
  },
  {
    q: 'Why is Kael slower than other models?',
    a: [
      'Kael favours correctness over speed, so it thinks before it writes. At any level, Kael takes about 2.2 times as long to think as an average AI model. Kael Pro Beta is slower again.',
      'Once it starts writing, expect 270 to 340 tokens per second, in every mode. There is no setting that turns thinking off: every level thinks first. For the quickest replies, use Kael Beta at its default level, Low.',
    ],
  },
  {
    q: 'Which model and thinking level should I use?',
    a: [
      'Start with Kael Beta at Low, the default. Move up to High or Max when a task is hard enough that being right matters more than being quick, such as a security review or a large refactor.',
      'Use Kael Pro Beta for the hardest problems, where its extra thoroughness is worth the higher price. Its levels are z-low (the default) and z-high. A model accepts only its own levels.',
    ],
  },
  {
    q: 'What are z-low and z-high?',
    a: [
      'They are the two thinking levels of Kael Pro Beta, and they are available now. z-low is the default and z-high is the most thorough level Kael offers. You set them with reasoning_effort, the same way you set Low, High and Max on Kael Beta.',
    ],
  },
  {
    q: 'Can Kael read images, PDFs and video?',
    a: [
      'Images, yes. Kael takes text and images as input and returns text.',
      'PDFs, video and other file types are on the way, but they are not available in the beta.',
    ],
  },
  {
    q: 'Which languages does Kael support?',
    a: ['English. Other languages have not been tested yet, so we don’t list them as supported.'],
  },
  {
    q: 'What is the context window?',
    a: ['1 million tokens of input and up to 128,000 tokens of output per request.'],
  },
  {
    q: 'What are the rate limits?',
    a: [
      `${LIMITS.requestsPerMinute} requests per minute and ${LIMITS.concurrentRequests} requests at once, per account, counted across both models together.`,
      `A request can run for up to ${LIMITS.timeoutMinutes} minutes, so set your client’s timeout above that, or stream the response.`,
    ],
  },
  {
    q: 'What is Kael’s knowledge cutoff?',
    a: ['July 2026.'],
  },
  {
    q: 'Does Kael train on my data?',
    a: ['No. We don’t use your requests to train Kael.'],
  },
  {
    q: 'How long do you keep my requests?',
    a: [
      'Up to 15 minutes, so cache hits can be calculated. After that, requests are not stored in a database.',
      'The exception is anything our safety system flags as harmful. Those are kept until our support team has reviewed them. The data section above and the Privacy Policy cover the details.',
    ],
  },
  {
    q: 'Can I download or self-host Kael?',
    a: ['No. Kael is closed: the weights are not released. It is available through the API and our apps.'],
  },
  {
    q: 'Is Kael good at creative writing?',
    a: [
      'It can write stories and other creative text, but that is not what it is tuned for. Kael is strongest at coding, security, software engineering, agentic work and math.',
      'If writing is your main use case, Kael is probably not the best fit today.',
    ],
  },
  {
    q: 'How is Kael priced?',
    a: [
      'Per million tokens, and each model has its own price. Kael Beta is $3.00 for input, $0.60 for cached input and $10.00 for output, at every level. Kael Pro Beta is $8.00 for input, $1.60 for cached input and $25.00 for output, at both levels.',
      'The pricing section and the console have the exact numbers.',
    ],
  },
  {
    q: 'What am I billed for?',
    a: [
      'You are billed once, for your own input tokens and the final output tokens. Nothing else is added to your bill.',
    ],
  },
  {
    q: 'Where are the benchmarks?',
    a: [
      'We haven’t published any. We don’t want to grade ourselves, so we are seeking independent evaluation and plan to share the results here once there are any.',
    ],
  },
  {
    q: 'Can I set the temperature?',
    a: [
      'You can send it, so existing code does not break, but Kael does not use it. Sampling parameters are accepted and ignored, which means output is not deterministic and runs can vary.',
    ],
  },
  {
    q: 'Does Kael support streaming, tool calls and JSON mode?',
    a: [
      'Streaming and tool calls, yes, on all three request formats. Tool calling works with your own function tools; Kael has no built-in web search or code execution.',
      'JSON mode, no. response_format is accepted but not enforced, so ask for JSON in your prompt and validate what comes back. tool_choice and max_tokens are accepted but not enforced either.',
    ],
  },
  {
    q: 'What is Kael built on?',
    a: [
      'Quancis does not publish how Kael is built or which components it uses, and Kael will not say. The weights are closed.',
    ],
  },
];
