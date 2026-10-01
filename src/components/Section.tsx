import React from 'react';

/**
 * Small layout primitives for long content pages (the Kael page uses
 * them throughout). They reproduce, exactly, the section padding, eyebrow,
 * h2 and body-paragraph styles the other pages repeat inline, so a page
 * built from these still looks like the rest of the site.
 */

export const Section: React.FC<{
  id?: string;
  /** 'first' pads the top as well — used for the section right under a hero. */
  pad?: 'first' | 'default';
  children: React.ReactNode;
}> = ({ id, pad = 'default', children }) => (
  <section
    id={id}
    className={`px-[clamp(20px,5vw,48px)] scroll-mt-[100px] ${
      pad === 'first'
        ? 'pt-[clamp(40px,6vh,64px)] pb-[clamp(88px,15vh,176px)]'
        : 'pb-[clamp(88px,15vh,176px)]'
    }`}
  >
    <div className="max-w-[1160px] mx-auto">{children}</div>
  </section>
);

export const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-xs font-medium tracking-[0.14em] uppercase text-ink-3">{children}</span>
);

export const H2: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h2
    className={`mt-3.5 mb-6 font-medium text-ink leading-[1.14] tracking-[-0.032em] ${className}`}
    style={{ fontSize: 'clamp(1.75rem, 3.3vw, 2.6rem)' }}
  >
    {children}
  </h2>
);

export const H3: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`m-0 text-[1.25rem] font-medium leading-[1.25] tracking-[-0.02em] text-ink ${className}`}>
    {children}
  </h3>
);

export const Prose: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p
    className={`max-w-[720px] text-ink-2 leading-[1.7] ${className}`}
    style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.1875rem)' }}
  >
    {children}
  </p>
);

export default Section;
