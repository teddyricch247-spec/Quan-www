import React from 'react';

/**
 * Small building blocks for the plain-language document pages
 * (/privacy, /security, /legal): a titled section, a paragraph, a list and a
 * link style, so they all read and look the same.
 */

export const DOC_LINK =
  'font-medium text-ink border-b border-[#D5D5D1] hover:border-ink transition-colors cursor-pointer';

export const DocShell: React.FC<{ eyebrow: string; title: string; lead: React.ReactNode; children: React.ReactNode }> = ({
  eyebrow,
  title,
  lead,
  children,
}) => (
  <div className="w-full bg-white px-[clamp(20px,5vw,48px)] pt-[clamp(56px,9vh,96px)] pb-[clamp(88px,14vh,150px)]">
    <div className="max-w-[720px] mx-auto">
      <span className="page-eyebrow">{eyebrow}</span>
      <h1 className="page-title mt-3.5">{title}</h1>
      <p className="page-lead mt-4">{lead}</p>
      {children}
    </div>
  </div>
);

export const DocSection: React.FC<{ id?: string; title: string; children: React.ReactNode; first?: boolean }> = ({
  id,
  title,
  children,
  first = false,
}) => (
  <section id={id} className={`scroll-mt-[100px] ${first ? 'mt-12' : 'mt-12 pt-12 border-t border-line-soft'}`}>
    <h2 className="m-0 text-[1.0625rem] font-medium tracking-[-0.015em] text-ink">{title}</h2>
    {children}
  </section>
);

export const DocP: React.FC<{ children: React.ReactNode; muted?: boolean }> = ({ children, muted = false }) => (
  <p
    className={`mt-3 max-w-[600px] leading-[1.7] ${muted ? 'text-ink-3' : 'text-ink-2'}`}
    style={{ fontSize: muted ? '0.875rem' : '0.9375rem' }}
  >
    {children}
  </p>
);

export const DocList: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ul className="mt-3 max-w-[600px] list-disc pl-5 text-ink-2 leading-[1.7] marker:text-ink-3" style={{ fontSize: '0.9375rem' }}>
    {items.map((item, i) => (
      <li key={i} className="mt-1.5">
        {item}
      </li>
    ))}
  </ul>
);
