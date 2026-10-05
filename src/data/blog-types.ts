/**
 * Types and tiny builders for blog content.
 *
 * A post body is a list of blocks. Inline formatting inside any text string:
 *   [label](https://example.com)   link (internal paths start with "/")
 *   **bold**   *italic*   `code`
 */

export type BlogTag = 'Product' | 'Engineering' | 'Research' | 'Company';

/** Ids of the figures registered in components/blog/figures/index.tsx. */
export type FigureId =
  | 'three-families'
  | 'repeated-sampling'
  | 'travelplanner'
  | 'mind-evolution-ablation'
  | 'kael-loop'
  | 'speed-ranges'
  | 'security-pipeline'
  | 'veracode-failures'
  // Drawn figures (SVG), added 5 October 2026
  | 'tokens-pipeline'
  | 'prefill-kv'
  | 'decode-loop'
  | 'embedding-space'
  | 'context-narrows'
  | 'scratch-paper'
  | 'second-student'
  | 'many-students'
  | 'idea-ladder'
  | 'pool-and-picker'
  | 'mind-evolution-islands'
  | 'swiss-cheese'
  | 'sql-injection-flow'
  | 'kael-request-path'
  | 'wait-at-the-front'
  | 'thinking-stack';

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'callout'; title: string; text: string }
  | { type: 'figure'; id: FigureId; caption: string; source?: { label: string; url: string } }
  | { type: 'table'; caption: string; headers: string[]; rows: string[][] }
  | { type: 'code'; language: string; code: string; caption?: string };

export interface Reference {
  /** "Authors, Year. Title." Written out in full so a reader can find it without the link. */
  citation: string;
  url: string;
}

export interface Author {
  name: string;
  role: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  /** Shorter, keyword-led title for the <title> tag, if the headline is too long or too clever. */
  seoTitle?: string;
  /** ISO date (YYYY-MM-DD) the post was first published. */
  date: string;
  /** ISO date of the last meaningful edit. Omit if never edited. */
  updated?: string;
  excerpt: string;
  tag: BlogTag;
  author: string;
  keywords: string[];
  /** Path under /public of the 1200x630 share image. */
  ogImage: string;
  body: Block[];
  references?: Reference[];
  /** Slugs of posts to suggest at the end. Falls back to the newest other posts. */
  related?: string[];
}

export interface BlogListItem {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tag: BlogTag;
  minutes: number;
}

// Builders — they only make post files shorter to read.
export const p = (text: string): Block => ({ type: 'p', text });
export const h2 = (text: string): Block => ({ type: 'h2', text });
export const h3 = (text: string): Block => ({ type: 'h3', text });
export const ul = (...items: string[]): Block => ({ type: 'ul', items });
export const ol = (...items: string[]): Block => ({ type: 'ol', items });
export const quote = (text: string, cite?: string): Block => ({ type: 'quote', text, cite });
export const callout = (title: string, text: string): Block => ({ type: 'callout', title, text });
export const figure = (
  id: FigureId,
  caption: string,
  source?: { label: string; url: string }
): Block => ({ type: 'figure', id, caption, source });
export const table = (caption: string, headers: string[], rows: string[][]): Block => ({
  type: 'table',
  caption,
  headers,
  rows,
});
export const code = (language: string, source: string, caption?: string): Block => ({
  type: 'code',
  language,
  code: source,
  caption,
});

/** Anchor id for an h2 heading, used by the table of contents. */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Words in a post body, counting text in every block that carries text. */
export function countWords(body: Block[]): number {
  const strip = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*`]/g, '');
  const words = (s: string) => (strip(s).trim().match(/\S+/g) ?? []).length;
  let n = 0;
  for (const b of body) {
    switch (b.type) {
      case 'p':
      case 'h2':
      case 'h3':
      case 'quote':
        n += words(b.text);
        break;
      case 'ul':
      case 'ol':
        for (const item of b.items) n += words(item);
        break;
      case 'callout':
        n += words(b.title) + words(b.text);
        break;
      case 'figure':
        n += words(b.caption);
        break;
      case 'table':
        for (const row of b.rows) for (const cell of row) n += words(cell);
        break;
      case 'code':
        break;
    }
  }
  return n;
}
