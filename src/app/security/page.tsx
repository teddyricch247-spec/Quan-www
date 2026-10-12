import type { Metadata } from 'next';
import Link from 'next/link';
import { DOC_LINK, DocList, DocP, DocSection, DocShell } from '../../components/DocPage';
import { JsonLd } from '../../components/JsonLd';
import { EXTERNAL, ROUTES } from '../../lib/routes';
import { ORG } from '../../lib/org';
import { LIMITS } from '../../data/kael';
import { breadcrumbJsonLd, pageMetadata } from '../../lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Security and data handling',
  description:
    'How Kael handles your requests, what we keep and for how long, what we do not claim, and how to report a security problem to Quancis.',
  path: ROUTES.security,
});

/**
 * Every statement here is one the site already makes elsewhere (the Kael page's
 * "Your data" section and FAQ, src/data/kael.ts) or is a fact about this
 * website. Nothing is claimed that Quancis has not published: no certification,
 * no audit, no uptime figure, no response-time promise. The Platform's privacy
 * policy stays the binding document. Keep this page in step with
 * src/data/kael.ts and the Kael page.
 */
export default function SecurityPage() {
  return (
    <DocShell
      eyebrow="Quancis"
      title="Security and Data Handling."
      lead="What happens to your requests, what we keep, what we do not claim, and how to tell us about a problem."
    >
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Security and data handling', path: ROUTES.security },
        ])}
      />

      <DocSection id="requests" title="What happens to your requests" first>
        <DocList
          items={[
            <>
              <strong className="font-medium text-ink">Normal requests</strong> are held for up to 15 minutes so cache
              hits can be calculated. After that they are not stored in a database.
            </>,
            <>
              <strong className="font-medium text-ink">Flagged requests.</strong> If our safety system flags a request
              or a response as harmful, we keep it until our support team has reviewed it. We do this to improve the
              safety system and to keep a record in case of a dispute, for example when an account has been blocked or
              suspended and the account holder contacts us.
            </>,
            <>
              <strong className="font-medium text-ink">Training.</strong> Your requests are not used to train Kael.
            </>,
            <>
              <strong className="font-medium text-ink">Billing.</strong> You are billed once, for your input and the
              final answer, nothing else.
            </>,
          ]}
        />
        <DocP muted>
          This is a plain-language summary. The{' '}
          <a href={EXTERNAL.platformPrivacy} className={DOC_LINK}>
            Privacy Policy
          </a>{' '}
          is the binding document, and the{' '}
          <Link href={`${ROUTES.kael}#data`} className={DOC_LINK}>
            Kael page
          </Link>{' '}
          has the same summary.
        </DocP>
      </DocSection>

      <DocSection id="product" title="What Kael does and does not do">
        <DocList
          items={[
            'Requests and responses can be screened by a safety system, so a harmful request or response can be stopped before it is delivered.',
            'Kael has no built-in web search and no code execution. Tool calling works with your own function tools, so anything a tool does happens in your code, under your control.',
            'The weights are closed. Kael is available through the API (Quan Harness and Quan Chat will use it too, once they open) and cannot be self-hosted.',
            `Rate limits are ${LIMITS.requestsPerMinute} requests a minute and ${LIMITS.concurrentRequests} requests at once, per account.`,
          ]}
        />
      </DocSection>

      <DocSection id="your-side" title="Your side of it">
        <DocList
          items={[
            'Keep your API key on a server you control. Do not put it in a browser app, a mobile app or a public repository.',
            'Use a separate key for each project, so one can be removed without breaking the others.',
            'If a key has been exposed, create a new one in the Developer Platform, stop using the old one, and write to us if you need help.',
            'Do not put passwords, keys or other secrets in prompts unless the task needs them.',
            'Treat code Kael writes like any other code you did not write: review it before you ship it. Our post on reviewing AI-written code has a pipeline you can use.',
          ]}
        />
        <DocP muted>
          <Link href="/blog/ai-generated-code-security-review" className={DOC_LINK}>
            Read: AI-written code has a security problem →
          </Link>
        </DocP>
      </DocSection>

      <DocSection id="not-claimed" title="What we do not claim">
        <DocP>
          This website does not claim any security certification, audit or penetration test, and Quancis does not
          publish uptime or SLA figures or a formal model card. If we have one of these in future, it will be listed
          here with its date. If you need one for a procurement decision, write to us and we will tell you plainly
          what exists.
        </DocP>
        <DocP>
          Quan Harness and Quan Chat are not open to the public yet. Their data handling will be written up here, and
          their terms and privacy policy published, before anyone is asked to use them.
        </DocP>
      </DocSection>

      <DocSection id="report" title="Reporting a security problem">
        <DocP>
          If you think you have found a vulnerability in this website, the Kael API or the Developer Platform, email{' '}
          <a href={`mailto:${ORG.email.support}?subject=Security%20report`} className={DOC_LINK}>
            {ORG.email.support}
          </a>{' '}
          with &ldquo;Security report&rdquo; in the subject. Please include:
        </DocP>
        <DocList
          items={[
            'What you found and where (the URL, endpoint or model).',
            'The steps to reproduce it, as exactly as you can.',
            'What you think the impact is.',
            'How we can reach you.',
          ]}
        />
        <DocP>
          Please give us a reasonable chance to fix the problem before you publish it, and do not access data that is
          not yours, disrupt the service or test against other people&apos;s accounts. We do not run a bug bounty
          programme. The same details are in our{' '}
          <a href="/.well-known/security.txt" className={DOC_LINK}>
            security.txt
          </a>
          .
        </DocP>
      </DocSection>

      <DocSection title="About this website">
        <DocP>
          This website has no accounts, no forms and sets no cookies. What it does collect, and what the demos keep in
          your browser, is on the{' '}
          <Link href={ROUTES.privacy} className={DOC_LINK}>
            privacy and cookies page
          </Link>
          . Last updated 11 October 2026.
        </DocP>
      </DocSection>
    </DocShell>
  );
}
