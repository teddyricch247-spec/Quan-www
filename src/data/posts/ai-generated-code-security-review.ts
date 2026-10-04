import { callout, code, figure, h2, h3, ol, p, table } from '../blog-types';
import type { BlogPost } from '../blog-types';

export const post: BlogPost = {
  slug: 'ai-generated-code-security-review',
  title: 'AI-Written Code Has a Security Problem. Here’s How to Review It.',
  seoTitle: 'AI-Generated Code Security: What the Research Says and How to Review It',
  date: '2026-10-02',
  tag: 'Engineering',
  author: 'response-mosese',
  excerpt:
    'Four studies on the security of AI-written code, two bugs worth spotting on sight, and a review checklist that fits how machine-written code actually fails.',
  keywords: [
    'AI-generated code security',
    'AI code review',
    'LLM code vulnerabilities',
    'secure code generation',
    'code review checklist',
    'package hallucination',
    'SQL injection',
    'insecure direct object reference',
  ],
  ogImage: '/og/ai-generated-code-security-review.png',
  related: ['best-of-n-to-mind-evolution', 'why-kael-is-slower-on-purpose'],
  body: [
    p(
      'The tests are green. The code reads cleanly, the variable names are sensible, and the comments even explain the intent. You skim it, nod, and merge. Three weeks later someone finds that one endpoint builds a database query by gluing a user’s input into a string.'
    ),
    p(
      'Nobody was careless. The code looked like the work of someone competent, because it was fluent. That fluency is the core of the problem with AI-written code. A model optimizes for code that looks right and runs, and neither of those is the same as code that is safe. This post covers what the research says about how often that gap bites, why reviewers miss it, and a review routine that fits the way machine-written code fails.'
    ),

    h2('What the studies found'),
    p(
      'The evidence on AI and code security is mixed, and anyone who tells you it is simple is selling something. Here are four studies, each answering a slightly different question. They used different tasks, languages, tools and ways of counting, so the numbers cannot be averaged into one headline. Read them as four angles on the same question.'
    ),
    table(
      'Four studies on the security of AI-written code. They are not directly comparable, because each measured something different.',
      ['Study', 'What they measured', 'Headline finding'],
      [
        [
          '[Pearce et al., 2022](https://arxiv.org/abs/2108.09293)',
          'GitHub Copilot, prompted with 89 scenarios drawn from high-risk weakness types, producing 1,689 programs',
          'Roughly 40% of the generated programs were vulnerable',
        ],
        [
          '[Perry et al., 2023](https://arxiv.org/abs/2211.03622)',
          'A user study at Stanford: people wrote code with and without an AI assistant',
          'People with the assistant wrote significantly less secure code, and were more likely to believe it was secure',
        ],
        [
          '[Sandoval et al., 2023](https://arxiv.org/abs/2208.09727)',
          'A user study with 58 students writing low-level C, with and without an assistant',
          'Assisted participants introduced critical security bugs at a rate no more than about 10% higher than the unassisted group',
        ],
        [
          '[Veracode, 2025](https://www.veracode.com/press-release/ai-generated-code-poses-major-security-risks-in-nearly-half-of-all-development-tasks-veracode-research-reveals/)',
          '80 coding tasks run across more than 100 language models',
          'In 45% of cases the model chose an insecure way of writing the code',
        ],
      ]
    ),
    p(
      'Taken together they say something more careful than “AI code is insecure.” The Copilot study found a large share of vulnerable output when the model was pushed toward risky scenarios. The two user studies disagree with each other: Perry’s group saw assistance make security worse, while the Sandoval group found it made little difference to how often serious bugs appeared. And Veracode’s much newer, much wider test of more than a hundred models found that the models were getting better at writing code that works while showing no comparable improvement at writing code that is safe.'
    ),
    p(
      'The most useful breakdown in that last report is by weakness type, because the failures were not spread evenly. Veracode reported that the models failed to produce a secure choice in 86% of the relevant cross-site scripting cases and 88% of the log injection cases. Those are the kinds of bugs where the secure version needs a piece of context the prompt rarely contains, such as which output is untrusted or which strings reach a log.'
    ),
    figure(
      'veracode-failures',
      'Failure rates in Veracode’s 2025 GenAI Code Security study. The per-weakness rates are as reported by the researchers.',
      {
        label: 'Veracode press release',
        url: 'https://www.veracode.com/press-release/ai-generated-code-poses-major-security-risks-in-nearly-half-of-all-development-tasks-veracode-research-reveals/',
      }
    ),

    h2('Why the bugs are easy to miss'),
    p(
      'Think about how a reviewer reads code written by a colleague. You know their habits. You know which parts of the system they understand well and which they are shaky on, and you read the shaky parts harder. Machine-written code gives you no such map. It is equally confident everywhere, the style is consistent from the first line to the last, and the weak spots hide in the same smooth prose as the strong ones.'
    ),
    p(
      'The Stanford study is the sharpest piece of evidence for what that does to people. Participants with the assistant wrote less secure code and were more likely to believe it was secure, a gap between how safe the code was and how safe it felt. The authors also reported that participants who trusted the assistant less, and who put more effort into their prompts, produced fewer vulnerabilities. Misplaced confidence is a security problem in its own right.'
    ),
    p(
      'There is also a more mundane reason. A model is writing from patterns it learned from a vast amount of public code, and public code contains plenty of insecure examples. It is rewarded for producing something that satisfies the request in front of it. Your threat model, your authentication scheme and the data your users should and should not see are not in the request unless you put them there.'
    ),

    h2('Two bugs worth learning to spot on sight'),
    p(
      'You do not need to memorize a vulnerability catalogue. In practice a handful of patterns account for a large share of what you will meet, and the two below show up constantly in generated code. If you can recognise these two at a glance, you will catch more than you expect.'
    ),
    h3('1. Input glued into a query'),
    p(
      'This is SQL injection, one of the oldest bugs there is, still sitting near the top of the [OWASP Top 10](https://owasp.org/www-project-top-ten/) under the injection category. An assistant asked for “a function that finds a user by username” will often write the first version below, because it is the shortest thing that works.'
    ),
    code(
      'python',
      `# Works. Passes the happy-path test. Unsafe.
def find_user(db, username):
    query = f"SELECT id, email FROM users WHERE username = '{username}'"
    return db.execute(query).fetchone()

# find_user(db, "' OR '1'='1") returns the first user in the table.`,
      'The input becomes part of the SQL itself, so the person supplying it can rewrite the query.'
    ),
    code(
      'python',
      `# Safe. The driver sends the value separately from the SQL.
def find_user(db, username):
    return db.execute(
        "SELECT id, email FROM users WHERE username = ?", (username,)
    ).fetchone()`,
      'A parameterized query keeps data and instructions apart. The same idea applies in every language and driver.'
    ),
    h3('2. Logged in, but not allowed'),
    p(
      'The second pattern is subtler, and tests rarely catch it because a test usually logs in as one user and fetches that user’s own data. It is an insecure direct object reference: the endpoint checks that you are *someone*, but not that the record you asked for is *yours*.'
    ),
    code(
      'javascript',
      `// Authenticated, but not authorised: any logged-in user can
// read any invoice by guessing or counting up the id.
app.get('/invoices/:id', requireLogin, async (req, res) => {
  const invoice = await db.invoices.findById(req.params.id);
  res.json(invoice);
});`,
      'Here `db` stands in for whatever data layer you use.'
    ),
    code(
      'javascript',
      `app.get('/invoices/:id', requireLogin, async (req, res) => {
  // Ask for the record *and* tie it to the caller in one query.
  const invoice = await db.invoices.findOne({
    id: req.params.id,
    ownerId: req.user.id,
  });
  if (!invoice) return res.status(404).end(); // same answer for "missing" and "not yours"
  res.json(invoice);
});`
    ),
    p(
      'Notice what separates the two versions. It is not syntax or style. It is knowledge that the data belongs to someone, which is a fact about your application and not about the programming language. That is exactly the kind of fact a model will not infer unless it is told.'
    ),

    h2('A hallucinated dependency is a bug too'),
    p(
      'Insecure code is not the only way a generated change can hurt you. Models sometimes recommend packages that do not exist. A team of researchers studying this, [Spracklen and colleagues](https://arxiv.org/abs/2406.10279), analysed 576,000 code samples from 16 models and described package hallucination as a systemic, persistent problem. The attack that follows is simple. Someone notices that a model keeps suggesting a particular made-up package name, registers that name on a public registry, and fills it with malicious code. The next developer who runs the install command pulls it in. The technique is sometimes called slopsquatting.'
    ),
    p(
      'The review habit that follows is cheap: every new dependency in a machine-written change gets checked. Does the package exist, is it the one you meant, who maintains it, and is it recent?'
    ),

    h2('A review checklist for machine-written code'),
    p(
      'Generic code-review advice assumes the author understood the system. Here is a version that assumes they did not, and works through the places where generated code is most likely to be wrong.'
    ),
    ol(
      '**Find where untrusted input enters.** Request bodies, query strings, headers, file uploads, webhook payloads, anything read from a database that a user could have written. Mark each entry point before reading anything else.',
      '**Follow each input to where it lands.** Does it end up in a query, a shell command, a file path, an HTML template or a log line? Every one of those destinations has a safe way to receive data. Check the code uses it, rather than string-building.',
      '**Check authorisation on every route, not just authentication.** For each endpoint ask who is allowed to see or change *this* record. “Logged in” is the answer to a different question.',
      '**Look for secrets and permissive defaults.** Hard-coded keys, tokens in example config, wildcard CORS, debug modes, certificate checks switched off to make a test pass.',
      '**Check every new dependency.** Confirm it exists, that it is the library you meant, and that it is maintained. Pin versions.',
      '**Read the error paths.** Generated code is at its most optimistic where things go wrong. Look for swallowed exceptions, stack traces returned to the user, and sensitive data written to logs.',
      '**Ask what happens when someone misuses it.** Not “does it work” but “what if the id belongs to someone else, the file is huge, the string is empty, the request is repeated a thousand times.”'
    ),
    p(
      'You will notice that most of these are about context the generated code did not have. That is deliberate. The most effective single change you can make is to put that context in the request: who the callers are, what data is sensitive, what the framework’s safe defaults are. A prompt that says “this endpoint is public-facing and handles payment data” gets different code from one that says “write an invoice endpoint.”'
    ),

    h2('Can the model check its own work?'),
    p(
      'The obvious next idea is to have the model review what it just wrote. It sometimes works. It also fails in a predictable way. [Huang and colleagues](https://arxiv.org/abs/2310.01798) tested self-correction on reasoning tasks and found that without any outside feedback, models struggled to improve their own answers, and performance could get worse after a round of self-correction. A model asked “is this right?” about its own output is often inclined to say yes, for the same reasons it wrote it in the first place.'
    ),
    p(
      'What does work is a check that rests on something outside the draft. [Self-Debugging](https://arxiv.org/abs/2304.05128) is a good example for code. Instead of asking a model to reflect, it runs the code against unit tests and feeds the results back, which improved accuracy by up to 12% on two benchmarks and let the method match or beat approaches that generated more than ten times as many candidate programs. The feedback was concrete: this input produced this wrong output.'
    ),
    p(
      'We covered the general version of this in [From Best-of-N to Mind Evolution](/blog/best-of-n-to-mind-evolution): in every method that spends extra compute to improve an answer, the quality of the improvement is bounded by the quality of the signal that says what is wrong. For security, good signals are static analysis findings, failing abuse-case tests, and a reviewer, human or model, given a specific brief rather than a vague one. “Is this code good?” gets a shrug. “Find every place untrusted input reaches a query, a path or a template, and say whether it is handled safely” gets an answer you can act on.'
    ),
    p(
      'This is the job of the check step in Kael’s draft, check and refine loop: reading a draft against what you asked for and catching what a single pass tends to miss, which for code means bugs and security issues. We want to be plain about how far that claim goes. It is a design goal, not a measured result: we have not published benchmark numbers for Kael and we are waiting on independent evaluation. A model check lowers the odds that an obvious flaw reaches you. It does not replace the other layers below.'
    ),

    h2('A pipeline you can set up this week'),
    p(
      'Layers beat heroics. No single step catches everything, but each catches things the others miss, and the combination is cheap to run on every change.'
    ),
    figure(
      'security-pipeline',
      'One reasonable ordering. The cheap, mechanical checks run first so that human attention goes to the parts that need judgement. This is a suggested workflow, not measured data.'
    ),
    p(
      'Run a static analyser such as [CodeQL](https://codeql.github.com/), [Semgrep](https://semgrep.dev/) or [Bandit](https://bandit.readthedocs.io/) in CI, along with a secret scanner, so the mechanical bugs never reach a human. Then write tests that attack your own code. For the invoice endpoint above, the test that would have caught the bug is only a few lines long:'
    ),
    code(
      'python',
      `def test_user_cannot_read_another_users_invoice(client, alice_token, bobs_invoice):
    response = client.get(
        f"/invoices/{bobs_invoice.id}",
        headers={"Authorization": f"Bearer {alice_token}"},
    )
    assert response.status_code == 404`,
      'An abuse-case test: the point is that it fails on the unsafe version and passes on the safe one.'
    ),
    p(
      'Add a model check with a security-focused brief for anything that touches input handling or data access, and save your own attention for the places where a mistake is expensive: authorisation logic, anything involving money, and anything that changes who can see what. Machine-written code is not uniquely dangerous. It is just uniformly confident, and the job of a review process is to supply the doubt the author did not.'
    ),
    callout(
      'Want to try this on a real change?',
      'Kael is built for code review, debugging and security work, and sign-up is open while it is in beta. Take a diff you trust least, give it the security-focused brief above, and compare what it finds with your static analyser. Use the [Kael API](https://platform.quancis.space) with the SDK you already have, or hand the whole task to the [Quan Harness coding agent](/harness). Kael [thinks longer on purpose](/blog/why-kael-is-slower-on-purpose), so give a hard review room to run.'
    ),
  ],
  references: [
    {
      citation:
        'Pearce, Ahmad, Tan, Dolan-Gavitt and Karri (2022). Asleep at the Keyboard? Assessing the Security of GitHub Copilot’s Code Contributions. IEEE S&P 2022; arXiv:2108.09293.',
      url: 'https://arxiv.org/abs/2108.09293',
    },
    {
      citation:
        'Perry, Srivastava, Kumar and Boneh (2023). Do Users Write More Insecure Code with AI Assistants? ACM CCS 2023; arXiv:2211.03622.',
      url: 'https://arxiv.org/abs/2211.03622',
    },
    {
      citation:
        'Sandoval, Pearce, Nys, Karri, Garg and Dolan-Gavitt (2023). Lost at C: A User Study on the Security Implications of Large Language Model Code Assistants. USENIX Security 2023; arXiv:2208.09727.',
      url: 'https://arxiv.org/abs/2208.09727',
    },
    {
      citation:
        'Veracode (2025). AI-Generated Code Poses Major Security Risks in Nearly Half of All Development Tasks. 2025 GenAI Code Security Report, press release.',
      url: 'https://www.veracode.com/press-release/ai-generated-code-poses-major-security-risks-in-nearly-half-of-all-development-tasks-veracode-research-reveals/',
    },
    {
      citation:
        'Spracklen et al. (2024). We Have a Package for You! A Comprehensive Analysis of Package Hallucinations by Code Generating LLMs. arXiv:2406.10279.',
      url: 'https://arxiv.org/abs/2406.10279',
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
      citation: 'OWASP Foundation. OWASP Top Ten.',
      url: 'https://owasp.org/www-project-top-ten/',
    },
  ],
};
