import React from 'react';
import Link from 'next/link';
import { ROUTES, EXTERNAL } from '../../lib/routes';
import { BrandMark } from '../BrandMark';

/**
 * Shared footer for every www page (spec §Part 3): short About line,
 * links to Legal, Blog, the three product pages, plus the platform/app
 * domains directly for anyone who already knows what they want.
 */
export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-line-soft px-[clamp(20px,5vw,48px)] pt-[clamp(60px,9vh,96px)] pb-[46px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-x-16 gap-y-10 max-w-[1160px] mx-auto">
        <div>
          <span className="flex items-center gap-2 font-semibold text-[1.0625rem] tracking-[-0.015em] text-ink">
            <BrandMark size={24} />
            uancis
          </span>
          <p className="mt-4 max-w-[320px] text-sm leading-relaxed text-ink-2">
            The world&apos;s first composite intelligence — and the products people actually use it through.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.13em] text-ink-3">Product</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link href={ROUTES.kael} className="text-ink-2 hover:text-ink transition-colors cursor-pointer">
                Kael
              </Link>
            </li>
            <li>
              <Link href={ROUTES.harness} className="text-ink-2 hover:text-ink transition-colors cursor-pointer">
                Quan Harness
              </Link>
            </li>
            <li>
              <Link href={ROUTES.chat} className="text-ink-2 hover:text-ink transition-colors cursor-pointer">
                Quan Chat
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.13em] text-ink-3">Company</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link href={ROUTES.blog} className="text-ink-2 hover:text-ink transition-colors cursor-pointer">
                Blog
              </Link>
            </li>
            <li>
              <Link href={ROUTES.legal} className="text-ink-2 hover:text-ink transition-colors cursor-pointer">
                Legal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.13em] text-ink-3">Go straight to</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <a
                href={EXTERNAL.platform}
                className="text-ink-2 hover:text-ink transition-colors cursor-pointer"
              >
                Developer Platform
              </a>
            </li>
            <li>
              <a href={EXTERNAL.app} className="text-ink-2 hover:text-ink transition-colors cursor-pointer">
                Harness &amp; Chat App
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1160px] mx-auto mt-[clamp(56px,8vh,88px)] flex flex-wrap items-center justify-between gap-4 text-[0.8125rem] text-ink-3">
        <span>© {new Date().getFullYear()} Quancis.</span>
        <Link href={ROUTES.legal} className="hover:text-ink transition-colors cursor-pointer">
          Legal
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
