'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ACCENT_RGB, type AccentName } from '../lib/accents';

export type LowPolySceneVariant = 'orbit' | 'pipeline' | 'pulse';

export interface LowPolySceneProps {
  variant: LowPolySceneVariant;
  accent: AccentName;
  className?: string;
}

/**
 * Small, contained low-poly 3D illustrations — not the full hero, a
 * lighter inline visual sized to sit inside a section and illustrate
 * what that section is describing. Flat-shaded primitive geometries
 * only (no loaded models/textures), matching the site's existing
 * "hand-built from primitives" visual language rather than introducing
 * a second one. Same graceful-degradation approach as HeroCanvas: if
 * WebGL setup fails, this renders nothing rather than breaking the page.
 *
 * Variants:
 *   orbit    — a core with smaller shapes circling it at different
 *              radii/speeds — Kael's "specialist intelligences working
 *              as one."
 *   pipeline — a row of blocks with one pulse of light traveling
 *              through them in sequence — Harness's task-to-shipped
 *              pipeline.
 *   pulse    — a single soft, slowly breathing form — Chat's
 *              conversational, ambient quality.
 */
export const LowPolyScene: React.FC<LowPolySceneProps> = ({ variant, accent, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let rafId = 0;
    const disposables: { dispose: () => void }[] = [];

    try {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const [ar, ag, ab] = ACCENT_RGB[accent];
      const accentColor = new THREE.Color(ar / 255, ag / 255, ab / 255);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, variant === 'pipeline' ? 3.2 : 1.6, 8.5);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      renderer.setClearColor(0x000000, 0);
      // setSize below is called with updateStyle=false (we set CSS size
      // ourselves here, once) — otherwise Three.js would set the canvas's
      // CSS width/height in un-scaled px while its width/height *attributes*
      // are already pixelRatio-multiplied, rendering up to 2x the intended
      // size on any high-DPI screen.
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      container.appendChild(renderer.domElement);
      disposables.push({ dispose: () => renderer.dispose() });

      const key = new THREE.DirectionalLight(0xffffff, 1.6);
      key.position.set(4, 6, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(accentColor, 1.1);
      rim.position.set(-5, -2, -3);
      scene.add(rim);
      const ambient = new THREE.AmbientLight(0x8890a0, 0.55);
      scene.add(ambient);

      const inkMat = () =>
        new THREE.MeshStandardMaterial({ color: 0x2a2e33, flatShading: true, roughness: 0.55, metalness: 0.08 });
      const accentMat = () =>
        new THREE.MeshStandardMaterial({ color: accentColor, flatShading: true, roughness: 0.4, metalness: 0.12 });
      const softMat = () =>
        new THREE.MeshStandardMaterial({ color: 0xc7ccd3, flatShading: true, roughness: 0.6, metalness: 0.05 });

      const group = new THREE.Group();
      scene.add(group);

      // Per-variant scene construction. Each pushes whatever meshes/
      // geometries/materials it creates onto `disposables` and returns
      // an `animate(t)` callback the render loop below calls every frame.
      let animate: (t: number) => void = () => {};

      if (variant === 'orbit') {
        const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 0), accentMat());
        disposables.push(core.geometry, core.material as THREE.Material);
        group.add(core);

        const satellites: { mesh: THREE.Mesh; radius: number; speed: number; tilt: number; phase: number }[] = [];
        const satelliteGeos = [
          new THREE.TetrahedronGeometry(0.34, 0),
          new THREE.OctahedronGeometry(0.3, 0),
          new THREE.TetrahedronGeometry(0.28, 0),
          new THREE.OctahedronGeometry(0.32, 0),
          new THREE.TetrahedronGeometry(0.3, 0),
        ];
        satelliteGeos.forEach((sg, i) => {
          const mat = i % 2 === 0 ? softMat() : inkMat();
          const mesh = new THREE.Mesh(sg, mat);
          disposables.push(sg, mat);
          group.add(mesh);
          satellites.push({
            mesh,
            radius: 2.05 + i * 0.42,
            speed: 0.16 + i * 0.045,
            tilt: (i / satelliteGeos.length) * Math.PI * 0.7 - 0.35,
            phase: i * 1.3,
          });
        });

        animate = (t: number) => {
          core.rotation.y = t * 0.15;
          core.rotation.x = Math.sin(t * 0.1) * 0.15;
          satellites.forEach((s) => {
            const a = t * s.speed + s.phase;
            const x = Math.cos(a) * s.radius;
            const z = Math.sin(a) * s.radius;
            const y = Math.sin(a * 1.3 + s.tilt) * 0.55 + Math.sin(s.tilt) * 0.4;
            s.mesh.position.set(x, y, z);
            s.mesh.rotation.x = t * 0.6 + s.phase;
            s.mesh.rotation.y = t * 0.4 + s.phase;
          });
        };
      } else if (variant === 'pipeline') {
        const COUNT = 6;
        const blocks: THREE.Mesh[] = [];
        for (let i = 0; i < COUNT; i++) {
          const geo = new THREE.BoxGeometry(0.85, 0.85, 0.85);
          const mat = inkMat();
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set((i - (COUNT - 1) / 2) * 1.35, 0, 0);
          disposables.push(geo, mat);
          blocks.push(mesh);
          group.add(mesh);
        }
        group.rotation.x = -0.18;
        group.rotation.y = 0.5;

        const pulseColor = accentColor.clone();
        const baseColor = new THREE.Color(0x2a2e33);

        animate = (t: number) => {
          group.rotation.y = 0.5 + Math.sin(t * 0.08) * 0.12;
          const cyclePos = (t * 0.55) % COUNT;
          blocks.forEach((b, i) => {
            const d = Math.abs(((i - cyclePos + COUNT / 2) % COUNT) - COUNT / 2);
            const glow = Math.max(0, 1 - d * 1.4);
            (b.material as THREE.MeshStandardMaterial).color.copy(baseColor).lerp(pulseColor, glow);
            b.position.y = glow * 0.28;
            b.rotation.y = t * 0.3 + i;
          });
        };
      } else {
        // 'pulse'
        const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 1), accentMat());
        disposables.push(core.geometry, core.material as THREE.Material);
        group.add(core);
        const shellGeo = new THREE.IcosahedronGeometry(1.5, 1);
        const shellMat = new THREE.MeshStandardMaterial({
          color: accentColor,
          flatShading: true,
          wireframe: true,
          transparent: true,
          opacity: 0.35,
        });
        const shell = new THREE.Mesh(shellGeo, shellMat);
        disposables.push(shellGeo, shellMat);
        group.add(shell);

        animate = (t: number) => {
          const breathe = 1 + Math.sin(t * 0.5) * 0.06;
          core.scale.setScalar(breathe);
          core.rotation.y = t * 0.1;
          shell.scale.setScalar(breathe * 1.18 + Math.sin(t * 0.5 + 0.6) * 0.02);
          shell.rotation.y = -t * 0.07;
          shell.rotation.x = t * 0.05;
        };
      }

      function resize() {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(w, h, false);
      }
      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      let visible = true;
      const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 });
      io.observe(container);

      let clock = 0;
      let last = performance.now();
      function frame(now: number) {
        rafId = requestAnimationFrame(frame);
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        if (disposed || !visible) return;
        if (!reduceMotion) clock += dt;
        animate(clock);
        renderer.render(scene, camera);
      }
      rafId = requestAnimationFrame(frame);

      return () => {
        disposed = true;
        cancelAnimationFrame(rafId);
        resizeObserver.disconnect();
        io.disconnect();
        disposables.forEach((d) => d.dispose());
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      };
    } catch (err) {
      console.warn('LowPolyScene: WebGL setup failed, skipping this illustration.', err);
      return;
    }
  }, [variant, accent]);

  return <div ref={containerRef} className={`w-full h-full ${className}`} aria-hidden="true" />;
};

export default LowPolyScene;
