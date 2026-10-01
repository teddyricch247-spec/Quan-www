import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/* ============================================================
   Shared runtime for the three home-page product scenes
   (kaelCube, harnessLaptop, chatComposer).

   Every scene is a plain factory:

       createXScene(container, options) => SceneHandle

   - It owns its own canvas (and, for chat, a CSS3D layer) inside
     `container`, sized from the container, never from `window`.
   - It never runs unless the host calls setActive(true), so an
     off-screen or backgrounded scene costs nothing.
   - Every animation state is a pure function of an accumulated
     clock `t`, so pausing, resuming and the reduced-motion still
     frame are all trivial, and nothing is left running after
     dispose().
   ============================================================ */

export interface SceneOptions {
  /** prefers-reduced-motion: draw one composed still frame, no loop. */
  reducedMotion: boolean;
  /** Called once, after the first frame has actually been drawn. */
  onReady?: () => void;
  /** A frame threw, or the GPU context was lost: the host should fall back to its static stage. */
  onError?: (err: unknown) => void;
  /** harness + chat: the text the demo "types". */
  prompt?: string;
  /** chat: the text of Kael's reply bubble. */
  reply?: string;
  /** chat: render the reply as a file chip instead of plain text. */
  replyAsFile?: boolean;
}

export interface SceneHandle {
  /** Start/stop animating. Safe to call repeatedly. */
  setActive(active: boolean): void;
  /** Container size changed. */
  resize(): void;
  /** Free every GPU resource, DOM node and timer. */
  dispose(): void;
}

/* ------------------------------------------------------------
   Brand
   Identical to <BrandMark />: a 4x4 grid,  x = ink, R = red, . = empty
   ------------------------------------------------------------ */
export const BRAND_RED = '#E4002B';
export const BRAND_INK = '#16181A';
export const BRAND_GRID: readonly string[] = ['.xx.', 'x..x', 'x.x.', '.x.R'];

/** Draw the brand mark (cells only, no tile) into a 2D canvas. */
export function drawBrandMark(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  ink: string
): void {
  const cs = size / 4;
  const bleed = 0.5; // hides anti-aliasing seams between abutting cells
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const ch = BRAND_GRID[row][col];
      if (ch === '.') continue;
      c.fillStyle = ch === 'R' ? BRAND_RED : ink;
      c.fillRect(x + col * cs - bleed, y + row * cs - bleed, cs + bleed * 2, cs + bleed * 2);
    }
  }
}

/* ------------------------------------------------------------
   Math + easing  (the power/back eases match GSAP's, so the
   chat timeline keeps the exact feel of the original)
   ------------------------------------------------------------ */
export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const smoothstep = (a: number, b: number, x: number): number => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const linear = (t: number): number => t;
export const power2In = (t: number): number => t * t;
export const power2Out = (t: number): number => 1 - (1 - t) * (1 - t);
export const power2InOut = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
export const power3InOut = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
export const easeInCubic = (t: number): number => t * t * t;
export const easeInOutCubic = power3InOut;
/** GSAP back.out(s) */
export const backOut =
  (s = 1.70158) =>
  (t: number): number => {
    const u = t - 1;
    return u * u * ((s + 1) * u + s) + 1;
  };
export const easeOutBack = backOut(1.70158);

/** Small deterministic PRNG, so "random" timing is the same every loop. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Cheap stateless hash in [0,1). */
export const hash01 = (n: number): number => {
  const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
};

/* ------------------------------------------------------------
   Renderer + sizing
   ------------------------------------------------------------ */
export function measure(container: HTMLElement): { w: number; h: number } {
  return {
    w: Math.max(2, container.clientWidth),
    h: Math.max(2, container.clientHeight),
  };
}

export function createRenderer(container: HTMLElement, maxDpr: number): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
  const canvas = renderer.domElement;
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
  container.appendChild(canvas);
  return renderer;
}

export function disposeRenderer(renderer: THREE.WebGLRenderer): void {
  const canvas = renderer.domElement;
  renderer.dispose();
  // Browsers cap live WebGL contexts (Safari especially). Release the
  // context immediately instead of waiting for garbage collection.
  renderer.forceContextLoss();
  canvas.parentNode?.removeChild(canvas);
}

/** Report a lost WebGL context (GPU reset, driver crash, OS reclaiming memory).
 *  Returns an unsubscribe: call it BEFORE disposeRenderer, which deliberately
 *  loses the context itself. */
export function watchContext(renderer: THREE.WebGLRenderer, onLost: () => void): () => void {
  const canvas = renderer.domElement;
  const handler = (e: Event) => {
    e.preventDefault();
    onLost();
  };
  canvas.addEventListener('webglcontextlost', handler);
  return () => canvas.removeEventListener('webglcontextlost', handler);
}

/* ------------------------------------------------------------
   Studio lighting: a soft room environment for reflections
   (what makes clearcoat plastic look like product photography)
   ------------------------------------------------------------ */
export function applyStudioEnvironment(renderer: THREE.WebGLRenderer, scene: THREE.Scene): () => void {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment(renderer);
  const target = pmrem.fromScene(room, 0.04);
  scene.environment = target.texture;
  room.dispose();
  pmrem.dispose();
  return () => {
    scene.environment = null;
    target.dispose();
  };
}

/* ------------------------------------------------------------
   Disposal
   ------------------------------------------------------------ */
export function disposeTree(root: THREE.Object3D): void {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) geometries.add(mesh.geometry);
    const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (mat) (Array.isArray(mat) ? mat : [mat]).forEach((m) => materials.add(m));
  });
  materials.forEach((m) => {
    const record = m as unknown as Record<string, unknown>;
    for (const key of Object.keys(record)) {
      const value = record[key] as THREE.Texture | undefined;
      if (value && (value as THREE.Texture).isTexture) value.dispose();
    }
    m.dispose();
  });
  geometries.forEach((g) => g.dispose());
}

/* ------------------------------------------------------------
   Fonts: the canvas needs the same families the page uses.
   next/font exposes them as CSS variables on <html>.
   ------------------------------------------------------------ */
export function siteFonts(): { sans: string; mono: string } {
  const root = getComputedStyle(document.documentElement);
  const inter = root.getPropertyValue('--font-inter').trim();
  const jb = root.getPropertyValue('--font-jetbrains-mono').trim();
  return {
    sans: `${inter ? inter + ',' : ''}system-ui,-apple-system,"Segoe UI",Roboto,sans-serif`,
    mono: `${jb ? jb + ',' : ''}ui-monospace,SFMono-Regular,Menlo,Consolas,monospace`,
  };
}

/** Ask the browser to fetch the canvas fonts (canvas text alone never triggers a download). */
export function preloadFonts(specs: string[]): Promise<unknown> {
  if (!('fonts' in document)) return Promise.resolve();
  return Promise.all(specs.map((s) => document.fonts.load(s).catch(() => []))).catch(() => undefined);
}

/* ------------------------------------------------------------
   The loop
   - the clock only advances while the scene is active
   - dt is clamped, so returning to a tab never makes a jump
   - a small governor lowers the pixel ratio if the scene can't
     hold ~40fps, instead of dropping frames on weak GPUs
   - reduced motion: one still frame, no rAF at all
   ------------------------------------------------------------ */
export interface LoopOptions {
  renderer: THREE.WebGLRenderer;
  frame: (t: number, dt: number) => void;
  reducedMotion: boolean;
  /** The moment of the story to freeze on for reduced motion. */
  stillTime: number;
  /** Pixel ratio changed (the scene should re-apply its size). */
  onPixelRatioChange: () => void;
  onFirstFrame?: () => void;
  onError?: (err: unknown) => void;
}

export interface Loop {
  setActive(active: boolean): void;
  /** Redraw the current frame now (used after a resize). */
  redraw(): void;
  dispose(): void;
}

export function createLoop(opts: LoopOptions): Loop {
  let raf = 0;
  let last = 0;
  let t = 0;
  let active = false;
  let disposed = false;
  let drewFirst = false;
  let ema = 1 / 60;
  let slowFrames = 0;

  let broken = false;

  const draw = (time: number, dt: number) => {
    if (broken) return;
    try {
      opts.frame(time, dt);
      if (!drewFirst) {
        drewFirst = true;
        opts.onFirstFrame?.();
      }
    } catch (err) {
      // A throwing frame would otherwise throw again on every rAF. Stop
      // for good and let the host fall back to its static stage.
      broken = true;
      active = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      opts.onError?.(err);
    }
  };

  const tick = (now: number) => {
    if (disposed || broken || !active) {
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(tick);
    const raw = (now - last) / 1000;
    last = now;
    const dt = Math.min(raw, 0.05);
    t += dt;
    draw(t, dt);

    // Pixel-ratio governor. Ignore long stalls (tab switches, GC).
    if (raw < 0.25) {
      ema += (raw - ema) * 0.05;
      if (ema > 0.026) {
        slowFrames += 1;
        if (slowFrames > 120) {
          slowFrames = 0;
          const pr = opts.renderer.getPixelRatio();
          if (pr > 1) {
            opts.renderer.setPixelRatio(Math.max(1, pr - 0.25));
            opts.onPixelRatioChange();
            ema = 1 / 60;
          }
        }
      } else {
        slowFrames = 0;
      }
    }
  };

  return {
    setActive(next: boolean) {
      if (disposed || broken || next === active) return;
      active = next;
      if (opts.reducedMotion) {
        if (active) draw(opts.stillTime, 0);
        return;
      }
      if (active) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    redraw() {
      // Resizing a WebGL canvas clears it, so repaint even while paused
      // (but never before the first frame has been asked for).
      if (disposed || !drewFirst) return;
      draw(opts.reducedMotion ? opts.stillTime : t, 0);
    },
    dispose() {
      disposed = true;
      active = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}
