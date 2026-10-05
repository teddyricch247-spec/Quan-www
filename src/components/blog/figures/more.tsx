import React from 'react';
import { Arrow, ArrowDefs, C, Scribble, Svg, T } from './svg';

/**
 * Drawn figures for the four posts that were already on the blog:
 *   PoolAndPicker, MindEvolutionIslands   best-of-n-to-mind-evolution
 *   SwissCheese, SqlInjectionFlow         ai-generated-code-security-review
 *   KaelRequestPath                       introducing-kael
 *   WaitAtTheFront, ThinkingStack         why-kael-is-slower-on-purpose
 *
 * Like the ones in theory.tsx, these illustrate. They show no measured data.
 * Anything with a number in it repeats a number the post already states.
 */

/* ------------------------------------------------------------------ */
/* Best-of-N: the pool is the same, the picker decides                 */
/* ------------------------------------------------------------------ */

const CORRECT = new Set([3, 9, 14]);

export const PoolAndPicker: React.FC = () => {
  const p = 'pool';
  return (
    <Svg
      viewBox="0 0 400 268"
      label="A pool of twenty attempts at one problem, three of which are correct. An exact checker such as a test suite finds a correct one. A weak judge, or a vote between look-alike answers, can return a wrong one. The pool is the same either way; the picker decides."
    >
      <ArrowDefs prefix={p} />
      <T x={33} y={16} size={12} weight={500}>
        20 attempts at one problem
      </T>

      {Array.from({ length: 20 }).map((_, i) => {
        const col = i % 10;
        const row = Math.floor(i / 10);
        const x = 33 + col * 34;
        const y = 26 + row * 34;
        const ok = CORRECT.has(i);
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={28}
              height={28}
              rx={7}
              fill={ok ? C.greenSoft : C.surface}
              stroke={ok ? C.green : C.line}
              strokeWidth={ok ? 1.8 : 1.5}
            />
            {ok ? (
              <path
                d={`M${x + 8} ${y + 14.5} L${x + 12.5} ${y + 19} L${x + 20.5} ${y + 9.5}`}
                fill="none"
                stroke={C.green}
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
          </g>
        );
      })}

      <rect x={33} y={102} width={9} height={9} rx={2.5} fill={C.greenSoft} stroke={C.green} strokeWidth={1.5} />
      <T x={47} y={110.5} size={11} fill={C.ink2}>
        correct (3)
      </T>
      <rect x={128} y={102} width={9} height={9} rx={2.5} fill={C.surface} stroke={C.line} strokeWidth={1.5} />
      <T x={142} y={110.5} size={11} fill={C.ink2}>
        wrong (17)
      </T>

      <rect x={28} y={126} width={166} height={46} rx={10} fill={C.white} stroke={C.ink3} strokeWidth={1.5} />
      <T x={111} y={146} size={12.5} weight={500} anchor="middle">
        An exact checker
      </T>
      <T x={111} y={161} size={11} fill={C.ink3} anchor="middle">
        tests, a proof checker
      </T>
      <rect x={206} y={126} width={166} height={46} rx={10} fill={C.white} stroke={C.ink3} strokeWidth={1.5} />
      <T x={289} y={146} size={12.5} weight={500} anchor="middle">
        A weak judge
      </T>
      <T x={289} y={161} size={11} fill={C.ink3} anchor="middle">
        or a vote on look-alikes
      </T>

      <Arrow prefix={p} d="M111 175 L111 194" color="n" width={1.8} />
      <Arrow prefix={p} d="M289 175 L289 194" color="r" width={1.8} />

      <rect x={28} y={198} width={166} height={34} rx={10} fill={C.greenSoft} stroke={C.green} strokeWidth={1.5} />
      <T x={111} y={219} size={12.5} weight={500} anchor="middle" fill={C.green}>
        ✓ Returns a correct one
      </T>
      <rect x={206} y={198} width={166} height={34} rx={10} fill={C.redSoft} stroke={C.red} strokeWidth={1.5} />
      <T x={289} y={219} size={12.5} weight={500} anchor="middle" fill={C.red}>
        ✕ Can return a wrong one
      </T>

      <T x={200} y={256} size={12} weight={500} anchor="middle" fill={C.ink2}>
        Same pool. The picker decides.
      </T>
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Mind Evolution: islands that trade their best, weakest one restarts */
/* ------------------------------------------------------------------ */

const DOTS: [number, number][] = [
  [-22, -16],
  [14, -26],
  [28, 8],
  [-8, 20],
  [-30, 14],
  [4, -2],
  [34, -14],
];

const Island: React.FC<{ cx: number; cy: number; r: number; dashed?: boolean; best?: number; ghost?: boolean }> = ({
  cx,
  cy,
  r,
  dashed = false,
  best,
  ghost = false,
}) => (
  <g>
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={ghost ? C.white : C.surface}
      stroke={dashed ? C.ink3 : C.line}
      strokeWidth={1.5}
      strokeDasharray={dashed ? '5 4' : undefined}
    />
    {DOTS.map(([dx, dy], i) => (
      <circle
        key={i}
        cx={cx + dx * (r / 55)}
        cy={cy + dy * (r / 55)}
        r={i === best ? 6 : 4.5}
        fill={i === best ? C.red : C.ink3}
        opacity={ghost ? 0.35 : i === best ? 1 : 0.8}
      />
    ))}
  </g>
);

export const MindEvolutionIslands: React.FC = () => {
  const p = 'isl';
  return (
    <Svg
      viewBox="0 0 400 272"
      label="Three islands of candidate answers evolve separately. Islands one and two swap their best members. Island three, the weakest, is restarted from the best candidates of the other islands."
    >
      <ArrowDefs prefix={p} />

      <T x={95} y={34} size={11.5} weight={500} fill={C.ink2} anchor="middle">
        Island 1
      </T>
      <T x={305} y={34} size={11.5} weight={500} fill={C.ink2} anchor="middle">
        Island 2
      </T>
      <Island cx={95} cy={96} r={54} best={1} />
      <Island cx={305} cy={96} r={54} best={4} />

      <Arrow prefix={p} d="M154 80 L242 80" color="k" width={1.6} />
      <Arrow prefix={p} d="M246 112 L158 112" color="k" width={1.6} />
      <T x={200} y={101} size={11} fill={C.ink2} anchor="middle">
        swap their best
      </T>

      <Island cx={200} cy={206} r={46} dashed ghost />
      <Arrow prefix={p} d="M126 144 C150 172 160 178 168 182" color="r" dashed width={1.6} />
      <Arrow prefix={p} d="M274 144 C250 172 240 178 232 182" color="r" dashed width={1.6} />
      <T x={200} y={266} size={11.5} fill={C.red} anchor="middle" weight={500}>
        Island 3, the weakest, restarts from the leaders
      </T>
      <T x={200} y={14} size={11} fill={C.ink3} anchor="middle">
        each island evolves on its own, so the pool stays varied
      </T>
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Security review: layers with holes                                  */
/* ------------------------------------------------------------------ */

const SLABS: { x: number; label: string[]; holes: [number, number][] }[] = [
  { x: 52, label: ['Static', 'analysis'], holes: [[95, 11], [130, 9], [172, 7]] },
  { x: 132, label: ['Tests'], holes: [[95, 10], [152, 11]] },
  { x: 212, label: ['Model', 'check'], holes: [[62, 9], [95, 10]] },
  { x: 292, label: ['Human', 'review'], holes: [[62, 10], [155, 12]] },
];

export const SwissCheese: React.FC = () => (
  <Svg
    viewBox="0 0 400 240"
    maxWidth={440}
    label="Four review layers drawn as slices of cheese, each with holes in different places. A first bug passes the static analysis layer but is stopped by the tests. A second bug slips through the first three layers and is caught by human review. Stacked layers rarely have holes in the same place."
  >
    <T x={200} y={18} size={12} weight={500} anchor="middle">
      Every layer has holes. Stacked, they rarely line up.
    </T>
    {SLABS.map((s) => (
      <g key={s.x}>
        <rect x={s.x} y={34} width={56} height={150} rx={9} fill={C.amberSoft} stroke={C.amberBorder} strokeWidth={1.8} />
        {s.holes.map(([y, r], i) => (
          <ellipse key={i} cx={s.x + 28} cy={y} rx={r * 1.1} ry={r} fill={C.white} stroke={C.amberBorder} strokeWidth={1.5} />
        ))}
        {s.label.map((line, i) => (
          <T key={line} x={s.x + 28} y={204 + i * 14} size={11.5} fill={C.ink2} anchor="middle">
            {line}
          </T>
        ))}
      </g>
    ))}

    {/* Bug A: through the first hole, stopped by the second layer. */}
    <line x1={22} y1={130} x2={130} y2={130} stroke={C.red} strokeWidth={2.4} strokeLinecap="round" />
    <path d="M123 123 L135 137 M135 123 L123 137" stroke={C.red} strokeWidth={2.4} strokeLinecap="round" />
    <T x={22} y={118} size={11} weight={500} fill={C.red}>
      bug A
    </T>

    {/* Bug B: through three layers, caught by the last. */}
    <line x1={22} y1={95} x2={290} y2={95} stroke={C.red} strokeWidth={2.4} strokeLinecap="round" />
    <path d="M283 88 L295 102 M295 88 L283 102" stroke={C.red} strokeWidth={2.4} strokeLinecap="round" />
    <T x={22} y={83} size={11} weight={500} fill={C.red}>
      bug B
    </T>
  </Svg>
);

/* ------------------------------------------------------------------ */
/* SQL injection: data pasted into the instruction vs sent beside it   */
/* ------------------------------------------------------------------ */

export const SqlInjectionFlow: React.FC = () => {
  const p = 'sql';
  return (
    <Svg
      viewBox="0 0 400 332"
      label="Two ways to build a database query from a user's input. Top: the input is pasted into the SQL text, so the database reads the attacker's words as part of the instruction. Bottom: the SQL and the value travel separately, so the database treats the value as plain data."
    >
      <ArrowDefs prefix={p} />

      <T x={28} y={14} size={12} weight={500} fill={C.red}>
        Glued into the query
      </T>
      <rect x={28} y={22} width={150} height={28} rx={8} fill={C.redSoft} stroke={C.redBorder} strokeWidth={1.5} />
      <T x={40} y={40} size={12} mono fill={C.red}>
        ' OR '1'='1
      </T>
      <T x={190} y={40} size={11} fill={C.ink3} italic>
        typed by the user
      </T>
      <Arrow prefix={p} d="M103 53 L103 70" color="g" />
      <rect x={28} y={74} width={344} height={52} rx={10} fill={C.white} stroke={C.ink3} strokeWidth={1.5} />
      <T x={42} y={95} size={11.5} mono>
        SELECT id, email FROM users
      </T>
      <T x={42} y={113} size={11.5} mono>
        WHERE username = '
        <tspan fill={C.red} fontWeight={600}>
          ' OR '1'='1
        </tspan>
        '
      </T>
      <Arrow prefix={p} d="M200 129 L200 144" color="g" />
      <rect x={72} y={148} width={256} height={30} rx={9} fill={C.redSoft} stroke={C.red} strokeWidth={1.5} />
      <T x={200} y={167} size={12} weight={500} anchor="middle" fill={C.red}>
        The database reads it all as instructions
      </T>

      <line x1={28} y1={196} x2={372} y2={196} stroke={C.line} strokeWidth={1.5} />

      <T x={28} y={218} size={12} weight={500} fill={C.green}>
        Sent beside the query
      </T>
      <rect x={28} y={228} width={212} height={46} rx={10} fill={C.white} stroke={C.ink3} strokeWidth={1.5} />
      <T x={40} y={247} size={11.5} mono>
        SELECT id, email FROM users
      </T>
      <T x={40} y={264} size={11.5} mono>
        WHERE username = ?
      </T>
      <rect x={252} y={228} width={120} height={46} rx={10} fill={C.redSoft} stroke={C.redBorder} strokeWidth={1.5} />
      <T x={264} y={246} size={10.5} fill={C.ink3}>
        value
      </T>
      <T x={264} y={264} size={11.5} mono fill={C.red}>
        ' OR '1'='1
      </T>
      <Arrow prefix={p} d="M134 277 L172 294" color="g" />
      <Arrow prefix={p} d="M312 277 L268 294" color="g" />
      <rect x={72} y={298} width={256} height={30} rx={9} fill={C.greenSoft} stroke={C.green} strokeWidth={1.5} />
      <T x={200} y={317} size={12} weight={500} anchor="middle" fill={C.green}>
        The value stays data and is never run
      </T>
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Kael: how much work happens depends on the request                  */
/* ------------------------------------------------------------------ */

export const KaelRequestPath: React.FC = () => {
  const p = 'kreq';
  return (
    <Svg
      viewBox="0 0 400 290"
      maxWidth={420}
      label="The path of one request. The request passes a safety check. How many internal calls follow depends on the request: an easy one may use a single call, a hard one up to about twenty, retrieval included. The response passes a safety check too."
    >
      <ArrowDefs prefix={p} />

      <rect x={130} y={6} width={140} height={28} rx={14} fill={C.surface} stroke={C.line} strokeWidth={1.5} />
      <T x={200} y={24.5} size={12.5} weight={500} anchor="middle">
        Your request
      </T>
      <Arrow prefix={p} d="M200 37 L200 50" />

      <rect x={90} y={54} width={220} height={30} rx={9} fill={C.white} stroke={C.ink3} strokeWidth={1.5} />
      <T x={200} y={73} size={12} anchor="middle">
        Safety check on the request
      </T>
      <Arrow prefix={p} d="M200 87 L200 100" />

      <rect x={28} y={104} width={344} height={102} rx={12} fill={C.surface} stroke={C.line} strokeWidth={1.5} />
      <T x={200} y={122} size={11.5} weight={500} fill={C.ink2} anchor="middle">
        How much work happens depends on the request
      </T>

      <T x={44} y={152} size={12} weight={500}>
        Easy
      </T>
      <circle cx={100} cy={148.5} r={5} fill={C.ink2} />
      <T x={116} y={152} size={11.5} fill={C.ink2}>
        a single internal call
      </T>

      <T x={44} y={186} size={12} weight={500} fill={C.red}>
        Hard
      </T>
      {Array.from({ length: 20 }).map((_, i) => (
        <circle key={i} cx={100 + i * 10} cy={182.5} r={3.6} fill={C.red} opacity={0.9} />
      ))}
      <T x={304} y={186} size={11.5} fill={C.ink2}>
        up to ~20
      </T>

      <Arrow prefix={p} d="M200 209 L200 222" />
      <rect x={90} y={226} width={220} height={30} rx={9} fill={C.white} stroke={C.ink3} strokeWidth={1.5} />
      <T x={200} y={245} size={12} anchor="middle">
        Safety check on the response
      </T>
      <Arrow prefix={p} d="M200 259 L200 270" />
      <T x={200} y={286} size={12.5} weight={600} anchor="middle" fill={C.red}>
        One answer comes back
      </T>
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Speed: where the wait sits, and how fast the text then arrives      */
/* ------------------------------------------------------------------ */

const Ticks: React.FC<{ x: number; y: number; n: number; step: number; color?: string }> = ({
  x,
  y,
  n,
  step,
  color = C.ink,
}) => (
  <g stroke={color} strokeWidth={1.6} strokeLinecap="round">
    {Array.from({ length: n }).map((_, i) => (
      <line key={i} x1={x + i * step} y1={y + 6} x2={x + i * step} y2={y + 22} />
    ))}
  </g>
);

export const WaitAtTheFront: React.FC = () => (
  <Svg
    viewBox="0 0 400 214"
    label="Two timelines for an answer of the same length. With thinking on, there is a long wait before the first word, then the text arrives in quick, closely spaced bursts. With thinking off, the first word arrives sooner and the text arrives at a slower pace. The drawing is a schematic, not to scale."
  >
    <T x={28} y={18} size={13} weight={500}>
      Thinking on
    </T>
    <T x={372} y={18} size={11} fill={C.ink3} anchor="end">
      220 to 340 tokens a second once it starts
    </T>
    <rect x={28} y={30} width={170} height={34} rx={8} fill={C.white} stroke={C.ink3} strokeWidth={1.5} strokeDasharray="4 3" />
    <Scribble x={42} y={42} w={142} lines={2} gap={11} />
    <Ticks x={204} y={30} n={24} step={5} />
    <line x1={200} y1={26} x2={200} y2={70} stroke={C.red} strokeWidth={1.8} />
    <T x={200} y={84} size={11} weight={500} fill={C.red} anchor="middle">
      first word, after the thinking
    </T>

    <T x={28} y={118} size={13} weight={500}>
      Thinking off
    </T>
    <T x={372} y={118} size={11} fill={C.ink3} anchor="end">
      90 to 140 tokens a second
    </T>
    <rect x={28} y={130} width={16} height={34} rx={5} fill={C.surface2} stroke={C.ink3} strokeWidth={1.5} />
    <Ticks x={52} y={130} n={24} step={11.6} />
    <line x1={46} y1={126} x2={46} y2={170} stroke={C.red} strokeWidth={1.8} />
    <T x={46} y={184} size={11} weight={500} fill={C.red}>
      first word, usually within 0.7 to 3 seconds
    </T>

    <T x={372} y={206} size={10.5} fill={C.ink3} anchor="end" italic>
      schematic, not to scale
    </T>
  </Svg>
);

/* ------------------------------------------------------------------ */
/* Thinking levels as stacks of paper                                  */
/* ------------------------------------------------------------------ */

const LEVELS: { name: string; sub: string; sheets: number }[] = [
  { name: 'Off', sub: 'answer only', sheets: 0 },
  { name: 'Low', sub: 'the default', sheets: 1 },
  { name: 'High', sub: 'more room', sheets: 3 },
  { name: 'Max', sub: 'the most room', sheets: 6 },
];

export const ThinkingStack: React.FC = () => {
  const p = 'stk';
  return (
    <Svg
      viewBox="0 0 400 214"
      label="Four thinking levels drawn as stacks of paper. Off is an answer sheet alone. Low adds a sheet of scratch paper, High a few more, and Max the most. A schematic, not a measurement."
    >
      <ArrowDefs prefix={p} />
      <Arrow prefix={p} d="M60 18 L340 18" width={1.4} />
      <T x={60} y={12} size={11} fill={C.ink3}>
        less thinking
      </T>
      <T x={340} y={12} size={11} fill={C.ink3} anchor="end">
        more thinking
      </T>

      {LEVELS.map((lv, i) => {
        const cx = 70 + i * 87;
        const x = cx - 28;
        const baseY = 110;
        return (
          <g key={lv.name}>
            {Array.from({ length: lv.sheets }).map((_, k) => {
              const idx = lv.sheets - k; // draw the highest sheet first so lower ones overlap it
              return (
                <rect
                  key={k}
                  x={x}
                  y={baseY - idx * 8}
                  width={56}
                  height={58}
                  rx={5}
                  fill={C.white}
                  stroke={C.ink3}
                  strokeWidth={1.3}
                  strokeDasharray="4 3"
                />
              );
            })}
            {lv.sheets > 0 ? <Scribble x={x + 9} y={baseY - lv.sheets * 8 + 12} w={38} lines={1} /> : null}
            <rect x={x} y={baseY} width={56} height={58} rx={5} fill={C.redSoft} stroke={C.red} strokeWidth={1.6} />
            <line x1={x + 10} y1={baseY + 16} x2={x + 46} y2={baseY + 16} stroke={C.redBorder} strokeWidth={2.2} strokeLinecap="round" />
            <line x1={x + 10} y1={baseY + 27} x2={x + 46} y2={baseY + 27} stroke={C.redBorder} strokeWidth={2.2} strokeLinecap="round" />
            <line x1={x + 10} y1={baseY + 38} x2={x + 32} y2={baseY + 38} stroke={C.redBorder} strokeWidth={2.2} strokeLinecap="round" />
            <T x={cx} y={186} size={13} weight={600} anchor="middle">
              {lv.name}
            </T>
            <T x={cx} y={202} size={11} fill={C.ink3} anchor="middle">
              {lv.sub}
            </T>
          </g>
        );
      })}
    </Svg>
  );
};
