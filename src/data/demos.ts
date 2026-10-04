/**
 * Every demo on the site lives here. To add one:
 *
 *   1. Drop the finished single-file HTML game/app in `public/demo-files/`
 *      (it is served as-is at /demo-files/<file>).
 *   2. Add an object to DEMOS below.
 *   3. Optional: add the demo to DEMOS in scripts/make-og.py, run it, and set
 *      `ogImage` so the demo has its own share card (otherwise it uses the
 *      site's default card).
 *
 * That is all. The hub page (/kael/demo), the demo's own page
 * (/kael/demo/<slug>), the Kael page's demo strip, the "more demos" list and
 * the sitemap are all generated from this array at build time. File size and
 * line count are read from the HTML file itself (see src/lib/demoFiles.ts),
 * so they cannot go stale.
 *
 * Cover art: set `cover.image` to a screenshot in `public/` (for example
 * '/demo-covers/chess.jpg') and it replaces the drawn cover everywhere. Until
 * then each demo uses a drawn cover (`cover.art`); a new art style is one more
 * case in src/components/demos/DemoCover.tsx, and 'generic' works with no
 * extra code at all.
 */

/** How a demo was made. Add a key here to tell a different story for a
 *  future demo (made in Quan Harness, made through the API, and so on). */
export type DemoOrigin = 'kael-chat';

export type CoverArt = 'snake' | 'chess' | 'generic';

export interface DemoControl {
  /** The key, gesture or button. Shown in a mono pill. */
  input: string;
  /** What it does. */
  action: string;
}

export interface Demo {
  /** URL segment: /kael/demo/<slug>. Lowercase, hyphens. */
  slug: string;
  title: string;
  /** One line. Used as the lead on the demo's page. */
  tagline: string;
  /** Two sentences at most. Used on cards and as the meta description. */
  summary: string;
  /** Paragraphs for the "About" section of the demo's page. */
  description: string[];
  /** ISO date (YYYY-MM-DD). Newest demo is listed first. */
  date: string;
  /** File name inside public/demo-files/. */
  file: string;
  tags: string[];
  /** Optional 1200x630 share image, e.g. '/og/demo-chess.png' (drawn by
   *  scripts/make-og.py, see its DEMOS list). Without it the page shares the
   *  site's default card. */
  ogImage?: string;
  origin: DemoOrigin;
  cover: {
    art: CoverArt;
    /** Gradient behind the art, also the card's colour while it loads. */
    from: string;
    to: string;
    /** Optional screenshot path under public/. Overrides the drawn art. */
    image?: string;
  };
  highlights: string[];
  controls: { desktop: DemoControl[]; touch: DemoControl[] };
  /** Display strings for the spec list, e.g. 'three.js 0.160'. */
  tech: string[];
  /** Hosts the file loads code from. Shown next to the player so nobody is
   *  surprised that a CDN sees the request. */
  cdnHosts: string[];
  /** What, if anything, the demo keeps in the browser. */
  storage: string;
}

export interface OriginStory {
  /** Short label, shown as a badge. */
  label: string;
  /** One sentence, shown on every demo page. */
  short: string;
  /** The three facts, shown in full on the hub page. */
  facts: { title: string; body: string }[];
}

export const ORIGINS: Record<DemoOrigin, OriginStory> = {
  'kael-chat': {
    label: 'Made in chat with Kael',
    short:
      'Kael wrote this in a chat conversation, with no building tools, as a single HTML file.',
    facts: [
      {
        title: 'Just a chat',
        body: 'Kael had no building tools. The code was written as text in a conversation, nothing more.',
      },
      {
        title: 'One file each',
        body: 'Every demo is a single self-contained HTML file, with its styles and script inside it.',
      },
      {
        title: 'Drawn and synthesised in code',
        body: 'There are no image, model or audio files. Textures are drawn on a canvas and sounds are synthesised. The only things fetched are the libraries, loaded from a public CDN.',
      },
    ],
  },
};

export const DEMOS: Demo[] = [
  {
    slug: 'ouroboros',
    title: 'Ouroboros',
    tagline: 'A 3D survival snake game, in one HTML file.',
    summary:
      'Steer a snake around a walled arena at sunset, eat glowing orbs and outlast the AI hunters. Three.js, procedural textures and synthesised sound, all in one file.',
    description: [
      'Ouroboros is a 3D snake survival game. You steer a snake around a 300 by 300 metre stone-walled arena at sunset, eating glowing orbs to grow. Rarer cyan orbs are worth far more and refill your boost.',
      'Between you and a high score are the hunters: AI snakes that look ahead for walls, rocks and other bodies, chase food and sprint when the way is clear. You start against three and the cap is nine, with more arriving the longer you last. Hit a wall, a rock or another snake’s body, or run into your own, and you are out. Whenever any snake dies, it drops orbs.',
      'Everything on screen is generated in code: the ground, the stone walls, the scales, the sunset sky, even the sound effects, which are synthesised with the Web Audio API. Bloom post-processing gives the orbs their glow. A tactical minimap, a combo multiplier, camera shake and full touch controls are in the same file.',
    ],
    date: '2026-10-04',
    file: 'ouroboros.html',
    tags: ['Game', '3D', 'AI opponents'],
    ogImage: '/og/demo-ouroboros.png',
    origin: 'kael-chat',
    cover: { art: 'snake', from: '#0b1020', to: '#e08a4e' },
    highlights: [
      '300 by 300 m arena with rocks, grass and stone walls',
      'Up to 9 AI hunters that dodge obstacles and chase food',
      'Boost meter, combo multiplier and rare orbs',
      'Tactical minimap',
      'Touch controls: floating joystick, look zone and boost button',
      'Textures and sound generated in code, no asset files',
    ],
    controls: {
      desktop: [
        { input: 'A / D or ← →', action: 'Steer' },
        { input: 'Shift or W', action: 'Boost' },
        { input: 'Drag the mouse', action: 'Look around' },
        { input: 'P or Esc', action: 'Pause' },
        { input: 'Space or Enter', action: 'Start, or play again' },
      ],
      touch: [
        { input: 'Left side of the screen', action: 'Steering joystick' },
        { input: 'Push the stick up, or tap Boost', action: 'Sprint' },
        { input: 'Right side of the screen', action: 'Drag to look around' },
      ],
    },
    tech: ['three.js 0.160', 'WebGL with bloom post-processing', 'Web Audio API'],
    cdnHosts: ['unpkg.com'],
    storage: 'Your best score is saved in your browser only. Nothing is sent to us.',
  },
  {
    slug: 'chess',
    title: '3D Chess',
    tagline: 'A full chess game with real physics, in one HTML file.',
    summary:
      'Play chess on a rendered wooden board, against a friend or the built-in AI. Captured pieces are knocked off by a physics engine and clatter across the board.',
    description: [
      '3D Chess is a complete chess game on a rendered wooden board. The pieces are built in code from turned profiles and simple shapes, lit with physically based materials and soft shadows.',
      'The rules are all there: castling, en passant, promotion with a piece picker, check, checkmate, stalemate, and draws by threefold repetition, the fifty-move rule or insufficient material. Moves are logged in standard algebraic notation, and you can undo them.',
      'Turn the AI on and it plays Black: an alpha-beta search with a capture search at the end, up to five plies (half-moves) deep, thinking for at most a second and a half on a desktop. We haven’t measured its strength. When a piece is captured it is not simply removed. The cannon-es physics engine knocks it off the square and lets it tumble across the board, with wood-on-wood sound synthesised on the fly.',
    ],
    date: '2026-10-04',
    file: 'chess.html',
    tags: ['Game', '3D', 'Physics', 'AI opponent'],
    ogImage: '/og/demo-chess.png',
    origin: 'kael-chat',
    cover: { art: 'chess', from: '#0d0b09', to: '#3a2a1c' },
    highlights: [
      'Full rules: castling, en passant, promotion and every kind of draw',
      'An AI opponent that plays Black, with iterative deepening',
      'Captured pieces knocked off by a physics engine (cannon-es)',
      'Move list in algebraic notation, undo, and flip board',
      'Orbit, zoom and pan camera, tap or click to move',
      'Wood, felt and sound generated in code, no asset files',
    ],
    controls: {
      desktop: [
        { input: 'Click a piece, then a square', action: 'Move' },
        { input: 'Drag', action: 'Orbit the camera' },
        { input: 'Scroll', action: 'Zoom' },
        { input: 'Undo, Flip, AI, Sound', action: 'Take back a move, turn the board, play the AI, mute' },
      ],
      touch: [
        { input: 'Tap a piece, then a square', action: 'Move' },
        { input: 'Drag', action: 'Orbit the camera' },
        { input: 'Pinch', action: 'Zoom' },
        { input: 'Two-finger drag', action: 'Pan' },
      ],
    },
    tech: ['three.js 0.160', 'cannon-es 0.20 physics', 'Web Audio API'],
    cdnHosts: ['cdn.jsdelivr.net'],
    storage: 'Nothing is stored in your browser.',
  },
];

/** Newest first. Demos on the same date keep the order they have above. */
export function getAllDemos(): Demo[] {
  return DEMOS.slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getDemoBySlug(slug: string): Demo | undefined {
  return DEMOS.find((d) => d.slug === slug);
}
