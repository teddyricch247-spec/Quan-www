'use client';

import Link from 'next/link';
import { BrandMark } from '../components/BrandMark';
import { ROUTES } from '../lib/routes';

/**
 * Shown when a page throws while rendering. Sits inside the root layout, so
 * the header and footer stay put. Same look as the 404 page.
 */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="w-full bg-white px-[clamp(20px,5vw,48px)] py-[clamp(100px,18vh,200px)]">
      <div className="max-w-[480px] mx-auto text-center">
        <BrandMark size={40} className="mx-auto mb-8 text-ink" />
        <h1 className="page-title">Something went wrong.</h1>
        <p className="page-lead mx-auto mt-4">
          That page hit an error on our side. Try again, or head back to the start.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
          <button type="button" onClick={() => reset()} className="btn-pill btn-pill-dark cursor-pointer">
            Try again
          </button>
          <Link
            href={ROUTES.home}
            className="text-[0.9375rem] font-medium text-ink-2 hover:text-ink transition-colors cursor-pointer"
          >
            Back to Quancis
          </Link>
        </div>
      </div>
    </div>
  );
}
