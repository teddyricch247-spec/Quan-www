import { callout, figure, h2, p, table } from '../blog-types';
import type { BlogPost } from '../blog-types';

export const post: BlogPost = {
  slug: 'best-of-n-to-mind-evolution',
  title: 'From Best-of-N to Mind Evolution: How AI Systems Spend Extra Compute',
  seoTitle: 'Best-of-N, Fusion-of-N and Mind Evolution Explained',
  date: '2026-10-02',
  tag: 'Research',
  author: 'response-mosese',
  excerpt:
    'Asking a model once is the weakest way to use it. What the research says about sampling many answers: Best-of-N, Fusion-of-N and DeepMind’s Mind Evolution.',
  keywords: [
    'Best-of-N',
    'Fusion-of-N',
    'Mind Evolution',
    'inference-time compute',
    'test-time scaling',
    'compound AI systems',
    'self-consistency',
    'Mixture-of-Agents',
  ],
  ogImage: '/og/best-of-n-to-mind-evolution.png',
  related: ['ai-generated-code-security-review', 'introducing-kael'],
  body: [
    p(
      'Ask a language model a hard question and it gives you one answer. That answer is a single draw from an enormous space of answers the model could have written, and there is no guarantee it is the best of them. Sometimes the model would have solved the problem on its very next try. Sometimes the right plan was in one attempt and the right ending was in another.'
    ),
    p(
      'A lot of recent progress in AI systems is a reaction to that fact. If one attempt is cheap and attempts vary, spend more attempts, and find a better way to turn many attempts into one answer. The methods go by names like Best-of-N, self-consistency, Fusion-of-N and Mind Evolution, and they are often described as rivals. It is more useful to see them as rungs on a ladder. They also share one dependency that decides whether any of them will work for you, which is where this post ends up.'
    ),
    figure(
      'three-families',
      'The three families this post walks through. The diagram is an illustration of the ideas, not measured data.'
    ),

    h2('The idea underneath: spend compute at answer time'),
    p(
      'For years, a better model meant a bigger model. That is still true, but it now has company. A line of work on *test-time compute* (also called inference-time compute) asks what you gain by letting a fixed model do more work on each question: sample more, think longer, check and revise.'
    ),
    p(
      'The clearest framing comes from [Snell, Lee, Xu and Kumar](https://arxiv.org/abs/2408.03314). They found that how well extra inference compute pays off depends on how hard the prompt is. On easier problems, having the model revise an answer a few times can beat sampling many fresh ones. On harder problems, broader search wins. Choosing the strategy per prompt, which they call compute-optimal scaling, made test-time compute about four times as efficient as a plain Best-of-N baseline. And on problems where a smaller model already has a non-trivial chance of success, spending the extra compute at answer time beat a model fourteen times larger in a comparison matched on total compute.'
    ),
    p('Hold on to that finding about difficulty. It comes back near the end.'),

    h2('Best-of-N: sample many, keep one'),
    p(
      'Best-of-N is the simplest serious technique. Sample N answers independently, score each one, return the highest scorer. [OpenAI’s 2021 work on grade-school math](https://arxiv.org/abs/2110.14168) is the classic early example. The authors trained a verifier to judge whether a solution was correct, sampled many candidate solutions at test time, and returned whichever the verifier ranked highest. They found that verification scaled better with more data than simply fine-tuning the model that writes the solutions.'
    ),
    p(
      'The strength of Best-of-N is that it needs nothing clever. The weak spot is the scorer. When the scorer is a test suite or a proof checker, it is exact, and every extra sample is another chance to land on a correct answer. A paper titled [Large Language Monkeys](https://arxiv.org/abs/2407.21787), from researchers at Stanford, Oxford and Google DeepMind, measured how far that goes. On SWE-bench Lite, a set of real GitHub issues, DeepSeek-Coder-V2-Instruct solved 15.9% of issues with one sample and 56% with 250 samples. That beat the 43% single-attempt result the authors cite as the state of the art at the time, which came from more capable frontier models.'
    ),
    figure(
      'repeated-sampling',
      'Repeated sampling on SWE-bench Lite. Coverage is the share of issues where at least one sample works.',
      { label: 'Brown et al., 2024', url: 'https://arxiv.org/abs/2407.21787' }
    ),
    p(
      'That is a striking result, and it comes with a condition the authors state plainly. In domains where answers can be checked automatically, such as code with tests or formal proofs, more coverage turns directly into better performance. Where there is no automatic checker, the usual ways of picking from the pile, majority voting and reward models, flattened out beyond a few hundred samples and failed to keep up with the growing pool. The model could solve the problem. The system could not tell which attempt was the solution.'
    ),
    p(
      'Even a learned scorer can hurt you if you lean on it too hard. [Gao, Schulman and Hilton](https://arxiv.org/abs/2210.10760) studied what happens when you optimize against an imperfect reward model, using either reinforcement learning or Best-of-N sampling. Past a point, a higher score from the proxy stopped meaning a better answer and started meaning a worse one. That is Goodhart’s law, measured. A bigger N against a flawed judge mostly buys you the flaws.'
    ),

    h2('Self-consistency: let the samples vote'),
    p(
      'If you have no verifier, agreement can stand in for one. [Self-consistency](https://arxiv.org/abs/2203.11171) samples a set of different reasoning paths for a question and returns the answer most of them agree on. The intuition is that a hard problem has many ways to go wrong and, usually, one way to come out right, so wrong paths scatter while right paths converge. On arithmetic and commonsense benchmarks it improved accuracy over standard chain-of-thought prompting by between 3.9 and 17.9 points, with the largest gain on GSM8K.'
    ),
    p(
      'Voting has a limit of its own: it only works when answers can be compared for equality. A number, a multiple-choice letter, a final value. It says little about two different but equally reasonable code patches, or two different essays. For those you need something that can read candidates, not just count them.'
    ),

    h2('Fusion-of-N: stop picking, start combining'),
    p(
      'Best-of-N and voting share a quiet assumption: the winner has to be one of the candidates, and everything else is discarded. But candidates are rarely all good or all bad. One sample may have the right plan and a broken edge case. Another may have the edge case right and an awkward plan. Picking one throws the other half away.'
    ),
    p(
      'Combining candidates is not a new idea. [LLM-Blender](https://arxiv.org/abs/2306.02561), in 2023, paired a pairwise ranker with a generative fuser that merged the top-ranked outputs of several models, on the observation that the best model changes from one prompt to the next. [Mixture-of-Agents](https://arxiv.org/abs/2406.04692) arranged models in layers, where each agent reads all the outputs of the previous layer before writing its own. A Mixture-of-Agents built only from open-source models scored 65.1% on AlpacaEval 2.0, against 57.5% for GPT-4 Omni.'
    ),
    p(
      'The cleanest statement of the idea is [Making, Not Taking, the Best of N](https://arxiv.org/abs/2510.00931), from Cohere Labs, which proposes Fusion-of-N. Sample N answers as before, but instead of scoring them, hand them all to a strong LLM judge and ask it to synthesize the most informative parts of each into one final answer. The authors tried it in two settings, test-time scaling from a single model and synthetic data generation from a pool of teacher models, across 11 languages, 3 benchmarks and several model sizes. They report that it consistently beat Best-of-N, and that in some translation settings the fused answer even scored higher than the best single sample in the pool, which a selection method cannot do by construction.'
    ),
    p(
      'There is a price of admission. Fusion-of-N can replace Best-of-N with no other changes, the authors say, as long as you have a reasonably strong generative model to act as the fusor. The quality of the synthesis is capped by the quality of the model doing the synthesizing.'
    ),

    h2('Mind Evolution: let the answers improve each other'),
    p(
      'Fusion combines a fixed pool once. The next step is to treat the pool as a population that can be improved over several rounds. That is the move [Mind Evolution](https://arxiv.org/abs/2501.09891), from Google DeepMind, makes in a paper titled Evolving Deeper LLM Thinking.'
    ),
    p(
      'It borrows from genetic algorithms, with a language model doing the genetic operations in plain language. The search starts with a population of complete candidate solutions. A program scores each one against the task’s constraints and, importantly, writes feedback in words about what is violated. Higher-scoring candidates are more likely to be picked as parents, and the model rewrites parents into children through a short conversation between two roles: a critic that reads the evaluation and proposes fixes, and an author that produces a revised solution. To stop the population collapsing into copies of one idea, candidates live on separate islands that evolve independently, trade their best members every so often, and have their weakest islands reset from the global leaders.'
    ),
    p(
      'The results on planning tasks are large. TravelPlanner asks a model to build a trip plan that satisfies a tangle of budget and commonsense constraints written in ordinary language. Gemini 1.5 Flash solved 5.6% of the validation problems in a single pass. Best-of-N with up to 800 candidates reached 55.6%. Sequential revision, where ten candidates are each revised for many turns, reached 82.8%. Mind Evolution, with the same ceiling of 800 candidates, reached 95.6%, and it did so with fewer model calls on average than Best-of-N: about 174 against about 472. Handing the problems that remained to Gemini 1.5 Pro took validation success to 100%.'
    ),
    figure(
      'travelplanner',
      'TravelPlanner validation set, Gemini 1.5 Flash. Calls are model calls per problem, averaged over the set.',
      { label: 'Lee et al., 2025, Table 2', url: 'https://arxiv.org/abs/2501.09891' }
    ),
    p(
      'Two details in the paper matter more than the headline. The first is the ablation. Adding the critic step lifted success on TravelPlanner validation from 46.1% to 71.1%. Adding the evaluator’s written feedback lifted it from 76.1% to 91.1%. Those are the two largest jumps in the table. The pieces that mattered most were the ones that told the model, in words, what was wrong with the candidate in front of it.'
    ),
    figure(
      'mind-evolution-ablation',
      'Components added one at a time, TravelPlanner validation set. Each bar includes everything above it.',
      { label: 'Lee et al., 2025, Table 4', url: 'https://arxiv.org/abs/2501.09891' }
    ),
    p(
      'The second is the limit. Mind Evolution needs a programmatic evaluator, a function that can check a candidate and describe its faults. The authors say so directly, note that learned or self-evaluating feedback is noisier, and leave it for future work. They chose tasks partly because checking a plan is much easier than producing one. It is also worth remembering that the models in the paper are the 2024 generation, Gemini 1.5 Flash and Pro, so the absolute numbers will not carry over to today’s models. The relative lesson is the part that lasts.'
    ),

    h2('What every method has in common'),
    p(
      'Line the methods up and a pattern shows. Generating candidates is the cheap part. Every method is limited by the same thing: a trustworthy signal for which candidate is better.'
    ),
    table(
      'The four methods side by side. The last two columns are our summary, not the papers’ wording.',
      ['Method', 'What you generate', 'How you decide', 'What it needs', 'Where it breaks'],
      [
        [
          'Best-of-N',
          'N independent samples',
          'Score each, keep the top one',
          'A verifier, reward model or test suite',
          'A flawed judge gets exploited, and the pool plateaus when verification is weak',
        ],
        [
          'Self-consistency',
          'N reasoning paths',
          'Take the majority answer',
          'Answers that can be compared for equality',
          'Open-ended output, where no two answers match',
        ],
        [
          'Fusion-of-N',
          'N samples, from one model or several',
          'A strong LLM writes a synthesis',
          'A capable fusor model',
          'A weak fusor can blend good parts with bad ones',
        ],
        [
          'Mind Evolution',
          'A population, rewritten over generations',
          'A program scores it and explains the faults',
          'An evaluator that can describe what is wrong',
          'No evaluator, no search',
        ],
      ]
    ),
    p(
      'This is the same point [Huang and colleagues made about self-correction](https://arxiv.org/abs/2310.01798): when a model tries to fix its own reasoning with no outside signal, it often struggles to improve, and sometimes turns a correct answer into a wrong one. The methods above work because something outside the sampling loop tells the system which candidate is better. That might be tests, a verifier, a constraint checker or a stronger judge. When the signal is exact, extra compute converts into accuracy almost mechanically. When it is weak, extra compute converts into more confident-sounding noise.'
    ),
    p(
      'Code is the cleanest illustration. [Self-Debugging](https://arxiv.org/abs/2304.05128) gave a model the results of running its code against unit tests and had it revise. Accuracy improved by up to 12% on two benchmarks, and the approach could match or beat baselines that generated more than ten times as many candidate programs. Execution feedback is an evaluator in its purest form.'
    ),

    h2('What it costs, and when it pays'),
    p(
      'None of this is free. N samples cost N times the tokens, and rounds of revision add latency on top. A quick worked example: suppose a model charges $10 per million output tokens and a typical answer runs 1,500 tokens. One attempt costs about 1.5 cents. Best-of-8 costs about 12 cents before you pay for any scoring, and a fusion pass adds the cost of reading eight candidates and writing one more answer. At a thousand requests a day, that is the difference between roughly $15 and $120, before the judge.'
    ),
    p(
      'That arithmetic is why the finding about difficulty, from the start of this post, matters so much. The same paper that showed test-time compute can beat a bigger model also showed that the right strategy depends on the question. Easy requests deserve one fast attempt. Hard requests, where being wrong is expensive, deserve the full machinery. A system that spends heavy compute on everything wastes money, and one that spends none leaves accuracy on the table. Deciding how much to spend on each request is a design problem in its own right, and one of the least glamorous and most important parts of building these systems.'
    ),

    h2('Where Kael fits'),
    p(
      'Berkeley researchers gave this style of design a name in 2024: a [compound AI system](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/), meaning a system that tackles a task with several interacting components, including multiple model calls, retrievers and tools. Kael is one. Behind a single API call, several models work together: a draft is produced, checked against your request, and refined, and only the refined answer is returned. Depending on the request, that can be as few as one internal call or up to about twenty, retrieval included. The [Introducing Kael](/blog/introducing-kael) post covers the design, and the [Kael page](/kael#how-it-works) has the short version.'
    ),
    p(
      'We want to be careful about what we are claiming. Kael is not a literal implementation of Best-of-N, Fusion-of-N or Mind Evolution, and the numbers in this post belong to the papers, not to us. We have not published benchmark numbers for Kael, and we are waiting on independent evaluation instead of grading ourselves. What the research gives us is a design principle: a draft-check-refine loop is only as good as its check, and a check is only as good as the signal behind it. It is also why we pay attention to where checking is concrete. Code, security reviews and math are what Kael is built for, and they are also the areas where a draft can be held up against something real.'
    ),
    callout(
      'If you want to see a draft-check-refine system behave',
      'Kael is in beta and sign-up is open. It accepts the Chat Completions, Responses and Anthropic Messages formats, so pointing an existing SDK at it is a base-URL change. Two honest caveats first. Kael [thinks longer on purpose](/blog/why-kael-is-slower-on-purpose), so it will not be the fastest model you test, and it accepts sampling settings such as temperature but ignores them, so two runs can differ. You can start at the [Kael API console](https://platform.quancis.space) or browse the [examples page](/examples).'
    ),

    h2('If you read only three of these'),
    p(
      'Read Snell and colleagues for the framing, Large Language Monkeys for the evidence that coverage keeps growing with samples, and Mind Evolution for what a population and a critic can do together. Then ask the question that decides everything else: what is my evaluator? If you can check an answer cheaply and reliably, extra compute is a good deal. If you cannot, the first thing to build is not a bigger sampler. It is a better way to tell good from bad.'
    ),
  ],
  references: [
    {
      citation:
        'Snell, Lee, Xu and Kumar (2024). Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters. arXiv:2408.03314.',
      url: 'https://arxiv.org/abs/2408.03314',
    },
    {
      citation: 'Cobbe et al. (2021). Training Verifiers to Solve Math Word Problems. arXiv:2110.14168.',
      url: 'https://arxiv.org/abs/2110.14168',
    },
    {
      citation:
        'Brown, Juravsky, Ehrlich et al. (2024). Large Language Monkeys: Scaling Inference Compute with Repeated Sampling. arXiv:2407.21787.',
      url: 'https://arxiv.org/abs/2407.21787',
    },
    {
      citation:
        'Gao, Schulman and Hilton (2023). Scaling Laws for Reward Model Overoptimization. ICML 2023; arXiv:2210.10760.',
      url: 'https://arxiv.org/abs/2210.10760',
    },
    {
      citation:
        'Wang et al. (2023). Self-Consistency Improves Chain of Thought Reasoning in Language Models. ICLR 2023; arXiv:2203.11171.',
      url: 'https://arxiv.org/abs/2203.11171',
    },
    {
      citation:
        'Jiang, Ren and Lin (2023). LLM-Blender: Ensembling Large Language Models with Pairwise Ranking and Generative Fusion. ACL 2023; arXiv:2306.02561.',
      url: 'https://arxiv.org/abs/2306.02561',
    },
    {
      citation:
        'Wang et al. (2024). Mixture-of-Agents Enhances Large Language Model Capabilities. arXiv:2406.04692 (ICLR 2025).',
      url: 'https://arxiv.org/abs/2406.04692',
    },
    {
      citation:
        'Khairi, D’souza, Fadaee and Kreutzer (2025). Making, Not Taking, the Best of N. Cohere Labs; ICLR 2026; arXiv:2510.00931.',
      url: 'https://arxiv.org/abs/2510.00931',
    },
    {
      citation:
        'Lee, Fischer, Wu, Marwood, Baluja, Schuurmans and Chen (2025). Evolving Deeper LLM Thinking. Google DeepMind; arXiv:2501.09891.',
      url: 'https://arxiv.org/abs/2501.09891',
    },
    {
      citation:
        'Huang et al. (2024). Large Language Models Cannot Self-Correct Reasoning Yet. ICLR 2024; arXiv:2310.01798.',
      url: 'https://arxiv.org/abs/2310.01798',
    },
    {
      citation:
        'Chen, Lin, Schärli and Zhou (2024). Teaching Large Language Models to Self-Debug. ICLR 2024; arXiv:2304.05128.',
      url: 'https://arxiv.org/abs/2304.05128',
    },
    {
      citation: 'Zaharia et al. (2024). The Shift from Models to Compound AI Systems. Berkeley AI Research Blog.',
      url: 'https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/',
    },
  ],
};
