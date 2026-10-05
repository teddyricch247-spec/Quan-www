import React from 'react';
import { Arrow, ArrowDefs, C, Scribble, Student, Svg, T } from './svg';

/**
 * Figures for "The Thinking Behind Kael" (src/data/posts/the-thinking-behind-kael.ts).
 *
 * These illustrate ideas. None of them is a measurement, and every caption in
 * the post says so. DecodeLoop is the one animated figure: it uses the
 * `fig-sweep` and `fig-append` classes defined in globals.css under
 * "Blog figures", and the motion is switched off for prefers-reduced-motion.
 */

/* ------------------------------------------------------------------ */
/* 1. Text -> tokens -> IDs -> embeddings                              */
/* ------------------------------------------------------------------ */

const TOKENS = ['I', '’m', 'going', 'to', 'the'];
const IDS = ['40', '1101', '1016', '311', '290'];
// Made-up embedding values in [-1, 1]. Red = positive, dark = negative, stronger = bigger.
const VECTORS = [
  [0.8, -0.3, 0.5, -0.6, 0.2, 0.9],
  [-0.5, 0.7, -0.2, 0.4, -0.8, 0.3],
  [0.3, 0.6, -0.7, 0.1, 0.5, -0.4],
  [-0.6, -0.1, 0.4, 0.8, -0.3, 0.6],
  [0.2, -0.7, 0.6, -0.2, 0.7, -0.5],
];

export const TokensPipeline: React.FC = () => {
  const p = 'tok';
  const cx = (i: number) => 28 + i * 70 + 32;
  return (
    <Svg
      viewBox="0 0 400 288"
      label="Text becomes numbers in three steps. The words I, ’m, going, to, the are cut into tokens, each token is given an ID number, and each ID is looked up as a column of numbers called an embedding."
    >
      <ArrowDefs prefix={p} />

      <T x={28} y={16} size={12} weight={500} fill={C.ink2}>
        1 · The text is cut into tokens
      </T>
      {TOKENS.map((t, i) => (
        <g key={t}>
          <rect x={28 + i * 70} y={26} width={64} height={34} rx={8} fill={C.white} stroke={C.line} strokeWidth={1.5} />
          <T x={cx(i)} y={48} size={14} anchor="middle">
            {t}
          </T>
          <Arrow prefix={p} d={`M${cx(i)} 63 L${cx(i)} 91`} />
        </g>
      ))}

      <T x={28} y={104} size={12} weight={500} fill={C.ink2}>
        2 · Each token is swapped for an ID number
      </T>
      {IDS.map((id, i) => (
        <g key={id}>
          <rect x={28 + i * 70} y={114} width={64} height={28} rx={8} fill={C.surface} stroke={C.line} strokeWidth={1.5} />
          <T x={cx(i)} y={133} size={13} anchor="middle" mono>
            {id}
          </T>
          <Arrow prefix={p} d={`M${cx(i)} 145 L${cx(i)} 170`} />
        </g>
      ))}

      <T x={28} y={183} size={12} weight={500} fill={C.ink2}>
        3 · Each ID is looked up as a list of numbers
      </T>
      {VECTORS.map((col, i) => (
        <g key={i}>
          {col.map((v, j) => (
            <rect
              key={j}
              x={cx(i) - 15}
              y={192 + j * 11.5}
              width={30}
              height={10}
              rx={2.5}
              fill={v > 0 ? C.red : C.ink}
              opacity={0.15 + Math.abs(v) * 0.8}
            />
          ))}
        </g>
      ))}
      <T x={200} y={282} size={11} fill={C.ink3} anchor="middle">
        a real one holds hundreds to thousands of numbers
      </T>
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* 2. Prefill: the whole prompt in, one note per token out             */
/* ------------------------------------------------------------------ */

const PREFILL_TOKENS = ['Fix', 'this', 'bug', 'in', 'login'];

export const PrefillKv: React.FC = () => {
  const p = 'pre';
  const cx = (i: number) => 28 + i * 70 + 32;
  const kCells = [0.9, 0.45, 0.7];
  const vCells = [0.5, 0.95, 0.35];
  return (
    <Svg
      viewBox="0 0 400 282"
      label="Prefill. A five-token prompt goes through the model's layers all at once, and the model leaves behind a note for every token: a key and a value. Together these notes are the KV cache."
    >
      <ArrowDefs prefix={p} />

      {PREFILL_TOKENS.map((t, i) => (
        <g key={t}>
          <rect x={28 + i * 70} y={10} width={64} height={30} rx={8} fill={C.white} stroke={C.line} strokeWidth={1.5} />
          <T x={cx(i)} y={30} size={13} anchor="middle">
            {t}
          </T>
          <Arrow prefix={p} d={`M${cx(i)} 43 L${cx(i)} 60`} />
        </g>
      ))}

      <rect x={28} y={64} width={344} height={40} rx={10} fill={C.surface} stroke={C.line} strokeWidth={1.5} />
      <T x={200} y={80} size={12.5} weight={500} anchor="middle">
        The layers read the whole prompt in one pass
      </T>
      <T x={200} y={95} size={11} fill={C.ink3} anchor="middle">
        every token, every layer, together
      </T>

      {PREFILL_TOKENS.map((t, i) => (
        <Arrow key={t} prefix={p} d={`M${cx(i)} 107 L${cx(i)} 128`} />
      ))}

      {PREFILL_TOKENS.map((t, i) => {
        const x = 28 + i * 70;
        const y = 132;
        return (
          <g key={t}>
            {/* Cards behind: the same note on the other layers. */}
            <rect x={x + 8} y={y + 8} width={64} height={84} rx={8} fill={C.lineSoft} stroke={C.line} strokeWidth={1} />
            <rect x={x + 4} y={y + 4} width={64} height={84} rx={8} fill={C.white} stroke={C.line} strokeWidth={1} />
            <rect x={x} y={y} width={64} height={84} rx={8} fill={C.white} stroke={C.ink3} strokeWidth={1.5} />
            <T x={x + 32} y={y + 17} size={11} fill={C.ink2} anchor="middle" mono>
              {t}
            </T>
            <T x={x + 9} y={y + 45} size={11} weight={600} fill={C.ink} mono>
              K
            </T>
            {kCells.map((o, j) => (
              <rect key={j} x={x + 22 + j * 12} y={y + 35} width={10} height={13} rx={2.5} fill={C.ink} opacity={o} />
            ))}
            <T x={x + 9} y={y + 71} size={11} weight={600} fill={C.red} mono>
              V
            </T>
            {vCells.map((o, j) => (
              <rect key={j} x={x + 22 + j * 12} y={y + 61} width={10} height={13} rx={2.5} fill={C.red} opacity={o} />
            ))}
          </g>
        );
      })}

      <T x={200} y={252} size={12.5} weight={500} anchor="middle">
        The KV cache: one note per token, per layer
      </T>
      <T x={200} y={269} size={11} fill={C.ink3} anchor="middle">
        K says what a token is about · V is what it hands over
      </T>
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* 3. Decode: reread every note, write one token, add its note         */
/* ------------------------------------------------------------------ */

const NOTES: { t: string; own: boolean }[] = [
  { t: 'I', own: false },
  { t: '’m', own: false },
  { t: 'going', own: false },
  { t: 'to', own: false },
  { t: 'miss', own: true },
  { t: 'the', own: true },
];

export const DecodeLoop: React.FC = () => {
  const p = 'dec';
  const w = 44;
  const gap = 6;
  const x0 = 28;
  const cardX = (i: number) => x0 + i * (w + gap);
  const centre = (i: number) => cardX(i) + w / 2;
  return (
    <Svg
      viewBox="0 0 400 292"
      label="Decode. To choose each new word the model reads every note in the cache, the ones from the prompt and the ones from words it has already written. It then writes one token, adds that token's own note to the cache, and repeats."
    >
      <ArrowDefs prefix={p} />

      <T x={28} y={14} size={11} weight={500} fill={C.ink2}>
        The notebook so far
      </T>
      <rect x={236} y={5} width={9} height={9} rx={2} fill={C.white} stroke={C.ink3} strokeWidth={1.5} />
      <T x={249} y={13.5} size={10.5} fill={C.ink3}>
        prompt
      </T>
      <rect x={297} y={5} width={9} height={9} rx={2} fill={C.redSoft} stroke={C.red} strokeWidth={1.5} />
      <T x={310} y={13.5} size={10.5} fill={C.ink3}>
        written
      </T>

      {/* Reading lines, drawn first so the cards sit on top of their ends. The grey
          ones are always there; the red ones sweep across them one at a time. */}
      {NOTES.map((n, i) => (
        <line key={`g-${n.t}-${i}`} x1={200} y1={196} x2={centre(i)} y2={74} stroke={C.line} strokeWidth={1.5} />
      ))}
      {NOTES.map((n, i) => (
        <line
          key={`l-${n.t}-${i}`}
          x1={200}
          y1={196}
          x2={centre(i)}
          y2={74}
          stroke={C.red}
          strokeWidth={1.5}
          className="fig-sweep"
          style={{ animationDelay: `${i * 0.5}s` }}
        />
      ))}

      {NOTES.map((n, i) => (
        <g key={`${n.t}-${i}`}>
          <rect
            x={cardX(i)}
            y={26}
            width={w}
            height={46}
            rx={8}
            fill={n.own ? C.redSoft : C.white}
            stroke={n.own ? C.red : C.ink3}
            strokeWidth={1.5}
          />
          <T x={centre(i)} y={53} size={11} anchor="middle" mono>
            {n.t}
          </T>
          <rect
            x={cardX(i)}
            y={26}
            width={w}
            height={46}
            rx={8}
            fill="none"
            stroke={C.red}
            strokeWidth={2.5}
            className="fig-sweep"
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        </g>
      ))}

      {/* The new note, appended at the end of each cycle. */}
      <g className="fig-append">
        <rect x={cardX(6)} y={26} width={w} height={46} rx={8} fill={C.redSoft} stroke={C.red} strokeWidth={1.5} strokeDasharray="4 3" />
        <T x={centre(6)} y={53} size={11} anchor="middle" mono>
          match
        </T>
      </g>

      <rect x={104} y={196} width={192} height={38} rx={10} fill={C.ink} />
      <T x={200} y={220} size={13} weight={500} fill={C.white} anchor="middle">
        Which token comes next?
      </T>

      <Arrow prefix={p} d="M200 238 L200 250" color="g" />
      <T x={200} y={266} size={12} fill={C.ink2} anchor="middle">
        It reads every note, every time it writes a token.
      </T>
      <T x={200} y={283} size={11} fill={C.ink3} anchor="middle">
        Then it adds its own note and goes round again.
      </T>
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* 4. Meaning as geometry: king - man + woman ~ queen                  */
/* ------------------------------------------------------------------ */

export const EmbeddingSpace: React.FC = () => {
  const p = 'emb';
  const man = { x: 70, y: 205 };
  const woman = { x: 205, y: 220 };
  const king = { x: 100, y: 90 };
  const queen = { x: 235, y: 105 };
  return (
    <Svg
      viewBox="0 0 400 270"
      label="A two-dimensional sketch of word meanings as positions. The step from man to woman is the same as the step from king to queen, so king minus man plus woman lands near queen. Apple and pear sit far away, close to each other."
    >
      <ArrowDefs prefix={p} />

      <T x={170} y={22} size={15} weight={500} anchor="middle">
        king − man + woman ≈ queen
      </T>

      {/* The shared "male to female" step, drawn twice. */}
      <Arrow prefix={p} d={`M${man.x + 9} ${man.y + 1} L${woman.x - 10} ${woman.y - 1}`} color="r" width={2} />
      <Arrow prefix={p} d={`M${king.x + 9} ${king.y + 1} L${queen.x - 10} ${queen.y - 1}`} color="r" width={2} />
      {/* The shared "royalty" step. */}
      <Arrow prefix={p} d={`M${man.x + 2} ${man.y - 10} L${king.x - 2} ${king.y + 10}`} dashed />
      <Arrow prefix={p} d={`M${woman.x + 2} ${woman.y - 10} L${queen.x - 2} ${queen.y + 10}`} dashed />

      <T x={165} y={83} size={11} fill={C.red} anchor="middle" weight={500}>
        male → female
      </T>
      <T x={137} y={240} size={11} fill={C.red} anchor="middle" weight={500}>
        male → female
      </T>
      <T x={72} y={150} size={11} fill={C.ink3} anchor="end">
        royalty
      </T>
      <T x={247} y={168} size={11} fill={C.ink3}>
        royalty
      </T>

      {[
        { ...man, label: 'man', dy: 24 },
        { ...woman, label: 'woman', dy: 24 },
        { ...king, label: 'king', dy: -14 },
      ].map((d) => (
        <g key={d.label}>
          <circle cx={d.x} cy={d.y} r={6} fill={C.ink} />
          <T x={d.x} y={d.y + d.dy} size={12.5} weight={500} anchor="middle">
            {d.label}
          </T>
        </g>
      ))}
      <circle cx={queen.x} cy={queen.y} r={11} fill="none" stroke={C.red} strokeWidth={1.5} strokeDasharray="3 3" />
      <circle cx={queen.x} cy={queen.y} r={6} fill={C.red} />
      <T x={queen.x} y={queen.y - 18} size={12.5} weight={500} anchor="middle" fill={C.red}>
        queen
      </T>

      <circle cx={322} cy={198} r={5} fill={C.ink3} />
      <T x={322} y={218} size={12} fill={C.ink3} anchor="middle">
        apple
      </T>
      <circle cx={347} cy={164} r={5} fill={C.ink3} />
      <T x={347} y={146} size={12} fill={C.ink3} anchor="middle">
        pear
      </T>
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* 5. The same last words, with and without context                    */
/* ------------------------------------------------------------------ */

const FLAT: [string, number][] = [
  ['the', 150],
  ['be', 138],
  ['see', 128],
  ['try', 116],
  ['go', 102],
  ['sleep', 90],
];
const SHARP: [string, number][] = [
  ['be late', 250],
  ['miss it', 118],
  ['run', 70],
  ['pack', 44],
  ['sleep', 26],
  ['the', 16],
];

const Bars: React.FC<{ rows: [string, number][]; y: number; hot?: boolean }> = ({ rows, y, hot = false }) => (
  <g>
    {rows.map(([word, len], i) => (
      <g key={word}>
        <T x={92} y={y + i * 17 + 10.5} size={11.5} fill={C.ink2} anchor="end">
          {word}
        </T>
        <rect x={100} y={y + i * 17} width={len} height={13} rx={3.5} fill={hot && i === 0 ? C.red : C.ink3} opacity={hot && i === 0 ? 1 : 0.55} />
      </g>
    ))}
  </g>
);

export const ContextNarrows: React.FC = () => (
  <Svg
    viewBox="0 0 400 444"
    label="Two bar charts of what a model might write after the words I'm going to. With nothing before those words, six continuations are almost equally likely. After a short paragraph about being late for a match, one continuation, be late, is far more likely than the rest. The bars are illustrative, not measured."
  >
    <T x={28} y={16} size={12} weight={500}>
      A · Almost nothing before it
    </T>
    <rect x={28} y={26} width={344} height={28} rx={8} fill={C.surface} stroke={C.line} strokeWidth={1.5} />
    <T x={42} y={44} size={13}>
      I’m going to …
    </T>
    <Bars rows={FLAT} y={66} />
    <T x={100} y={184} size={11} italic fill={C.ink3}>
      Many continuations, all about equally likely.
    </T>

    <line x1={28} y1={202} x2={372} y2={202} stroke={C.line} strokeWidth={1.5} />

    <T x={28} y={226} size={12} weight={500}>
      B · The same words, after a little story
    </T>
    <rect x={28} y={236} width={344} height={72} rx={8} fill={C.surface} stroke={C.line} strokeWidth={1.5} />
    <T x={42} y={255} size={12} italic fill={C.ink2}>
      I’ve been up since five. The match starts at
    </T>
    <T x={42} y={272} size={12} italic fill={C.ink2}>
      eight, my boots are still in the car, and the
    </T>
    <T x={42} y={289} size={12} italic fill={C.ink2}>
      bus is already late.{' '}
      <tspan fill={C.ink} fontStyle="normal" fontWeight={500}>
        I’m going to …
      </tspan>
    </T>
    <Bars rows={SHARP} y={322} hot />
    <T x={100} y={437} size={11} italic fill={C.ink3}>
      A few continuations now stand out.
    </T>
  </Svg>
);

/* ------------------------------------------------------------------ */
/* 6 and 7. Context strips: what each student's answer is written from */
/* ------------------------------------------------------------------ */

/** A block in a strip: one stretch of the context the model is reading. */
const Block: React.FC<{
  x: number;
  y?: number;
  w: number;
  h?: number;
  label?: string;
  kind: 'question' | 'scratch' | 'draft' | 'answer';
  size?: number;
}> = ({ x, y = 0, w, h = 34, label, kind, size = 12 }) => {
  const style = {
    question: { fill: C.surface, stroke: C.line, dash: undefined, text: C.ink2 },
    scratch: { fill: C.white, stroke: C.ink3, dash: '4 3', text: C.ink2 },
    draft: { fill: C.surface2, stroke: C.ink3, dash: undefined, text: C.ink },
    answer: { fill: C.redSoft, stroke: C.red, dash: undefined, text: C.red },
  }[kind];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={style.fill} stroke={style.stroke} strokeWidth={1.5} strokeDasharray={style.dash} />
      {label ? (
        <T x={x + w / 2} y={y + h / 2 + size * 0.35} size={size} weight={500} fill={style.text} anchor="middle">
          {label}
        </T>
      ) : null}
    </g>
  );
};

export const ScratchPaper: React.FC = () => {
  const p = 'scr';
  return (
    <Svg
      viewBox="0 0 400 250"
      label="Two students and what each answer is written from. Student A writes the answer from the question alone. Student B first writes scratch work, then writes the answer with both the question and the scratch work in view."
    >
      <ArrowDefs prefix={p} />

      <T x={28} y={18} size={13} weight={500}>
        Student A answers at once
      </T>
      <Block x={28} y={30} w={130} kind="question" label="Question" />
      <Block x={166} y={30} w={130} kind="answer" label="Answer" />
      <Arrow prefix={p} d="M231 68 C231 92 93 92 93 70" />
      <T x={28} y={110} size={11.5} fill={C.ink2}>
        The answer is predicted from the question alone.
      </T>

      <T x={28} y={146} size={13} weight={500}>
        Student B writes scratch work first
      </T>
      <Block x={28} y={158} w={86} kind="question" label="Question" />
      <Block x={120} y={158} w={152} kind="scratch" />
      <Scribble x={134} y={170} w={124} lines={2} gap={11} />
      <Block x={278} y={158} w={94} kind="answer" label="Answer" />
      <Arrow prefix={p} d="M325 196 C325 220 71 220 71 198" />
      <T x={28} y={241} size={11.5} fill={C.ink2}>
        Predicted from the question and the reasoning.
      </T>
    </Svg>
  );
};

export const SecondStudent: React.FC = () => {
  const p = 'two';
  return (
    <Svg
      viewBox="0 0 400 252"
      label="Two students in a row. The first student reads the question, writes scratch work and produces a draft. The second student starts from the question and that draft, writes scratch work about what is wrong or missing, and produces an improved answer."
    >
      <ArrowDefs prefix={p} />

      <T x={28} y={16} size={13} weight={500}>
        Student 1
      </T>
      <Block x={28} y={26} w={76} kind="question" label="Question" />
      <Block x={110} y={26} w={134} kind="scratch" />
      <Scribble x={124} y={38} w={106} lines={2} gap={11} />
      <Block x={250} y={26} w={122} kind="draft" label="Draft" />

      <Arrow prefix={p} d="M311 64 C311 96 125 84 125 118" />
      <T x={218} y={95} size={11} fill={C.ink3} anchor="middle">
        hands over the draft
      </T>

      <T x={28} y={110} size={13} weight={500}>
        Student 2
      </T>
      <Block x={28} y={122} w={62} kind="question" label="Question" size={11.5} />
      <Block x={94} y={122} w={62} kind="draft" label="Draft" size={11.5} />
      <Block x={160} y={122} w={134} kind="scratch" />
      <T x={227} y={137} size={11} italic fill={C.ink2} anchor="middle">
        What is wrong?
      </T>
      <T x={227} y={151} size={11} italic fill={C.ink2} anchor="middle">
        What is missing?
      </T>
      <Block x={298} y={122} w={74} kind="answer" label="Improved" size={11.5} />

      <T x={28} y={190} size={11.5} fill={C.ink2}>
        Student 1’s scratch paper works out how to create an answer.
      </T>
      <T x={28} y={207} size={11.5} fill={C.ink2}>
        Student 2’s works out how to make an existing one better.
      </T>
      <T x={28} y={231} size={11.5} fill={C.ink3} italic>
        Flaws that slipped past while writing are easier to spot while reading.
      </T>
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* 8. Many differently taught students, pick the best, improve it      */
/* ------------------------------------------------------------------ */

const SCHOOLS = ['A', 'B', 'C', 'D', 'E'];
const SCORES = [18, 24, 12, 34, 22];
const BEST = 3;

export const ManyStudents: React.FC = () => {
  const p = 'many';
  const cx = (i: number) => 48 + i * 76;
  return (
    <Svg
      viewBox="0 0 400 372"
      label="Five students from five different schools attempt the same task. Each attempt is scored. The strongest draft, from school D, is handed to a second student, who reasons about how to improve it and writes the final answer."
    >
      <ArrowDefs prefix={p} />

      <T x={200} y={14} size={12} weight={500} anchor="middle">
        Same task, five differently taught students
      </T>

      {SCHOOLS.map((s, i) => (
        <g key={s}>
          <Student cx={cx(i)} top={24} fill={i === BEST ? C.red : C.ink2} scale={0.95} />
          <T x={cx(i)} y={68} size={10.5} fill={C.ink3} anchor="middle">
            School {s}
          </T>
          <rect x={cx(i) - 18} y={76} width={36} height={44} rx={5} fill={C.white} stroke={i === BEST ? C.red : C.ink3} strokeWidth={i === BEST ? 2 : 1.5} />
          <line x1={cx(i) - 11} y1={88} x2={cx(i) + 11} y2={88} stroke={C.line} strokeWidth={2} />
          <line x1={cx(i) - 11} y1={97} x2={cx(i) + 11} y2={97} stroke={C.line} strokeWidth={2} />
          <line x1={cx(i) - 11} y1={106} x2={cx(i) + 3} y2={106} stroke={C.line} strokeWidth={2} />
          <rect x={cx(i) - 18} y={128} width={36} height={6} rx={3} fill={C.surface2} />
          <rect x={cx(i) - 18} y={128} width={SCORES[i]} height={6} rx={3} fill={i === BEST ? C.red : C.ink3} />
        </g>
      ))}
      <T x={200} y={152} size={11} fill={C.ink3} anchor="middle">
        each attempt is scored
      </T>

      {SCHOOLS.map((s, i) => (
        <path
          key={s}
          d={`M${cx(i)} 160 L200 184`}
          fill="none"
          stroke={i === BEST ? C.red : C.line}
          strokeWidth={i === BEST ? 2 : 1.5}
        />
      ))}
      <rect x={110} y={184} width={180} height={30} rx={9} fill={C.white} stroke={C.red} strokeWidth={1.5} />
      <T x={200} y={203} size={12.5} weight={500} anchor="middle">
        Keep the strongest draft
      </T>

      <Arrow prefix={p} d="M200 217 L200 234" color="r" width={1.8} />

      <rect x={28} y={238} width={344} height={66} rx={12} fill={C.surface} stroke={C.line} strokeWidth={1.5} />
      <Student cx={66} top={252} fill={C.ink2} scale={1.1} />
      <T x={100} y={262} size={13} weight={500}>
        Second student
      </T>
      <T x={100} y={279} size={11.5} fill={C.ink2}>
        starts from the best draft and reasons
      </T>
      <T x={100} y={294} size={11.5} fill={C.ink2}>
        about how to make it better
      </T>

      <Arrow prefix={p} d="M200 307 L200 322" color="r" width={1.8} />
      <rect x={110} y={326} width={180} height={34} rx={10} fill={C.redSoft} stroke={C.red} strokeWidth={1.5} />
      <T x={200} y={348} size={14} weight={600} anchor="middle" fill={C.red}>
        Final answer
      </T>
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* 9. The ladder                                                       */
/* ------------------------------------------------------------------ */

const RUNGS: { title: string[]; dots: number; scratch: boolean }[] = [
  { title: ['Answer', 'at once'], dots: 1, scratch: false },
  { title: ['Think', 'first'], dots: 1, scratch: true },
  { title: ['Draft, then', 'improve'], dots: 2, scratch: true },
  { title: ['Many drafts,', 'keep the best,', 'improve it'], dots: 5, scratch: true },
];

export const IdeaLadder: React.FC = () => {
  const p = 'lad';
  const base = 236;
  return (
    <Svg
      viewBox="0 0 400 290"
      label="A four-step ladder. Step one, answer at once. Step two, think first. Step three, draft then improve. Step four, many drafts, keep the best, then improve it. Each step adds something and costs more tokens and time."
    >
      <ArrowDefs prefix={p} />
      {RUNGS.map((r, i) => {
        const x = 28 + i * 87;
        const h = 44 + i * 40;
        const top = base - h;
        const last = i === RUNGS.length - 1;
        return (
          <g key={r.title.join('')}>
            <rect
              x={x}
              y={top}
              width={82}
              height={h}
              rx={8}
              fill={last ? C.redSoft : C.surface}
              stroke={last ? C.red : C.line}
              strokeWidth={1.5}
            />
            <T x={x + 10} y={top + 20} size={13} weight={600} fill={last ? C.red : C.ink} mono>
              {i + 1}
            </T>
            {Array.from({ length: r.dots }).map((_, d) => (
              <circle key={d} cx={x + 14 + d * 13} cy={base - 14} r={4.5} fill={last ? C.red : C.ink2} />
            ))}
            {r.scratch ? (
              <rect x={x + 10} y={base - 38} width={30} height={10} rx={3} fill="none" stroke={C.ink3} strokeWidth={1.2} strokeDasharray="3 2" />
            ) : null}
            {r.title.map((line, k) => (
              <T
                key={line}
                x={x + 2}
                y={top - 8 - (r.title.length - 1 - k) * 14}
                size={11.5}
                weight={500}
                fill={last ? C.red : C.ink}
              >
                {line}
              </T>
            ))}
          </g>
        );
      })}
      <line x1={28} y1={base + 6} x2={372} y2={base + 6} stroke={C.ink3} strokeWidth={1.5} markerEnd={`url(#${p}-g)`} />
      <T x={200} y={266} size={11.5} fill={C.ink3} anchor="middle">
        more tokens written, more time spent
      </T>
    </Svg>
  );
};
