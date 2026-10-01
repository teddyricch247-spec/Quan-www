import * as THREE from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import {
  BRAND_GRID,
  BRAND_RED,
  applyStudioEnvironment,
  backOut,
  clamp01,
  createLoop,
  createRenderer,
  disposeRenderer,
  disposeTree,
  linear,
  measure,
  power2In,
  power2InOut,
  power2Out,
  power3InOut,
  watchContext,
  type Loop,
  type SceneHandle,
  type SceneOptions,
} from './runtime';

/* ============================================================
   QUAN CHAT — "Ask Anything."

   The real composer floating in 3D: a title and the brand mark in
   cubes, then a prompt is typed, sent, Kael thinks, and answers.
   ~13 s loop. The UI is real DOM rendered by CSS3DRenderer (so the
   type is crisp at any size); the cubes are WebGL.

   Ported from the dev's standalone demo. Changes:
   - sized from its container (the demo hard-coded a 9:18 phone-
     shaped stage sized from the viewport), camera now fits the
     content to any container shape
   - the GSAP timeline is rewritten as pure functions of time (no
     dependency, no timers; pauses with the scene, freezes for
     reduced motion)
   - CSS is scoped under .qcs-* and injected once (the demo's `.title`,
     `.dot`, `.controls` etc. would leak into the site)
   - cube logo is the real brand mark; palette uses the site tokens;
     type inherits the site's Inter
   - the "deep reasoning" toggle lights up while the prompt is typed,
     mirroring the real composer
   - prompt/reply are options (the demo's were a joke prompt and a
     file chip, which implied abilities Chat may not have)
   ============================================================ */

const PLACEHOLDER = 'Ask Quancis Anything…';
const DEFAULT_PROMPT = 'Why is my API call returning a 401?';
const DEFAULT_REPLY = 'Your key needs the Bearer prefix.';

const UI_WIDTH = 500;
const GAP = 12;
const PUSH_FRACTION = 0.1; // how far the UI leans toward the camera while Kael thinks (fraction of the fitted distance)

const CUBE = 24;
const CUBE_GAP = 3;
const PITCH = CUBE + CUBE_GAP;
const LOGO_SPAN = 4 * PITCH - CUBE_GAP;

/** Key moments, in seconds. Loop is seamless: t=0 and t=LOOP are the same picture. */
const T = {
  exit0: 1.5, // title + cubes fade out
  exit1: 2.1,
  type0: 2.1, // typing starts
  type1: 3.9,
  send: 3.9,
  think: 4.85, // UI leans in, thinking dots
  respond: 7.5, // Kael answers
  reset: 10.65, // conversation clears
  silent: 12.05, // text swaps back to the placeholder while invisible
  in0: 12.15, // title + cubes return
  in1: 12.95,
  loop: 12.95,
  still: 0.6, // reduced motion: the "Ask Anything." opening frame
} as const;

/* ------------------------------------------------------------
   Timeline tracks (the GSAP timeline, as pure functions of time)
   ------------------------------------------------------------ */
type Ease = (t: number) => number;
interface Seg {
  t0: number;
  t1: number;
  to: number;
  ease: Ease;
}
const seg = (t0: number, t1: number, to: number, ease: Ease = linear): Seg => ({ t0, t1, to, ease });
const set = (t: number, to: number): Seg => ({ t0: t, t1: t, to, ease: linear });

/** A value that starts at `initial` and glides through `segs` (in time order). */
function track(initial: number, segs: Seg[]): (t: number) => number {
  return (t) => {
    let v = initial;
    for (let i = 0; i < segs.length; i++) {
      const s = segs[i];
      if (t < s.t0) return v;
      if (t < s.t1) return v + (s.to - v) * s.ease((t - s.t0) / (s.t1 - s.t0));
      v = s.to;
    }
    return v;
  };
}

const BACK = backOut(1.7);

function buildTracks(shiftThink: number, shiftReply: number) {
  return {
    titleO: track(1, [seg(T.exit0, T.exit1, 0, power2InOut), seg(T.in0, T.in1, 1, power2Out)]),
    titleY: track(0, [seg(T.exit0, T.exit1, -26, power2InOut), seg(T.in0, T.in1, 0, power2Out)]),
    logoO: track(1, [seg(T.exit0, T.exit1, 0, power2InOut), seg(T.in0, T.in1, 1, power2Out)]),
    typedO: track(1, [seg(4.0, 4.28, 0, power2Out), seg(T.in0, T.in1, 1, power2Out)]),
    cursorO: track(0, [set(T.type0, 1), seg(T.send, T.send + 0.15, 0, linear)]),
    sendS: track(1, [seg(T.send, T.send + 0.12, 0.85, power2InOut), seg(T.send + 0.12, T.send + 0.24, 1, power2InOut)]),

    userO: track(0, [seg(4.12, 4.67, 1, BACK), seg(T.reset, T.reset + 0.5, 0, power2In)]),
    userY: track(40, [
      seg(4.12, 4.67, 0, BACK),
      seg(5.1, 5.65, -shiftThink, power2InOut),
      seg(T.respond, T.respond + 0.4, -shiftReply, power2InOut),
      seg(T.reset, T.reset + 0.5, -shiftReply - 28, power2In),
      set(T.silent, 40),
    ]),
    userS: track(0.85, [seg(4.12, 4.67, 1, BACK), set(T.silent, 0.85)]),

    thinkO: track(0, [seg(5.35, 5.85, 1, BACK), seg(T.respond, T.respond + 0.22, 0, power2In)]),
    thinkY: track(40, [seg(5.35, 5.85, 0, BACK), set(T.silent, 40)]),
    thinkS: track(0.85, [seg(5.35, 5.85, 1, BACK), seg(T.respond, T.respond + 0.22, 0.85, power2In)]),

    replyO: track(0, [seg(7.6, 8.15, 1, BACK), seg(T.reset, T.reset + 0.5, 0, power2In)]),
    replyY: track(40, [seg(7.6, 8.15, 0, BACK), seg(T.reset, T.reset + 0.5, -28, power2In), set(T.silent, 40)]),
    replyS: track(0.85, [seg(7.6, 8.15, 1, BACK), set(T.silent, 0.85)]),

    uiZ: track(0, [seg(T.think, T.think + 1.3, 1, power3InOut), seg(T.reset + 0.1, T.reset + 1.5, 0, power3InOut)]),
    uiRX: track(0, [seg(T.think, T.think + 1.3, 0.1, power3InOut), seg(T.reset + 0.1, T.reset + 1.5, 0, power3InOut)]),
    uiRY: track(0, [seg(T.think, T.think + 1.3, -0.05, power3InOut), seg(T.reset + 0.1, T.reset + 1.5, 0, power3InOut)]),
  };
}

/* ------------------------------------------------------------
   Scoped styles, injected once and removed with the last scene
   ------------------------------------------------------------ */
const STYLE_ID = 'qcs-styles';
let styleRefs = 0;

const CSS = `
.qcs-root{position:absolute;inset:0;overflow:hidden;pointer-events:none;color:#16181A;font-family:inherit;-webkit-font-smoothing:antialiased;user-select:none;-webkit-user-select:none}
.qcs-root.qcs-paused *{animation-play-state:paused !important}
.qcs-ui{width:${UI_WIDTH}px;display:flex;flex-direction:column;align-items:center;transform-style:preserve-3d;pointer-events:none}
.qcs-title{font-size:64px;font-weight:600;letter-spacing:-0.035em;line-height:1.05;text-align:center;margin:0 0 40px;white-space:nowrap;will-change:transform,opacity}
.qcs-box{position:relative;width:100%;background:#fff;border-radius:34px;border:1px solid rgba(22,24,26,0.06);box-shadow:0 10px 40px rgba(22,24,26,0.09),0 2px 10px rgba(22,24,26,0.04);padding:28px;display:flex;flex-direction:column;gap:24px}
.qcs-zone{position:absolute;left:28px;right:28px;bottom:100%;height:0}
.qcs-row{position:absolute;left:0;right:0;bottom:22px;display:flex;opacity:0;will-change:transform,opacity;transform-origin:center bottom;backface-visibility:hidden}
.qcs-row-user{justify-content:flex-end}
.qcs-row-kael{justify-content:flex-start}
.qcs-bubble{max-width:88%;padding:14px 22px;border-radius:24px;font-size:17px;font-weight:500;letter-spacing:-0.01em;line-height:1.3;display:flex;align-items:center;gap:12px;white-space:nowrap;box-shadow:0 8px 28px rgba(22,24,26,0.10);min-height:54px}
.qcs-user{background:#EDEDEA;color:#16181A;border-bottom-right-radius:6px}
.qcs-kael{background:#16181A;color:#fff;border-bottom-left-radius:6px}
.qcs-thinking{background:#16181A;width:74px;padding:0;gap:5px;justify-content:center;border-bottom-left-radius:6px}
.qcs-dot{width:6px;height:6px;border-radius:50%;background:#fff;animation:qcs-bounce 1.3s infinite ease-in-out both}
.qcs-dot:nth-child(1){animation-delay:-0.26s}
.qcs-dot:nth-child(2){animation-delay:-0.13s}
.qcs-dot:nth-child(3){animation-delay:0s}
@keyframes qcs-bounce{0%,80%,100%{transform:scale(0.4);opacity:0.45}40%{transform:scale(1);opacity:1}}
.qcs-file{width:26px;height:26px;border-radius:8px;flex:0 0 auto;background:rgba(255,255,255,0.16);display:flex;align-items:center;justify-content:center}
.qcs-file svg{width:14px;height:14px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.qcs-placeholder{font-size:20px;font-weight:400;letter-spacing:-0.01em;height:26px;display:flex;align-items:center;padding-left:2px;white-space:nowrap;overflow:hidden;color:#16181A;will-change:opacity}
.qcs-muted{color:#949AA1}
.qcs-cursor-wrap{display:inline-flex;align-items:center;margin-left:3px;opacity:0}
.qcs-cursor{display:inline-block;width:2px;height:1.05em;border-radius:1px;background:#16181A;animation:qcs-blink 1s step-end infinite}
@keyframes qcs-blink{0%,100%{opacity:1}50%{opacity:0}}
.qcs-controls{display:flex;justify-content:space-between;align-items:center}
.qcs-icons{display:flex;gap:14px}
.qcs-icon{width:46px;height:46px;border-radius:50%;border:1px solid rgba(22,24,26,0.09);background:#fff;display:flex;align-items:center;justify-content:center;color:#5C6167;transition:color .35s ease,background-color .35s ease,border-color .35s ease}
.qcs-icon.qcs-on{color:#D88A3B;background:#FDF4EA;border-color:#F3D8B0}
.qcs-icon svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.qcs-send{width:50px;height:50px;border-radius:50%;background:#16181A;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 14px rgba(22,24,26,0.22);will-change:transform}
.qcs-send svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
@media (prefers-reduced-motion:reduce){.qcs-root *{animation:none !important}}
`;

function acquireStyles(): void {
  if (styleRefs++ === 0 && !document.getElementById(STYLE_ID)) {
    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }
}
function releaseStyles(): void {
  if (--styleRefs <= 0) {
    styleRefs = 0;
    document.getElementById(STYLE_ID)?.remove();
  }
}

const FILE_ICON =
  '<span class="qcs-file"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>';

const MARKUP = `
<div class="qcs-ui">
  <div class="qcs-title">Ask Anything.</div>
  <div class="qcs-box">
    <div class="qcs-zone">
      <div class="qcs-row qcs-row-user" data-e="user"><div class="qcs-bubble qcs-user"><span data-e="userText"></span></div></div>
      <div class="qcs-row qcs-row-kael" data-e="think"><div class="qcs-bubble qcs-thinking"><span class="qcs-dot"></span><span class="qcs-dot"></span><span class="qcs-dot"></span></div></div>
      <div class="qcs-row qcs-row-kael" data-e="reply"><div class="qcs-bubble qcs-kael" data-e="replyBubble"><span data-e="replyText"></span></div></div>
    </div>
    <div class="qcs-placeholder"><span class="qcs-muted" data-e="typed"></span><span class="qcs-cursor-wrap" data-e="cursor"><span class="qcs-cursor"></span></span></div>
    <div class="qcs-controls">
      <div class="qcs-icons">
        <div class="qcs-icon" data-e="reason"><svg viewBox="0 0 24 24"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z"/><path d="M19 3L19.5 5.5L22 6L19.5 6.5L19 9L18.5 6.5L16 6L18.5 5.5Z"/></svg></div>
        <div class="qcs-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg></div>
      </div>
      <div class="qcs-send" data-e="send"><svg viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg></div>
    </div>
  </div>
</div>`;

export function createChatComposer(container: HTMLElement, opts: SceneOptions): SceneHandle {
  const prompt = opts.prompt && opts.prompt.trim() ? opts.prompt.trim() : DEFAULT_PROMPT;
  const reply = opts.reply && opts.reply.trim() ? opts.reply.trim() : DEFAULT_REPLY;
  let disposed = false;

  /* ---------- renderer first: if WebGL is unavailable this throws before
     anything has been added to the page ---------- */
  const root = document.createElement('div');
  root.className = 'qcs-root qcs-paused';
  root.setAttribute('aria-hidden', 'true');
  const gl = createRenderer(root, 2);
  const unwatch = watchContext(gl, () => opts.onError?.(new Error('WebGL context lost')));

  /* ---------- DOM ---------- */
  acquireStyles();
  container.appendChild(root);

  const ui = document.createElement('div');
  ui.innerHTML = MARKUP.trim();
  const uiEl = ui.firstElementChild as HTMLElement;
  const q = <E extends HTMLElement>(name: string): E => uiEl.querySelector(`[data-e="${name}"]`) as E;
  const els = {
    title: uiEl.querySelector('.qcs-title') as HTMLElement,
    typed: q('typed'),
    cursor: q('cursor'),
    send: q('send'),
    reason: q('reason'),
    user: q('user'),
    think: q('think'),
    reply: q('reply'),
    thinkBubble: q('think').firstElementChild as HTMLElement,
    replyBubble: q('replyBubble'),
  };
  q('userText').textContent = prompt;
  q('replyText').textContent = reply;
  if (opts.replyAsFile) els.replyBubble.insertAdjacentHTML('afterbegin', FILE_ICON);

  /* ---------- renderers ---------- */
  gl.domElement.style.zIndex = '1';
  const css = new CSS3DRenderer();
  css.domElement.style.cssText += ';position:absolute;inset:0;z-index:2;pointer-events:none;';
  root.appendChild(css.domElement);
  // Lay the UI out now so its real height can be measured before first render.
  css.domElement.appendChild(uiEl);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 10, 6000);
  const disposeEnv = applyStudioEnvironment(gl, scene);

  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(260, 430, 620);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 0.8);
  rim.position.set(-380, 250, 180);
  scene.add(rim);

  /* ---------- the brand mark, in cubes ---------- */
  const logoGroup = new THREE.Group();
  scene.add(logoGroup);
  const cubeMat = (color: number | string, rough: number) =>
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      roughness: rough,
      metalness: 0,
      clearcoat: 0.9,
      clearcoatRoughness: 0.25,
      transparent: true,
      opacity: 1,
      envMapIntensity: 0.8,
    });
  const mats = { x: cubeMat(0x16181a, 0.28), '.': cubeMat(0xf6f6f3, 0.28), R: cubeMat(BRAND_RED, 0.22) } as const;
  const cubeGeo = new THREE.BoxGeometry(CUBE, CUBE, CUBE);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const ch = BRAND_GRID[r][c] as 'x' | '.' | 'R';
      const cube = new THREE.Mesh(cubeGeo, mats[ch]);
      cube.position.set(c * PITCH - (LOGO_SPAN - CUBE) / 2, -r * PITCH + (LOGO_SPAN - CUBE) / 2, 0);
      logoGroup.add(cube);
    }
  }
  const logoMats = [mats.x, mats['.'], mats.R];

  const uiObject = new CSS3DObject(uiEl);
  uiEl.style.pointerEvents = 'none'; // CSS3DObject sets 'auto'; this layer is decorative
  scene.add(uiObject);

  /* ---------- measuring + framing ---------- */
  let tracks = buildTracks(54 + GAP, 54 + GAP);
  let logoBaseY = 0;
  let pushZ = 100;

  const measureBubbles = () => {
    const hThink = els.thinkBubble.offsetHeight || 54;
    const hReply = els.replyBubble.offsetHeight || 54;
    tracks = buildTracks(hThink + GAP, hReply + GAP);
  };

  const applySize = () => {
    const { w, h } = measure(container);
    gl.setSize(w, h, false);
    css.setSize(w, h);
    camera.aspect = w / h;

    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const wrapperH = uiEl.offsetHeight || 265;
    logoBaseY = wrapperH / 2 + 34 + LOGO_SPAN / 2;

    // Content bounds at rest: input box bottom → top of the cubes (+ float).
    const topY = wrapperH / 2 + 34 + LOGO_SPAN + 8;
    const botY = -wrapperH / 2 - 6;
    const contentH = topY - botY;
    const cy = (topY + botY) / 2 - contentH * 0.04;

    // Fit both axes at the *leaned-in* depth, then back the camera off by
    // the push distance. At rest the UI sits ~10% smaller; while Kael
    // thinks it leans in to exactly the fitted size and never clips.
    const fillW = w < 520 ? 0.93 : 0.9;
    const fillH = 0.92;
    const dW = UI_WIDTH / fillW / (2 * tanHalf * camera.aspect);
    const dH = contentH / fillH / (2 * tanHalf);
    const fit = Math.max(dW, dH);
    pushZ = fit * PUSH_FRACTION;
    camera.position.set(0, cy, fit + pushZ);
    camera.updateProjectionMatrix();
  };

  /* ---------- per-frame DOM writes (only when something changed) ---------- */
  const lastStyle = new Map<HTMLElement, string>();
  const place = (el: HTMLElement, o: number, y: number, s: number) => {
    const sig = `${o.toFixed(3)}|${y.toFixed(2)}|${s.toFixed(3)}`;
    if (lastStyle.get(el) === sig) return;
    lastStyle.set(el, sig);
    el.style.opacity = String(clamp01(o));
    el.style.transform = `translate3d(0,${y}px,0) scale(${s})`;
  };
  let lastTyped = '\u0000';
  let lastMuted: boolean | null = null;
  let lastReason: boolean | null = null;
  let lastCursor = -1;
  let lastTypedO = -1;
  let lastSend = -1;

  const frame = (time: number) => {
    const tl = time % T.loop;

    /* title + cubes */
    place(els.title, tracks.titleO(tl), tracks.titleY(tl), 1);
    const logoO = clamp01(tracks.logoO(tl));
    for (let i = 0; i < logoMats.length; i++) logoMats[i].opacity = logoO;
    logoGroup.visible = logoO > 0.002;
    logoGroup.position.set(0, logoBaseY + Math.sin(time * 1.4) * 5.5, 40);
    logoGroup.rotation.set(Math.cos(time * 0.9) * 0.06, Math.sin(time * 0.7) * 0.12, 0);

    /* composer text */
    let text = PLACEHOLDER;
    let muted = true;
    if (tl >= T.type0 && tl < T.silent) {
      const n = Math.round(prompt.length * clamp01((tl - T.type0) / (T.type1 - T.type0)));
      text = prompt.slice(0, n);
      muted = false;
    }
    if (text !== lastTyped) {
      els.typed.textContent = text;
      lastTyped = text;
    }
    if (muted !== lastMuted) {
      els.typed.classList.toggle('qcs-muted', muted);
      lastMuted = muted;
    }
    const typedO = clamp01(tracks.typedO(tl));
    if (typedO !== lastTypedO) {
      (els.typed.parentElement as HTMLElement).style.opacity = String(typedO);
      lastTypedO = typedO;
    }
    const cursorO = clamp01(tracks.cursorO(tl));
    if (cursorO !== lastCursor) {
      els.cursor.style.opacity = String(cursorO);
      lastCursor = cursorO;
    }
    const reasonOn = tl >= T.type0 && tl < T.silent;
    if (reasonOn !== lastReason) {
      els.reason.classList.toggle('qcs-on', reasonOn);
      lastReason = reasonOn;
    }
    const sendS = tracks.sendS(tl);
    if (sendS !== lastSend) {
      els.send.style.transform = `scale(${sendS})`;
      lastSend = sendS;
    }

    /* conversation */
    place(els.user, tracks.userO(tl), tracks.userY(tl), tracks.userS(tl));
    place(els.think, tracks.thinkO(tl), tracks.thinkY(tl), tracks.thinkS(tl));
    place(els.reply, tracks.replyO(tl), tracks.replyY(tl), tracks.replyS(tl));

    /* the whole UI leans in while Kael thinks */
    uiObject.position.z = tracks.uiZ(tl) * pushZ;
    uiObject.rotation.set(tracks.uiRX(tl), tracks.uiRY(tl), 0);

    gl.render(scene, camera);
    css.render(scene, camera);
  };

  const loop: Loop = createLoop({
    renderer: gl,
    frame,
    reducedMotion: opts.reducedMotion,
    stillTime: T.still,
    onPixelRatioChange: () => {
      applySize();
      loop.redraw();
    },
    onFirstFrame: opts.onReady,
    onError: opts.onError,
  });

  measureBubbles();
  applySize();

  // Real font metrics change the bubble heights slightly: measure again.
  if ('fonts' in document) {
    void document.fonts.ready.then(() => {
      if (disposed) return;
      measureBubbles();
      applySize();
      loop.redraw();
    });
  }

  return {
    setActive: (active) => {
      root.classList.toggle('qcs-paused', !active);
      loop.setActive(active);
    },
    resize: () => {
      applySize();
      loop.redraw();
    },
    dispose: () => {
      disposed = true;
      loop.dispose();
      unwatch();
      disposeEnv();
      disposeTree(scene);
      lastStyle.clear();
      disposeRenderer(gl);
      root.parentNode?.removeChild(root);
      releaseStyles();
    },
  };
}
