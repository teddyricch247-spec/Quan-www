/**
 * Everything the /kael page states as a fact lives in this one file, so a
 * price, a limit or an answer is changed in exactly one place and every
 * section (spec sheet, thinking-level picker, pricing table, FAQ, home
 * page) updates together.
 *
 * Nothing here is invented: each value comes from the founder's own
 * description of the model. If a number changes, change it here.
 */

// ---------------------------------------------------------------------------
// Thinking levels and pricing
// ---------------------------------------------------------------------------

export type LevelStatus = 'default' | 'available' | 'soon';

export interface ThinkingLevel {
  id: 'low' | 'high' | 'max' | 'z-low' | 'z-high';
  label: string;
  status: LevelStatus;
  /** USD per 1M input tokens (standard, uncached). */
  input: string;
  /** USD per 1M cached input tokens. Omitted where the cached rate has not been announced. */
  cachedInput?: string;
  /** USD per 1M output tokens. */
  output: string;
  /** What the level is. */
  blurb: string;
  /** Where it fits. Omitted for levels that are not released yet. */
  useFor?: string;
}

export const THINKING_LEVELS: ThinkingLevel[] = [
  {
    id: 'low',
    label: 'Low',
    status: 'default',
    input: '$2',
    cachedInput: '$0.40',
    output: '$6',
    blurb: 'The default. Thinking is on, at the lowest level available today.',
    useFor: 'Everyday coding and math, when you want Kael’s checking without the longest wait.',
  },
  {
    id: 'high',
    label: 'High',
    status: 'available',
    input: '$2',
    cachedInput: '$0.40',
    output: '$6',
    blurb: 'More thinking before the answer than Low.',
    useFor: 'Harder debugging, code review, and changes that touch several files.',
  },
  {
    id: 'max',
    label: 'Max',
    status: 'available',
    input: '$2',
    cachedInput: '$0.40',
    output: '$6',
    blurb: 'The most thinking available today.',
    useFor: 'Security reviews, large refactors, and anything where being right matters more than being quick.',
  },
  {
    id: 'z-low',
    label: 'z-low',
    status: 'soon',
    input: '$6',
    output: '$15',
    blurb:
      'The first level of the Z tier. Requests take a different route through the system, which costs more.',
  },
  {
    id: 'z-high',
    label: 'z-high',
    status: 'soon',
    input: '$6',
    output: '$15',
    blurb: 'The highest level of thinking Kael will offer, on the same Z-tier route as z-low.',
  },
];

export const STATUS_LABEL: Record<LevelStatus, string> = {
  default: 'Default',
  available: 'Available',
  soon: 'Not released yet',
};

export const PRICE_NOTE =
  'Prices are per 1M tokens. Cached input is billed at up to 80% off the standard input rate. You are billed for your own input tokens and the final output tokens only: the extra model calls Kael makes inside the system are never billed to you. See the console for the exact numbers.';

// ---------------------------------------------------------------------------
// Speed
// ---------------------------------------------------------------------------

export const SPEED = {
  /** Thinking on, at any level. */
  thinkingOn: {
    thinkingTime: '2.2×',
    tpsLow: 220,
    tpsHigh: 340,
  },
  /** Thinking off. */
  thinkingOff: {
    firstWordLow: '0.7',
    firstWordHigh: '3',
    tpsLow: 90,
    tpsHigh: 140,
  },
  /** Upper end of the shared axis used by the range bars. */
  tpsAxisMax: 400,
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
  { id: 'model-id', label: 'Model ID', value: 'kael-beta', mono: true, note: 'The string you pass as "model".' },
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
  {
    id: 'cutoff',
    label: 'Knowledge cutoff',
    value: 'July 2026',
    note: 'Kael is several models working together, so the cutoff can differ between components.',
  },
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
    value: 'Off, Low, High, Max',
    note: 'z-low and z-high are not released yet. An Auto level is not available yet.',
  },
  { id: 'speed', label: 'Speed', value: 'Accuracy over speed', note: 'Details in the Thinking section below.' },
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
      'No. Kael is a system, which we call the Composite Intelligence System (CIS). Fine-tuned language models, small language models, retrieval and other specialist models work together behind a single API call.',
      'From the outside it looks like one model: you send a request and get a response.',
    ],
  },
  {
    q: 'Will it work with the SDK I already use?',
    a: [
      'Yes. Kael accepts Chat Completions, the Responses API and the Anthropic Messages format, so existing SDKs and tools work without a custom client.',
      'For OpenAI-style requests you change the base URL and the model name (kael-beta) and keep the rest of your code.',
    ],
  },
  {
    q: 'Why is Kael slower than other models?',
    a: [
      'It does more work per answer. Every response goes through a draft, a check and a refinement before it reaches you. With thinking on, at any level, Kael takes about 2.2 times as long to think as an average AI model.',
      'That is a deliberate trade: we chose accuracy over speed. If you need the fastest response, turn thinking off. With thinking off, the first word usually arrives in 0.7 to 3 seconds.',
    ],
  },
  {
    q: 'Which thinking level should I use?',
    a: [
      'Start with Low, the default. Move up to High or Max when a task is hard enough that being right matters more than being quick, such as a security review or a large refactor.',
      'z-low and z-high are the highest levels and are not released yet. An Auto level, where Kael decides how much to think, is not available yet either.',
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
    q: 'What is Kael’s knowledge cutoff?',
    a: [
      'July 2026. Because Kael is several models working together, the edge of knowledge can differ between components.',
    ],
  },
  {
    q: 'Does Kael train on my data?',
    a: [
      'No. We don’t use your requests to train Kael. Its models start from open-weight models and are tuned on data generated by an earlier internal version of Kael, so nothing in that process needs customer data.',
    ],
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
      'Per million tokens. At the Low, High and Max thinking levels it is $2 for input, $0.40 for cached input (up to 80% off), and $6 for output.',
      'The Z levels will be $6 for input and $15 for output when they launch. The pricing section and the console have the exact numbers.',
    ],
  },
  {
    q: 'Where are the benchmarks?',
    a: [
      'We haven’t published any. We don’t want to grade ourselves, so we are seeking independent evaluation and plan to share the results here once there are any.',
    ],
  },
  {
    q: 'When will z-low and z-high be available?',
    a: [
      'We don’t have a date yet. They are the highest thinking levels. They send requests through a different internal route that costs more, priced at $6 for input and $15 for output per million tokens.',
    ],
  },
  {
    q: 'Am I billed for the extra model calls Kael makes inside the system?',
    a: [
      'No. You pay for your own input tokens and the final output tokens only. Whatever happens inside the system, such as extra model calls, retrieval and checking, is never billed to you.',
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
    a: ['Yes, all three.'],
  },
  {
    q: 'Which models is Kael made of?',
    a: [
      'Kael’s component models start from open-weight models and are fine-tuned by Quancis to work together inside the system. We have not published the names of the component models.',
    ],
  },
];
