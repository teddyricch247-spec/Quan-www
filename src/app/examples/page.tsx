import type { Metadata } from 'next';
import { ExamplesGallery } from '../../components/examples/ExamplesGallery';
import { JsonLd } from '../../components/JsonLd';
import { PlaceholderNote } from '../../components/PlaceholderNote';
import { PlatformCta } from '../../components/PlatformCta';
import { EXAMPLES, EXAMPLES_ARE_LIVE, EXAMPLE_MODEL_ID } from '../../data/examples';
import { breadcrumbJsonLd, collectionPageJsonLd, pageMetadata } from '../../lib/seo';

const TITLE = 'Kael Examples — Real Prompts and Outputs';
const DESCRIPTION =
  'Examples of what Kael produces, each with the exact prompt, the model ID, the thinking level and the unedited output.';

// While every example is a placeholder the page is noindex (and left out of
// the sitemap). It becomes indexable automatically once one example is real.
export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/examples',
  noindex: !EXAMPLES_ARE_LIVE,
});

const READING_GUIDE = [
  {
    heading: 'Prompt',
    body: 'Exactly what was sent to Kael, including any code or context. Nothing is added or removed.',
  },
  {
    heading: 'Settings',
    body: `The model ID (${EXAMPLE_MODEL_ID}) and the thinking level the request used: Off, Low, High or Max.`,
  },
  {
    heading: 'Output',
    body: 'What Kael returned, unedited, along with the tokens and time where they were recorded.',
  },
] as const;

export default function ExamplesPage() {
  return (
    <div className="w-full bg-white px-[clamp(20px,5vw,48px)] pt-[clamp(56px,9vh,96px)] pb-[clamp(88px,14vh,150px)]">
      <JsonLd
        data={[
          collectionPageJsonLd({ name: 'Kael examples', description: DESCRIPTION, path: '/examples' }),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Examples', path: '/examples' },
          ]),
        ]}
      />
      <div className="max-w-[920px] mx-auto">
        <span className="page-eyebrow">Kael</span>
        <h1 className="page-title mt-3.5">What Kael Produces.</h1>
        <p className="page-lead mt-4">
          A gallery of Kael outputs, each with the prompt, model ID and thinking level that produced it.
        </p>

        {!EXAMPLES_ARE_LIVE ? (
          <PlaceholderNote label="Placeholder" className="mt-8">
            Every card on this page is a placeholder. None of it was produced by Kael. Real prompts and unedited
            responses will replace them.
          </PlaceholderNote>
        ) : null}

        <dl className="m-0 mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-3">
          {READING_GUIDE.map((item) => (
            <div key={item.heading}>
              <dt className="text-[0.9375rem] font-medium text-ink">{item.heading}</dt>
              <dd className="m-0 mt-1.5 text-[0.875rem] leading-[1.6] text-ink-2">{item.body}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12">
          <ExamplesGallery examples={EXAMPLES} />
        </div>

        <p className="mt-10 max-w-[680px] text-[0.9375rem] leading-[1.7] text-ink-2">
          Kael is not deterministic. It accepts sampling settings such as temperature but does not use them, so
          the same prompt can give a different answer on another run. Treat each example as one sample, not a
          guarantee.
        </p>

        <PlatformCta
          className="mt-14"
          heading="Run the same prompts yourself."
          body="Sign-up is open to anyone while Kael is in beta. Use the model name kael-beta with the SDK you already have, and compare what you get with what you see here."
        />
      </div>
    </div>
  );
}
