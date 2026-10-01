import * as THREE from 'three';
import {
  BRAND_GRID,
  BRAND_RED,
  applyStudioEnvironment,
  createLoop,
  createRenderer,
  disposeRenderer,
  disposeTree,
  easeInCubic,
  easeOutBack,
  easeOutCubic,
  hash01,
  measure,
  preloadFonts,
  siteFonts,
  smoothstep,
  watchContext,
  type Loop,
  type SceneHandle,
  type SceneOptions,
} from './runtime';

/* ============================================================
   KAEL — "many parts, one whole"

   A 4x4x4 cube whose six faces are the Quancis brand mark.
   It idles, charges (the red cell glows), bursts apart, reveals
   the name, then snaps shut again. 16 s, seamless.

   Ported from the dev's standalone demo. Changes:
   - sized from its container (was window.innerWidth/innerHeight,
     appended to <body>)
   - faces now show the real brand mark (.xx. / x..x / x.x. / .x.R,
     red #E4002B). The demo used a different pattern, and the left
     and right faces were mirrored.
   - modern three (r160) colour pipeline + environment lighting
   - camera dollies in at rest so the cube reads at tile size, and
     pulls back to frame the burst
   - the inner pieces shrink away instead of popping out of
     existence
   - soft ground shadow, all resources disposed, cancellable loop
   ============================================================ */

const CFG = {
  N: 4, // 4×4×4
  cell: 1.0, // distance between cubelet centres
  body: 0.96, // cubelet body size (leaves a visible gap)
  sticker: 0.84, // sticker size (leaves a dark frame)
  loop: 16.0, // seconds per full cycle
  fitRadius: 9.6, // world radius the camera must always frame at full burst
  restDolly: 0.66, // camera distance at rest, as a fraction of the burst framing
  envIntensity: 0.85,
  keyLight: 1.5,
  rimLight: 0.55,
  stillTime: 9.0, // reduced motion: freeze on the name reveal
} as const;

// 0 = ink · 1 = paper · 2 = red. Row 0 = TOP, col 0 = LEFT as seen
// when looking AT a face from outside the cube.
const PATTERN: number[][] = BRAND_GRID.map((row) =>
  Array.from(row).map((ch) => (ch === 'x' ? 0 : ch === 'R' ? 2 : 1))
);

const PH = {
  idleEnd: 4.0, // float
  chargeEnd: 5.5, // shake / glow  (1.5 s)
  boomEnd: 7.5, // burst         (2.0 s)
  holdEnd: 11.0, // name on show  (3.5 s)
  reformEnd: 13.0, // snap shut     (2.0 s)
  settleEnd: 14.0, // tiny ring-out (1.0 s)
} as const;

interface Piece {
  mesh: THREE.Mesh;
  home: THREE.Vector3;
  dir: THREE.Vector3;
  dist: number;
  axis: THREE.Vector3;
  spin: number;
  isCore: boolean;
}

function radialTexture(stops: [number, string][]): THREE.CanvasTexture {
  const S = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const g = cv.getContext('2d')!;
  const grad = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  stops.forEach(([o, c]) => grad.addColorStop(o, c));
  g.fillStyle = grad;
  g.fillRect(0, 0, S, S);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createKaelCube(container: HTMLElement, opts: SceneOptions): SceneHandle {
  const renderer = createRenderer(container, 2);
  const unwatch = watchContext(renderer, () => opts.onError?.(new Error('WebGL context lost')));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
  const disposeEnv = applyStudioEnvironment(renderer, scene);

  /* ---------- lights (the environment does most of the work) ---------- */
  const key = new THREE.DirectionalLight(0xffffff, CFG.keyLight);
  key.position.set(8, 14, 10);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, CFG.rimLight);
  rim.position.set(-9, -6, 6);
  scene.add(rim);

  /* ---------- materials ---------- */
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x1b1c1e,
    roughness: 0.35,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    envMapIntensity: CFG.envIntensity,
  });
  const stickerMat = (color: number | string, roughness: number, clearRough: number) =>
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      roughness,
      metalness: 0.0,
      clearcoat: 1.0,
      clearcoatRoughness: clearRough,
      envMapIntensity: CFG.envIntensity,
    });
  const stickerMats: THREE.MeshPhysicalMaterial[] = [
    stickerMat(0x0d0e0f, 0.2, 0.05), // ink
    stickerMat(0xf4f4f1, 0.15, 0.05), // paper
    stickerMat(BRAND_RED, 0.12, 0.03), // red
  ];
  stickerMats[2].emissive = new THREE.Color(0xff1a3c);
  stickerMats[2].emissiveIntensity = 0;

  /* ---------- the 4×4×4 ---------- */
  const cubeGroup = new THREE.Group();
  scene.add(cubeGroup);

  const bodyGeo = new THREE.BoxGeometry(CFG.body, CFG.body, CFG.body);
  const stickerGeo = new THREE.PlaneGeometry(CFG.sticker, CFG.sticker);
  const N = CFG.N;
  const offset = (N - 1) / 2;
  const sOff = CFG.body / 2 + 0.005; // slightly outside the body
  const pieces: Piece[] = [];
  let pIndex = 0;

  const addSticker = (
    piece: THREE.Mesh,
    value: number,
    pos: [number, number, number],
    rot: [number, number, number]
  ) => {
    const st = new THREE.Mesh(stickerGeo, stickerMats[value]);
    st.position.set(...pos);
    st.rotation.set(...rot);
    piece.add(st);
  };

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      for (let k = 0; k < N; k++) {
        const x = (i - offset) * CFG.cell;
        const y = (j - offset) * CFG.cell;
        const z = (k - offset) * CFG.cell;

        const piece = new THREE.Mesh(bodyGeo, bodyMat);
        piece.position.set(x, y, z);

        // Each face reads correctly when looked at from outside the cube.
        // Right (+x): viewer's right is −z. Left (−x): viewer's right is +z.
        if (i === N - 1) addSticker(piece, PATTERN[N - 1 - j][N - 1 - k], [sOff, 0, 0], [0, Math.PI / 2, 0]);
        if (i === 0) addSticker(piece, PATTERN[N - 1 - j][k], [-sOff, 0, 0], [0, -Math.PI / 2, 0]);
        if (j === N - 1) addSticker(piece, PATTERN[k][i], [0, sOff, 0], [-Math.PI / 2, 0, 0]);
        if (j === 0) addSticker(piece, PATTERN[N - 1 - k][i], [0, -sOff, 0], [Math.PI / 2, 0, 0]);
        if (k === N - 1) addSticker(piece, PATTERN[N - 1 - j][i], [0, 0, sOff], [0, 0, 0]);
        if (k === 0) addSticker(piece, PATTERN[N - 1 - j][N - 1 - i], [0, 0, -sOff], [0, Math.PI, 0]);

        cubeGroup.add(piece);

        // per-piece motion data
        const dir = new THREE.Vector3(i - offset, j - offset, k - offset);
        if (dir.length() > 0.01) {
          dir.normalize();
          dir.x += (hash01(pIndex * 3.1 + 1) - 0.5) * 0.45;
          dir.y += (hash01(pIndex * 3.1 + 2) - 0.5) * 0.45;
          dir.z += (hash01(pIndex * 3.1 + 3) - 0.5) * 0.45;
          dir.normalize();
        } else {
          dir.set(hash01(pIndex) - 0.5, hash01(pIndex + 1) - 0.5, hash01(pIndex + 2) - 0.5).normalize();
        }
        const axis = new THREE.Vector3(
          hash01(pIndex * 5.3 + 11) - 0.5,
          hash01(pIndex * 5.3 + 12) - 0.5,
          hash01(pIndex * 5.3 + 13) - 0.5
        ).normalize();

        pieces.push({
          mesh: piece,
          home: new THREE.Vector3(x, y, z),
          dir,
          dist: 4.5 + hash01(pIndex * 7.7 + 21) * 2.0,
          axis,
          spin: (0.8 + hash01(pIndex * 9.1 + 31) * 1.6) * Math.PI,
          isCore: i >= 1 && i <= 2 && j >= 1 && j <= 2 && k >= 1 && k <= 2,
        });
        pIndex++;
      }
    }
  }

  /* ---------- the name ---------- */
  const fonts = siteFonts();
  const TEXT_W = 2048;
  const TEXT_H = 1024;
  const textCanvas = document.createElement('canvas');
  textCanvas.width = TEXT_W;
  textCanvas.height = TEXT_H;
  const textTex = new THREE.CanvasTexture(textCanvas);
  textTex.colorSpace = THREE.SRGBColorSpace;
  textTex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const paintName = () => {
    const g = textCanvas.getContext('2d')!;
    g.clearRect(0, 0, TEXT_W, TEXT_H);
    const family = fonts.sans;
    let size = 500;
    g.font = `600 ${size}px ${family}`;
    const w0 = g.measureText('Kael').width;
    if (w0 > 0) size = Math.min((size * (TEXT_W * 0.9)) / w0, TEXT_H * 0.8);
    g.font = `600 ${size.toFixed(1)}px ${family}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    const cx = TEXT_W / 2;
    const cy = TEXT_H / 2;
    const grad = g.createLinearGradient(0, cy - size * 0.55, 0, cy + size * 0.55);
    grad.addColorStop(0.0, '#ff6a80');
    grad.addColorStop(0.42, BRAND_RED);
    grad.addColorStop(1.0, '#8a0019');
    g.save();
    g.shadowColor = 'rgba(228, 0, 43, 0.85)';
    g.shadowBlur = 120;
    g.fillStyle = grad;
    g.fillText('Kael', cx, cy); // pass 1 builds the glow
    g.fillText('Kael', cx, cy); // pass 2 makes it solid
    g.restore();
    textTex.needsUpdate = true;
  };
  paintName();
  let disposed = false;
  void preloadFonts([`600 120px ${fonts.sans}`]).then(() => {
    if (!disposed) paintName();
  });

  const textMat = new THREE.MeshBasicMaterial({
    map: textTex,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 2.75), textMat);
  textMesh.visible = false;
  scene.add(textMesh);

  /* ---------- shockwave ring ---------- */
  const ringMat = new THREE.MeshBasicMaterial({
    map: radialTexture([
      [0.0, 'rgba(228,0,43,0)'],
      [0.55, 'rgba(228,0,43,0)'],
      [0.72, 'rgba(228,0,43,0.55)'],
      [0.84, 'rgba(255,100,125,0.2)'],
      [0.94, 'rgba(228,0,43,0.04)'],
      [1.0, 'rgba(228,0,43,0)'],
    ]),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), ringMat);
  ring.visible = false;
  scene.add(ring);

  /* ---------- ground shadow (anchors the floating cube) ---------- */
  const shadowMat = new THREE.MeshBasicMaterial({
    map: radialTexture([
      [0.0, 'rgba(22,24,26,0.55)'],
      [0.45, 'rgba(22,24,26,0.22)'],
      [1.0, 'rgba(22,24,26,0)'],
    ]),
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -4.1;
  scene.add(shadow);

  /* ---------- camera framing ---------- */
  const CAM_DIR = new THREE.Vector3(0.35, 0.3, 1).normalize();
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  let fitDist = 28;

  const applySize = () => {
    const { w, h } = measure(container);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    // Frame a sphere of fitRadius in BOTH axes, whatever the container shape.
    fitDist = CFG.fitRadius / Math.sin(Math.min(vFov, hFov) / 2);
    camera.updateProjectionMatrix();
  };
  applySize();

  /* ---------- the timeline ---------- */
  const frame = (time: number) => {
    const t = time % CFG.loop;
    const u = t / CFG.loop;

    let explode = 0;
    let reveal = 0;
    let charge = 0;
    let shake = 0;
    let impact = 0;

    if (t < PH.idleEnd) {
      /* calm */
    } else if (t < PH.chargeEnd) {
      const p = (t - PH.idleEnd) / (PH.chargeEnd - PH.idleEnd);
      charge = p;
      shake = p * p * 0.06;
    } else if (t < PH.boomEnd) {
      const p = (t - PH.chargeEnd) / (PH.boomEnd - PH.chargeEnd);
      const decay = Math.max(0, 1 - p * 3.5);
      charge = decay;
      shake = decay * 0.06;
      explode = easeOutCubic(p);
      reveal = smoothstep(0.1, 0.85, p);
    } else if (t < PH.holdEnd) {
      explode = 1;
      reveal = 1;
    } else if (t < PH.reformEnd) {
      const p = (t - PH.holdEnd) / (PH.reformEnd - PH.holdEnd);
      explode = 1 - easeInCubic(p);
      reveal = 1 - smoothstep(0.0, 0.6, p);
    } else if (t < PH.settleEnd) {
      const p = (t - PH.reformEnd) / (PH.settleEnd - PH.reformEnd);
      impact = Math.exp(-8 * p) * Math.sin(p * Math.PI * 3);
    }

    /* rigid transform of the whole cube: exactly one turn per loop */
    const ang = u * Math.PI * 2;
    cubeGroup.rotation.set(0.3 + Math.sin(ang) * 0.16, ang, Math.sin(ang * 2) * 0.03);

    const floatY = Math.sin(ang * 2) * 0.15;
    const sx = Math.sin(time * 61.0) * shake;
    const sy = Math.sin(time * 47.3 + 1.7) * shake;
    const sz = Math.sin(time * 53.7 + 3.1) * shake;
    cubeGroup.position.set(sx, floatY + sy, sz);
    cubeGroup.scale.setScalar((1 + 0.06 * impact) * (1 + 0.02 * charge * Math.sin(time * 30)));

    stickerMats[2].emissiveIntensity = charge * 1.8;

    /* every cubelet */
    const coreShrink = 1 - smoothstep(0.7, 0.95, explode);
    for (let i = 0; i < pieces.length; i++) {
      const p = pieces[i];
      const m = p.mesh;
      m.position.copy(p.home).addScaledVector(p.dir, p.dist * explode);
      m.rotation.set(p.axis.x * p.spin * explode, p.axis.y * p.spin * explode, p.axis.z * p.spin * explode);
      // Inner pieces would sit in front of the name once the burst is wide
      // open, so they shrink away (and grow back when the cube re-forms).
      if (p.isCore) {
        m.scale.setScalar(Math.max(coreShrink, 0.0001));
        m.visible = coreShrink > 0.002;
      }
    }

    /* camera: dolly in at rest, pull back to frame the burst */
    const distFactor = (CFG.restDolly + (1 - CFG.restDolly) * explode) * (1 - 0.05 * charge);
    camera.position.copy(CAM_DIR).multiplyScalar(fitDist * distFactor);
    camera.lookAt(0, 0, 0);

    /* the name: always readable */
    textMesh.visible = reveal > 0.005;
    if (textMesh.visible) {
      textMat.opacity = Math.min(1, reveal * 1.4);
      textMesh.scale.setScalar(0.55 + 0.45 * easeOutBack(reveal));
      textMesh.position.set(0, floatY, 0);
      textMesh.quaternion.copy(camera.quaternion);
    }

    /* shockwave */
    if (t >= PH.chargeEnd && t < PH.chargeEnd + 1.3) {
      const p = (t - PH.chargeEnd) / 1.3;
      ring.visible = true;
      ringMat.opacity = 0.85 * Math.pow(1 - p, 2);
      ring.scale.setScalar(2.5 + easeOutCubic(p) * 18.0);
      ring.position.set(0, floatY, 0);
      ring.quaternion.copy(camera.quaternion);
    } else {
      ring.visible = false;
    }

    /* ground shadow loosens as the cube bursts */
    shadowMat.opacity = 0.34 * (1 - smoothstep(0.0, 0.7, explode));
    shadow.scale.setScalar(7.2 * (1 + explode * 1.4) * (1 + 0.04 * impact));

    renderer.render(scene, camera);
  };

  const loop: Loop = createLoop({
    renderer,
    frame,
    reducedMotion: opts.reducedMotion,
    stillTime: CFG.stillTime,
    onPixelRatioChange: () => {
      applySize();
      loop.redraw();
    },
    onFirstFrame: opts.onReady,
    onError: opts.onError,
  });

  return {
    setActive: (active) => loop.setActive(active),
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
      disposeRenderer(renderer);
    },
  };
}
