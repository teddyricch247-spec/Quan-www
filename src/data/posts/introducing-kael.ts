import { callout, code, h2, p, table } from '../blog-types';
import type { BlogPost } from '../blog-types';

// Editorial rule for this post, and for any post about Kael: say what Kael is
// for and how to use it, never how it produces an answer. Quancis does not
// publish how Kael is built (see About and src/data/kael.ts), so there are no
// steps, call counts or component lists here. The research behind the idea is
// in "The Thinking Behind Kael" and "From Best-of-N to Mind Evolution", which
// are written as research notes and say so.

export const post: BlogPost = {
  slug: 'introducing-kael',
  title: 'Introducing Kael',
  seoTitle: 'Introducing Kael: Built for Accuracy, in Beta',
  date: '2026-10-01',
  updated: '2026-10-11',
  tag: 'Product',
  author: 'response-mosese',
  excerpt:
    'Kael is built to be right more than it is built to be fast: two models behind one API that works with the SDKs you already use. It is in beta, and sign-up is open to anyone.',
  keywords: [
    'Kael',
    'Kael API',
    'Kael Beta',
    'Kael Pro Beta',
    'OpenAI-compatible API',
    'AI coding API',
    'Quancis',
  ],
  ogImage: '/og/introducing-kael.png',
  related: ['the-thinking-behind-kael', 'why-kael-is-slower-on-purpose'],
  body: [
    p(
      'Kael is built for accuracy. It comes as two models, Kael Beta and Kael Pro Beta, behind one API. From the outside it behaves like any other chat model: you send a request and you get a response.'
    ),
    p(
      'Kael is in beta, sign-up is open to anyone, and before you spend a prompt on it you should know what it is for, what it costs you, and what it cannot do yet. That is what this post is.'
    ),

    h2('Two models'),
    p(
      '**Kael Beta** (`kael-beta`) is for most work: everyday reasoning, coding, debugging and review. It is the lower-priced model. **Kael Pro Beta** (`kael-pro-beta`) is for the hardest problems, where extra thoroughness is worth a higher price per token. You call either one the same way, with the same key and the same request formats. Only the model name changes.'
    ),
    p(
      'Both think before they answer, at every level. If you want the reasoning behind that choice, read [The Thinking Behind Kael](/blog/the-thinking-behind-kael), which is written as a research note. We do not publish how Kael is built, and that post does not claim to describe it.'
    ),

    h2('Built for accuracy, not speed'),
    p(
      'Kael is for people who want the right answer more than the quick one. It is strongest at coding, security, software engineering, agentic work and math, which are areas where an answer can be held up against something concrete. That choice has a cost, and we do not hide it: Kael is slower than most models. We explain the numbers in [Why Kael Is Slower, On Purpose](/blog/why-kael-is-slower-on-purpose).'
    ),
    p(
      'Requests and answers can also be screened, so a harmful request or response can be stopped before it is delivered.'
    ),

    h2('Nothing new to learn'),
    p(
      'Kael accepts Chat Completions, the Responses API and the Anthropic Messages format, and it supports streaming and tool calls. For OpenAI-style requests you change the base URL to `https://api.quancis.space/v1`, use a model name (`kael-beta` or `kael-pro-beta`), and keep the rest of your code.'
    ),
    code(
      'python',
      `from openai import OpenAI

client = OpenAI(
    base_url="https://api.quancis.space/v1",
    api_key="YOUR_API_KEY",  # create one in the Quancis Developer Platform
)

response = client.chat.completions.create(
    model="kael-beta",
    messages=[
        {"role": "user", "content": "Review this function for security problems: ..."}
    ],
)
print(response.choices[0].message.content)`,
      'An existing OpenAI-style client, pointed at Kael. You can get a key and read the full reference in the [Quancis Developer Platform](https://platform.quancis.space) and its [API documentation](https://platform.quancis.space/docs).'
    ),

    h2('What the beta supports, and what it does not'),
    table(
      'Kael in beta at a glance. See the Kael page for the full specification.',
      ['Item', 'Today'],
      [
        ['Model IDs', '`kael-beta`, `kael-pro-beta`'],
        ['Input', 'Text and images'],
        ['Output', 'Text'],
        ['Context window', '1 million tokens of input'],
        ['Maximum output', 'Up to 128,000 tokens per response'],
        ['Knowledge cutoff', 'July 2026'],
        ['Language', 'English. Other languages have not been tested, so they are not listed as supported'],
        ['Weights', 'Closed. Available through the API; Harness and Chat will use it once they open'],
        ['Not in the beta', 'PDFs, video and other file types'],
      ]
    ),
    p(
      'A few behaviours are worth knowing before you build on it. Kael accepts sampling settings such as temperature so existing code does not break, but it does not use them, which means the output is not deterministic and runs can vary. JSON mode is not enforced: ask for JSON in your prompt and validate what comes back. Kael has no built-in web search or code execution; tool calling works with your own function tools. And you are billed once, for your own input tokens and the final output tokens, nothing else.'
    ),
    p(
      'On data: requests are not used to train Kael. Normal requests are held for up to 15 minutes so cache hits can be calculated, then are not stored in a database. If the safety system flags a request or a response, it is kept until our support team has reviewed it. The [security and data handling page](/security) has the summary, and the [privacy policy](https://platform.quancis.space/privacy-policy) is the binding document.'
    ),

    h2('What we are not claiming'),
    p(
      'We have not published benchmark numbers, and we are not going to publish ones we ran ourselves. Independent evaluation is being sought, and when results exist we will share them on the [Kael page](/kael). Until then, the fastest way to judge Kael is to point your existing SDK at it and run your hardest prompts. The [demos](/kael/demo) show what it produces, each with the exact prompt, model, level, tokens and time.'
    ),
    p(
      'Kael is also the system behind [Quan Harness](/harness), our coding agent, and [Quan Chat](/chat), our assistant. Both are built but not open to the public yet; the Kael API is the way in today.'
    ),
    callout(
      'Start here',
      'Create an account at the [Quancis Developer Platform](https://platform.quancis.space), read the [Kael API documentation](https://platform.quancis.space/docs), and check the [Kael API pricing](https://platform.quancis.space/pricing). If something does not behave the way this post says it should, [tell us](/contact).'
    ),
  ],
};
