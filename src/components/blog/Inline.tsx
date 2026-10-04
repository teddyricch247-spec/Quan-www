import React from 'react';
import Link from 'next/link';
import { OWN_HOSTS } from '../../lib/routes';

/**
 * Inline formatting for blog text. Supported, in any string in a post:
 *   [label](href)   link        **bold**   *italic*   `code`
 * Paths that start with "/" are internal links (client-side navigation).
 * Quancis hosts (platform., app., www.) are plain same-owner links. Any
 * other host is an outside citation and opens in a new tab.
 */
const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*\s][^*]*)\*/g;

const LINK_CLASS =
  'border-b border-[#D5D5D1] font-medium text-ink transition-colors hover:border-ink';

function isOwnHost(href: string): boolean {
  try {
    return OWN_HOSTS.includes(new URL(href).hostname);
  } catch {
    return false;
  }
}

const InlineLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={LINK_CLASS}>
        {children}
      </Link>
    );
  }
  if (href.startsWith('#') || isOwnHost(href)) {
    return (
      <a href={href} className={LINK_CLASS}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} className={LINK_CLASS} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

export function renderInline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const m of text.matchAll(TOKEN)) {
    const start = m.index ?? 0;
    if (start > last) out.push(text.slice(last, start));

    if (m[1] !== undefined && m[2] !== undefined) {
      out.push(
        <InlineLink key={key++} href={m[2]}>
          {m[1]}
        </InlineLink>
      );
    } else if (m[3] !== undefined) {
      out.push(
        <strong key={key++} className="font-semibold text-ink">
          {m[3]}
        </strong>
      );
    } else if (m[4] !== undefined) {
      out.push(
        <code key={key++} className="rounded-md bg-surface px-1.5 py-0.5 text-[0.875em] text-ink">
          {m[4]}
        </code>
      );
    } else if (m[5] !== undefined) {
      out.push(<em key={key++}>{m[5]}</em>);
    }
    last = start + m[0].length;
  }

  if (last < text.length) out.push(text.slice(last));
  return out;
}
