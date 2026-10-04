import { readFileSync } from 'node:fs';
import path from 'node:path';

export interface DemoFileStats {
  /** Lines in the HTML file, formatted, e.g. "2,725". */
  lines: string;
  /** File size in KB, formatted, e.g. "90". */
  kb: string;
}

const NUMBER = new Intl.NumberFormat('en-US');

/**
 * Reads a demo's HTML file at build time and reports its size, so the pages
 * can state "2,725 lines, 90 KB" without anyone keeping that number up to date.
 *
 * Server-only: import it from pages and route files, never from a component
 * marked 'use client'. Returns null (and the pages simply omit the line) if the
 * file cannot be read, so a missing file never breaks the build.
 */
export function getDemoFileStats(file: string): DemoFileStats | null {
  try {
    const buf = readFileSync(path.join(process.cwd(), 'public', 'demo-files', file));
    let lines = 0;
    for (let i = 0; i < buf.length; i++) if (buf[i] === 10) lines++;
    return { lines: NUMBER.format(lines), kb: NUMBER.format(Math.round(buf.length / 1024)) };
  } catch {
    return null;
  }
}
