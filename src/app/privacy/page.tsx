import type { Metadata } from 'next';
import Link from 'next/link';
import { DOC_LINK, DocList, DocP, DocSection, DocShell } from '../../components/DocPage';
import { JsonLd } from '../../components/JsonLd';
import { EXTERNAL, ROUTES } from '../../lib/routes';
import { ORG } from '../../lib/org';
import { breadcrumbJsonLd, pageMetadata } from '../../lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy and cookies',
  description:
    'What this website collects (almost nothing), the cookies it sets (none), and the small things the demos keep in your browser.',
  path: ROUTES.privacy,
});

/**
 * This page covers www.quancis.space only. It is written from what the code
 * of the site actually does, and each statement below can be checked there:
 *   - no cookies and no analytics, advertising or tracking scripts in src/
 *   - fonts come from next/font, which downloads them at build time and
 *     serves them from our own domain
 *   - the browser storage the demos use is in public/demo-files/*.html
 *   - the demos fetch three.js from public CDNs, and only after Play is clicked
 * If any of that changes (an analytics tool, a form, a new demo that stores
 * something), change this page in the same commit and bump PAGE_UPDATED.
 */
export default function PrivacyPage() {
  return (
    <DocShell
      eyebrow="Quancis"
      title="Privacy and Cookies."
      lead="This page is about this website, www.quancis.space. It is short because the site collects very little."
    >
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Privacy and cookies', path: ROUTES.privacy },
        ])}
      />

      <DocSection title="The short version" first>
        <DocList
          items={[
            'This site sets no cookies.',
            'It has no analytics, no advertising and no tracking scripts.',
            'It has no accounts, no sign-up and no forms, so it asks you for nothing.',
            'The demos can save a few small things in your own browser. They stay on your device. Details below.',
          ]}
        />
      </DocSection>

      <DocSection title="What we receive when you visit">
        <DocP>
          Like any website, ours is delivered by a hosting provider (we use Vercel), and a hosting provider handles
          standard request data to do that: your IP address, the page you asked for, your browser and device type, and
          the time. It uses this to deliver pages and to keep the service running and secure. We do not add anything
          on top of that, and we do not build profiles of visitors.
        </DocP>
        <DocP>
          Fonts are not a third-party request: they are downloaded when the site is built and served from our own
          domain, so visiting a page does not contact Google Fonts.
        </DocP>
      </DocSection>

      <DocSection id="cookies" title="Cookies and browser storage">
        <DocP>
          The site itself sets no cookies and stores nothing in your browser. The only thing that does is some of the
          demos, which run on this site&apos;s domain and use your browser&apos;s local storage to remember small
          settings. Local storage is not a cookie, it is never sent to us, and it cannot be read by other websites.
        </DocP>
        <div className="card-panel mt-5 max-w-[600px] overflow-hidden">
          <table className="w-full border-collapse text-left text-[0.875rem]">
            <caption className="sr-only">What each demo keeps in your browser</caption>
            <thead>
              <tr className="border-b border-line-soft bg-surface text-ink-3">
                <th scope="col" className="px-5 py-3 font-medium">Demo</th>
                <th scope="col" className="px-5 py-3 font-medium">What it keeps on your device</th>
              </tr>
            </thead>
            <tbody className="text-ink-2">
              <tr className="border-b border-line-soft">
                <th scope="row" className="px-5 py-3 align-top font-medium text-ink">Ouroboros</th>
                <td className="px-5 py-3">Your best score.</td>
              </tr>
              <tr className="border-b border-line-soft">
                <th scope="row" className="px-5 py-3 align-top font-medium text-ink">Fan Circuit</th>
                <td className="px-5 py-3">Whether you collapsed the on-screen panel.</td>
              </tr>
              <tr className="border-b border-line-soft">
                <th scope="row" className="px-5 py-3 align-top font-medium text-ink">Blockscape</th>
                <td className="px-5 py-3">Your settings and the blocks you have built (local storage and IndexedDB).</td>
              </tr>
              <tr>
                <th scope="row" className="px-5 py-3 align-top font-medium text-ink">3D Chess</th>
                <td className="px-5 py-3">Nothing.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <DocP>
          To remove it, clear this site&apos;s data in your browser&apos;s settings. The demos still work without it.
        </DocP>
      </DocSection>

      <DocSection title="When you play a demo">
        <DocP>
          A demo only loads when you press Play (or open it full screen). The demos draw 3D graphics with a public
          library called three.js, which they fetch from a public content delivery network (unpkg, jsDelivr or
          cdnjs, depending on the demo). When that happens your browser contacts that network directly, and it can
          see your IP address and browser details, as any site you load a file from can. Nothing is loaded from them
          until you press Play.
        </DocP>
      </DocSection>

      <DocSection title="If you write to us">
        <DocP>
          If you email{' '}
          <a href={`mailto:${ORG.email.support}`} className={DOC_LINK}>
            {ORG.email.support}
          </a>{' '}
          or{' '}
          <a href={`mailto:${ORG.email.business}`} className={DOC_LINK}>
            {ORG.email.business}
          </a>
          , we receive your email address and whatever you send, and we use it to answer you. Please do not send
          secrets, passwords or API keys by email.
        </DocP>
      </DocSection>

      <DocSection title="Other Quancis services">
        <DocP>
          The{' '}
          <a href={EXTERNAL.platform} className={DOC_LINK}>
            Quancis Developer Platform
          </a>{' '}
          and the Kael API are separate services with their own privacy policy, which is the binding document for
          anything you do there:{' '}
          <a href={EXTERNAL.platformPrivacy} className={DOC_LINK}>
            Platform Privacy Policy
          </a>
          . A plain-language summary of how Kael handles requests is on the{' '}
          <Link href={ROUTES.security} className={DOC_LINK}>
            security and data handling page
          </Link>
          . Quan Harness and Quan Chat are not open to the public yet, so they have no privacy policy yet; one will be
          published before anyone is asked to use them.
        </DocP>
      </DocSection>

      <DocSection title="Questions, and changes to this page">
        <DocP>
          Ask us anything about this page on the{' '}
          <Link href={ROUTES.contact} className={DOC_LINK}>
            contact page
          </Link>
          . If the site starts using analytics, a form or anything else that collects data, this page will be updated
          before it does. Last updated 11 October 2026.
        </DocP>
        <DocP muted>This page is a plain-language description of what the site does. It is not legal advice.</DocP>
      </DocSection>
    </DocShell>
  );
}
