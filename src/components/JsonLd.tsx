import React from 'react';
import type { JsonLdNode } from '../lib/seo';

/**
 * Renders schema.org structured data as a JSON-LD <script>. It is a server
 * component, so the data is in the HTML Google first fetches.
 *
 * "<" is escaped so a stray "</script>" inside a string can never end the
 * tag early.
 */
export const JsonLd: React.FC<{ data: JsonLdNode | JsonLdNode[] }> = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
  />
);

export default JsonLd;
