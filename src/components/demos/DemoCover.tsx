import React from 'react';
import type { Demo } from '../../data/demos';

/**
 * The cover image for a demo, drawn in SVG so it needs no asset file and stays
 * sharp at any size. If the demo sets `cover.image` (a real screenshot) that is
 * used instead. To add a new drawn style: add a value to CoverArt in
 * src/data/demos.ts, add a component below, and add it to the switch in
 * DemoCover. The 'generic' style needs no extra code.
 *
 * Gradient/clip ids are prefixed with the slug so two covers on one page
 * (the hub grid) never share an id.
 */

const W = 640;
const H = 400;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const hex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
function mix(c1: [number, number, number], c2: [number, number, number], t: number): string {
  return `#${hex(lerp(c1[0], c2[0], t))}${hex(lerp(c1[1], c2[1], t))}${hex(lerp(c1[2], c2[2], t))}`;
}

/* ---------------------------------------------------------------- snake */

function SnakeArt({ id }: { id: string }) {
  const N = 48;
  const head: [number, number, number] = [0x66, 0xe6, 0xa0];
  const tail: [number, number, number] = [0x0d, 0x45, 0x26];

  const pts = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1); // 0 = head, 1 = tail
    const x = 505 - t * 410;
    const y = 318 + Math.sin(t * Math.PI * 2.5 + 0.5) * 38 - t * 8;
    const taper = t < 0.66 ? 1 : Math.pow(1 - (t - 0.66) / 0.34, 0.7);
    const r = 23 * (0.85 + 0.15 * Math.min(1, t * 16)) * taper;
    return { x, y, r, color: mix(head, tail, Math.min(1, t * 1.1)) };
  });

  // Head faces along the direction of travel (from the neck towards the head).
  const a = Math.atan2(pts[0].y - pts[3].y, pts[0].x - pts[3].x);
  const deg = (a * 180) / Math.PI;

  const orbs: { x: number; y: number; rare?: boolean }[] = [
    { x: 118, y: 268 },
    { x: 214, y: 372 },
    { x: 356, y: 276 },
    { x: 560, y: 262, rare: true },
    { x: 596, y: 352 },
    { x: 288, y: 350 },
  ];

  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050912" />
          <stop offset="0.28" stopColor="#2b2f56" />
          <stop offset="0.42" stopColor="#b0645c" />
          <stop offset="0.55" stopColor="#ffb877" />
        </linearGradient>
        <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a6a48" />
          <stop offset="1" stopColor="#3a2a1e" />
        </linearGradient>
        <radialGradient id={`${id}-sun`}>
          <stop offset="0" stopColor="#fffbe8" stopOpacity="1" />
          <stop offset="0.15" stopColor="#ffe3b0" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#ff9a50" stopOpacity="0.28" />
          <stop offset="1" stopColor="#ff7a2a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-gold`}>
          <stop offset="0" stopColor="#fff2c2" />
          <stop offset="0.35" stopColor="#ffb020" />
          <stop offset="1" stopColor="#ffb020" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-cyan`}>
          <stop offset="0" stopColor="#e6ffff" />
          <stop offset="0.35" stopColor="#2ce0ff" />
          <stop offset="1" stopColor="#2ce0ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-vig`} cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      <circle cx="384" cy="205" r="150" fill={`url(#${id}-sun)`} />
      <circle cx="384" cy="205" r="14" fill="#fffbe8" />

      {/* stone wall along the horizon */}
      <rect x="0" y="206" width={W} height="34" fill="#4a3c30" />
      {[0, 1, 2].map((row) =>
        Array.from({ length: 14 }, (_, c) => (
          <rect
            key={`${row}-${c}`}
            x={c * 50 + (row % 2) * 24 + 2}
            y={208 + row * 11}
            width="46"
            height="9"
            rx="1.5"
            fill={row === 0 ? '#7a6a58' : '#6a5a4a'}
            opacity={0.55 + ((c * 7 + row * 3) % 5) * 0.08}
          />
        )),
      )}
      <rect x="0" y="238" width={W} height="4" fill="#2a2018" opacity="0.7" />

      <rect x="0" y="240" width={W} height={H - 240} fill={`url(#${id}-ground)`} />

      {/* orbs: ground glow, then the orb */}
      {orbs.map((o, i) => (
        <g key={i}>
          <ellipse cx={o.x} cy={o.y + 14} rx={o.rare ? 34 : 26} ry={o.rare ? 9 : 7} fill={`url(#${id}-${o.rare ? 'cyan' : 'gold'})`} opacity="0.8" />
          <circle cx={o.x} cy={o.y - 6} r={o.rare ? 24 : 18} fill={`url(#${id}-${o.rare ? 'cyan' : 'gold'})`} />
          <circle cx={o.x} cy={o.y - 6} r={o.rare ? 8 : 6} fill={o.rare ? '#ffffff' : '#fff6d6'} />
        </g>
      ))}

      {/* body, tail first so the head sits on top */}
      <g>
        {pts
          .slice()
          .reverse()
          .map((p, i) => (
            <g key={i}>
              <ellipse cx={p.x + 4} cy={p.y + p.r * 0.95} rx={p.r * 1.05} ry={p.r * 0.35} fill="#000" opacity="0.22" />
              <circle cx={p.x} cy={p.y} r={p.r} fill={p.color} />
              <circle cx={p.x - p.r * 0.28} cy={p.y - p.r * 0.34} r={p.r * 0.42} fill="#fff" opacity="0.16" />
            </g>
          ))}
      </g>

      {/* head */}
      <g transform={`translate(${pts[0].x} ${pts[0].y}) rotate(${deg})`}>
        <ellipse cx="6" cy="0" rx="40" ry="27" fill="#8cffbc" />
        <ellipse cx="2" cy="-8" rx="26" ry="12" fill="#fff" opacity="0.18" />
        <path d="M44 4 L66 -2 M44 4 L66 10" stroke="#ff2f52" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="14" cy="-15" r="8" fill="#ffd24a" />
        <circle cx="14" cy="15" r="8" fill="#ffd24a" />
        <rect x="14" y="-21" width="4" height="12" rx="1.5" fill="#0a0608" />
        <rect x="14" y="9" width="4" height="12" rx="1.5" fill="#0a0608" />
      </g>

      <rect width={W} height={H} fill={`url(#${id}-vig)`} />
    </>
  );
}

/* ---------------------------------------------------------------- chess */

// Half-profiles [radius, height] lifted from the chess demo's own piece code.
const PROF_PAWN: [number, number][] = [
  [0, 0], [0.30, 0], [0.30, 0.06], [0.27, 0.11], [0.22, 0.16], [0.17, 0.21], [0.14, 0.28], [0.13, 0.35],
  [0.13, 0.41], [0.16, 0.46], [0.17, 0.5], [0.15, 0.53], [0.13, 0.56], [0.16, 0.62], [0.18, 0.68],
  [0.17, 0.74], [0.14, 0.79], [0.09, 0.83], [0.04, 0.85], [0, 0.85],
];
const PROF_ROOK: [number, number][] = [
  [0, 0], [0.35, 0], [0.35, 0.06], [0.32, 0.11], [0.27, 0.15], [0.22, 0.2], [0.2, 0.26], [0.19, 0.34],
  [0.19, 0.44], [0.2, 0.52], [0.24, 0.56], [0.28, 0.58], [0.3, 0.6], [0.3, 0.68], [0.3, 0.78], [0.3, 0.88], [0, 0.88],
];
const PROF_KING: [number, number][] = [
  [0, 0], [0.39, 0], [0.39, 0.07], [0.36, 0.13], [0.3, 0.18], [0.25, 0.23], [0.23, 0.3], [0.22, 0.39],
  [0.22, 0.5], [0.23, 0.57], [0.26, 0.62], [0.25, 0.67], [0.22, 0.72], [0.21, 0.8], [0.21, 0.9],
  [0.22, 0.99], [0.23, 1.06], [0.22, 1.12], [0.18, 1.16], [0.12, 1.19], [0.05, 1.2], [0, 1.2],
];

/** Closed silhouette path for a turned piece, standing on (0,0), `s` px per unit. */
function turnedPath(profile: [number, number][], s: number): string {
  const right = profile.map(([r, h]) => `${(r * s).toFixed(1)} ${(-h * s).toFixed(1)}`);
  const left = profile
    .slice()
    .reverse()
    .map(([r, h]) => `${(-r * s).toFixed(1)} ${(-h * s).toFixed(1)}`);
  return `M${right.join(' L')} L${left.join(' L')} Z`;
}

function ChessArt({ id }: { id: string }) {
  const cx = 320;
  const yFar = 104;
  const yNear = 372;
  const sc = (v: number) => 1 / (1 + (8 - v) * 0.115);
  const k0 = sc(0);
  const Y = (v: number) => yFar + (yNear - yFar) * ((sc(v) - k0) / (1 - k0));
  const X = (u: number, v: number) => cx + (u - 4) * 68 * sc(v);

  const squares: { d: string; dark: boolean }[] = [];
  for (let v = 0; v < 8; v++) {
    for (let u = 0; u < 8; u++) {
      squares.push({
        d: `M${X(u, v).toFixed(1)} ${Y(v).toFixed(1)} L${X(u + 1, v).toFixed(1)} ${Y(v).toFixed(1)} L${X(u + 1, v + 1).toFixed(1)} ${Y(v + 1).toFixed(1)} L${X(u, v + 1).toFixed(1)} ${Y(v + 1).toFixed(1)} Z`,
        dark: (u + v) % 2 === 1,
      });
    }
  }

  type P = { kind: 'pawn' | 'rook' | 'king'; u: number; v: number; white: boolean };
  const stand: P[] = [
    { kind: 'rook', u: 1.5, v: 1.5, white: false },
    { kind: 'king', u: 4.5, v: 6.6, white: true },
    { kind: 'pawn', u: 2.5, v: 5.6, white: true },
    { kind: 'pawn', u: 6.5, v: 6.5, white: true },
  ];
  const profileFor = (k: P['kind']) => (k === 'pawn' ? PROF_PAWN : k === 'rook' ? PROF_ROOK : PROF_KING);

  const renderPiece = (p: P, i: number) => {
    const x = X(p.u, p.v);
    const y = Y(p.v);
    const s = 86 * sc(p.v);
    const fill = `url(#${id}-${p.white ? 'white' : 'black'})`;
    return (
      <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
        <ellipse cx="6" cy="2" rx={0.5 * s} ry={0.16 * s} fill="#000" opacity="0.4" />
        <path d={turnedPath(profileFor(p.kind), s)} fill={fill} />
        {p.kind === 'king' ? (
          <g fill={fill}>
            <rect x={-0.045 * s} y={-1.45 * s} width={0.09 * s} height={0.26 * s} rx="1" />
            <rect x={-0.12 * s} y={-1.39 * s} width={0.24 * s} height={0.08 * s} rx="1" />
          </g>
        ) : null}
        {p.kind === 'rook' ? (
          <g fill={fill}>
            {[-0.2, 0, 0.2].map((dx) => (
              <rect key={dx} x={(dx - 0.065) * s} y={-1.04 * s} width={0.13 * s} height={0.16 * s} />
            ))}
          </g>
        ) : null}
        <path
          d={turnedPath(profileFor(p.kind), s)}
          fill="none"
          stroke="#fff"
          strokeOpacity={p.white ? 0 : 0.18}
          strokeWidth="1"
        />
      </g>
    );
  };

  // The captured pawn: lifted off its square and floating upright, with a glow
  // and a trail of sparkles on its way to the tray at the side.
  const fx = X(5.5, 3.6);
  const fy = Y(3.6) - 96;
  const fs = 86 * sc(3.6) * 0.92;

  return (
    <>
      <defs>
        <radialGradient id={`${id}-bg`} cx="0.5" cy="0.18" r="0.9">
          <stop offset="0" stopColor="#4a3320" />
          <stop offset="0.55" stopColor="#15100b" />
          <stop offset="1" stopColor="#07080b" />
        </radialGradient>
        <linearGradient id={`${id}-white`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#cdbf9f" />
          <stop offset="0.45" stopColor="#fff8e8" />
          <stop offset="1" stopColor="#b7a982" />
        </linearGradient>
        <linearGradient id={`${id}-black`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0f0f14" />
          <stop offset="0.4" stopColor="#4a4a5a" />
          <stop offset="1" stopColor="#101015" />
        </linearGradient>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0" stopColor="#ffe9b8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffe9b8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-vig`} cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#${id}-bg)`} />

      {/* board edge */}
      <path
        d={`M${X(0, 8).toFixed(1)} ${Y(8)} L${X(8, 8).toFixed(1)} ${Y(8)} L${X(8, 8).toFixed(1)} ${Y(8) + 18} L${X(0, 8).toFixed(1)} ${Y(8) + 18} Z`}
        fill="#2a170b"
      />
      {squares.map((s, i) => (
        <path key={i} d={s.d} fill={s.dark ? '#2c2e35' : '#e9e5d9'} />
      ))}
      <path
        d={`M${X(0, 0).toFixed(1)} ${Y(0)} L${X(8, 0).toFixed(1)} ${Y(0)} L${X(8, 8).toFixed(1)} ${Y(8)} L${X(0, 8).toFixed(1)} ${Y(8)} Z`}
        fill={`url(#${id}-gloss)`}
      />

      {/* back to front so nearer pieces cover farther ones */}
      {stand.slice().sort((a, b) => a.v - b.v).map(renderPiece)}

      {/* the captured pawn, floating upright, with its flight path and sparkles */}
      <path
        d={`M${(fx - 8).toFixed(1)} ${(fy + 4).toFixed(1)} Q${(fx + 60).toFixed(1)} ${(fy - 70).toFixed(1)} ${(fx + 150).toFixed(1)} ${(fy + 40).toFixed(1)}`}
        stroke="#ffd479"
        strokeOpacity="0.6"
        strokeWidth="2"
        strokeDasharray="3 7"
        strokeLinecap="round"
        fill="none"
      />
      {[
        [-26, 34, 3], [20, 18, 2.2], [-12, -24, 2.6], [34, -8, 2], [4, 52, 2.4], [-34, 6, 1.8],
      ].map(([dx, dy, r], i) => (
        <circle key={i} cx={fx + dx} cy={fy - 20 + dy} r={r} fill="#ffe9b8" opacity={0.85 - i * 0.08} />
      ))}
      <ellipse cx={fx + 3} cy={Y(3.6) + 2} rx={0.42 * fs} ry={0.13 * fs} fill="#000" opacity="0.32" />
      <circle cx={fx} cy={fy - 0.42 * fs} r={0.95 * fs} fill={`url(#${id}-halo)`} />
      <g transform={`translate(${fx.toFixed(1)} ${fy.toFixed(1)})`}>
        <path d={turnedPath(PROF_PAWN, fs)} fill={`url(#${id}-black)`} />
        <path d={turnedPath(PROF_PAWN, fs)} fill="none" stroke="#fff" strokeOpacity="0.2" strokeWidth="1" />
      </g>

      <rect width={W} height={H} fill={`url(#${id}-vig)`} />
    </>
  );
}

/* ---------------------------------------------------------------- voxel */

type VoxelKind = 'grass' | 'dirt' | 'sand' | 'water' | 'log' | 'leaf' | 'stone';

const VOX: Record<VoxelKind, { top: string; left: string; right: string; strip?: boolean; alpha?: number }> = {
  grass: { top: '#78bf4f', left: '#8a6540', right: '#6f4f31', strip: true },
  dirt: { top: '#8f6a43', left: '#7e5a37', right: '#654629' },
  sand: { top: '#e6d49b', left: '#d2bf86', right: '#bda870' },
  water: { top: '#4a9be0', left: '#3a82c4', right: '#2f6faa', alpha: 0.82 },
  log: { top: '#a98558', left: '#6e4f2e', right: '#5a3f24' },
  leaf: { top: '#4f9a3a', left: '#3f8230', right: '#336a27' },
  stone: { top: '#9a9aa2', left: '#85858d', right: '#70707a' },
};

function VoxelArt({ id }: { id: string }) {
  const CW = 26; // half cube width on screen
  const CH = 15; // half diamond height
  const CZ = 30; // cube height
  const ox = 320;
  const oy = 136;

  type Cube = { x: number; y: number; z: number; kind: VoxelKind };
  const cubes: Cube[] = [];
  const N = 6;
  // Terrain: 0 = water (over a sand bed), 1 = grass, 2 = a small hill.
  const heights = [
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 2, 1, 1],
    [1, 1, 2, 2, 1, 0],
    [1, 1, 1, 1, 0, 0],
    [1, 1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0, 0],
  ];
  for (let z = 0; z < N; z++) {
    for (let x = 0; x < N; x++) {
      const h = heights[z][x];
      cubes.push({ x, y: -1, z, kind: h === 0 ? 'sand' : 'dirt' });
      if (h === 0) {
        cubes.push({ x, y: 0, z, kind: 'water' });
      } else {
        for (let y = 0; y < h - 1; y++) cubes.push({ x, y, z, kind: 'dirt' });
        cubes.push({ x, y: h - 1, z, kind: 'grass' });
      }
    }
  }
  // An oak tree on the grass.
  const tx = 1;
  const tz = 2;
  for (let y = 1; y <= 3; y++) cubes.push({ x: tx, y, z: tz, kind: 'log' });
  for (let dz = -1; dz <= 1; dz++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx !== 0 || dz !== 0) cubes.push({ x: tx + dx, y: 3, z: tz + dz, kind: 'leaf' });
      if (Math.abs(dx) + Math.abs(dz) < 2) cubes.push({ x: tx + dx, y: 4, z: tz + dz, kind: 'leaf' });
    }
  }
  // A couple of stone blocks the player has placed.
  cubes.push({ x: 4, y: 1, z: 1, kind: 'stone' });
  cubes.push({ x: 4, y: 0, z: 1, kind: 'stone' });

  cubes.sort((a, b) => a.x + a.z - (b.x + b.z) || a.y - b.y);

  const renderCube = (c: Cube, i: number) => {
    const v = VOX[c.kind];
    const px = ox + (c.x - c.z) * CW;
    const py = oy + (c.x + c.z) * CH - c.y * CZ;
    const op = v.alpha ?? 1;
    const top = `${px},${py - CH} ${px + CW},${py} ${px},${py + CH} ${px - CW},${py}`;
    const left = `${px - CW},${py} ${px},${py + CH} ${px},${py + CH + CZ} ${px - CW},${py + CZ}`;
    const right = `${px},${py + CH} ${px + CW},${py} ${px + CW},${py + CZ} ${px},${py + CH + CZ}`;
    return (
      <g key={i} opacity={op}>
        <polygon points={left} fill={v.left} />
        <polygon points={right} fill={v.right} />
        {v.strip ? (
          <>
            <polygon points={`${px - CW},${py} ${px},${py + CH} ${px},${py + CH + 9} ${px - CW},${py + 9}`} fill="#5fa03e" />
            <polygon points={`${px},${py + CH} ${px + CW},${py} ${px + CW},${py + 9} ${px},${py + CH + 9}`} fill="#4c8a30" />
          </>
        ) : null}
        <polygon points={top} fill={v.top} />
        <polygon points={top} fill="none" stroke="#000" strokeOpacity="0.14" strokeWidth="1" />
      </g>
    );
  };

  const clouds = [
    { x: 70, y: 70, w: 120, h: 22 },
    { x: 96, y: 56, w: 70, h: 18 },
    { x: 420, y: 44, w: 130, h: 24 },
    { x: 450, y: 30, w: 70, h: 18 },
  ];

  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f6fc0" />
          <stop offset="0.55" stopColor="#7fb6e8" />
          <stop offset="1" stopColor="#d7ecfa" />
        </linearGradient>
        <radialGradient id={`${id}-sun`}>
          <stop offset="0" stopColor="#fffbe8" stopOpacity="1" />
          <stop offset="0.2" stopColor="#fff0c0" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffe08a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-vig`} cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      <circle cx="530" cy="92" r="120" fill={`url(#${id}-sun)`} />
      <rect x="518" y="80" width="24" height="24" fill="#fffdf0" />
      {clouds.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width={c.w} height={c.h} fill="#fff" opacity="0.9" />
      ))}
      {cubes.map(renderCube)}
      <rect width={W} height={H} fill={`url(#${id}-vig)`} />
    </>
  );
}

/* -------------------------------------------------------------- generic */

/** Fallback: a 4 by 4 grid echoing the brand mark, with the title across it. */
function GenericArt({ id, title }: { id: string; title: string }) {
  const filled = new Set(['1,0', '2,0', '0,1', '0,2', '3,1', '2,2', '1,3']);
  return (
    <>
      <defs>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-glow)`} />
      <g transform="translate(232 80)">
        {Array.from({ length: 16 }, (_, i) => {
          const c = i % 4;
          const r = Math.floor(i / 4);
          const on = filled.has(`${c},${r}`);
          const red = c === 3 && r === 3;
          return (
            <rect
              key={i}
              x={c * 44}
              y={r * 44}
              width="40"
              height="40"
              rx="3"
              fill={red ? '#E4002B' : '#fff'}
              opacity={red ? 1 : on ? 0.85 : 0.08}
            />
          );
        })}
      </g>
      <text x="320" y="318" textAnchor="middle" fill="#fff" fontSize="34" fontWeight="500" letterSpacing="-1">
        {title}
      </text>
    </>
  );
}

/* -------------------------------------------------------------- circuit */

/** A circuit board seen from above: two AA cells, a three-position switch,
 *  copper traces and a five-blade fan. */
function CircuitArt({ id }: { id: string }) {
  const copper = '#d9b24a';
  return (
    <>
      <defs>
        <radialGradient id={`${id}-glow`} cx="0.62" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#7fe0ff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#7fe0ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-glow)`} />
      {/* board */}
      <rect x="40" y="52" width="560" height="296" rx="14" fill="#0b4f2c" opacity="0.92" />
      <rect x="40" y="52" width="560" height="296" rx="14" fill="none" stroke="#e6f3ea" strokeOpacity="0.25" strokeWidth="2" />
      {/* traces */}
      <g fill="none" stroke={copper} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M120 150 H78 V318 H430 V232" />
        <path d="M232 112 H300 V176 H430" />
        <path d="M232 112 V84 H360 V150 H430" />
        <path d="M150 262 H190 V318" opacity="0.55" strokeWidth="4" />
      </g>
      {/* two AA cells */}
      {[170, 222].map((y, i) => (
        <g key={y}>
          <rect x="70" y={y} width="150" height="36" rx="10" fill="#1d3f66" />
          <rect x="70" y={y + 6} width="150" height="5" fill="#c9a63a" opacity="0.8" />
          <rect x="220" y={y + 11} width="9" height="14" rx="2" fill="#d5dae0" />
          <text x="145" y={y + 25} textAnchor="middle" fill="#ffde78" fontSize="13" fontWeight="600">
            AA 1.5V
          </text>
          <circle cx="82" cy={y + 18} r="3" fill={i === 0 ? '#fff' : '#fff'} opacity="0.5" />
        </g>
      ))}
      {/* three-position switch */}
      <rect x="160" y="82" width="140" height="46" rx="8" fill="#232a33" />
      <rect x="172" y="98" width="116" height="14" rx="3" fill="#0b0e12" />
      <rect x="222" y="92" width="30" height="26" rx="4" fill="#cfd6df" />
      <text x="190" y="144" textAnchor="middle" fill="#e6f3ea" fontSize="11" opacity="0.8">LOW</text>
      <text x="230" y="144" textAnchor="middle" fill="#e6f3ea" fontSize="11" opacity="0.8">COM</text>
      <text x="270" y="144" textAnchor="middle" fill="#e6f3ea" fontSize="11" opacity="0.8">HIGH</text>
      {/* fan */}
      <circle cx="450" cy="190" r="86" fill="none" stroke="#a9c1d6" strokeOpacity="0.35" strokeWidth="3" />
      <g transform="translate(450 190)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="38" cy="0" rx="40" ry="15" fill="#a9c1d6" opacity="0.9" transform={`rotate(${a + 12})`} />
        ))}
        <circle r="20" fill="#39424e" />
        <circle r="9" fill="#8b95a1" />
      </g>
    </>
  );
}

/* --------------------------------------------------------------- export */

export const DemoCover: React.FC<{
  demo: Pick<Demo, 'slug' | 'title' | 'cover'>;
  className?: string;
}> = ({ demo, className = '' }) => {
  const { cover, slug, title } = demo;
  const id = `cover-${slug}`;

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${cover.from}, ${cover.to})` }}
    >
      {cover.image ? (
        // eslint-disable-next-line @next/next/no-img-element -- images are unoptimized on this site (next.config.ts)
        <img src={cover.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
          focusable="false"
        >
          {cover.art === 'snake' ? <SnakeArt id={id} /> : null}
          {cover.art === 'chess' ? <ChessArt id={id} /> : null}
          {cover.art === 'voxel' ? <VoxelArt id={id} /> : null}
          {cover.art === 'circuit' ? <CircuitArt id={id} /> : null}
          {cover.art === 'generic' ? <GenericArt id={id} title={title} /> : null}
        </svg>
      )}
    </div>
  );
};

export default DemoCover;
