import { callout, figure, h2, ol, p, table, ul } from '../blog-types';
import type { BlogPost } from '../blog-types';

/**
 * Written as design philosophy, on purpose: it describes the ideas and beliefs
 * behind Kael, not what happens inside any given request. Keep it that way when
 * editing. The callout near the top says so to the reader; do not add sentences
 * that turn a theory into a claim about Kael's internals.
 */
export const post: BlogPost = {
  slug: 'the-thinking-behind-kael',
  title: 'Scratch Paper, Second Drafts and Many Students: The Thinking Behind Kael',
  seoTitle: 'How LLMs Think: KV Cache, Scratch Paper and Best-of-N Explained',
  date: '2026-10-05',
  tag: 'Research',
  author: 'response-mosese',
  excerpt:
    'How a model reads, writes and thinks, and why we believed one that thinks, drafts, improves and compares many attempts should beat one that answers at once.',
  keywords: [
    'how LLMs work',
    'KV cache',
    'prefill and decode',
    'thinking tokens',
    'chain of thought',
    'self-refine',
    'Best-of-N',
    'test-time compute',
    'Kael',
    'composite intelligence system',
  ],
  ogImage: '/og/the-thinking-behind-kael.png',
  related: ['best-of-n-to-mind-evolution', 'why-kael-is-slower-on-purpose'],
  body: [
    p(
      'Most explanations of how an AI model works start with the maths. This one starts with a student at a desk. When we were designing Kael, the idea that kept paying off was not an equation. It was a picture: what would a good student do with a hard exam question, and what would a better student do?'
    ),
    p(
      'This post is the reasoning we built from. It covers how a language model reads and writes, why giving it room to think helps, and why we came to believe that a model which thinks, drafts, improves its own draft and does all of that several times over should beat one that answers straight away. It is written the way a research note is: ideas first, the evidence we leaned on cited, and a section at the end on where our theory is weakest.'
    ),
    callout(
      'Theory, not a spec',
      'This is the psychology behind the design: the beliefs and hypotheses we held while building. It is not a description of Kael’s internals, and nothing here should be read as a statement of what happens inside any particular request. For what Kael is and what it supports today, see [Introducing Kael](/blog/introducing-kael) and the [Kael page](/kael).'
    ),

    h2('1. Models do not read words'),
    p(
      'A language model never sees your sentence. It sees numbers. Before anything else happens, the text is cut into pieces called **tokens**, usually short words or fragments of longer ones, and each token is swapped for an ID from a fixed vocabulary. “The” is one token. A long word like “unbelievable” may be two or three.'
    ),
    p(
      'An ID is still only a label. The next step is to look each one up in a table and get back a long list of numbers, a vector, called an **embedding**. That list is what the network actually computes with. Everything that follows, in this post and inside the model, is arithmetic on lists of numbers.'
    ),
    figure(
      'tokens-pipeline',
      'From text to numbers. The ID numbers and the cell shading are made up for illustration. Real models use vocabularies of tens of thousands of tokens or more, and vectors with hundreds to thousands of numbers.'
    ),

    h2('2. Prefill: reading the prompt and taking notes'),
    p(
      'Answering a request has two phases. The first is **prefill**, and it is where the model reads your input. All the prompt’s tokens flow through the network’s layers together, and in every layer each token produces two things: a **key** and a **value**. A key is a label for what the token is about. A value is the content it can hand over when something asks for it. Later tokens search the keys and collect from the matching values. That search is called attention, and it is the core idea of the [transformer](https://arxiv.org/abs/1706.03762).'
    ),
    p(
      'The model keeps the keys and values it has computed so it never has to compute them again. That store is the **KV cache**. The simplest way we found to think about it is as a notebook. During prefill the model reads the whole prompt once and writes a note for every token, on every layer. [Serving systems](https://arxiv.org/abs/2309.06180) spend a great deal of engineering on managing this notebook, because it grows with every token and takes real memory.'
    ),
    figure(
      'prefill-kv',
      'Prefill. The prompt is processed together and leaves behind one note, a key and a value, for every token. The drawing shows one layer, with the same note on other layers faintly behind it.'
    ),

    h2('3. Decode: one token at a time, rereading every note'),
    p(
      'The second phase is **decode**. This is where the model writes its answer, and it works in a way that surprises most people the first time they hear it. The model produces one token at a time. To choose each one, it reads *all* the notes in the cache, both the prompt’s and those of every token it has already written. Then it writes the new token, adds that token’s own note to the notebook, and goes round again. Every token, every time.'
    ),
    p(
      'This is fast enough to be useful because reading notes is far cheaper than recomputing them. Nothing from earlier tokens is worked out again. Only the newest token is processed, and it looks back at what is already stored. A model that had to re-read the prompt from scratch for every word it wrote would be unusably slow.'
    ),
    p(
      'Hold on to one consequence, because the rest of this post rests on it: **whatever the model has already written becomes part of what it reads next.** Its output is not separate from its input. It goes into the same notebook.'
    ),
    figure(
      'decode-loop',
      'Decode. Each new token reads every note already in the cache, then adds its own. The red sweep is animated, and is shown still for anyone who has asked their device for reduced motion.'
    ),

    h2('4. Meaning is relationships, and relationships need material'),
    p(
      'Why does the model need all those notes? Because of what an embedding is. Embeddings place tokens in a space where relationships between meanings become relationships between positions. The famous demonstration comes from [word-vector research](https://arxiv.org/abs/1301.3781): take the vector for king, subtract man, add woman, and you land close to queen. Nobody wrote a rule about gender or royalty. They are directions in the space that training carved out on its own.'
    ),
    figure(
      'embedding-space',
      'A two-dimensional cartoon of an embedding space. Real spaces have hundreds or thousands of dimensions, but the idea carries over: a relationship such as “male to female” is a direction, and it points the same way wherever you apply it.'
    ),
    p(
      'Now put that to work on prediction. Give a model only the words *I’m going to* and ask it to continue. It has almost nothing to relate those tokens to, so many continuations are about equally plausible, and what comes out may not be what you had in mind. Now put the same words at the end of a paragraph about a match that starts at eight, boots left in the car and a bus that is already late. Every one of those tokens is a note in the notebook, and the relationships between them narrow what is likely to come next. The model has not learned anything new. It simply has more to relate.'
    ),
    figure(
      'context-narrows',
      'The same last words with and without the context in front of them. The bars are illustrative, not measured probabilities.'
    ),
    p(
      'This is the problem we kept returning to: **a model often does not have enough tokens to predict from.** A hard question arrives as a short prompt, and then asks for an answer that depends on long chains of relationships that are not on the page yet.'
    ),

    h2('5. Thinking is writing notes to yourself'),
    p(
      'This is the gap that “thinking” addresses, and through the notebook picture it is easy to explain. Before the answer, the model writes out reasoning: ideas it considers, options it rules out, intermediate results. Reasoning and answer sit in the same stream of tokens and the same cache. So when the model reaches the answer, it is predicting from a notebook full of relationships it has just built, not from a two-line prompt.'
    ),
    p(
      'The research record agrees. Showing a model worked examples with intermediate steps, known as [chain-of-thought prompting](https://arxiv.org/abs/2201.11903), raised its performance on arithmetic and reasoning problems, and a later paper found that even the instruction [“let’s think step by step”](https://arxiv.org/abs/2205.11916) was enough to help. More recent models, such as [DeepSeek-R1](https://arxiv.org/abs/2501.12948), are trained to produce long reasoning of this kind on their own before they answer.'
    ),
    p(
      'Picture two students sitting the same exam. The first writes whatever comes to mind straight onto the answer sheet. The second is given a sheet of scratch paper and uses it: tries an approach, notices that it fails, tries another, checks the arithmetic, and only then writes the answer. Give them the same intelligence and the second student will usually come out ahead. Not because they know more, but because by the time they write the answer, the page in front of them has more on it.'
    ),
    figure(
      'scratch-paper',
      'What each student’s answer is written from. The scratch paper is the KV cache, and the work shown on it is the extra context the answer gets to lean on.'
    ),

    h2('6. The second student: improving instead of inventing'),
    p(
      'Now bring in a second student. They wait until the student with the scratch paper has finished, then take the draft that student produced. Their job is not to write a fresh answer. It is to improve this one, and they get their own scratch paper to do it. We expected this student to beat both of the others, for three reasons.'
    ),
    ol(
      '**They start from something, not nothing.** A draft is a lot of tokens already on the page, which is exactly what a short prompt lacks. The second student’s notebook opens with the question *and* a concrete attempt at it.',
      '**Their thinking has a different job.** The first student’s scratch paper is spent working out how to create an answer. The second student’s is spent on how to make this one better: what is missing, what is wrong, what could be cut. Our belief was that checking is an easier task than creating, and that reasoning about a flaw you can see is easier than reasoning toward a solution you cannot yet see.',
      '**They can catch what the first pass could not.** The first student was busy writing. The second is reading. Bugs, gaps and unstated assumptions that slid past while the draft was being written are easier to see when the draft is sitting there as input.'
    ),
    figure(
      'second-student',
      'The second student’s notebook starts with a draft, and their scratch paper is aimed at a different question.'
    ),
    p(
      'This is a theory about where the gain comes from, and the literature supports it in places. [Self-Refine](https://arxiv.org/abs/2303.17651) had a model critique and then revise its own output, with no extra training, and reported improvements across a range of tasks. We read that as encouraging. We do not read it as the end of the argument, and the section on limits below explains why.'
    ),

    h2('7. Many students, taught differently'),
    p(
      'The next step in the same direction is to stop betting on a single student. Imagine many students, each taught by a different teacher, in a different school, with a different method. Hand them all the same task, and give each their own scratch paper and answer sheet.'
    ),
    p(
      'Two things make this worth doing. The first is simple odds. If one student has some chance of solving a hard problem, a room of them has a much better chance that *somebody* does. The effect is measurable: the [Large Language Monkeys](https://arxiv.org/abs/2407.21787) paper found that the share of problems solved kept climbing as the number of attempts grew, across several orders of magnitude. We went through the numbers in [From Best-of-N to Mind Evolution](/blog/best-of-n-to-mind-evolution).'
    ),
    p(
      'The second is the word *different*. Ten copies of the same student, making the same mistakes for the same reasons, are not ten chances. They are one chance repeated. Variety in how attempts are produced is what turns a crowd into independent shots at the answer, so we treated that variety as something to protect. The islands in Mind Evolution exist for the same reason.'
    ),
    p(
      'Then comes the step we care about most. We do not simply take the best attempt and stop. We take the best draft and hand it to the second student, who reasons from it to produce the final answer. Selecting decides where to start. Reasoning decides how good it ends up.'
    ),
    figure(
      'many-students',
      'Many attempts, one pick, one improvement. The scores and the choice of School D are illustrative.'
    ),
    p(
      'There is a catch hiding in the word *best*, and we come back to it below: choosing the best of many answers needs some way of knowing which one is best.'
    ),

    h2('8. The three ideas as a ladder'),
    p(
      'Put the three ideas side by side and they form a ladder. Each rung adds something, each costs something, and each has its own way of failing.'
    ),
    figure(
      'idea-ladder',
      'The ladder, drawn as a schematic. The steps do not measure anything. They show that each rung builds on the one before.'
    ),
    table(
      'The three ideas, what each adds, what it costs and where it can fail. These columns are our own reading, not a result from any one paper.',
      ['Idea', 'The student picture', 'What it adds', 'What it costs', 'Where it can fail'],
      [
        [
          'Think before answering',
          'One student, with scratch paper',
          'The answer is predicted from reasoning on the page, not from the bare prompt',
          'More tokens written before the answer starts, so more time',
          'Reasoning that reads well but is wrong, or that is not the real reason for the answer',
        ],
        [
          'Draft, then improve',
          'A second student works from the first student’s answer',
          'A concrete starting point, and a task that is easier than creating',
          'A second pass of reading and writing',
          'With nothing to check against, a revision can turn a right answer into a wrong one',
        ],
        [
          'Many attempts, keep the best, improve it',
          'A room of differently taught students',
          'Several independent chances, and a stronger draft to start from',
          'Many times the tokens',
          'A weak way of choosing the best, or attempts that are too alike',
        ],
      ]
    ),

    h2('9. What it all costs'),
    p(
      'Every rung of the ladder is paid for in tokens, and tokens are time and compute. Thinking means writing more before the answer begins. A second pass means reading a draft and writing a critique and a revision. Many students means doing the whole thing several times over. We do not see that as a flaw to apologise for. It is the trade the design rests on: spend extra effort to be right more often.'
    ),
    p(
      'It only makes sense when the problem is hard enough to deserve it. The test-time compute work of [Snell and colleagues](https://arxiv.org/abs/2408.03314) found that how much extra computation helps depends on how hard the question is, which is the same lesson from the other side: easy questions do not need the whole ladder, and hard ones may need every rung. What that means for waiting time and price is covered in [Why Kael Is Slower, On Purpose](/blog/why-kael-is-slower-on-purpose).'
    ),

    h2('10. Where the theory is weak'),
    p('A theory is only useful if you know where it breaks. These are the places we think ours is thinnest.'),
    ul(
      '**Self-correction needs something to correct against.** [Huang and colleagues](https://arxiv.org/abs/2310.01798) found that when models were asked to review and fix their own reasoning with no outside feedback, performance on reasoning tasks did not improve and sometimes got worse. Our second student should do best when it can hold the draft up against something concrete, such as a test, a constraint or the original request, and worst when it is only asked whether the answer feels right. The ablation in [our research post](/blog/best-of-n-to-mind-evolution) points the same way: written feedback about what was wrong mattered most.',
      '**Written reasoning is not always the real reasoning.** [Turpin and colleagues](https://arxiv.org/abs/2305.04388) showed that a model’s written explanation can leave out what actually influenced its answer. Scratch paper helps because it adds context the model can use. It is not a window into the model’s mind, and we should not treat it as one.',
      '**Picking the best is hard.** With an exact checker, more attempts keep paying off. With a weak one they plateau, or mislead. A vote cannot compare open-ended answers, and a flawed judge can be gamed. The research post covers this in detail.',
      '**More is not always better.** Extra thinking on an easy question is wasted effort, and a long chain of reasoning gives a model more room to talk itself into a mistake.',
      '**These are theories.** This post is not evidence that any particular system works. We have not published benchmark numbers, and we are not going to publish ones we ran ourselves. Independent evaluation is being sought, and results will go on the [Kael page](/kael) when they exist.'
    ),

    h2('What we took from it'),
    p(
      'Strip the detail away and three beliefs are left. A model predicts better when there is more on the page to relate. A draft is a better place to start than a blank sheet. And several differently made attempts beat one. Everything else is detail, and most of the hard work is in the detail.'
    ),
    p(
      'None of this is finished thinking. It is where we started, written down so that you can judge it, argue with it and tell us where we are wrong. If you want to, [get in touch](/contact).'
    ),
  ],
  references: [
    {
      citation: 'Vaswani et al., 2017. Attention Is All You Need.',
      url: 'https://arxiv.org/abs/1706.03762',
    },
    {
      citation:
        'Kwon et al., 2023. Efficient Memory Management for Large Language Model Serving with PagedAttention.',
      url: 'https://arxiv.org/abs/2309.06180',
    },
    {
      citation: 'Mikolov et al., 2013. Efficient Estimation of Word Representations in Vector Space.',
      url: 'https://arxiv.org/abs/1301.3781',
    },
    {
      citation: 'Wei et al., 2022. Chain-of-Thought Prompting Elicits Reasoning in Large Language Models.',
      url: 'https://arxiv.org/abs/2201.11903',
    },
    {
      citation: 'Kojima et al., 2022. Large Language Models are Zero-Shot Reasoners.',
      url: 'https://arxiv.org/abs/2205.11916',
    },
    {
      citation:
        'DeepSeek-AI, 2025. DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning.',
      url: 'https://arxiv.org/abs/2501.12948',
    },
    {
      citation: 'Madaan et al., 2023. Self-Refine: Iterative Refinement with Self-Feedback.',
      url: 'https://arxiv.org/abs/2303.17651',
    },
    {
      citation: 'Brown et al., 2024. Large Language Monkeys: Scaling Inference Compute with Repeated Sampling.',
      url: 'https://arxiv.org/abs/2407.21787',
    },
    {
      citation:
        'Snell et al., 2024. Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters.',
      url: 'https://arxiv.org/abs/2408.03314',
    },
    {
      citation: 'Huang et al., 2023. Large Language Models Cannot Self-Correct Reasoning Yet.',
      url: 'https://arxiv.org/abs/2310.01798',
    },
    {
      citation:
        'Turpin et al., 2023. Language Models Don’t Always Say What They Think: Unfaithful Explanations in Chain-of-Thought Prompting.',
      url: 'https://arxiv.org/abs/2305.04388',
    },
  ],
};
