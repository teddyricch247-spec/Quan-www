import React from 'react';

/**
 * One schema.org JSON-LD block. "<" is escaped so that text containing
 * "</script>" can never end the tag early.
 */
export const JsonLd: React.FC<{ data: Record<string, unknown> }> = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
  />
);

export default JsonLd;
