import React from 'react';
import Link from 'next/link';
import { EXTERNAL, ROUTES } from '../lib/routes';

export interface NotOpenYetProps {
  /** "Quan Harness" or "Quan Chat". */
  product: string;
  /** One sentence on what the person can do today instead. */
  instead: React.ReactNode;
}

/**
 * The closing band on /harness and /chat while the product is not open to the
 * public. It replaces what used to be a "Start" button and a "See pricing"
 * link that both led to a holding page: a button that cannot do what it says
 * is worse than no button.
 *
 * It says plainly that the product is not open, offers the one thing that
 * does work today (the Kael API), and links to the status page for the rest.
 * No sign-up or waitlist on purpose.
 *
 * When the product launches, swap this component for real buttons (see the
 * note in lib/routes.ts).
 */
export const NotOpenYet: React.FC<NotOpenYetProps> = ({ product, instead }) => {
  return (
    <div className="rounded-[28px] bg-surface px-[clamp(28px,6vw,64px)] py-[clamp(48px,8vh,76px)] text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium tracking-[0.06em] text-ink-2">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ink-3" />
        Not open to the public yet
      </span>
      <p
        className="mx-auto mt-6 max-w-[560px] text-ink-2 leading-[1.6]"
        style={{ fontSize: 'clamp(1.0625rem, 1.3vw, 1.1875rem)' }}
      >
        {product} is built, but you cannot sign up for it yet, and no pricing is published. {instead}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <a href={EXTERNAL.platform} className="btn-pill btn-pill-dark">
          Get Kael API Access
        </a>
        <Link href={ROUTES.notAvailable} className="btn-pill btn-pill-outline">
          Where things stand
        </Link>
      </div>
    </div>
  );
};

export default NotOpenYet;
