import type { Metadata } from 'next';
import { PlaceholderNote } from '../../components/PlaceholderNote';
import { EXTERNAL } from '../../lib/routes';

export const metadata: Metadata = {
  title: 'Legal',
  description: "Kael, Harness, and Chat are separate products with their own terms. Here's where each one lives.",
};

function LegalRow({
  title,
  note,
  termsHref,
  privacyHref,
}: {
  title: string;
  note?: string;
  termsHref: string;
  privacyHref: string;
}) {
  return (
    <div className="card-panel px-7 py-6 sm:px-8 sm:py-7">
      <h2 className="m-0 text-[1.0625rem] font-medium tracking-[-0.015em] text-ink">{title}</h2>
      {note ? <p className="mt-1.5 mb-0 text-sm text-ink-2">{note}</p> : null}
      <div className="mt-4 flex flex-wrap items-center gap-2.5 text-[0.9375rem]">
        <a href={termsHref} className="font-medium text-ink border-b border-[#D5D5D1] hover:border-ink transition-colors cursor-pointer">
          Terms of Service
        </a>
        <span className="text-ink-3">·</span>
        <a href={privacyHref} className="font-medium text-ink border-b border-[#D5D5D1] hover:border-ink transition-colors cursor-pointer">
          Privacy Policy
        </a>
      </div>
    </div>
  );
}

export default function LegalPage() {
  return (
    <div className="w-full bg-white px-[clamp(20px,5vw,48px)] pt-[clamp(56px,9vh,96px)] pb-[clamp(88px,14vh,150px)]">
      <div className="max-w-[720px] mx-auto">
        <span className="page-eyebrow">Quancis</span>
        <h1 className="page-title mt-3.5">Legal.</h1>
        <p className="page-lead mt-4">
          Kael, Harness, and Chat are separate products with their own terms. Here&apos;s where each one lives.
        </p>

        <div className="mt-12 flex flex-col gap-4">
          <LegalRow
            title="Kael / Developer API"
            termsHref={EXTERNAL.platformTerms}
            privacyHref={EXTERNAL.platformPrivacy}
          />
          <LegalRow
            title="Quan Harness & Quan Chat"
            note="One subscription, one set of terms."
            termsHref={EXTERNAL.appTerms}
            privacyHref={EXTERNAL.appPrivacy}
          />
        </div>

        <div className="mt-16 pt-12 border-t border-line-soft">
          <h2 className="m-0 text-[1.0625rem] font-medium tracking-[-0.015em] text-ink">Cookies &amp; Analytics</h2>
          <p className="mt-3 max-w-[560px] text-ink-2 leading-[1.7]" style={{ fontSize: '0.9375rem' }}>
            This site uses minimal analytics to understand traffic. It doesn&apos;t set any tracking cookies tied to
            your account — those live on the product you actually sign into.
          </p>
          <PlaceholderNote label="Expand" className="mt-5 max-w-[560px]">
            once you know exactly what www&apos;s own analytics setup does.
          </PlaceholderNote>
        </div>
      </div>
    </div>
  );
}
