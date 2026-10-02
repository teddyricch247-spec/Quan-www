import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Cpu, Hammer, MessageCircle } from 'lucide-react';
import { ROUTES } from '../lib/routes';
import { ACCENT_TEXT_CLASS, ACCENT_HOVER_TEXT_CLASS, type AccentName } from '../lib/accents';

interface Tile {
  accent: AccentName;
  icon: React.ElementType;
  name: string;
  category: string;
  tagline: string;
  href: string;
}

const TILES: Tile[] = [
  {
    accent: 'red',
    icon: Cpu,
    name: 'Kael',
    category: 'The model, as an API.',
    tagline: 'Drop it into anything that already speaks OpenAI.',
    href: ROUTES.kael,
  },
  {
    accent: 'harness',
    icon: Hammer,
    name: 'Quan Harness',
    category: 'The coding agent.',
    tagline: 'An agent that ships, not just suggests.',
    href: ROUTES.harness,
  },
  {
    accent: 'chat',
    icon: MessageCircle,
    name: 'Quan Chat',
    category: 'The assistant.',
    tagline: 'Kael, in a conversation.',
    href: ROUTES.chat,
  },
];

/** The three product tiles on the home page (spec §3.1). */
export const ProductTiles: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1160px] mx-auto">
      {TILES.map((tile) => (
        <Link
          key={tile.href}
          href={tile.href}
          className="group relative flex flex-col rounded-2xl border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#D2D2CD] hover:shadow-[0_20px_44px_-24px_rgba(20,22,24,0.18)]"
        >
          <ArrowUpRight
            className="absolute top-6 right-6 h-[18px] w-[18px] text-ink-3 transition-colors group-hover:text-ink"
            strokeWidth={1.8}
          />
          <div className={`grid h-11 w-11 place-items-center rounded-xl bg-surface ${ACCENT_TEXT_CLASS[tile.accent]}`}>
            <tile.icon className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <h3 className="mt-5 text-lg font-medium tracking-[-0.02em] text-ink">{tile.name}</h3>
          <p className="mt-1 text-sm text-ink-2">{tile.category}</p>
          <p className="mt-3 max-w-[280px] text-[0.9375rem] leading-[1.55] text-ink">{tile.tagline}</p>
        </Link>
      ))}
    </div>
  );
};

/** "Ready? Kael · Harness · Chat" — the footer-adjacent closing strip
 *  (spec §3.1: "No separate closing CTA needed — repeat the three
 *  tiles as a simple footer-adjacent strip"). */
export const ReadyStrip: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[1.0625rem]">
      <span className="text-ink-2">Ready?</span>
      {TILES.map((tile, i) => (
        <React.Fragment key={tile.href}>
          {i > 0 ? <span className="text-ink-3">·</span> : null}
          <Link
            href={tile.href}
            className={`font-medium text-ink transition-colors ${ACCENT_HOVER_TEXT_CLASS[tile.accent]}`}
          >
            {tile.name}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProductTiles;
