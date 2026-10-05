import React from 'react';

/**
 * Shared pieces for the drawn (SVG) blog figures.
 *
 * Colours are hex copies of the tokens in globals.css (@theme). They are
 * written out here, not read from CSS variables, because Tailwind only emits
 * a theme variable when some utility class uses it, and an SVG attribute is
 * not a utility class. If a token changes in globals.css, change it here too.
 *
 * Every figure is a self-contained <svg> with a viewBox about 400 units wide.
 * That width is deliberate: on a phone the drawing scales to roughly 0.8 and
 * 12-unit text is still readable. On a desktop the drawing is capped at
 * `maxWidth` and centred, so it never balloons.
 */
export const C = {
  ink: '#16181A',
  ink2: '#5C6167',
  ink3: '#949AA1',
  line: '#E8E8E5',
  lineSoft: '#F2F2F0',
  surface: '#F7F7F5',
  surface2: '#EDEDEA',
  white: '#FFFFFF',
  red: '#D83B32',
  redSoft: '#FEF3F2',
  redBorder: '#FECDCA',
  green: '#16A34A',
  greenSoft: '#F0FDF4',
  greenBorder: '#BBF7D0',
  amberSoft: '#FFFBEB',
  amberBorder: '#FDE68A',
} as const;

const MONO = "var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";

interface SvgProps {
  viewBox: string;
  /** Read aloud by screen readers in place of the drawing. Say what it shows. */
  label: string;
  maxWidth?: number;
  children: React.ReactNode;
}

export const Svg: React.FC<SvgProps> = ({ viewBox, label, maxWidth = 460, children }) => (
  <svg
    viewBox={viewBox}
    role="img"
    aria-label={label}
    style={{ display: 'block', width: '100%', height: 'auto', maxWidth, margin: '0 auto' }}
  >
    {children}
  </svg>
);

interface TProps {
  x: number;
  y: number;
  size?: number;
  weight?: number;
  fill?: string;
  anchor?: 'start' | 'middle' | 'end';
  mono?: boolean;
  italic?: boolean;
  opacity?: number;
  children: React.ReactNode;
}

/** A line of SVG text. Inherits the page font unless `mono` is set. */
export const T: React.FC<TProps> = ({
  x,
  y,
  size = 12,
  weight = 400,
  fill = C.ink,
  anchor = 'start',
  mono = false,
  italic = false,
  opacity,
  children,
}) => (
  <text
    x={x}
    y={y}
    fontSize={size}
    fontWeight={weight}
    fill={fill}
    textAnchor={anchor}
    fontStyle={italic ? 'italic' : undefined}
    opacity={opacity}
    style={mono ? { fontFamily: MONO } : undefined}
  >
    {children}
  </text>
);

/** Arrowhead markers. Ids are prefixed per figure so two figures never share one. */
export const ArrowDefs: React.FC<{ prefix: string }> = ({ prefix }) => (
  <defs>
    {(
      [
        ['g', C.ink3],
        ['k', C.ink],
        ['r', C.red],
        ['n', C.green],
      ] as const
    ).map(([key, color]) => (
      <marker
        key={key}
        id={`${prefix}-${key}`}
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path
          d="M1.5 1.5L8.5 5L1.5 8.5"
          fill="none"
          stroke={color}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </marker>
    ))}
  </defs>
);

type ArrowColor = 'g' | 'k' | 'r' | 'n';
const STROKE: Record<ArrowColor, string> = { g: C.ink3, k: C.ink, r: C.red, n: C.green };

/** A straight or curved arrow, given as an SVG path. */
export const Arrow: React.FC<{
  prefix: string;
  d: string;
  color?: ArrowColor;
  dashed?: boolean;
  width?: number;
  both?: boolean;
}> = ({ prefix, d, color = 'g', dashed = false, width = 1.5, both = false }) => (
  <path
    d={d}
    fill="none"
    stroke={STROKE[color]}
    strokeWidth={width}
    strokeDasharray={dashed ? '4 4' : undefined}
    strokeLinecap="round"
    markerEnd={`url(#${prefix}-${color})`}
    markerStart={both ? `url(#${prefix}-${color})` : undefined}
  />
);

/** A small person: round head, rounded shoulders. `cx`/`top` place the head's centre line and the top. */
export const Student: React.FC<{ cx: number; top: number; fill?: string; scale?: number }> = ({
  cx,
  top,
  fill = C.ink2,
  scale = 1,
}) => (
  <g transform={`translate(${cx} ${top}) scale(${scale})`}>
    <circle cx="0" cy="8" r="7.5" fill={fill} />
    <path d="M-13 30 C-13 18 -7 17 0 17 C7 17 13 18 13 30 Z" fill={fill} />
  </g>
);

/** Wavy "scribble" lines that read as rough working. */
export const Scribble: React.FC<{ x: number; y: number; w: number; lines?: number; gap?: number; color?: string }> = ({
  x,
  y,
  w,
  lines = 2,
  gap = 9,
  color = C.ink3,
}) => {
  const waves = Math.max(2, Math.round(w / 12));
  const step = w / waves;
  return (
    <g fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.75">
      {Array.from({ length: lines }).map((_, i) => {
        const yy = y + i * gap;
        let d = `M${x} ${yy}`;
        for (let k = 0; k < waves; k += 1) {
          d += ` q${step / 4} ${k % 2 === 0 ? -3 : 3} ${step / 2} 0 t${step / 2} 0`;
        }
        // Shorten the last line a little so the block looks handwritten, not ruled.
        return <path key={i} d={d} opacity={i === lines - 1 && lines > 1 ? 0.6 : 1} />;
      })}
    </g>
  );
};
