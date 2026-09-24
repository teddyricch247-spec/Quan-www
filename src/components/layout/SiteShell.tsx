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
 */
export const SiteShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname() || '/';
  const hasHero = HERO_ROUTES.has(pathname);

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <Navbar />
      <main className={`flex-1 w-full ${hasHero ? '' : 'pt-[114px]'}`}>{children}</main>
      <Footer />
    </div>
  );
};

export default SiteShell;
