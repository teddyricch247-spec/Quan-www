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
const hex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
function mix(c1: [number, number, number], c2: [number, number, number], t: number): string {
  return `#${hex(lerp(c1[0], c2[0], t))}${hex(lerp(c1[1], c2[1], t))}${hex(lerp(c1[2], c2[2], t))}`;
}

/* --------------------------------------------------------------- shared */

/** Seeded generator, so a cover renders identically on the server and in the browser. */
function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Blur filters used for glow and soft shadow. */
function FxDefs({ id }: { id: string }) {
  return (
    <defs>
      <filter id={`${id}-bloom`} x="-120%" y="-120%" width="340%" height="340%">
        <feGaussianBlur stdDeviation="7" />
      </filter>
      <filter id={`${id}-soft`} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="2.6" />
      </filter>
      <filter id={`${id}-haze`} x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="1.4" />
      </filter>
    </defs>
  );
}

/** A soft vignette and a light film grain, so the vector art does not read as flat clip-art. */
function Finish({ id, vignette = 0.5 }: { id: string; vignette?: number }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-vig`} cx="0.5" cy="0.5" r="0.78">
          <stop offset="0.52" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity={vignette} />
        </radialGradient>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-vig)`} />
      <rect width={W} height={H} filter={`url(#${id}-grain)`} opacity="0.09" style={{ mixBlendMode: 'overlay' }} />
    </>
  );
}


/* ---------------------------------------------------------------- snake */

// Low camera on a sunset arena, looking along the ground at the snake as it
// comes toward you. Everything uses one perspective: the distance from the
// horizon sets both where a thing sits on screen and how large it is. The head
// and the busiest part of the scene stay in the middle 300px, because the
// player box on a phone crops the sides of the cover.
function SnakeArt({ id }: { id: string }) {
  const horizon = 184;
  const floor = H + 80;
  const span = floor - horizon;
  const gy = (d: number) => horizon + span * Math.pow(d, 1.55);
  const sc = (d: number) => (gy(d) - horizon) / span;
  const R0 = 76; // body radius at sc = 1

  // Head sits close to the camera; the body winds away from it in an S.
  const dHead = 0.7;
  const tHead = 1 - dHead;
  const lat = (d: number) => {
    const u = 1 - d - tHead;
    return 560 * Math.sin(u * 5.6) * (0.08 + 2.2 * u);
  };

  const segs: { x: number; y: number; r: number; d: number; k: number }[] = [];
  {
    // Walk away from the head in small steps, keeping a ball only once it is
    // about 0.7 of a radius from the last one, measured on screen. Counting
    // the sideways travel as well keeps the body one unbroken chain even where
    // the snake turns across the view.
    let d = dHead - 0.04;
    let prev = { x: 320, y: gy(dHead) - R0 * sc(dHead) * 0.86 };
    let k = 0;
    while (d > 0.06 && k < 90) {
      const r = R0 * sc(d);
      const x = 320 + sc(d) * lat(d);
      const y = gy(d);
      if (Math.hypot(x - prev.x, y - prev.y) >= 0.7 * r) {
        segs.push({ x, y, r, d, k });
        prev = { x, y };
        k++;
      }
      d -= 0.0015;
    }
  }
  const headR = R0 * sc(dHead);
  const hx = 320;
  const hy = gy(dHead) - headR * 0.86;
  const body = (d: number) => mix([14, 62, 46], [92, 224, 168], Math.min(1, (d - 0.07) / 0.65));

  const orbs: { d: number; lat: number; cyan?: boolean }[] = [
    { d: 0.5, lat: -430 },
    { d: 0.42, lat: 330 },
    { d: 0.6, lat: 380 },
    { d: 0.3, lat: -250 },
    { d: 0.36, lat: 40, cyan: true },
    { d: 0.78, lat: -330 },
    { d: 0.24, lat: 330 },
  ];
  const rand = rng(11);
  const stars = Array.from({ length: 26 }, () => ({ x: rand() * W, y: rand() * 90, r: 0.5 + rand() * 0.9 }));
  const bricks: number[] = [];
  for (let i = 0; i < 40; i++) bricks.push(i);

  return (
    <>
      <FxDefs id={id} />
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14163f" />
          <stop offset="0.35" stopColor="#4a2a6b" />
          <stop offset="0.7" stopColor="#d4586a" />
          <stop offset="0.9" stopColor="#ff9a55" />
          <stop offset="1" stopColor="#ffd08a" />
        </linearGradient>
        <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b2694a" />
          <stop offset="0.25" stopColor="#7a4638" />
          <stop offset="1" stopColor="#1e1215" />
        </linearGradient>
        <radialGradient id={`${id}-sunglow`}>
          <stop offset="0" stopColor="#fff3c4" stopOpacity="0.95" />
          <stop offset="0.25" stopColor="#ffb866" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff7a45" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-ball`} cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.34" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </radialGradient>
        <radialGradient id={`${id}-orb`} cx="0.38" cy="0.34" r="0.7">
          <stop offset="0" stopColor="#fffbe6" />
          <stop offset="0.5" stopColor="#ffc247" />
          <stop offset="1" stopColor="#e07a12" />
        </radialGradient>
        <radialGradient id={`${id}-orbc`} cx="0.38" cy="0.34" r="0.7">
          <stop offset="0" stopColor="#f2ffff" />
          <stop offset="0.5" stopColor="#4fe6ff" />
          <stop offset="1" stopColor="#0a8fc0" />
        </radialGradient>
        <radialGradient id={`${id}-head`} cx="0.42" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#c9ffe6" />
          <stop offset="0.45" stopColor="#5fe0aa" />
          <stop offset="1" stopColor="#1d7a5a" />
        </radialGradient>
      </defs>

      {/* sky, sun and distant hills */}
      <rect width={W} height={horizon + 4} fill={`url(#${id}-sky)`} />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={0.25 + (i % 4) * 0.12} />
      ))}
      <circle cx="320" cy={horizon - 4} r="190" fill={`url(#${id}-sunglow)`} />
      <circle cx="320" cy={horizon - 8} r="30" fill="#fff6d6" />
      {[
        { y: 96, o: 0.16, w: 220 },
        { y: 124, o: 0.1, w: 300 },
        { y: 150, o: 0.14, w: 180 },
      ].map((c, i) => (
        <rect key={i} x={120 + i * 150} y={c.y} width={c.w} height="5" rx="2.5" fill="#ffd9b0" opacity={c.o} />
      ))}
      <path
        d={`M0 ${horizon - 18} L48 ${horizon - 40} L92 ${horizon - 22} L150 ${horizon - 52} L214 ${horizon - 20} L262 ${horizon - 30} L318 ${horizon - 12} L392 ${horizon - 34} L452 ${horizon - 58} L520 ${horizon - 26} L576 ${horizon - 44} L640 ${horizon - 16} L640 ${horizon} L0 ${horizon} Z`}
        fill="#3b1f4a"
        opacity="0.8"
      />

      {/* arena wall */}
      <rect x="0" y={horizon - 15} width={W} height="17" fill="#2a1a24" />
      {bricks.map((i) => (
        <rect key={i} x={i * 17 + (i % 2) * 4} y={horizon - 13 + (i % 2) * 7} width="14" height="6" fill="#3a2531" opacity="0.9" />
      ))}
      <rect x="0" y={horizon - 15} width={W} height="2" fill="#ffb27a" opacity="0.55" />

      {/* ground */}
      <rect y={horizon} width={W} height={H - horizon} fill={`url(#${id}-ground)`} />
      <ellipse cx="320" cy={horizon + 20} rx="150" ry="26" fill="#ffb866" opacity="0.28" filter={`url(#${id}-soft)`} />
      {Array.from({ length: 15 }, (_, i) => {
        const dx = (i - 7) * 150;
        return (
          <line key={i} x1="320" y1={horizon} x2={320 + dx * 1.2} y2={H + 20} stroke="#ffcf9a" strokeOpacity="0.07" strokeWidth="1" />
        );
      })}
      {[0.12, 0.2, 0.3, 0.42, 0.56, 0.72, 0.9].map((d, i) => (
        <line key={i} x1="0" y1={gy(d)} x2={W} y2={gy(d)} stroke="#ffcf9a" strokeOpacity="0.06" strokeWidth="1" />
      ))}

      {/* orbs, far to near */}
      {orbs
        .slice()
        .sort((a, b) => a.d - b.d)
        .map((o, i) => {
          const k = sc(o.d);
          const x = 320 + k * o.lat;
          const y = gy(o.d);
          const r = 22 * k + 4;
          const glow = o.cyan ? '#37d9ff' : '#ffab2e';
          return (
            <g key={i}>
              <ellipse cx={x} cy={y} rx={r * 2.4} ry={r * 0.8} fill={glow} opacity="0.35" filter={`url(#${id}-soft)`} />
              <circle cx={x} cy={y - r * 1.5} r={r * 2.6} fill={glow} opacity="0.34" filter={`url(#${id}-bloom)`} />
              <circle cx={x} cy={y - r * 1.5} r={r} fill={`url(#${id}-${o.cyan ? 'orbc' : 'orb'})`} />
              <circle cx={x - r * 0.3} cy={y - r * 1.8} r={r * 0.22} fill="#fff" opacity="0.85" />
            </g>
          );
        })}

      {/* body, far to near */}
      {segs
        .slice()
        .reverse()
        .map((s) => {
          const cy = s.y - s.r * 0.86;
          const fill = body(s.d);
          return (
            <g key={s.k}>
              <ellipse cx={s.x + s.r * 0.16} cy={s.y + s.r * 0.04} rx={s.r * 1.12} ry={s.r * 0.3} fill="#150a10" opacity="0.5" />
              <circle cx={s.x} cy={cy} r={s.r} fill={fill} />
              {s.r > 6 && s.k % 2 === 0 ? (
                <ellipse cx={s.x} cy={cy - s.r * 0.3} rx={s.r * 0.62} ry={s.r * 0.34} fill="#0b3b2b" opacity="0.4" />
              ) : null}
              <circle cx={s.x} cy={cy} r={s.r} fill={`url(#${id}-ball)`} />
              {s.r > 5 ? (
                <path
                  d={`M${(s.x - s.r * 0.8).toFixed(1)} ${(cy - s.r * 0.55).toFixed(1)} A${s.r.toFixed(1)} ${s.r.toFixed(1)} 0 0 1 ${(s.x + s.r * 0.8).toFixed(1)} ${(cy - s.r * 0.55).toFixed(1)}`}
                  stroke="#ffb27a"
                  strokeOpacity="0.5"
                  strokeWidth={Math.max(1, s.r * 0.08)}
                  fill="none"
                  strokeLinecap="round"
                />
              ) : null}
            </g>
          );
        })}

      {/* head */}
      <g>
        <ellipse cx={hx + 6} cy={gy(dHead) + 2} rx={headR * 1.6} ry={headR * 0.36} fill="#150a10" opacity="0.55" />
        <path
          d={`M${hx - headR * 0.35} ${hy + headR * 1.08} q${-headR * 0.1} ${headR * 0.5} ${-headR * 0.34} ${headR * 0.8} q${headR * 0.38} ${-headR * 0.3} ${headR * 0.5} ${-headR * 0.7} q${headR * 0.12} ${headR * 0.4} ${headR * 0.34} ${headR * 0.7} q${-headR * 0.12} ${-headR * 0.5} ${-headR * 0.34} ${-headR * 0.86} z`}
          fill="#ff3b4d"
        />
        <ellipse cx={hx} cy={hy} rx={headR * 1.58} ry={headR * 1.12} fill={`url(#${id}-head)`} />
        <ellipse cx={hx} cy={hy + headR * 0.52} rx={headR * 1.2} ry={headR * 0.5} fill="#1d7a5a" opacity="0.38" />
        <path
          d={`M${hx - headR * 1.3} ${hy - headR * 0.52} Q${hx} ${hy - headR * 1.3} ${hx + headR * 1.3} ${hy - headR * 0.52}`}
          stroke="#ffd2a0"
          strokeOpacity="0.55"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {[-1, 1].map((sd) => (
          <g key={sd}>
            <ellipse cx={hx + sd * headR * 0.66} cy={hy - headR * 0.18} rx={headR * 0.3} ry={headR * 0.25} fill="#ffcf3d" />
            <ellipse cx={hx + sd * headR * 0.66} cy={hy - headR * 0.18} rx={headR * 0.3} ry={headR * 0.25} fill="none" stroke="#7a4a00" strokeOpacity="0.6" strokeWidth="1.2" />
            <ellipse cx={hx + sd * headR * 0.66} cy={hy - headR * 0.18} rx={headR * 0.06} ry={headR * 0.22} fill="#120a05" />
            <circle cx={hx + sd * headR * 0.58} cy={hy - headR * 0.28} r={headR * 0.05} fill="#fff" opacity="0.9" />
            <ellipse cx={hx + sd * headR * 0.2} cy={hy + headR * 0.3} rx={headR * 0.05} ry={headR * 0.035} fill="#0d4a35" opacity="0.8" />
          </g>
        ))}
      </g>

      <Finish id={id} vignette={0.5} />
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

// Eight by eight in perspective, the pieces lit from the upper left on a
// glossy board, and one captured pawn lifted off the board on its way out.
// Pieces stand on the middle of their squares and the board is a little less
// steep than before, so the pieces read as objects on it rather than cut-outs.
function ChessArt({ id }: { id: string }) {
  const cx = 320;
  const yFar = 96;
  const yNear = 360;
  const sc = (v: number) => 1 / (1 + (8 - v) * 0.1);
  const k0 = sc(0);
  const Y = (v: number) => yFar + (yNear - yFar) * ((sc(v) - k0) / (1 - k0));
  const X = (u: number, v: number) => cx + (u - 4) * 66 * sc(v);
  const quad = (u0: number, v0: number, u1: number, v1: number) =>
    `M${X(u0, v0).toFixed(1)} ${Y(v0).toFixed(1)} L${X(u1, v0).toFixed(1)} ${Y(v0).toFixed(1)} L${X(u1, v1).toFixed(1)} ${Y(v1).toFixed(1)} L${X(u0, v1).toFixed(1)} ${Y(v1).toFixed(1)} Z`;

  const squares: { d: string; dark: boolean }[] = [];
  for (let v = 0; v < 8; v++) for (let u = 0; u < 8; u++) squares.push({ d: quad(u, v, u + 1, v + 1), dark: (u + v) % 2 === 1 });

  type Pc = { kind: 'pawn' | 'rook' | 'king'; u: number; v: number; white: boolean };
  const stand: Pc[] = [
    { kind: 'rook', u: 1.5, v: 1.5, white: false },
    { kind: 'pawn', u: 6.5, v: 1.5, white: false },
    { kind: 'pawn', u: 7.5, v: 2.5, white: false },
    { kind: 'pawn', u: 3.5, v: 4.5, white: true },
    { kind: 'king', u: 4.5, v: 6.4, white: true },
    { kind: 'pawn', u: 2.5, v: 6.5, white: true },
    { kind: 'pawn', u: 6.5, v: 6.5, white: true },
  ];
  const profileFor = (k: Pc['kind']) => (k === 'pawn' ? PROF_PAWN : k === 'rook' ? PROF_ROOK : PROF_KING);

  const renderPiece = (p: Pc, i: number) => {
    const x = X(p.u, p.v);
    const y = Y(p.v);
    const s = 80 * sc(p.v);
    const fill = `url(#${id}-${p.white ? 'white' : 'black'})`;
    const body = turnedPath(profileFor(p.kind), s);
    return (
      <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
        <ellipse cx={s * 0.18} cy="1" rx={0.5 * s} ry={0.15 * s} fill="#000" opacity="0.5" filter={`url(#${id}-soft)`} />
        {/* reflection in the glossy board */}
        <g transform="scale(1 -0.5)" opacity="0.13">
          <path d={body} fill={fill} />
        </g>
        <path d={body} fill={fill} />
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
        <path d={body} fill={`url(#${id}-shade)`} />
        <path d={body} fill="none" stroke="#fff" strokeOpacity={p.white ? 0 : 0.2} strokeWidth="1" />
        {/* specular streak */}
        <ellipse cx={-0.1 * s} cy={-(p.kind === 'king' ? 0.7 : p.kind === 'rook' ? 0.5 : 0.4) * s} rx={0.028 * s} ry={0.2 * s} fill="#fff" opacity={p.white ? 0.6 : 0.3} />
      </g>
    );
  };

  const fx = X(4.2, 3.4);
  const fy = Y(3.4) - 92;
  const fs = 80 * sc(3.4) * 0.94;

  return (
    <>
      <FxDefs id={id} />
      <defs>
        <radialGradient id={`${id}-bg`} cx="0.5" cy="0.12" r="0.95">
          <stop offset="0" stopColor="#5b3e25" />
          <stop offset="0.5" stopColor="#1c130d" />
          <stop offset="1" stopColor="#07080b" />
        </radialGradient>
        <linearGradient id={`${id}-white`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9b993" />
          <stop offset="0.3" stopColor="#fffaf0" />
          <stop offset="0.7" stopColor="#e8dcc0" />
          <stop offset="1" stopColor="#a69770" />
        </linearGradient>
        <linearGradient id={`${id}-black`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0b0b10" />
          <stop offset="0.3" stopColor="#5a5a6c" />
          <stop offset="0.65" stopColor="#23232d" />
          <stop offset="1" stopColor="#09090d" />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0" stopColor="#ffe9b8" stopOpacity="0.6" />
          <stop offset="1" stopColor="#ffe9b8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-pool`} cx="0.45" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#fff2d6" stopOpacity="0.2" />
          <stop offset="1" stopColor="#fff2d6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-far`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c130d" stopOpacity="0.8" />
          <stop offset="0.5" stopColor="#1c130d" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6a4426" />
          <stop offset="1" stopColor="#2a170b" />
        </linearGradient>
        <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#${id}-bg)`} />
      <ellipse cx="300" cy="250" rx="330" ry="150" fill={`url(#${id}-pool)`} />

      {/* wooden frame, then the squares */}
      <path d={quad(-0.45, -0.45, 8.45, 8.45)} fill={`url(#${id}-wood)`} />
      <path d={`M${X(-0.45, 8.45).toFixed(1)} ${Y(8.45).toFixed(1)} L${X(8.45, 8.45).toFixed(1)} ${Y(8.45).toFixed(1)} L${X(8.45, 8.45).toFixed(1)} ${(Y(8.45) + 16).toFixed(1)} L${X(-0.45, 8.45).toFixed(1)} ${(Y(8.45) + 16).toFixed(1)} Z`} fill="#1d0f06" />
      <path d={quad(-0.06, -0.06, 8.06, 8.06)} fill="none" stroke="#d9b36a" strokeOpacity="0.55" strokeWidth="1.2" />
      {squares.map((s, i) => (
        <path key={i} d={s.d} fill={s.dark ? '#2b2d36' : '#ebe6d8'} stroke={s.dark ? '#2b2d36' : '#ebe6d8'} strokeWidth="0.6" />
      ))}
      <path d={quad(0, 0, 8, 8)} fill={`url(#${id}-gloss)`} />
      <path d={quad(0, 0, 8, 3.2)} fill={`url(#${id}-far)`} />

      {stand
        .slice()
        .sort((a, b) => a.v - b.v)
        .map(renderPiece)}

      {/* the captured pawn, floating upright, with its flight path and sparkles */}
      <path
        d={`M${(fx + 10).toFixed(1)} ${(fy - 18).toFixed(1)} Q${(fx + 70).toFixed(1)} ${(fy - 84).toFixed(1)} ${(fx + 140).toFixed(1)} ${(fy + 10).toFixed(1)}`}
        stroke="#ffd479"
        strokeOpacity="0.65"
        strokeWidth="2"
        strokeDasharray="3 7"
        strokeLinecap="round"
        fill="none"
      />
      {[
        [-26, 34, 3], [20, 18, 2.2], [-12, -24, 2.6], [34, -8, 2], [4, 52, 2.4], [-34, 6, 1.8],
      ].map(([dx, dy, r], i) => (
        <circle key={i} cx={fx + dx} cy={fy - 20 + dy} r={r} fill="#ffe9b8" opacity={0.9 - i * 0.09} />
      ))}
      <ellipse cx={fx + 3} cy={Y(3.4) + 1} rx={0.42 * fs} ry={0.13 * fs} fill="#000" opacity="0.4" filter={`url(#${id}-soft)`} />
      <circle cx={fx} cy={fy - 0.42 * fs} r={fs * 1.05} fill={`url(#${id}-halo)`} />
      <g transform={`translate(${fx.toFixed(1)} ${fy.toFixed(1)})`}>
        <path d={turnedPath(PROF_PAWN, fs)} fill={`url(#${id}-black)`} />
        <path d={turnedPath(PROF_PAWN, fs)} fill={`url(#${id}-shade)`} />
        <path d={turnedPath(PROF_PAWN, fs)} fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="1" />
        <ellipse cx={-0.1 * fs} cy={-0.4 * fs} rx={0.028 * fs} ry={0.2 * fs} fill="#fff" opacity="0.35" />
      </g>

      <Finish id={id} vignette={0.55} />
    </>
  );
}


/* ---------------------------------------------------------------- voxel */

// An isometric patch of the world, cropped by the frame on every side rather
// than floating in the middle of it, with the game's hotbar along the bottom.
function VoxelArt({ id }: { id: string }) {
  const N = 13;
  const CW = 33;
  const CH = 19;
  const CZ = 29;
  const ox = 320;
  const oy = 112;
  const rand = rng(5);

  const P = (x: number, z: number, h: number) => ({ x: ox + (x - z) * CW, y: oy + (x + z) * CH - h * CZ });
  // "123" rather than "123.0": most points land on whole pixels, and this
  // markup is inlined into the page, so every character counts.
  const num = (v: number) => String(Number(v.toFixed(1)));
  const pt = (x: number, z: number, h: number) => {
    const p = P(x, z, h);
    return `${num(p.x)} ${num(p.y)}`;
  };

  const pondX = 6.5;
  const pondZ = 4;
  const heightAt = (x: number, z: number) => {
    const dp = (x - pondX) ** 2 + ((z - pondZ) * 1.1) ** 2;
    if (dp < 6.5) return 1;
    const base = 2 + Math.sin(x * 0.75 + 0.4) * 0.9 + Math.cos(z * 0.62 + 0.2) * 0.9;
    return Math.max(2, Math.min(4, Math.round(base + (dp < 14 ? -0.6 : 0))));
  };

  type Col = { x: number; z: number; h: number; water: boolean; tone: number; stone: boolean };
  const cols: Col[] = [];
  for (let x = 0; x < N; x++) {
    for (let z = 0; z < N; z++) {
      const h = heightAt(x, z);
      cols.push({ x, z, h, water: h === 1, tone: (rand() - 0.5) * 0.16, stone: x === 4 && z === 8 });
    }
  }
  cols.sort((a, b) => a.x + a.z - (b.x + b.z) || a.x - b.x);
  // A block wholly outside the 640 by 400 frame is never seen, so do not draw
  // it (this cover is inlined into the page, and every element costs bytes).
  const inFrame = (c: Col) => {
    const xMin = ox + (c.x - c.z - 1) * CW;
    const xMax = ox + (c.x + 1 - c.z) * CW;
    const yMin = oy + (c.x + c.z) * CH - (c.h + 1) * CZ;
    const yMax = oy + (c.x + c.z + 2) * CH;
    return xMax > -6 && xMin < W + 6 && yMax > -6 && yMin < H + 6;
  };

  // A colour scaled lighter or darker. (hex() clamps, so a bright block cannot overflow.)
  const shade = (c: [number, number, number], k: number) => mix([c[0] * k, c[1] * k, c[2] * k], [0, 0, 0], 0);

  const GRASS: [number, number, number] = [104, 184, 70];
  const DIRT: [number, number, number] = [138, 94, 58];
  const SAND: [number, number, number] = [226, 208, 148];
  const STONE: [number, number, number] = [150, 152, 160];
  const LOG: [number, number, number] = [120, 82, 48];
  const LEAF: [number, number, number] = [60, 148, 62];

  const cube = (key: string, x: number, z: number, y: number, top: [number, number, number], side: [number, number, number], tone = 0) => {
    const t = y + 1;
    return (
      <g key={key}>
        <path d={`M${pt(x, z + 1, t)} L${pt(x + 1, z + 1, t)} L${pt(x + 1, z + 1, y)} L${pt(x, z + 1, y)} Z`} fill={shade(side, 0.82 + tone)} />
        <path d={`M${pt(x + 1, z, t)} L${pt(x + 1, z + 1, t)} L${pt(x + 1, z + 1, y)} L${pt(x + 1, z, y)} Z`} fill={shade(side, 0.62 + tone)} />
        <path d={`M${pt(x, z, t)} L${pt(x + 1, z, t)} L${pt(x + 1, z + 1, t)} L${pt(x, z + 1, t)} Z`} fill={shade(top, 1 + tone)} />
      </g>
    );
  };

  // Trees are a few cubes stacked on a grass column.
  const trees = [
    { x: 3, z: 3 },
    { x: 10, z: 3 },
  ];
  type Piece = { order: number; node: React.ReactNode };
  const pieces: Piece[] = [];
  cols.filter(inFrame).forEach((c) => {
    const { x, z, h } = c;
    const sideBase = c.water ? SAND : DIRT;
    const topCol = c.stone ? STONE : c.water ? SAND : GRASS;
    const lines: string[] = [];
    for (let k = 1; k < h; k++) {
      lines.push(`M${pt(x, z + 1, k)} L${pt(x + 1, z + 1, k)} L${pt(x + 1, z, k)}`);
    }
    pieces.push({
      order: (x + z) * 100 + x,
      node: (
        <g key={`c${x}-${z}`}>
          <path d={`M${pt(x, z + 1, h)} L${pt(x + 1, z + 1, h)} L${pt(x + 1, z + 1, 0)} L${pt(x, z + 1, 0)} Z`} fill={shade(sideBase, 0.84)} />
          <path d={`M${pt(x + 1, z, h)} L${pt(x + 1, z + 1, h)} L${pt(x + 1, z + 1, 0)} L${pt(x + 1, z, 0)} Z`} fill={shade(sideBase, 0.62)} />
          {!c.water && !c.stone ? (
            <>
              <path d={`M${pt(x, z + 1, h)} L${pt(x + 1, z + 1, h)} L${pt(x + 1, z + 1, h - 0.28)} L${pt(x, z + 1, h - 0.28)} Z`} fill={shade(GRASS, 0.7 + c.tone)} />
              <path d={`M${pt(x + 1, z, h)} L${pt(x + 1, z + 1, h)} L${pt(x + 1, z + 1, h - 0.28)} L${pt(x + 1, z, h - 0.28)} Z`} fill={shade(GRASS, 0.52 + c.tone)} />
            </>
          ) : null}
          {lines.length ? <path d={lines.join(' ')} stroke="#000" strokeOpacity="0.14" strokeWidth="1" fill="none" /> : null}
          <path d={`M${pt(x, z, h)} L${pt(x + 1, z, h)} L${pt(x + 1, z + 1, h)} L${pt(x, z + 1, h)} Z`} fill={shade(topCol, 1 + c.tone)} stroke="#000" strokeOpacity="0.1" strokeWidth="0.8" />
          {c.water ? (
            <>
              <path d={`M${pt(x, z, 1.02)} L${pt(x + 1, z, 1.02)} L${pt(x + 1, z + 1, 1.02)} L${pt(x, z + 1, 1.02)} Z`} fill={`url(#${id}-water)`} opacity="0.88" />
              <path d={`M${pt(x + 0.2, z + 0.5, 1.02)} L${pt(x + 0.55, z + 0.5, 1.02)}`} stroke="#fff" strokeOpacity="0.5" strokeWidth="1.5" />
            </>
          ) : null}
        </g>
      ),
    });
  });
  trees.forEach((t, ti) => {
    const base = heightAt(t.x, t.z);
    const trunk = [0, 1];
    trunk.forEach((k) =>
      pieces.push({ order: (t.x + t.z) * 100 + t.x + 50 + k, node: cube(`t${ti}-${k}`, t.x, t.z, base + k, LOG, LOG) }),
    );
    const leaves: [number, number, number][] = [];
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) leaves.push([dx, dz, 2]);
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) if (Math.abs(dx) + Math.abs(dz) < 2) leaves.push([dx, dz, 3]);
    leaves.forEach(([dx, dz, ky], li) => {
      if (dx === 0 && dz === 0 && ky === 2) return;
      pieces.push({
        order: (t.x + dx + t.z + dz) * 100 + t.x + dx + 60 + ky,
        node: cube(`l${ti}-${li}`, t.x + dx, t.z + dz, base + ky, LEAF, LEAF, ((li * 37) % 11) / 100 - 0.05),
      });
    });
  });
  pieces.sort((a, b) => a.order - b.order);

  const slots: [number, number, number][] = [GRASS, DIRT, STONE, LOG, LEAF, SAND, [72, 140, 220], [240, 200, 60], [200, 80, 70]];

  return (
    <>
      <FxDefs id={id} />
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5aa9f2" />
          <stop offset="0.6" stopColor="#a9d6fb" />
          <stop offset="1" stopColor="#e4f3ff" />
        </linearGradient>
        <linearGradient id={`${id}-water`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4fa6ee" />
          <stop offset="1" stopColor="#2c78cf" />
        </linearGradient>
        <radialGradient id={`${id}-sun`}>
          <stop offset="0" stopColor="#fffbd0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fffbd0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-fog`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dff0ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#dff0ff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      <circle cx="500" cy="50" r="90" fill={`url(#${id}-sun)`} />
      <rect x="486" y="36" width="28" height="28" fill="#fffbe0" />
      {[
        { x: 70, y: 40, w: 120 },
        { x: 330, y: 22, w: 150 },
      ].map((c, i) => (
        <g key={i}>
          <rect x={c.x} y={c.y} width={c.w} height="22" fill="#fff" />
          <rect x={c.x + 14} y={c.y - 12} width={c.w * 0.5} height="14" fill="#fff" />
          <rect x={c.x} y={c.y + 22} width={c.w} height="7" fill="#c9dcef" />
        </g>
      ))}
      {/* distant world, in haze, behind the near patch */}
      <path d={`M0 118 L60 96 L100 108 L170 84 L240 110 L300 100 L360 118 L430 92 L500 112 L570 90 L640 108 L640 190 L0 190 Z`} fill="#8bc3a0" opacity="0.7" filter={`url(#${id}-haze)`} />
      <rect y="100" width={W} height="90" fill={`url(#${id}-fog)`} />

      {pieces.map((p) => p.node)}

      {/* hotbar */}
      <g>
        <rect x="177" y="344" width="286" height="42" rx="4" fill="#000" opacity="0.5" />
        {slots.map((c, i) => (
          <g key={i}>
            <rect x={182 + i * 31.2} y="349" width="28" height="28" fill="#000" opacity="0.35" stroke="#fff" strokeOpacity={i === 0 ? 0.95 : 0.22} strokeWidth={i === 0 ? 2 : 1} />
            <rect x={188 + i * 31.2} y="355" width="16" height="16" fill={mix(c, c, 0)} />
            <rect x={188 + i * 31.2} y="355" width="16" height="5" fill="#fff" opacity="0.2" />
          </g>
        ))}
      </g>

      <Finish id={id} vignette={0.32} />
    </>
  );
}


/* -------------------------------------------------------------- circuit */

// A circuit board in perspective with the fan as the centrepiece, current
// shown as glowing dots running along the copper. The fan, switch and LED sit
// in the middle 300px; the two cells are off to the left and may be cropped
// on a phone.
function CircuitArt({ id }: { id: string }) {
  const wFar = 320;
  const wNear = 570;
  const yFar = 92;
  const yNear = 384;
  const kk = (v: number) => lerp(0.66, 1, v);
  const Px = (u: number, v: number) => 320 + (u - 0.5) * lerp(wFar, wNear, v);
  const Py = (v: number) => lerp(yFar, yNear, v);
  const pp = (u: number, v: number): [number, number] => [Px(u, v), Py(v)];
  const poly = (pts: [number, number][]) => pts.map(([u, v]) => `${Px(u, v).toFixed(1)},${Py(v).toFixed(1)}`).join(' ');

  const traces: [number, number][][] = [
    [[0.4, 0.7], [0.46, 0.7], [0.46, 0.36], [0.4, 0.36]],
    [[0.24, 0.36], [0.24, 0.2], [0.6, 0.2], [0.6, 0.34]],
    [[0.6, 0.64], [0.6, 0.92], [0.06, 0.92], [0.06, 0.95]],
    [[0.4, 0.86], [0.52, 0.86], [0.52, 0.56], [0.55, 0.56]],
    [[0.6, 0.5], [0.84, 0.5], [0.84, 0.6]],
  ];
  // glowing current dots, a few per trace
  const dots: [number, number][] = [];
  traces.forEach((tr, ti) => {
    for (let k = 0; k < 4; k++) {
      const f = (k + 0.4 + ti * 0.17) / 4;
      const segLen = tr.slice(1).map((p, i) => Math.hypot(p[0] - tr[i][0], (p[1] - tr[i][1]) * 0.8));
      const total = segLen.reduce((a, b) => a + b, 0);
      let at = f * total;
      for (let i = 0; i < segLen.length; i++) {
        if (at <= segLen[i]) {
          const t = at / segLen[i];
          dots.push([lerp(tr[i][0], tr[i + 1][0], t), lerp(tr[i][1], tr[i + 1][1], t)]);
          break;
        }
        at -= segLen[i];
      }
    }
  });

  const [fx, fy0] = pp(0.6, 0.49);
  const kf = kk(0.49);
  const R = 82 * kf;
  const fy = fy0 - R * 0.42;
  const cell = (v: number, label: string) => {
    const [x0, y0] = pp(0.05, v);
    const [x1] = pp(0.4, v);
    const h = 34 * kk(v);
    return (
      <g key={label + v}>
        <ellipse cx={(x0 + x1) / 2 + 5} cy={y0 + h * 0.5} rx={(x1 - x0) / 2 + 6} ry={h * 0.2} fill="#000" opacity="0.4" filter={`url(#${id}-soft)`} />
        <rect x={x0} y={y0 - h * 0.5} width={x1 - x0} height={h} rx={h * 0.45} fill={`url(#${id}-cell)`} />
        <rect x={x1 - 2} y={y0 - h * 0.16} width={h * 0.22} height={h * 0.32} rx="2" fill="#c9ced6" />
        <rect x={x0 + (x1 - x0) * 0.62} y={y0 - h * 0.5} width={(x1 - x0) * 0.1} height={h} fill="#e0b14f" opacity="0.8" />
        <text x={x0 + (x1 - x0) * 0.3} y={y0 + h * 0.12} textAnchor="middle" fill="#e9eef9" fontSize={h * 0.34} fontWeight="700" letterSpacing="0.5">
          {label}
        </text>
      </g>
    );
  };

  const [sx, sy] = pp(0.32, 0.36);
  const ks = kk(0.36) * 0.9;
  const [lx, ly] = pp(0.84, 0.62);
  const [rx, ry] = pp(0.38, 0.52);

  return (
    <>
      <FxDefs id={id} />
      <defs>
        <radialGradient id={`${id}-bg`} cx="0.5" cy="0.45" r="0.8">
          <stop offset="0" stopColor="#12493f" />
          <stop offset="1" stopColor="#04110f" />
        </radialGradient>
        <linearGradient id={`${id}-board`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0c4b39" />
          <stop offset="1" stopColor="#16805e" />
        </linearGradient>
        <linearGradient id={`${id}-cell`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d7bb2" />
          <stop offset="0.35" stopColor="#2b4377" />
          <stop offset="1" stopColor="#0f1b3a" />
        </linearGradient>
        <radialGradient id={`${id}-disc`}>
          <stop offset="0" stopColor="#cfeee9" stopOpacity="0.5" />
          <stop offset="0.75" stopColor="#8fd4cb" stopOpacity="0.28" />
          <stop offset="1" stopColor="#8fd4cb" stopOpacity="0.05" />
        </radialGradient>
        <linearGradient id={`${id}-blade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2fbff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#7fb9c6" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={`${id}-post`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1b2230" />
          <stop offset="0.4" stopColor="#4c586e" />
          <stop offset="1" stopColor="#141a26" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#${id}-bg)`} />
      <ellipse cx="330" cy="240" rx="230" ry="120" fill="#35e0b4" opacity="0.08" filter={`url(#${id}-bloom)`} />

      {/* board with a visible edge */}
      <polygon points={`${poly([[0, 1], [1, 1]])} ${Px(1, 1).toFixed(1)},${Py(1) + 12} ${Px(0, 1).toFixed(1)},${Py(1) + 12}`} fill="#06241b" />
      <polygon points={poly([[0, 0], [1, 0], [1, 1], [0, 1]])} fill={`url(#${id}-board)`} />
      <polygon points={poly([[0.015, 0.02], [0.985, 0.02], [0.985, 0.985], [0.015, 0.985]])} fill="none" stroke="#e0b14f" strokeOpacity="0.28" strokeWidth="1" />
      {/* faint ground plane grid */}
      {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((v) => (
        <line key={v} x1={Px(0.02, v)} y1={Py(v)} x2={Px(0.98, v)} y2={Py(v)} stroke="#fff" strokeOpacity="0.035" />
      ))}

      {/* copper, drawn twice: a dark underlay and the bright trace */}
      {traces.map((t, i) => (
        <polyline key={`u${i}`} points={poly(t)} fill="none" stroke="#3a2a08" strokeOpacity="0.5" strokeWidth={9 * 0.9} strokeLinejoin="round" strokeLinecap="round" />
      ))}
      {traces.map((t, i) => (
        <polyline key={i} points={poly(t)} fill="none" stroke="#e8bb55" strokeWidth={6 * 0.9} strokeLinejoin="round" strokeLinecap="round" />
      ))}
      {traces.map((t, i) => (
        <polyline key={`h${i}`} points={poly(t)} fill="none" stroke="#fff3c4" strokeOpacity="0.45" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      ))}
      {dots.map(([u, v], i) => {
        const [x, y] = pp(u, v);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="9" fill="#ffd86b" opacity="0.5" filter={`url(#${id}-soft)`} />
            <circle cx={x} cy={y} r="2.8" fill="#fffbe0" />
          </g>
        );
      })}

      {/* silkscreen */}
      {[
        { t: 'R1  22Ω', u: 0.3, v: 0.6, s: 11 },
        { t: 'SW1', u: 0.26, v: 0.28, s: 11 },
        { t: 'BT1  3V', u: 0.2, v: 0.58, s: 11 },
        { t: 'D1', u: 0.84, v: 0.7, s: 11 },
      ].map((l, i) => {
        const [x, y] = pp(l.u, l.v);
        return (
          <text key={i} x={x} y={y} fill="#f4fff9" opacity="0.55" fontSize={l.s * kk(l.v)} letterSpacing="1" fontWeight="600">
            {l.t}
          </text>
        );
      })}

      {/* battery cells */}
      {cell(0.7, 'AA 1.5V')}
      {cell(0.86, 'AA 1.5V')}

      {/* resistor */}
      <g transform={`translate(${rx.toFixed(1)} ${ry.toFixed(1)})`}>
        <ellipse cx="2" cy="5" rx="26" ry="4" fill="#000" opacity="0.35" filter={`url(#${id}-soft)`} />
        <line x1="-30" y1="0" x2="30" y2="0" stroke="#c9ced6" strokeWidth="2.4" />
        <rect x="-18" y="-7" width="36" height="14" rx="6" fill="#d9b98a" />
        {[-9, -3, 3, 9].map((x, i) => (
          <rect key={x} x={x - 1.4} y="-7" width="2.8" height="14" fill={['#8a3a1a', '#222', '#c1272d', '#c9a227'][i]} />
        ))}
      </g>

      {/* slide switch */}
      <g transform={`translate(${sx.toFixed(1)} ${sy.toFixed(1)}) scale(${ks.toFixed(3)})`}>
        <ellipse cx="3" cy="14" rx="40" ry="7" fill="#000" opacity="0.4" filter={`url(#${id}-soft)`} />
        <rect x="-36" y="-14" width="72" height="28" rx="6" fill="#0f131c" />
        <rect x="-36" y="-14" width="72" height="9" rx="6" fill="#fff" opacity="0.08" />
        <rect x="-26" y="-5" width="52" height="10" rx="5" fill="#04060a" />
        <rect x="6" y="-11" width="22" height="22" rx="4" fill="#e9edf3" />
        <rect x="6" y="-11" width="22" height="7" rx="4" fill="#fff" opacity="0.6" />
        <text x="-24" y="26" fill="#f4fff9" opacity="0.55" fontSize="9" fontWeight="600">LOW</text>
        <text x="12" y="26" fill="#f4fff9" opacity="0.55" fontSize="9" fontWeight="600">HIGH</text>
      </g>

      {/* LED */}
      <circle cx={lx} cy={ly - 8} r={26 * kk(0.62)} fill="#ff3b3b" opacity="0.4" filter={`url(#${id}-bloom)`} />
      <rect x={lx - 8} y={ly - 4} width="16" height="8" rx="2" fill="#3a0d10" />
      <path d={`M${lx - 8} ${ly - 3} v-12 a8 8 0 0 1 16 0 v12 z`} fill="#ff4a4a" />
      <ellipse cx={lx - 2.5} cy={ly - 14} rx="2" ry="4" fill="#fff" opacity="0.7" />

      {/* fan: stand, then the spinning disc */}
      <ellipse cx={fx + 6} cy={fy0 + 6} rx={R * 0.72} ry={R * 0.14} fill="#000" opacity="0.45" filter={`url(#${id}-soft)`} />
      <rect x={fx - R * 0.1} y={fy} width={R * 0.2} height={fy0 - fy + 2} fill={`url(#${id}-post)`} />
      <ellipse cx={fx} cy={fy0 + 2} rx={R * 0.46} ry={R * 0.1} fill="#1c2333" />
      <ellipse cx={fx} cy={fy0} rx={R * 0.46} ry={R * 0.09} fill="#3a4660" />
      <circle cx={fx} cy={fy} r={R * 1.35} fill="#7fe8d0" opacity="0.1" filter={`url(#${id}-bloom)`} />
      <ellipse cx={fx} cy={fy} rx={R} ry={R * 0.9} fill={`url(#${id}-disc)`} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${fx} ${fy}) rotate(${i * 72 + 18}) scale(1 0.9)`}>
          <path d={`M0 0 C${R * 0.2} ${-R * 0.12} ${R * 0.62} ${-R * 0.34} ${R * 0.98} ${-R * 0.16} C${R * 0.8} ${R * 0.06} ${R * 0.36} ${R * 0.14} 0 ${R * 0.06} Z`} fill={`url(#${id}-blade)`} opacity="0.55" filter={`url(#${id}-haze)`} />
          <path d={`M0 0 C${R * 0.2} ${-R * 0.12} ${R * 0.62} ${-R * 0.34} ${R * 0.98} ${-R * 0.16}`} fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.4" />
        </g>
      ))}
      <ellipse cx={fx} cy={fy} rx={R * 1.04} ry={R * 0.94} fill="none" stroke="#c9f3ec" strokeOpacity="0.5" strokeWidth="2" />
      <circle cx={fx} cy={fy} r={R * 0.2} fill="#222a3b" />
      <circle cx={fx} cy={fy} r={R * 0.2} fill="none" stroke="#9fb4d6" strokeOpacity="0.8" strokeWidth="2" />
      <circle cx={fx - R * 0.05} cy={fy - R * 0.06} r={R * 0.07} fill="#fff" opacity="0.7" />
      {/* air coming off it */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${fx - R * (0.5 - i * 0.5)} ${fy - R * 1.02} q${R * 0.06} ${-R * 0.34} ${R * 0.26} ${-R * 0.5}`} stroke="#cffff0" strokeOpacity={0.4 - i * 0.08} strokeWidth="2" strokeLinecap="round" fill="none" />
      ))}

      <Finish id={id} vignette={0.5} />
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
