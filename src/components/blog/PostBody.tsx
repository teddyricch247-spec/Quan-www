import React from 'react';
import type { Block, Reference } from '../../data/blog-types';
import { headingId } from '../../data/blog-types';
import { renderInline } from './Inline';
import { FIGURES } from './figures';

const BODY_TEXT = 'text-[1.0625rem] leading-[1.78] text-ink-2';

/** "In this post" — jump links to every h2. Skipped for short posts. */
export const PostToc: React.FC<{ blocks: Block[] }> = ({ blocks }) => {
  const headings = blocks.flatMap((b) => (b.type === 'h2' ? [b.text] : []));
  if (headings.length < 4) return null;
  return (
    <nav aria-label="In this post" className="mb-10 rounded-2xl border border-line bg-surface px-6 py-5">
      <p className="m-0 text-sm font-medium text-ink">In this post</p>
      <ol className="m-0 mt-3 flex list-none flex-col gap-1.5 p-0 text-[0.9375rem]">
        {headings.map((text) => (
          <li key={text}>
            <a
              href={`#${headingId(text)}`}
              className="text-ink-2 transition-colors hover:text-ink"
            >
              {text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

function renderBlock(block: Block, index: number, figureNo: number, tableNo: number): React.ReactNode {
  switch (block.type) {
    case 'p':
      return (
        <p key={index} className={`m-0 ${BODY_TEXT}`}>
          {renderInline(block.text)}
        </p>
      );

    case 'h2':
      return (
        <h2
          key={index}
          id={headingId(block.text)}
          className="m-0 mt-8 scroll-mt-[100px] font-medium leading-[1.2] tracking-[-0.028em] text-ink"
          style={{ fontSize: 'clamp(1.5rem, 2.6vw, 1.85rem)' }}
        >
          {block.text}
        </h2>
      );

    case 'h3':
      return (
        <h3
          key={index}
          className="m-0 mt-3 text-[1.25rem] font-medium leading-[1.3] tracking-[-0.02em] text-ink"
        >
          {block.text}
        </h3>
      );

    case 'ul':
      return (
        <ul key={index} className={`m-0 flex list-disc flex-col gap-2.5 pl-6 marker:text-ink-3 ${BODY_TEXT}`}>
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );

    case 'ol':
      return (
        <ol key={index} className={`m-0 flex list-decimal flex-col gap-3 pl-6 marker:text-ink-3 ${BODY_TEXT}`}>
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );

    case 'quote':
      return (
        <blockquote key={index} className="m-0 border-l-2 border-ink pl-5">
          <p className="m-0 text-[1.125rem] leading-[1.6] text-ink">{renderInline(block.text)}</p>
          {block.cite ? <footer className="mt-2 text-sm text-ink-3">{block.cite}</footer> : null}
        </blockquote>
      );

    case 'callout':
      return (
        <aside key={index} className="rounded-2xl border border-line bg-surface px-6 py-5">
          <p className="m-0 text-[0.9375rem] font-medium text-ink">{block.title}</p>
          <p className="mb-0 mt-2 text-[0.9375rem] leading-[1.7] text-ink-2">{renderInline(block.text)}</p>
        </aside>
      );

    case 'figure':
      return (
        <figure key={index} className="m-0 my-4 rounded-2xl border border-line px-5 py-6 sm:px-7">
          {FIGURES[block.id]}
          <figcaption className="mt-6 border-t border-line-soft pt-4 text-[0.8125rem] leading-[1.6] text-ink-3">
            <span className="font-medium text-ink-2">Figure {figureNo}.</span> {renderInline(block.caption)}
            {block.source ? (
              <>
                {' '}
                Source:{' '}
                <a
                  href={block.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-[#D5D5D1] text-ink-2 transition-colors hover:border-ink hover:text-ink"
                >
                  {block.source.label}
                </a>
                .
              </>
            ) : null}
          </figcaption>
        </figure>
      );

    case 'table':
      return (
        <figure key={index} className="m-0 my-4">
          <div className="card-panel overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left text-[0.875rem] leading-[1.55]">
              <caption className="sr-only">{block.caption}</caption>
              <thead>
                <tr className="bg-surface text-ink-2">
                  {block.headers.map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="border-t border-line-soft align-top">
                    {row.map((cell, c) =>
                      c === 0 ? (
                        <th key={c} scope="row" className="px-4 py-3.5 font-medium text-ink">
                          {renderInline(cell)}
                        </th>
                      ) : (
                        <td key={c} className="px-4 py-3.5 text-ink-2">
                          {renderInline(cell)}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <figcaption className="mt-3 text-[0.8125rem] leading-[1.6] text-ink-3">
            <span className="font-medium text-ink-2">Table {tableNo}.</span> {renderInline(block.caption)}
          </figcaption>
        </figure>
      );

    case 'code':
      return (
        <figure key={index} className="m-0 my-2">
          <pre
            tabIndex={0}
            aria-label={`${block.language} code example`}
            className="m-0 overflow-x-auto rounded-2xl bg-code-bg px-5 py-4 text-[0.8125rem] leading-[1.7] text-code-ink"
          >
            <code>{block.code}</code>
          </pre>
          {block.caption ? (
            <figcaption className="mt-2.5 text-[0.8125rem] leading-[1.6] text-ink-3">{renderInline(block.caption)}</figcaption>
          ) : null}
        </figure>
      );
  }
}

export const PostBody: React.FC<{ blocks: Block[] }> = ({ blocks }) => {
  let figureNo = 0;
  let tableNo = 0;
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, i) => {
        if (block.type === 'figure') figureNo += 1;
        if (block.type === 'table') tableNo += 1;
        return renderBlock(block, i, figureNo, tableNo);
      })}
    </div>
  );
};

export const PostReferences: React.FC<{ references: Reference[] }> = ({ references }) => (
  <section aria-labelledby="references-heading" className="mt-16 border-t border-line pt-10">
    <h2 id="references-heading" className="m-0 text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
      References
    </h2>
    <ol className="m-0 mt-5 flex list-decimal flex-col gap-3 pl-6 text-[0.9375rem] leading-[1.65] text-ink-2 marker:text-ink-3">
      {references.map((ref) => (
        <li key={ref.url} className="pl-1">
          <a
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-[#D5D5D1] text-ink-2 transition-colors hover:border-ink hover:text-ink"
          >
            {ref.citation}
          </a>
        </li>
      ))}
    </ol>
  </section>
);
