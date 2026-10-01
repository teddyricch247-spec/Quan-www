export type BlogTag = 'Product' | 'Engineering' | 'Company';

export interface BlogPost {
  slug: string;
  title: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  excerpt: string;
  tag: BlogTag;
  body: string[];
}

/**
 * Add a post by adding an object to BLOG_POSTS; its page at /blog/[slug] is
 * generated automatically at build time, and it appears in the sitemap.
 * Each string in `body` is one paragraph.
 *
 * Dates below are the day these drafts were written. Change `date` to the
 * day you actually publish.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'introducing-kael',
    title: 'Introducing Kael',
    date: '2026-10-01',
    tag: 'Product',
    excerpt:
      'Kael is a composite intelligence: a system of models that drafts, checks and refines every answer, behind an API that works with the SDKs you already use. It is in beta today.',
    body: [
      'Kael is not one model. It is a system, which we call the Composite Intelligence System, or CIS: fine-tuned language models, small language models, retrieval and other specialist models working together behind a single API call. From the outside it behaves like any other chat model. You send a request and you get a response.',
      'What happens in between is the point. Every answer is drafted, checked against what you asked, and refined before it reaches you. For code, that is where bugs and security vulnerabilities get caught, and where we aim to stop them being introduced at all. Kael is built for people who want accuracy more than speed, and it is strongest at coding, security, software engineering, agentic work and math.',
      'There is nothing new to learn to use it. Kael accepts Chat Completions, the Responses API and the Anthropic Messages format. For OpenAI-style requests you change the base URL to https://api.quancis.space/v1, use the model name kael-beta, and keep the rest of your code.',
      'The current beta takes text and images as input and returns text. The context window is 1 million tokens of input with up to 128,000 tokens of output, and the knowledge cutoff is July 2026. Kael is built for English today, and other languages have not been tested. It is a closed model, available through the API and our apps. PDFs, video and other file types are on the way, but they are not in the beta yet.',
      'We have not published benchmark numbers, and we are not publishing ones we ran ourselves. Independent evaluations are in progress, and we plan to share the results on the Kael page once they are in. Until then, the fastest way to judge Kael is to point your existing SDK at it and run your hardest prompts.',
      'Kael is also the system behind Quan Harness, our coding agent, and Quan Chat, our assistant. Same intelligence, three ways in.',
    ],
  },
  {
    slug: 'why-kael-is-slower-on-purpose',
    title: 'Why Kael Is Slower, On Purpose',
    date: '2026-10-01',
    tag: 'Engineering',
    excerpt:
      'Kael thinks about 2.2 times longer than an average AI model, then writes fast. Here are the numbers, the five thinking levels, and when to turn thinking off.',
    body: [
      'Kael takes longer to answer than most models. That is not a limitation we are working around. It is the trade we chose: accuracy over speed.',
      'With thinking on, at any level, Kael takes about 2.2 times as long to think as an average AI model. Once it starts writing, the answer streams out at between 220 and 340 tokens per second. If you switch thinking off entirely, including auto-thinking, the first word usually arrives within 0.7 to 3 seconds, at roughly 90 to 140 tokens per second.',
      'You choose how much thinking a request gets. Kael has five thinking levels. Low is the default, and High and Max add more thinking. At those three levels, input costs $2 per million tokens, at up to an 80% cache hit rate, and output costs $6 per million. Two more levels, z-low and z-high, are not released yet. They are the highest levels of thinking, and they send requests through a different internal route that costs more and produces better results. They will be priced at $6 per million input tokens, at up to an 80% cache hit rate, and $15 per million output tokens.',
      'In practice: start at Low. Move up to High or Max when a task is hard enough that being right matters more than being quick, such as a security review, a large refactor, or a bug that touches several files. Turn thinking off when you need the quickest possible reply and the question is simple.',
      'None of this makes Kael the right tool for every job. If you need the fastest response available, or your work is mostly creative writing, there are better fits. If you need the answer to be correct, that is what Kael is for.',
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  // Newest first. Equal dates return 0 so the sort (stable) keeps the order the
  // posts are written in, instead of an undefined order.
  return [...BLOG_POSTS].sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllTags(): BlogTag[] {
  return Array.from(new Set(BLOG_POSTS.map((p) => p.tag)));
}
