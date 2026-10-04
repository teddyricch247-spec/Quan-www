'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES, HERO_ROUTES, EXTERNAL } from '../../lib/routes';
import { BrandMark } from '../BrandMark';
import { Cpu, Gamepad2, Hammer, House, MessageCircle, Newspaper, Tag, X } from 'lucide-react';

const NAV_LINKS = [
  { href: ROUTES.home, label: 'Home', icon: House, accentClass: 'text-ink' },
  { href: ROUTES.kael, label: 'Kael', icon: Cpu, accentClass: 'text-accent-red' },
  { href: ROUTES.harness, label: 'Harness', icon: Hammer, accentClass: 'text-accent-harness' },
  { href: ROUTES.chat, label: 'Chat', icon: MessageCircle, accentClass: 'text-accent-chat' },
  { href: ROUTES.demo, label: 'Demos', icon: Gamepad2, accentClass: 'text-accent-red' },
  { href: ROUTES.pricing, label: 'Pricing', icon: Tag, accentClass: 'text-ink' },
  { href: ROUTES.blog, label: 'Blog', icon: Newspaper, accentClass: 'text-ink' },
] as const;

/** Home is only "active" on exactly "/"; every other link also stays active
 *  on its sub-pages (so /blog/some-post still highlights Blog).
 *
 *  When one link's path is nested inside another's (Demos lives at
 *  /kael/demo, under Kael at /kael), only the most specific match is active,
 *  so /kael/demo/chess highlights Demos and not Kael as well. */
function isActivePath(pathname: string, href: string): boolean {
  if (href === ROUTES.home) return pathname === ROUTES.home;
  const matches = (h: string) => pathname === h || pathname.startsWith(`${h}/`);
  if (!matches(href)) return false;
  return !NAV_LINKS.some((l) => l.href !== href && l.href.length > href.length && matches(l.href));
}

/**
 * Shared header for every www page (spec §Part 3): brand mark, then a
 * slide-in menu with Home · Kael · Harness · Chat · Demos · Pricing · Blog. No login link —
 * www sends people to a product page, which carries its own CTA.
 *
 * Same glass-pill mechanic as the platform app's Navbar: transparent over a
 * dark hero until scrolled, then a floating blurred pill; always the pill on
 * pages with no hero.
 *
 * The menu is a proper modal dialog: it takes focus when it opens, keeps Tab
 * inside itself, closes on Escape, on the backdrop, and whenever the route
 * changes, and hands focus back to the menu button when it closes.
 */
export const Navbar: React.FC = () => {
  const pathname = usePathname() || '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerId = useId();

  const drawerRef = useRef<HTMLElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const hasHero = HERO_ROUTES.has(pathname);

  // Pages with no hero are always in the pill state. This is derived, not
  // stored: setting it from an effect would paint one frame in the
  // transparent state and then animate into the pill on every such page.
  const pill = !hasHero || scrolled;
  const headerLight = !pill;

  useEffect(() => {
    if (!hasHero) return;
    const update = () => setScrolled(window.scrollY > 40);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [hasHero]);

  const closeMenu = useCallback((restoreFocus = true) => {
    setMenuOpen(false);
    if (restoreFocus) {
      requestAnimationFrame(() => openButtonRef.current?.focus());
    }
  }, []);

  // Any navigation closes the menu (covers back/forward as well as link clicks).
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Focus management + Escape + Tab trap while the menu is open.
  useEffect(() => {
    if (!menuOpen) return;

    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 60);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== 'Tab') return;
      const root = drawerRef.current;
      if (!root) return;
      const focusable = Array.from(root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  return (
    <>
      <header
        className={`fixed left-1/2 -translate-x-1/2 z-[100] flex items-center justify-between transition-all duration-700 ease-out ${
          pill
            ? 'site-header-glass top-3.5 w-[calc(100%-32px)] max-w-[1240px] h-[60px] rounded-full pl-6 pr-3.5 bg-white/[0.23]'
            : 'top-0 w-full h-[76px] px-[clamp(20px,5vw,48px)] bg-transparent'
        } ${menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <Link
          href={ROUTES.home}
          aria-label="Quancis, home"
          className={`flex items-center gap-2 font-semibold text-[1.0625rem] tracking-[-0.015em] cursor-pointer ${
            headerLight ? 'text-white' : 'text-ink'
          }`}
        >
          <BrandMark size={26} />
          <span aria-hidden="true">uancis</span>
        </Link>

        <button
          ref={openButtonRef}
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls={drawerId}
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
          onClick={() => closeMenu()}
          aria-hidden="true"
          className={`absolute inset-0 bg-[rgba(20,22,24,0.18)] backdrop-blur-[3px] transition-opacity duration-500 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <aside
          id={drawerId}
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          inert={!menuOpen}
          className={`menu-panel-glass absolute top-0 right-0 h-full w-[min(420px,92vw)] border-l border-white/60 shadow-[-40px_0_100px_-30px_rgba(20,22,24,0.20)] flex flex-col transition-transform duration-700 ease-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex-none flex items-center justify-between px-7 py-5 border-b border-line-soft">
            <span className="flex items-center gap-2 font-semibold text-[1.0625rem] tracking-[-0.015em] text-ink">
              <BrandMark size={24} />
              <span aria-hidden="true">uancis</span>
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => closeMenu()}
              aria-label="Close menu"
              className="w-10 h-10 grid place-items-center rounded-full text-ink-2 hover:bg-surface hover:text-ink transition-colors cursor-pointer"
            >
              <X className="h-[18px] w-[18px]" strokeWidth={1.7} />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center px-7 py-8 overflow-y-auto">
            <nav aria-label="Main" className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => {
                const isActive = isActivePath(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => closeMenu(false)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-3 py-2 text-[1.5rem] font-medium tracking-[-0.03em] transition-[opacity,transform] cursor-pointer ${
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

          <div className="flex-none flex flex-wrap items-center gap-x-6 gap-y-2 px-7 py-5 border-t border-line-soft text-sm">
            <Link
              href={ROUTES.legal}
              onClick={() => closeMenu(false)}
              className="text-ink-3 hover:text-ink transition-colors cursor-pointer"
            >
              Legal
            </Link>
            <a href={EXTERNAL.platformDocs} className="text-ink-3 hover:text-ink transition-colors cursor-pointer">
              API docs
            </a>
            <a href={EXTERNAL.platformPricing} className="text-ink-3 hover:text-ink transition-colors cursor-pointer">
              Pricing
            </a>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Navbar;
