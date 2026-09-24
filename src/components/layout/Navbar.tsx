'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES, HERO_ROUTES } from '../../lib/routes';
import { BrandMark } from '../BrandMark';
import { Cpu, Hammer, MessageCircle, Newspaper, X } from 'lucide-react';

const NAV_LINKS = [
  { href: ROUTES.kael, label: 'Kael', icon: Cpu, accentClass: 'text-accent-red' },
  { href: ROUTES.harness, label: 'Harness', icon: Hammer, accentClass: 'text-accent-harness' },
  { href: ROUTES.chat, label: 'Chat', icon: MessageCircle, accentClass: 'text-accent-chat' },
  { href: ROUTES.blog, label: 'Blog', icon: Newspaper, accentClass: 'text-ink' },
] as const;

/**
 * Shared header for every www page (spec §Part 3): brand mark, nav
 * links Kael · Harness · Chat · Blog, no login link — www sends people
 * to a product page, which carries its own CTA.
 *
 * Same glass-pill mechanic as the platform app's Navbar, reused
 * identically per spec §1.1: transparent over a dark hero until
 * scrolled, then a floating blurred pill; always pill-state on pages
 * with no hero. Simplified from the source (no auth state, no
 * account/admin items) since this repo has zero auth.
 */
export const Navbar: React.FC = () => {
  const pathname = usePathname() || '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const hasHero = HERO_ROUTES.has(pathname);

  useEffect(() => {
    if (!hasHero) {
      setScrolled(true);
      return;
    }
    setScrolled(window.scrollY > 40);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasHero]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const headerLight = hasHero && !scrolled;

  return (
    <>
      <header
        className={`fixed left-1/2 -translate-x-1/2 z-[100] flex items-center justify-between transition-all duration-700 ease-out ${
          scrolled
            ? 'site-header-glass top-3.5 w-[calc(100%-32px)] max-w-[1240px] h-[60px] rounded-full pl-6 pr-3.5 bg-white/[0.23]'
            : 'top-0 w-full h-[76px] px-[clamp(20px,5vw,48px)] bg-transparent'
        } ${menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <Link
          href={ROUTES.home}
          className={`flex items-center gap-2 font-semibold text-[1.0625rem] tracking-[-0.015em] cursor-pointer ${
            headerLight ? 'text-white' : 'text-ink'
          }`}
        >
          <BrandMark size={26} />
          <span>uancis</span>
        </Link>

        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className={`relative w-11 h-11 -mr-2.5 flex flex-col items-center justify-center gap-[7px] cursor-pointer ${
            headerLight ? 'text-white' : 'text-ink'
          }`}
        >
          <span className="block w-[22px] h-[2px] rounded-full bg-current" />
          <span className="block w-[22px] h-[2px] rounded-full bg-current" />
        </button>
      </header>

      {/* Slide-in glass drawer */}
      <div
        className={`fixed inset-0 z-[200] transition-[visibility] ${
          menuOpen ? 'visible' : 'invisible delay-700'
        }`}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-[rgba(20,22,24,0.18)] backdrop-blur-[3px] transition-opacity duration-500 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={`menu-panel-glass absolute top-0 right-0 h-full w-[min(420px,92vw)] border-l border-white/60 shadow-[-40px_0_100px_-30px_rgba(20,22,24,0.20)] flex flex-col transition-transform duration-700 ease-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex-none flex items-center justify-between px-7 py-5 border-b border-line-soft">
            <span className="flex items-center gap-2 font-semibold text-[1.0625rem] tracking-[-0.015em] text-ink">
              <BrandMark size={24} />
              uancis
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="w-10 h-10 grid place-items-center rounded-full text-ink-2 hover:bg-surface hover:text-ink transition-colors cursor-pointer"
            >
              <X className="h-[18px] w-[18px]" strokeWidth={1.7} />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center px-7 py-8 overflow-y-auto">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 py-2 text-[1.5rem] font-medium tracking-[-0.03em] transition-opacity cursor-pointer ${
                      menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                    } ${isActive ? link.accentClass : 'text-ink hover:opacity-55'}`}
                    style={{ transitionDelay: menuOpen ? `${0.1 + i * 0.06}s` : '0s', transitionDuration: '0.5s' }}
                  >
                    <link.icon className="h-5 w-5 flex-none opacity-60" strokeWidth={1.7} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex-none px-7 py-5 border-t border-line-soft">
            <Link
              href={ROUTES.legal}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-ink-3 hover:text-ink transition-colors cursor-pointer"
            >
              Legal
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Navbar;
