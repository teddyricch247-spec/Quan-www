import React from 'react';
import Link from 'next/link';
import { HeroCanvas } from './three/HeroCanvas';
import { ACCENT_RGB, ACCENT_GLASS_CLASS, type AccentName } from '../lib/accents';

export interface HeroCta {
  label: string;
  href: string;
  /** Cross-domain links (platform./app.quancis.space) use a plain <a>. */
  external?: boolean;
}

export interface HeroProps {
  accent: AccentName;
  eyebrow?: string;
  headline: React.ReactNode;
  subhead: React.ReactNode;
  cta?: HeroCta;
  /** A second, quieter button beside the main one (no accent ring). */
  secondaryCta?: HeroCta;
  /** Shorter hero with no bottom CTA — used by the home page, which
   *  moves straight into the three product tiles below it. */
  compact?: boolean;
}

const HeroLink: React.FC<{ cta: HeroCta; className: string }> = ({ cta, className }) =>
  cta.external ? (
    <a href={cta.href} className={className}>
      {cta.label}
    </a>
  ) : (
    <Link href={cta.href} className={className}>
      {cta.label}
    </Link>
  );

/**
 * The dark hero shared by every www page that has one (home, /kael,
 * /harness, /chat). Per spec §1.1/§1.4: one dark base on every hero —
 * only the HeroCanvas accent tint and the copy change per product; grid,
 * wave, gradient, and pointer behavior stay identical.
 *
 * The copy plays one staggered rise on page load (.hero-rise in
 * globals.css, switched off under prefers-reduced-motion). It is pure CSS,
 * so it costs no JavaScript and the text is in the server-rendered HTML.
 */
export const Hero: React.FC<HeroProps> = ({
  accent,
  eyebrow,
  headline,
  subhead,
  cta,
  secondaryCta,
  compact = false,
}) => {
  return (
    <section
      className={`relative flex items-start px-[clamp(20px,5vw,48px)] pt-[152px] overflow-hidden isolate bg-hero ${
        compact ? 'min-h-[78svh] pb-[9vh]' : 'min-h-[100svh] pb-[14vh]'
      }`}
    >
      <HeroCanvas accentColor={ACCENT_RGB[accent]} />
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(6,8,13,0.32) 0%, rgba(6,8,13,0.13) 42%, rgba(6,8,13,0.17) 70%, rgba(6,8,13,0.10) 100%)',
        }}
      />
      <div
        className="absolute left-0 right-0 bottom-0 -z-10 pointer-events-none h-[min(42vh,420px)]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 46%, rgba(255,255,255,0.34) 70%, rgba(255,255,255,0.84) 88%, #ffffff 100%)',
        }}
      />

      <div className="relative w-full max-w-[1160px] mx-auto">
        <div className="max-w-[820px]">
          {eyebrow ? (
            <div
              className="hero-rise mb-[26px] text-xs font-medium tracking-[0.13em] uppercase text-white/60"
              style={{ animationDelay: '0.05s' }}
            >
              {eyebrow}
            </div>
          ) : null}

          <h1
            className="hero-rise m-0 mb-[30px] font-medium text-white leading-[1.03] tracking-[-0.038em]"
            style={{ fontSize: 'clamp(2.5rem, 5.4vw, 4.4rem)', animationDelay: '0.12s' }}
          >
            {headline}
          </h1>

          <p
            className="hero-rise m-0 max-w-[680px] text-white leading-[1.62]"
            style={{
              fontSize: 'clamp(1.0625rem, 1.3vw, 1.1875rem)',
              marginBottom: cta ? '42px' : 0,
              animationDelay: '0.26s',
            }}
          >
            {subhead}
          </p>

          {cta ? (
            <div className="hero-rise flex flex-wrap gap-3.5" style={{ animationDelay: '0.4s' }}>
              <HeroLink cta={cta} className={`btn-pill btn-pill-glass ${ACCENT_GLASS_CLASS[accent]}`} />
              {secondaryCta ? <HeroLink cta={secondaryCta} className="btn-pill btn-pill-glass" /> : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Hero;
