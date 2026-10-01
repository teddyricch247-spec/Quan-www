import * as THREE from 'three';
import {
  clamp01,
  createLoop,
  createRenderer,
  disposeRenderer,
  disposeTree,
  drawBrandMark,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  hash01,
  measure,
  mulberry32,
  preloadFonts,
  siteFonts,
  watchContext,
  type Loop,
  type SceneHandle,
  type SceneOptions,
} from './runtime';

/* ============================================================
   QUAN HARNESS — "task in, shipped out"

   A modelled laptop with a working keyboard. A task is typed, the
   agent thinks, edits four files (a live diff streams across the
   screen), and reports back. ~20 s loop.

   Ported from the dev's standalone demo. Changes:
   - sized from its container (was window.innerWidth/innerHeight,
     appended to <body>), transparent background so it sits on the
     page instead of a hard-coded white
   - the `while (true)` async show (setTimeout sleeps, no way to
     stop it) is now a deterministic timeline: every state is a pure
     function of time, so it pauses with the scene, never leaks
     timers, and can be frozen for reduced motion
   - emblem + screen logo are the real brand mark (the demo drew a
     3x3 checkerboard in a different red)
   - screen text uses the site's own Inter / JetBrains Mono
   - screen redraw is capped at ~45 Hz (the camera still runs at
     full rate) and key/label geometry + materials are shared
   ============================================================ */

const CFG = {
  stillBackdrop: 0.2, // reduced motion: seconds after the diff finishes
  screenHz: 45,
} as const;

const DEFAULT_PROMPT = 'find and fix all the bugs, make no mistakes';

const SCRIPT: { t: string; s: string }[] = [
  { t: 'meta', s: '▸ Quan Harness · scanning workspace' },
  { t: 'meta', s: '  47 files indexed · 4 issues found' },
  { t: 'gap', s: '' },
  { t: 'file', s: 'src/api/client.js' },
  { t: 'del', s: '-  if (res.data = null) return;' },
  { t: 'add', s: '+  if (res.data === null) return;' },
  { t: 'ok', s: '✓  assignment in condition → strict equality' },
  { t: 'gap', s: '' },
  { t: 'file', s: 'src/utils/date.js' },
  { t: 'del', s: '-  const d = new Date(str);' },
  { t: 'add', s: "+  const d = new Date(str.replace(' ', 'T'));" },
  { t: 'ok', s: '✓  timezone-safe parsing on Safari' },
  { t: 'gap', s: '' },
  { t: 'file', s: 'src/ui/List.jsx' },
  { t: 'del', s: '-  items.map((it, i) => <Row key={i} />)' },
  { t: 'add', s: '+  items.map(it => <Row key={it.id} />)' },
  { t: 'ok', s: '✓  stable keys — no more remounts' },
  { t: 'gap', s: '' },
  { t: 'file', s: 'src/state/store.js' },
  { t: 'del', s: '-  state.items.push(next);' },
  { t: 'add', s: '+  state.items = [...state.items, next];' },
  { t: 'ok', s: '✓  immutable update — memoization restored' },
  { t: 'gap', s: '' },
  { t: 'done', s: '✓  All bugs fixed · 0 errors · tests passing' },
];

const TOTAL_CODE_CHARS = SCRIPT.reduce((a, l) => a + l.s.length, 0);

const STYLE: Record<string, { color: string; weight: string }> = {
  meta: { color: '#7d8590', weight: '400' },
  gap: { color: '#7d8590', weight: '400' },
  file: { color: '#79c0ff', weight: '600' },
  del: { color: '#ff8b82', weight: '400' },
  add: { color: '#7ee787', weight: '400' },
  ok: { color: '#3fb950', weight: '400' },
  done: { color: '#3fb950', weight: '600' },
};

/* ------------------------------------------------------------
   Canvas + geometry helpers
   ------------------------------------------------------------ */
function rr(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function roundedBox(w: number, h: number, d: number, r: number, seg = 3): THREE.BufferGeometry {
  r = Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4);
  const g = new THREE.BoxGeometry(w, h, d, seg, seg, seg);
  const pos = g.attributes.position;
  const nrm = g.attributes.normal;
  const hw = w / 2 - r;
  const hh = h / 2 - r;
  const hd = d / 2 - r;
  const v = new THREE.Vector3();
  const c = new THREE.Vector3();
  const n = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    c.set(Math.max(-hw, Math.min(hw, v.x)), Math.max(-hh, Math.min(hh, v.y)), Math.max(-hd, Math.min(hd, v.z)));
    n.copy(v).sub(c);
    if (n.lengthSq() > 1e-10) {
      n.normalize();
      v.copy(c).addScaledVector(n, r);
      pos.setXYZ(i, v.x, v.y, v.z);
      nrm.setXYZ(i, n.x, n.y, n.z);
    }
  }
  pos.needsUpdate = true;
  nrm.needsUpdate = true;
  return g;
}

function makeShadowTexture(inner: number, mid: number): THREE.CanvasTexture {
  const S = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const x = cv.getContext('2d')!;
  const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0.0, `rgba(0,0,0,${inner})`);
  g.addColorStop(0.38, `rgba(0,0,0,${mid})`);
  g.addColorStop(0.7, 'rgba(0,0,0,0.06)');
  g.addColorStop(1.0, 'rgba(0,0,0,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, S, S);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeGlassTexture(): THREE.CanvasTexture {
  const S = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const x = cv.getContext('2d')!;
  const g = x.createLinearGradient(0, 0, S, S);
  g.addColorStop(0.0, 'rgba(255,255,255,0.13)');
  g.addColorStop(0.3, 'rgba(255,255,255,0.035)');
  g.addColorStop(0.55, 'rgba(255,255,255,0)');
  g.addColorStop(1.0, 'rgba(255,255,255,0.05)');
  x.fillStyle = g;
  x.fillRect(0, 0, S, S);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeEmblemTexture(): THREE.CanvasTexture {
  const S = 128;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  drawBrandMark(cv.getContext('2d')!, 8, 8, S - 16, '#2b3138');
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/* ------------------------------------------------------------
   Keyboard layout
   ------------------------------------------------------------ */
const U = 0.34;
const KEY_H = 0.09;
const KB_X0 = -2.55;
const KB_Z0 = -1.75;

interface KeySpec {
  l: string;
  w: number;
  noLabel?: boolean;
}
const ROWS: KeySpec[][] = [
  [
    { l: '`', w: 1 }, { l: '1', w: 1 }, { l: '2', w: 1 }, { l: '3', w: 1 }, { l: '4', w: 1 }, { l: '5', w: 1 },
    { l: '6', w: 1 }, { l: '7', w: 1 }, { l: '8', w: 1 }, { l: '9', w: 1 }, { l: '0', w: 1 }, { l: '-', w: 1 },
    { l: '=', w: 1 }, { l: '⌫', w: 2 },
  ],
  [
    { l: 'Tab', w: 1.5 }, { l: 'Q', w: 1 }, { l: 'W', w: 1 }, { l: 'E', w: 1 }, { l: 'R', w: 1 }, { l: 'T', w: 1 },
    { l: 'Y', w: 1 }, { l: 'U', w: 1 }, { l: 'I', w: 1 }, { l: 'O', w: 1 }, { l: 'P', w: 1 }, { l: '[', w: 1 },
    { l: ']', w: 1 }, { l: '\\', w: 1.5 },
  ],
  [
    { l: 'Caps', w: 1.75 }, { l: 'A', w: 1 }, { l: 'S', w: 1 }, { l: 'D', w: 1 }, { l: 'F', w: 1 }, { l: 'G', w: 1 },
    { l: 'H', w: 1 }, { l: 'J', w: 1 }, { l: 'K', w: 1 }, { l: 'L', w: 1 }, { l: ';', w: 1 }, { l: "'", w: 1 },
    { l: 'Enter', w: 2.25 },
  ],
  [
    { l: 'Shift', w: 2.25 }, { l: 'Z', w: 1 }, { l: 'X', w: 1 }, { l: 'C', w: 1 }, { l: 'V', w: 1 }, { l: 'B', w: 1 },
    { l: 'N', w: 1 }, { l: 'M', w: 1 }, { l: ',', w: 1 }, { l: '.', w: 1 }, { l: '/', w: 1 }, { l: 'Shift', w: 2.75 },
  ],
  [
    { l: 'Ctrl', w: 1.25 }, { l: 'Fn', w: 1 }, { l: 'Win', w: 1.25 }, { l: 'Alt', w: 1.25 },
    { l: ' ', w: 6.25, noLabel: true }, { l: 'Alt', w: 1.25 }, { l: 'Fn', w: 1.25 }, { l: 'Ctrl', w: 1.5 },
  ],
];

interface KeyEntry {
  mesh: THREE.Mesh;
  y0: number;
  down: boolean;
  amt: number;
}

interface ShowState {
  inputText: string;
  userAlpha: number;
  userT0: number;
  agentAlpha: number;
  agentT0: number;
  thinking: boolean;
  codingActive: boolean;
  finished: boolean;
  codeChars: number;
  shiftDown: boolean;
  sendFlash: number;
  fadeT0: number;
}

const SW = 1024;
const SH = 640;

export function createHarnessLaptop(container: HTMLElement, opts: SceneOptions): SceneHandle {
  const USER_TEXT = opts.prompt && opts.prompt.trim() ? opts.prompt.trim() : DEFAULT_PROMPT;
  const fonts = siteFonts();
  const SANS = fonts.sans;
  const MONO = fonts.mono;

  let disposed = false;
  const renderer = createRenderer(container, 2);
  const unwatch = watchContext(renderer, () => opts.onError?.(new Error('WebGL context lost')));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
  const TARGET = new THREE.Vector3(0, 2.02, -0.48);

  /* ---------- lights (tuned by the dev for r160 physical lights) ---------- */
  scene.add(new THREE.HemisphereLight(0xffffff, 0xdfe6ee, 1.6));
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.7);
  keyLight.position.set(5.5, 9, 7);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
  fillLight.position.set(-7, 4.5, 6);
  scene.add(fillLight);
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.35);
  rimLight.position.set(-3, 3, -8);
  scene.add(rimLight);

  /* ---------- screen canvas ---------- */
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = SW;
  screenCanvas.height = SH;
  const sctx = screenCanvas.getContext('2d')!;
  const screenTex = new THREE.CanvasTexture(screenCanvas);
  screenTex.colorSpace = THREE.SRGBColorSpace;
  screenTex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  screenTex.minFilter = THREE.LinearFilter;
  screenTex.magFilter = THREE.LinearFilter;
  screenTex.generateMipmaps = false;

  /* ---------- laptop ---------- */
  const laptop = new THREE.Group();
  scene.add(laptop);

  const BASE_W = 6;
  const BASE_H = 0.34;
  const BASE_D = 4.2;

  const matBody = new THREE.MeshStandardMaterial({ color: 0xd8dee6, roughness: 0.55, metalness: 0.08 });
  const matDeck = new THREE.MeshStandardMaterial({ color: 0xc1c9d4, roughness: 0.72, metalness: 0.05 });
  const matKey = new THREE.MeshStandardMaterial({ color: 0xf7f9fc, roughness: 0.5, metalness: 0.02 });
  const matTrack = new THREE.MeshStandardMaterial({ color: 0xb9c2cd, roughness: 0.45, metalness: 0.06 });
  const matDark = new THREE.MeshStandardMaterial({ color: 0x2a2f38, roughness: 0.5, metalness: 0.35 });

  const baseMesh = new THREE.Mesh(roundedBox(BASE_W, BASE_H, BASE_D, 0.12, 6), matBody);
  baseMesh.position.y = BASE_H / 2;
  laptop.add(baseMesh);

  const deck = new THREE.Mesh(roundedBox(5.38, 0.035, 1.88, 0.07, 4), matDeck);
  deck.position.set(0, BASE_H + 0.0105, -1.05);
  laptop.add(deck);

  /* ---------- keyboard (shared geometry per width, shared label materials) ---------- */
  const labelTextures = new Map<string, THREE.CanvasTexture>();
  const labelMaterials = new Map<string, THREE.MeshStandardMaterial>();
  const keyGeometries = new Map<number, THREE.BufferGeometry>();
  const labelGeo = new THREE.PlaneGeometry(0.23, 0.23);

  const labelMaterial = (text: string): THREE.MeshStandardMaterial => {
    const cached = labelMaterials.get(text);
    if (cached) return cached;
    const S = 128;
    const cv = document.createElement('canvas');
    cv.width = cv.height = S;
    const x = cv.getContext('2d')!;
    const fs = text.length > 1 ? Math.min(S * 0.36, (S * 1.5) / text.length) : S * 0.5;
    x.font = `600 ${fs}px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif`;
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.fillStyle = '#5c6675';
    x.fillText(text, S / 2, S / 2 + fs * 0.04);
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    labelTextures.set(text, t);
    const m = new THREE.MeshStandardMaterial({
      map: t,
      transparent: true,
      depthWrite: false,
      roughness: 0.6,
      metalness: 0,
    });
    labelMaterials.set(text, m);
    return m;
  };

  const allKeys: KeyEntry[] = [];
  const keyMap = new Map<string, KeyEntry>();

  ROWS.forEach((row, ri) => {
    let x = KB_X0;
    row.forEach((k) => {
      const kw = k.w * U - 0.05;
      const kd = U - 0.05;
      const cx = x + (k.w * U) / 2;
      x += k.w * U;

      let geo = keyGeometries.get(k.w);
      if (!geo) {
        geo = roundedBox(kw, KEY_H, kd, 0.025, 3);
        keyGeometries.set(k.w, geo);
      }
      const mesh = new THREE.Mesh(geo, matKey);
      const y0 = BASE_H + 0.075;
      mesh.position.set(cx, y0, KB_Z0 + ri * U);
      laptop.add(mesh);

      if (!k.noLabel) {
        const lm = new THREE.Mesh(labelGeo, labelMaterial(k.l));
        lm.rotation.x = -Math.PI / 2;
        lm.position.y = KEY_H / 2 + 0.0016;
        mesh.add(lm);
      }

      const entry: KeyEntry = { mesh, y0, down: false, amt: 0 };
      allKeys.push(entry);
      const name = k.l.toLowerCase();
      if (!keyMap.has(name)) keyMap.set(name, entry);
    });
  });

  const trackpad = new THREE.Mesh(roundedBox(2.5, 0.022, 1.55, 0.012, 4), matTrack);
  trackpad.position.set(0, BASE_H + 0.005, 0.92);
  laptop.add(trackpad);

  const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 5.7, 18), matDark);
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(0, BASE_H - 0.03, -2.03);
  laptop.add(hinge);

  /* ---------- lid ---------- */
  const lid = new THREE.Group();
  lid.position.set(0, BASE_H - 0.02, -2.03);
  lid.rotation.x = -0.26;
  laptop.add(lid);

  const lidGeo = roundedBox(6, 3.9, 0.13, 0.06, 5);
  lidGeo.translate(0, 1.95, 0);
  lid.add(new THREE.Mesh(lidGeo, matBody));

  const bezel = new THREE.Mesh(
    new THREE.PlaneGeometry(5.75, 3.46),
    new THREE.MeshStandardMaterial({ color: 0x14181f, roughness: 0.52, metalness: 0.12 })
  );
  bezel.position.set(0, 2.07, 0.0665);
  lid.add(bezel);

  const camDot = new THREE.Mesh(
    new THREE.CircleGeometry(0.032, 20),
    new THREE.MeshStandardMaterial({ color: 0x2b3138, roughness: 0.35, metalness: 0.4 })
  );
  camDot.position.set(0, 3.755, 0.0672);
  lid.add(camDot);

  const screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(5.22, 3.2625),
    new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false })
  );
  screenMesh.position.set(0, 2.07, 0.0695);
  lid.add(screenMesh);

  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(5.22, 3.2625),
    new THREE.MeshBasicMaterial({
      map: makeGlassTexture(),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    })
  );
  glass.position.set(0, 2.07, 0.0715);
  lid.add(glass);

  const emblem = new THREE.Mesh(
    new THREE.PlaneGeometry(0.22, 0.22),
    new THREE.MeshStandardMaterial({
      map: makeEmblemTexture(),
      transparent: true,
      roughness: 0.65,
      metalness: 0.0,
    })
  );
  emblem.position.set(0, 0.17, 0.0672);
  lid.add(emblem);

  const screenGlow = new THREE.PointLight(0x6aa9ff, 0.0, 8, 2);
  screenGlow.position.set(0, 2.0, 0.9);
  lid.add(screenGlow);

  /* ---------- contact shadows ---------- */
  const shadowBig = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 12),
    new THREE.MeshBasicMaterial({ map: makeShadowTexture(0.34, 0.2), transparent: true, depthWrite: false })
  );
  shadowBig.rotation.x = -Math.PI / 2;
  shadowBig.position.set(0, 0.001, -0.35);
  scene.add(shadowBig);

  const shadowTight = new THREE.Mesh(
    new THREE.PlaneGeometry(7.4, 5.4),
    new THREE.MeshBasicMaterial({ map: makeShadowTexture(0.3, 0.14), transparent: true, depthWrite: false })
  );
  shadowTight.rotation.x = -Math.PI / 2;
  shadowTight.position.set(0, 0.0025, -0.1);
  scene.add(shadowTight);

  /* ---------- camera framing ---------- */
  const CAM_DIR = new THREE.Vector3(0, 0.3, 1).normalize();
  const BOUNDS = new THREE.Box3(new THREE.Vector3(-3.15, -0.06, -3.25), new THREE.Vector3(3.15, 4.16, 2.25));
  const camBase = new THREE.Vector3();

  const fitCamera = () => {
    const { w, h } = measure(container);
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    const dir = CAM_DIR.clone();
    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(dir, up).normalize();
    const upv = new THREE.Vector3().crossVectors(right, dir).normalize();

    const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5));
    const tanH = tanV * aspect;
    const v = new THREE.Vector3();
    let d = 0;
    for (let i = 0; i < 8; i++) {
      v.set(
        i & 1 ? BOUNDS.max.x : BOUNDS.min.x,
        i & 2 ? BOUNDS.max.y : BOUNDS.min.y,
        i & 4 ? BOUNDS.max.z : BOUNDS.min.z
      ).sub(TARGET);
      const px = v.dot(right);
      const py = v.dot(upv);
      const pz = v.dot(dir);
      d = Math.max(d, pz + Math.abs(px) / tanH, pz + Math.abs(py) / tanV);
    }
    d *= 1.1;
    camera.position.copy(TARGET).addScaledVector(dir, d);
    camBase.copy(camera.position);
    camera.lookAt(TARGET);
  };
  fitCamera();

  /* ============================================================
     THE SHOW — a deterministic timeline (all times in seconds)
     ============================================================ */
  const rand = mulberry32(7);
  const charTimes: number[] = [];
  let cursorT = 0.9; // quiet beat before the first key
  for (const ch of USER_TEXT) {
    charTimes.push(cursorT);
    cursorT += ch === ' ' ? 0.092 : 0.048 + rand() * 0.046;
  }
  const keyForChar: (KeyEntry | undefined)[] = Array.from(USER_TEXT).map((ch) => keyMap.get(ch.toLowerCase()));

  const shiftT = cursorT + 0.56; // hold shift (the "⇧ send" shortcut)
  const sendT = shiftT + 0.22; // message sent, camera pushes in
  const shiftUpT = sendT + 0.18;
  const agentT = shiftUpT + 0.56; // agent card appears, "thinking"
  const codeT = agentT + 1.75; // diff starts streaming

  // The diff streams at a gently pulsing rate (chars/s). Closed form:
  const RATE_MUL = 0.58; // typing slows while the camera is pushed in
  const charsAt = (tau: number) => RATE_MUL * (150 * tau + 20 * (1 - Math.cos(3.5 * tau)));
  let lo = 0;
  let hi = 120;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (charsAt(mid) < TOTAL_CODE_CHARS) lo = mid;
    else hi = mid;
  }
  const codeEndT = codeT + hi;
  const zoomOutT = codeEndT + 2.4;
  const fadeT = zoomOutT + 1.0;
  const loopEnd = fadeT + 0.7;
  const stillTime = codeEndT + CFG.stillBackdrop;

  const S: ShowState = {
    inputText: '',
    userAlpha: 0,
    userT0: 0,
    agentAlpha: 0,
    agentT0: 0,
    thinking: false,
    codingActive: false,
    finished: false,
    codeChars: 0,
    shiftDown: false,
    sendFlash: -1e9,
    fadeT0: -1,
  };

  const zoomAt = (tl: number): number => {
    if (tl < sendT) return 0;
    if (tl < sendT + 0.85) return easeInOutCubic((tl - sendT) / 0.85);
    if (tl < zoomOutT) return 1;
    if (tl < zoomOutT + 0.95) return 1 - easeInOutCubic((tl - zoomOutT) / 0.95);
    return 0;
  };

  // index of the last typed character at time tl (-1 before the first key)
  const lastCharIndex = (tl: number): number => {
    let a = 0;
    let b = charTimes.length - 1;
    let idx = -1;
    while (a <= b) {
      const mid = (a + b) >> 1;
      if (charTimes[mid] <= tl) {
        idx = mid;
        a = mid + 1;
      } else b = mid - 1;
    }
    return idx;
  };

  const evalShow = (tl: number) => {
    // text in the composer
    S.inputText = tl < sendT ? USER_TEXT.slice(0, lastCharIndex(tl) + 1) : '';

    S.shiftDown = tl >= shiftT && tl < shiftUpT;
    S.sendFlash = tl >= sendT ? sendT * 1000 : -1e9;
    S.userAlpha = tl >= sendT ? 1 : 0;
    S.userT0 = sendT * 1000;
    S.agentAlpha = tl >= agentT ? 1 : 0;
    S.agentT0 = agentT * 1000;
    S.thinking = tl >= agentT && tl < codeT;
    S.codingActive = tl >= codeT && tl < codeEndT;
    S.finished = tl >= codeEndT;
    S.codeChars = tl < codeT ? 0 : tl < codeEndT ? Math.min(TOTAL_CODE_CHARS, charsAt(tl - codeT)) : TOTAL_CODE_CHARS;
    S.fadeT0 = tl >= fadeT ? fadeT * 1000 : -1;

    // which physical keys are down right now
    for (let i = 0; i < allKeys.length; i++) allKeys[i].down = false;
    if (tl >= charTimes[0] && tl < sendT) {
      const idx = lastCharIndex(tl);
      for (let q = Math.max(0, idx - 1); q <= idx; q++) {
        if (tl - charTimes[q] < 0.07) {
          const k = keyForChar[q];
          if (k) k.down = true;
        }
      }
    }
    if (S.shiftDown) {
      const sh = keyMap.get('shift');
      if (sh) sh.down = true;
    }
    if (S.codingActive) {
      const period = 0.062 / RATE_MUL;
      const n = Math.floor((tl - codeT) / period);
      for (let q = Math.max(0, n - 1); q <= n; q++) {
        if (tl - (codeT + q * period) < 0.048) {
          allKeys[Math.floor(hash01(q * 1.7 + 3) * allKeys.length)].down = true;
        }
      }
    }
  };

  /* ============================================================
     SCREEN RENDERING
     ============================================================ */
  const drawScreen = (now: number) => {
    const c = sctx;
    const W = SW;
    const H = SH;
    const A = S.fadeT0 < 0 ? 1 : clamp01(1 - (now - S.fadeT0) / 620);
    const { thinking, codingActive, finished } = S;

    const bg = c.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#0d1117');
    bg.addColorStop(1, '#0a0d13');
    c.fillStyle = bg;
    c.fillRect(0, 0, W, H);

    c.fillStyle = '#111823';
    c.fillRect(0, 0, W, 58);
    c.fillStyle = 'rgba(255,255,255,0.07)';
    c.fillRect(0, 57, W, 1);

    const dots = ['#ff5f57', '#febc2e', '#28c840'];
    for (let i = 0; i < 3; i++) {
      c.beginPath();
      c.arc(28 + i * 23, 29, 7, 0, Math.PI * 2);
      c.fillStyle = dots[i];
      c.fill();
    }

    drawBrandMark(c, 104, 15, 28, '#ffffff');

    c.textAlign = 'left';
    c.textBaseline = 'middle';
    c.fillStyle = '#eef2f7';
    c.font = `600 18px ${SANS}`;
    c.fillText('Quan Harness', 142, 30);
    const titleW = c.measureText('Quan Harness').width;

    c.fillStyle = '#6e7681';
    c.font = `400 14px ${SANS}`;
    c.fillText('AI coding agent', 142 + titleW + 12, 31);

    const busy = thinking || codingActive;
    const pill = busy
      ? { dot: '#f0b429', bg: 'rgba(240,180,41,0.14)', fg: '#f0b429', label: 'working' }
      : { dot: '#3fb950', bg: 'rgba(63,185,80,0.14)', fg: '#3fb950', label: 'ready' };

    c.font = `500 14px ${SANS}`;
    const lw = c.measureText(pill.label).width;
    const pw = lw + 44;
    const ph = 28;
    const px = W - 30 - pw;
    const py = 15;
    rr(c, px, py, pw, ph, 14);
    c.fillStyle = pill.bg;
    c.fill();
    c.beginPath();
    c.arc(px + 17, py + 14, 4.5, 0, Math.PI * 2);
    c.fillStyle = pill.dot;
    c.fill();
    c.fillStyle = pill.fg;
    c.textAlign = 'left';
    c.fillText(pill.label, px + 29, py + 15);

    /* ---- user message bubble ---- */
    if (S.userAlpha * A > 0.002) {
      const p = clamp01((now - S.userT0) / 340);
      const e = easeOutBack(p);
      c.font = `500 17px ${SANS}`;
      const tw = c.measureText(USER_TEXT).width;
      const bw = Math.min(tw + 46, 780);
      const bh = 46;
      const bx = W - 30 - bw;
      const by = 76;
      const cx = bx + bw / 2;
      const cy = by + bh / 2;

      c.save();
      c.globalAlpha = clamp01(p * 2.4) * S.userAlpha * A;
      c.translate(cx, cy);
      c.scale(e, e);
      c.translate(-cx, -cy);

      c.save();
      c.shadowColor = 'rgba(31,111,235,0.35)';
      c.shadowBlur = 18;
      c.shadowOffsetY = 6;
      rr(c, bx, by, bw, bh, 14);
      c.fillStyle = '#1f6feb';
      c.fill();
      c.restore();

      c.fillStyle = '#ffffff';
      c.textAlign = 'right';
      c.textBaseline = 'middle';
      c.fillText(USER_TEXT, bx + bw - 23, by + bh / 2 + 1);
      c.restore();
    }

    /* ---- agent card ---- */
    if (S.agentAlpha * A > 0.002) {
      const p = clamp01((now - S.agentT0) / 380);
      const e = easeOutCubic(p);

      const cardX = 26;
      const cardW = W - 52;
      const cardH = 406;
      const cardY = 136 + (1 - e) * 16;

      c.save();
      c.globalAlpha = S.agentAlpha * A * e;

      rr(c, cardX, cardY, cardW, cardH, 16);
      c.fillStyle = '#111823';
      c.fill();
      c.strokeStyle = 'rgba(255,255,255,0.08)';
      c.lineWidth = 1.5;
      c.stroke();

      const avX = cardX + 20;
      const avY = cardY + 16;
      const avS = 36;
      drawBrandMark(c, avX, avY, avS, '#ffffff');

      if (busy) {
        const a0 = (now * 0.0042) % (Math.PI * 2);
        c.beginPath();
        c.arc(avX + avS / 2, avY + avS / 2, avS / 2 + 5, a0, a0 + Math.PI * 1.15);
        c.strokeStyle = '#4d9fff';
        c.lineWidth = 2.5;
        c.lineCap = 'round';
        c.stroke();
      }

      c.textAlign = 'left';
      c.textBaseline = 'middle';
      c.fillStyle = '#eef2f7';
      c.font = `600 17px ${SANS}`;
      c.fillText('Quan Harness', avX + avS + 16, cardY + 30);

      let statusText = '';
      let statusColor = '#8b949e';
      if (thinking) {
        statusText = 'Analyzing your request';
        statusColor = '#d29922';
      } else if (codingActive) {
        statusText = 'Editing files · applying fixes';
        statusColor = '#4d9fff';
      } else if (finished) {
        statusText = 'Finished · 0 errors remaining';
        statusColor = '#3fb950';
      }

      c.font = `400 14px ${SANS}`;
      c.fillStyle = statusColor;
      c.fillText(statusText, avX + avS + 16, cardY + 53);
      const stw = c.measureText(statusText).width;

      if (thinking) {
        for (let i = 0; i < 3; i++) {
          const ph2 = (now * 0.0016 + i * 0.22) % 1;
          const dy = -Math.sin(ph2 * Math.PI) * 3;
          c.beginPath();
          c.arc(avX + avS + 16 + stw + 14 + i * 12, cardY + 53 + dy, 3, 0, Math.PI * 2);
          c.fillStyle = '#8b949e';
          c.fill();
        }
      }

      c.fillStyle = 'rgba(255,255,255,0.07)';
      c.fillRect(cardX + 20, cardY + 76, cardW - 40, 1);

      const codeX = cardX + 26;
      const codeTop = cardY + 88;
      const lineH = 21;
      const maxLines = 12;

      const revealed: { t: string; text: string }[] = [];
      let rem = Math.floor(S.codeChars);
      for (const ln of SCRIPT) {
        if (rem <= 0) break;
        const n = Math.min(rem, ln.s.length);
        revealed.push({ t: ln.t, text: ln.s.slice(0, n) });
        rem -= ln.s.length;
      }

      const startIdx = Math.max(0, revealed.length - maxLines);
      const view = revealed.slice(startIdx);

      c.save();
      rr(c, cardX + 12, codeTop - 6, cardW - 24, maxLines * lineH + 12, 10);
      c.clip();

      let lastX = codeX;
      let lastY = codeTop + lineH / 2;
      let lastW = 0;

      view.forEach((ln, i) => {
        const y = codeTop + i * lineH + lineH / 2;

        if (ln.t === 'del' || ln.t === 'add') {
          c.fillStyle = ln.t === 'del' ? 'rgba(248,81,73,0.10)' : 'rgba(63,185,80,0.10)';
          c.fillRect(cardX + 12, y - lineH / 2, cardW - 24, lineH);
        } else if (ln.t === 'done') {
          c.fillStyle = 'rgba(63,185,80,0.12)';
          c.fillRect(cardX + 12, y - lineH / 2, cardW - 24, lineH);
        }

        if (ln.t === 'file') {
          c.fillStyle = 'rgba(121,192,255,0.85)';
          c.fillRect(cardX + 14, y - lineH / 2 + 3, 3, lineH - 6);
        }

        const st = STYLE[ln.t] || STYLE.meta;
        c.fillStyle = st.color;
        c.font = `${st.weight} 15px ${MONO}`;
        c.textAlign = 'left';
        c.textBaseline = 'middle';
        c.fillText(ln.text, codeX, y);

        lastX = codeX;
        lastY = y;
        lastW = c.measureText(ln.text).width;
      });

      if (startIdx > 0) {
        const fg = c.createLinearGradient(0, codeTop - 6, 0, codeTop + 26);
        fg.addColorStop(0, 'rgba(17,24,35,1)');
        fg.addColorStop(1, 'rgba(17,24,35,0)');
        c.fillStyle = fg;
        c.fillRect(cardX + 12, codeTop - 6, cardW - 24, 32);
      }

      if (codingActive && Math.floor(now / 460) % 2 === 0) {
        c.fillStyle = '#58a6ff';
        c.fillRect(lastX + lastW + 2, lastY - 8, 8, 17);
      }

      c.restore();

      const prog = TOTAL_CODE_CHARS > 0 ? Math.min(1, S.codeChars / TOTAL_CODE_CHARS) : 0;
      const pbX = cardX + 24;
      const pbY = cardY + 362;
      const pbW = cardW - 48;
      const pbH = 6;

      rr(c, pbX, pbY, pbW, pbH, 3);
      c.fillStyle = 'rgba(255,255,255,0.07)';
      c.fill();

      if (prog > 0) {
        rr(c, pbX, pbY, Math.max(6, pbW * prog), pbH, 3);
        c.fillStyle = finished ? '#3fb950' : '#4d9fff';
        c.fill();
      }

      c.textAlign = 'left';
      c.textBaseline = 'middle';
      c.fillStyle = '#8b949e';
      c.font = `400 13.5px ${SANS}`;

      let footer = 'Waiting for instructions…';
      if (thinking) footer = 'Reading repository…';
      else if (codingActive) footer = '4 files changed · +4 −4';
      else if (finished) footer = '4 files changed · +4 −4 · 0 errors';

      c.fillText(footer, cardX + 24, cardY + 388);

      c.textAlign = 'right';
      c.fillStyle = finished ? '#3fb950' : '#6e7681';
      c.fillText(`${Math.round(prog * 100)}%`, cardX + cardW - 24, cardY + 388);

      c.restore();
    }

    /* ---- composer bar ---- */
    c.fillStyle = '#111823';
    c.fillRect(0, 552, W, H - 552);
    c.fillStyle = 'rgba(255,255,255,0.07)';
    c.fillRect(0, 552, W, 1);

    const IB_X = 30;
    const IB_Y = 566;
    const IB_W = 822;
    const IB_H = 46;
    const hasText = S.inputText.length > 0;

    rr(c, IB_X, IB_Y, IB_W, IB_H, 12);
    c.fillStyle = '#0b0f16';
    c.fill();
    c.strokeStyle = hasText ? 'rgba(77,159,255,0.55)' : '#2a323d';
    c.lineWidth = 1.8;
    c.stroke();

    c.font = `400 17px ${SANS}`;
    c.textAlign = 'left';
    c.textBaseline = 'middle';

    if (!hasText) {
      c.fillStyle = '#4b535d';
      c.fillText('Describe a task for the agent…', IB_X + 22, IB_Y + IB_H / 2 + 1);
    } else {
      c.fillStyle = '#e6edf3';
      c.fillText(S.inputText, IB_X + 22, IB_Y + IB_H / 2 + 1);
      const tw = c.measureText(S.inputText).width;
      if (Math.floor(now / 460) % 2 === 0) {
        c.fillStyle = '#58a6ff';
        c.fillRect(IB_X + 22 + tw + 2, IB_Y + 12, 2, 22);
      }
    }

    const hx = IB_X + IB_W - 106;
    const hy = IB_Y + 10;
    const hw = 94;
    const hh = 26;
    rr(c, hx, hy, hw, hh, 8);
    c.fillStyle = S.shiftDown ? 'rgba(77,159,255,0.22)' : '#1a212b';
    c.fill();
    if (S.shiftDown) {
      c.strokeStyle = 'rgba(77,159,255,0.8)';
      c.lineWidth = 1.5;
      c.stroke();
    }
    c.fillStyle = S.shiftDown ? '#79c0ff' : '#6e7681';
    c.font = `600 12px ${SANS}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('⇧  send', hx + hw / 2, hy + hh / 2 + 1);

    const SB_X = 864;
    const SB_Y = 566;
    const SB_W = 130;
    const SB_H = 46;
    const flash = clamp01(1 - (now - S.sendFlash) / 420);

    rr(c, SB_X, SB_Y, SB_W, SB_H, 12);
    c.fillStyle = hasText ? '#238636' : '#1a212b';
    c.fill();
    if (flash > 0) {
      rr(c, SB_X, SB_Y, SB_W, SB_H, 12);
      c.fillStyle = `rgba(63,185,80,${flash * 0.85})`;
      c.fill();
    }
    c.fillStyle = hasText || flash > 0 ? '#ffffff' : '#565e68';
    c.font = `600 17px ${SANS}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('Send', SB_X + SB_W / 2, SB_Y + SB_H / 2 + 1);
  };

  /* ============================================================
     FRAME
     ============================================================ */
  const TARGET_FAR = TARGET.clone();
  const TARGET_NEAR = new THREE.Vector3(0, 2.28, -2.2);
  const effTarget = new THREE.Vector3();
  const camOffset = new THREE.Vector3();
  const rotY = new THREE.Matrix4();
  let lastScreenAt = -1;

  const frame = (time: number, dt: number) => {
    const tl = time % loopEnd;
    const nowMs = tl * 1000;
    evalShow(tl);

    // physical key travel (a little spring so presses feel soft)
    for (let i = 0; i < allKeys.length; i++) {
      const k = allKeys[i];
      const target = k.down ? 1 : 0;
      k.amt = dt === 0 ? target : k.amt + (target - k.amt) * Math.min(1, dt * 28);
      k.mesh.position.y = k.y0 - k.amt * 0.055;
    }

    const ez = zoomAt(tl);

    const busy = S.thinking || S.codingActive;
    const glowTarget = busy ? (S.codingActive ? 1.0 : 0.5) : 0.15;
    screenGlow.intensity = dt === 0 ? glowTarget : screenGlow.intensity + (glowTarget - screenGlow.intensity) * Math.min(1, dt * 3);

    // camera: orbit + dolly. The orbit fades to zero as we push in, so the
    // close-up holds a perfectly steady frame.
    effTarget.lerpVectors(TARGET_FAR, TARGET_NEAR, ez);
    camOffset.copy(camBase).sub(TARGET_FAR);
    const orbitAmp = 0.26 * (1 - ez);
    rotY.makeRotationY(Math.sin(time * 0.62) * orbitAmp);
    camOffset.applyMatrix4(rotY);
    camOffset.multiplyScalar(1 - ez * 0.5);
    camera.position.copy(effTarget).add(camOffset);
    camera.position.y += Math.sin(time * 0.91 + 1.3) * (0.045 * (1 - ez));
    camera.lookAt(effTarget);

    // the screen is a 1024×640 canvas upload, so cap how often it's redrawn
    if (dt === 0 || lastScreenAt < 0 || time - lastScreenAt >= 1 / CFG.screenHz) {
      lastScreenAt = time;
      drawScreen(nowMs);
      screenTex.needsUpdate = true;
    }

    renderer.render(scene, camera);
  };

  const loop: Loop = createLoop({
    renderer,
    frame,
    reducedMotion: opts.reducedMotion,
    stillTime,
    onPixelRatioChange: () => {
      fitCamera();
      loop.redraw();
    },
    onFirstFrame: opts.onReady,
    onError: opts.onError,
  });

  // Canvas text never triggers a font download by itself.
  void preloadFonts([
    `400 15px ${MONO}`,
    `600 15px ${MONO}`,
    `400 17px ${SANS}`,
    `500 17px ${SANS}`,
    `600 17px ${SANS}`,
  ]).then(() => {
    if (!disposed) loop.redraw();
  });

  return {
    setActive: (active) => loop.setActive(active),
    resize: () => {
      fitCamera();
      loop.redraw();
    },
    dispose: () => {
      disposed = true;
      loop.dispose();
      unwatch();
      labelTextures.clear();
      labelMaterials.clear();
      keyGeometries.clear();
      disposeTree(scene);
      disposeRenderer(renderer);
    },
  };
}

