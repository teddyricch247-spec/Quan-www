import React from 'react';
import { EXTERNAL } from '../lib/routes';

/**
 * A closing band that points readers at the Developer Platform
 * (platform.quancis.space): get a key, read the docs, see the price.
 * Used at the end of blog posts and company pages so most www pages lead
 * somewhere useful for someone who wants to try Kael. Same band shape as
 * the closing CTAs on the product pages.
 */
export const PlatformCta: React.FC<{
  heading?: string;
  body?: React.ReactNode;
  className?: string;
}> = ({
  heading = 'Try Kael on your own work.',
  body = 'Sign-up is open to anyone while Kael is in beta. Point the SDK you already use at the Kael API, set the model to kael-beta, and run your hardest prompt.',
  className = '',
}) => (
  <aside className={`rounded-[28px] bg-surface px-[clamp(24px,5vw,56px)] py-[clamp(36px,6vh,56px)] ${className}`}>
    <h2 className="m-0 text-[1.375rem] font-medium leading-[1.2] tracking-[-0.025em] text-ink">{heading}</h2>
    <p className="mb-0 mt-3 max-w-[560px] text-[0.9375rem] leading-[1.7] text-ink-2">{body}</p>
    <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
      <a href={EXTERNAL.platform} className="btn-pill btn-pill-dark">
        Get API access
      </a>
      <a
        href={EXTERNAL.platformDocs}
        className="border-b border-[#D5D5D1] pb-0.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink"
      >
        Kael API documentation
      </a>
      <a
        href={EXTERNAL.platformPricing}
        className="border-b border-[#D5D5D1] pb-0.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink"
      >
        Kael API pricing
      </a>
    </div>
  </aside>
);

export default PlatformCta;
