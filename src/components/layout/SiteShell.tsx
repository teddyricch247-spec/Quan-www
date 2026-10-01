'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { HERO_ROUTES } from '../../lib/routes';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

/**
 * The header is position:fixed (it floats over a hero and needs to
 * keep floating as you scroll), so it doesn't reserve layout space.
 * Hero pages already have enough top padding built into the hero
 * section itself to clear it; every non-hero page needs the offset
 * added here instead — same rule as the platform app's AppShell.
 *
 * Also hosts the "Skip to content" link: invisible until a keyboard user
 * tabs to it, then it jumps past the header straight to <main>.
 */
export const SiteShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname() || '/';
  const hasHero = HERO_ROUTES.has(pathname);

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className={`flex-1 w-full outline-none ${hasHero ? '' : 'pt-[114px]'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default SiteShell;
