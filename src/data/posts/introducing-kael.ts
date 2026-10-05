import { callout, code, figure, h2, p, table } from '../blog-types';
import type { BlogPost } from '../blog-types';

export const post: BlogPost = {
  slug: 'introducing-kael',
  title: 'Introducing Kael',
  seoTitle: 'Introducing Kael: A Composite Intelligence System in Public Beta',
  date: '2026-10-01',
  updated: '2026-10-05',
  tag: 'Product',
  author: 'response-mosese',
  excerpt:
    'Kael is a composite intelligence: a system of models that drafts, checks and refines every answer, behind an API that works with the SDKs you already use. It is in public beta today.',
  keywords: [
    'Kael',
    'Kael API',
    'composite intelligence system',
    'OpenAI-compatible API',
    'AI coding API',
    'Quancis',
  ],
  ogImage: '/og/introducing-kael.png',
  related: ['the-thinking-behind-kael', 'best-of-n-to-mind-evolution'],
  body: [
    p(
      'Kael is not one model. It is a system, which we call the Composite Intelligence System, or CIS: fine-tuned language models, small language models, retrieval and other specialist models working together behind a single API call. From the outside it behaves like any other chat model. You send a request and you get a response.'
    ),
    p(
      'What happens in between is the point, and it is the reason this post exists. Kael is in public beta, sign-up is open to anyone, and before you spend a prompt on it you should know what it is, what it is for, and what it cannot do yet.'
    ),

    h2('Draft, check, refine'),
    p(
      'Every answer Kael gives goes through three steps. First a draft is produced, the way any single model would attempt it. Then the draft is checked against what you actually asked, which catches what one pass tends to miss. For code, that means bugs and security issues. Finally the system corrects what the check found, and only the refined result comes back to you.'
    ),
    figure(
      'kael-loop',
      'The shape of one Kael request. The number of internal calls depends on the task.'
    ),
    p(
      'How much happens inside depends on the request. An easy one may be routed to the best single model, with skills, in a single internal call. A hard one can use up to about twenty calls, retrieval included. Because Kael is several models rather than one, other models can also take over a task that a component could not handle. Safety checks run on the way in and on the way out, so a harmful request or response can be stopped before it is delivered.'
    ),
    figure(
      'kael-request-path',
      'Where the work goes in one request. The figures are the ones in the text: as few as one internal call for an easy request, up to about twenty for a hard one. A simplified drawing, not a trace of a real request.'
    ),
    p(
      'This design sits in a family of ideas that researchers have been exploring under names like Best-of-N, Fusion-of-N and Mind Evolution. We wrote a longer piece on that research, [From Best-of-N to Mind Evolution](/blog/best-of-n-to-mind-evolution), including where Kael is and is not like those methods.'
    ),

    h2('Built for accuracy, not speed'),
    p(
      'Kael is for people who want the right answer more than the quick one. It is strongest at coding, security, software engineering, agentic work and math, which are areas where a draft can be held up against something concrete. That choice has a cost, and we do not hide it: Kael is slower than most models. We explain the numbers in [Why Kael Is Slower, On Purpose](/blog/why-kael-is-slower-on-purpose).'
    ),

    h2('Nothing new to learn'),
    p(
      'Kael accepts Chat Completions, the Responses API and the Anthropic Messages format, and it supports streaming, tool calls and JSON mode. For OpenAI-style requests you change the base URL to `https://api.quancis.space/v1`, use the model name `kael-beta`, and keep the rest of your code.'
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
      'Kael beta at a glance. See the Kael page for the full specification.',
      ['Item', 'Today'],
      [
        ['Model ID', '`kael-beta`'],
        ['Input', 'Text and images'],
        ['Output', 'Text'],
        ['Context window', '1 million tokens of input'],
        ['Maximum output', 'Up to 128,000 tokens per response'],
        ['Knowledge cutoff', 'July 2026 (can differ between component models)'],
        ['Language', 'English. Other languages have not been tested, so they are not listed as supported'],
        ['Weights', 'Closed. Available through the API and our apps only'],
        ['Not in the beta', 'PDFs, video and other file types'],
      ]
    ),
    p(
      'A few behaviours are worth knowing before you build on it. Kael accepts sampling settings such as temperature so existing code does not break, but it does not use them, which means the output is not deterministic and runs can vary. It does not cache responses, although input caching exists and affects pricing. And you are billed only for your own input tokens and the final output tokens. The extra model calls Kael makes inside the system are never billed to you.'
    ),
    p(
      'On data: requests are not used to train Kael. Normal requests are held for up to 15 minutes so cache hits can be calculated, then are not stored in a database. If the safety system flags a request or a response, it is kept until our support team has reviewed it. The [privacy policy](https://platform.quancis.space/privacy-policy) is the binding document.'
    ),

    h2('What we are not claiming'),
    p(
      'We have not published benchmark numbers, and we are not going to publish ones we ran ourselves. Independent evaluation is being sought, and when results exist we will share them on the [Kael page](/kael). Until then, the fastest way to judge Kael is to point your existing SDK at it and run your hardest prompts. The [examples page](/examples) is where we will show what it produces.'
    ),
    p(
      'Kael is also the system behind [Quan Harness](/harness), our coding agent, and [Quan Chat](/chat), our assistant. Same intelligence, three ways in.'
    ),
    callout(
      'Start here',
      'Create an account at the [Quancis Developer Platform](https://platform.quancis.space), read the [Kael API documentation](https://platform.quancis.space/docs), and check the [Kael API pricing](https://platform.quancis.space/pricing). If something does not behave the way this post says it should, [tell us](/contact).'
    ),
  ],
};
