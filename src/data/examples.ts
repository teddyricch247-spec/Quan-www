/**
 * Examples of what Kael actually produced, shown on /examples.
 *
 * EVERY ENTRY BELOW IS A PLACEHOLDER. Nothing here was produced by Kael.
 * To publish a real example, replace the placeholder text with the exact
 * prompt you sent and the exact output you got back (unedited), fill in
 * `recordedOn`, and set `placeholder: false`. Add more entries the same way.
 *
 * Search engines: while every entry is a placeholder the page is marked
 * noindex and left out of the sitemap, so unfinished content never appears
 * in search results. The moment one real example exists, the page becomes
 * indexable and joins the sitemap on the next build. No other change needed.
 */

export type ExampleCategory = 'Coding' | 'Security' | 'Math' | 'Agentic';
/** Kael Beta has Low, High and Max; Kael Pro Beta has z-low and z-high. There is no Off. */
export type ExampleLevel = 'Low' | 'High' | 'Max' | 'z-low' | 'z-high';

export interface KaelExample {
  id: string;
  title: string;
  category: ExampleCategory;
  /** The thinking level the request was sent with. */
  level: ExampleLevel;
  /** One sentence on what this example shows. */
  summary: string;
  /** Exactly what was sent to Kael. */
  prompt: string;
  /** Exactly what came back, unedited. */
  output: string;
  /** Optional measurements from the real run. */
  stats?: { inputTokens?: number; outputTokens?: number; seconds?: number };
  /** ISO date the output was recorded (YYYY-MM-DD). Required for real examples. */
  recordedOn?: string;
  placeholder: boolean;
}

/** The model ID every example was run against. Placeholders assume Kael Beta; if a real example used
 *  Kael Pro Beta (kael-pro-beta, z-low or z-high), say so in its summary. */
export const EXAMPLE_MODEL_ID = 'kael-beta';

const PROMPT_PLACEHOLDER =
  '[Placeholder] Paste the exact prompt you sent to Kael here, including any code or context you included.';
const OUTPUT_PLACEHOLDER =
  '[Placeholder] Paste Kael’s unedited response here. Do not tidy it up, shorten it or fix it: the point of this page is that visitors can see what comes back.';

export const EXAMPLES: KaelExample[] = [
  {
    id: 'debug-multi-file-bug',
    title: 'Tracking down a bug that spans several files',
    category: 'Coding',
    level: 'High',
    summary: 'A real bug report and the files involved, and the fix Kael proposed.',
    prompt: PROMPT_PLACEHOLDER,
    output: OUTPUT_PLACEHOLDER,
    placeholder: true,
  },
  {
    id: 'security-review-endpoint',
    title: 'A security review of an API endpoint',
    category: 'Security',
    level: 'High',
    summary: 'An endpoint with a deliberate flaw, and whether Kael finds it and explains the fix.',
    prompt: PROMPT_PLACEHOLDER,
    output: OUTPUT_PLACEHOLDER,
    placeholder: true,
  },
  {
    id: 'refactor-large-module',
    title: 'Refactoring a large module',
    category: 'Coding',
    level: 'Max',
    summary: 'A long, tangled module and the restructured version, with the reasoning for each change.',
    prompt: PROMPT_PLACEHOLDER,
    output: OUTPUT_PLACEHOLDER,
    placeholder: true,
  },
  {
    id: 'math-multi-step-problem',
    title: 'A multi-step math problem',
    category: 'Math',
    level: 'High',
    summary: 'A problem that needs several steps, with the working shown.',
    prompt: PROMPT_PLACEHOLDER,
    output: OUTPUT_PLACEHOLDER,
    placeholder: true,
  },
  {
    id: 'agent-tool-calls',
    title: 'An agent using tools to finish a task',
    category: 'Agentic',
    level: 'Low',
    summary: 'A request that needs tool calls, with the calls Kael made and the final answer.',
    prompt: PROMPT_PLACEHOLDER,
    output: OUTPUT_PLACEHOLDER,
    placeholder: true,
  },
  {
    id: 'quick-answer-low',
    title: 'A quick answer at the Low level',
    category: 'Coding',
    level: 'Low',
    summary: 'The quickest Kael gets: a simple question answered at the Low level.',
    prompt: PROMPT_PLACEHOLDER,
    output: OUTPUT_PLACEHOLDER,
    placeholder: true,
  },
];

/** True once at least one example is real. Controls indexing and the sitemap. */
export const EXAMPLES_ARE_LIVE: boolean = EXAMPLES.some((e) => !e.placeholder);
