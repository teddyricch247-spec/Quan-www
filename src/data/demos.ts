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
 * Every demo page, and the hub, also offers the HTML file as a download (an
 * <a download> link to the same file), so nothing else is needed for that.
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

export type CoverArt = 'snake' | 'chess' | 'voxel' | 'generic';

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
  /** Hosts the file only tries if the first one fails to load. Optional. */
  cdnFallbacks?: string[];
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
    slug: 'blockscape',
    title: 'Blockscape',
    tagline: 'A voxel sandbox with a day and night cycle, in one HTML file.',
    summary:
      'Explore an endless generated world of forests, deserts, mountains and oceans, then dig and build with ten block types. Sunrises, stars, rippling water and wandering animals, in one file.',
    description: [
      'Blockscape is a voxel sandbox. The world is generated from a seed as you walk: oceans, beaches, plains, forests, deserts, taiga, rocky mountains and snow caps, with caves underneath and a bedrock floor. Oak, birch and spruce trees, tall grass and flowers fill in the surface. Dig any block out and place a new one from the ten in your hotbar.',
      'The sky runs a full day and night cycle, 10 minutes long at the normal setting, with a sun and moon, stars, sunrise and sunset colours, drifting cube clouds, mist rising off the water at dawn, and a sun glare that the clouds and terrain can block. Water is its own shader, with ripples, reflections, foam at the shore and light patterns on the sea floor. Pigs, cows, sheep and villagers wander around. They are only there to look at.',
      'Everything on screen is generated in code. The block textures are drawn on a canvas, and the footsteps, digging, wind, water and bird sounds are synthesised with the Web Audio API. Your edits, position, time of day and settings are saved in your browser, so you can close the tab and come back to the same world. Settings let you change the graphics level, render distance, shadows, day length and more, and you can start a new world from any seed.',
    ],
    date: '2026-10-04',
    file: 'blockscape.html',
    tags: ['Game', '3D', 'Sandbox', 'Procedural'],
    ogImage: '/og/demo-blockscape.png',
    origin: 'kael-chat',
    cover: { art: 'voxel', from: '#3f78b8', to: '#a9d3f2' },
    highlights: [
      'Generated world from a seed: eight biomes, caves, trees and flowers',
      'Dig and place blocks, with ten block types in the hotbar',
      'Day and night cycle with sun, moon, stars, clouds and mist',
      'Water shader with ripples, reflections and foam',
      'Wandering pigs, cows, sheep and villagers',
      'Saved in your browser, with a new-world seed option',
      'Full touch controls, and graphics that adapt to your device',
      'Textures and sound generated in code, no asset files',
    ],
    controls: {
      desktop: [
        { input: 'W A S D', action: 'Move' },
        { input: 'Space', action: 'Jump (swim up in water)' },
        { input: 'Shift', action: 'Sprint while moving forward' },
        { input: 'Mouse', action: 'Look around' },
        { input: 'Left / right click', action: 'Dig a block / place a block' },
        { input: 'Middle click', action: 'Pick the block you are looking at' },
        { input: '1 to 0, or scroll', action: 'Choose a block in the hotbar' },
        { input: 'F, or double-tap Space', action: 'Toggle flying (Shift or C to descend, Ctrl or Q to go faster)' },
        { input: 'Esc', action: 'Pause and open settings' },
      ],
      touch: [
        { input: 'Left thumb', action: 'Floating joystick; push to the edge to sprint' },
        { input: 'Right thumb', action: 'Drag to look around' },
        { input: 'Jump, Dig and Place buttons', action: 'Hold Dig or Place to repeat' },
        { input: 'Fly button', action: 'Toggle flying; a down arrow appears while you fly' },
        { input: 'Tap the block bar', action: 'Choose a block' },
      ],
    },
    tech: ['three.js r128', 'WebGL with custom sky and water shaders', 'Web Audio API', 'IndexedDB'],
    cdnHosts: ['cdnjs.cloudflare.com'],
    cdnFallbacks: ['cdn.jsdelivr.net', 'unpkg.com'],
    storage:
      'Your block edits, position, time of day, hotbar and settings are saved in your browser (IndexedDB, with local storage as a fallback). Nothing is sent to us.',
  },
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
    tagline: 'A full chess game against an AI, in one HTML file.',
    summary:
      'Play chess on a rendered black-and-white board against the built-in AI, or switch it off to play a friend. Click a piece to see every move it can make, and watch captured pieces float away to rest.',
    description: [
      '3D Chess is a complete chess game on a rendered board with black and white squares, a gold grid and a–h, 1–8 labels. The pieces are built in code from turned profiles and simple shapes, lit with physically based materials and soft shadows.',
      'The rules are all there: castling, en passant, promotion with a piece picker, check, checkmate, stalemate, and draws by threefold repetition, the fifty-move rule or insufficient material. Moves are logged in standard algebraic notation, and you can undo them. Click one of your pieces and it lifts and lights up, with a dot on every square it can legally move to, red on squares where it can capture. The last move and any check are highlighted too.',
      'The AI is on by default and plays Black against you. It uses an alpha-beta search with a capture search at the end, up to five plies (half-moves) deep, thinking for at most a second and a half on a desktop. We haven’t measured its strength. Turn it off to play two people on one screen. When a piece is captured it is not simply removed: it lifts off the board, drifts through the air trailing sparkles and lowers itself, upright, onto a felt tray at the side. Sounds are synthesised on the fly.',
    ],
    date: '2026-10-04',
    file: 'chess.html',
    tags: ['Game', '3D', 'AI opponent'],
    ogImage: '/og/demo-chess.png',
    origin: 'kael-chat',
    cover: { art: 'chess', from: '#0d0b09', to: '#3a2a1c' },
    highlights: [
      'Full rules: castling, en passant, promotion and every kind of draw',
      'AI opponent on by default, playing Black, with iterative deepening',
      'Click a piece to lift it and see all of its legal moves',
      'Captured pieces float through the air to a rest tray at the side',
      'Move list in algebraic notation, undo, and flip board',
      'Orbit, zoom and pan camera, tap or click to move',
      'Board, wood, felt and sound generated in code, no asset files',
    ],
    controls: {
      desktop: [
        { input: 'Click a piece, then a square', action: 'Select it and see its legal moves, then move' },
        { input: 'Drag', action: 'Orbit the camera' },
        { input: 'Scroll', action: 'Zoom' },
        { input: 'New, Undo, Flip, AI, Sound', action: 'Start over, take back a move, turn the board, switch the AI on or off, mute' },
      ],
      touch: [
        { input: 'Tap a piece, then a square', action: 'Select it and see its legal moves, then move' },
        { input: 'Drag', action: 'Orbit the camera' },
        { input: 'Pinch', action: 'Zoom' },
        { input: 'Two-finger drag', action: 'Pan' },
      ],
    },
    tech: ['three.js 0.160', 'WebGL with physically based materials', 'Web Audio API'],
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
