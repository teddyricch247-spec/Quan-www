'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BrandMark } from '../BrandMark';
import type { SceneHandle, SceneOptions } from './scenes/runtime';

export type SceneName = 'kael' | 'harness' | 'chat';

type SceneFactory = (container: HTMLElement, options: SceneOptions) => SceneHandle;

// Each scene (and three.js with it) is its own chunk: nothing 3D is
// downloaded until a stage is within a few hundred pixels of the viewport.
const LOADERS: Record<SceneName, () => Promise<SceneFactory>> = {
  kael: () => import('./scenes/kaelCube').then((m) => m.createKaelCube),
  harness: () => import('./scenes/harnessLaptop').then((m) => m.createHarnessLaptop),
  chat: () => import('./scenes/chatComposer').then((m) => m.createChatComposer),
};

export interface SceneStageProps {
  scene: SceneName;
  /** What the animation shows, for screen readers (the stage itself is decorative). */
  label: string;
  /** harness + chat: the text the demo types. */
  prompt?: string;
  /** chat: Kael's reply. */
  reply?: string;
  /** chat: show the reply as a file chip. */
  replyAsFile?: boolean;
  className?: string;
}

/** Start building a scene this far before it scrolls into view… */
const NEAR_MARGIN = '240px 0px';
/** …and free its WebGL context once it is this far away again. */
const FAR_MARGIN = '1800px 0px';

/**
 * A rounded stage that hosts one product scene.
 *
 *  - lazy: the scene's code is imported, and its WebGL context created,
 *    only when the stage nears the viewport
 *  - frugal: it animates only while visible and the tab is foregrounded,
 *    and releases its GPU resources when scrolled far away
 *  - resilient: if WebGL is unavailable the stage keeps its (static) brand
 *    mark instead of breaking the page; prefers-reduced-motion gets one
 *    composed still frame instead of a loop
 */
export const SceneStage: React.FC<SceneStageProps> = ({
  scene,
  label,
  prompt,
  reply,
  replyAsFile,
  className = '',
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'idle' | 'ready' | 'failed'>('idle');

  useEffect(() => {
    const host = hostRef.current;
    const mount = mountRef.current;
    if (!host || !mount) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let handle: SceneHandle | null = null;
    let wanted = false;
    let generation = 0;
    let loadingGeneration = -1;
    let inView = false;
    let pageVisible = !document.hidden;
    let failed = false;
    // A scene that stops mid-run (GPU reset, a throwing frame) gets one fresh
    // start; a second stop means this device can't hold it, so the stage keeps
    // its static brand mark.
    let runtimeStops = 0;

    const sync = () => handle?.setActive(inView && pageVisible);

    const destroy = () => {
      wanted = false;
      generation += 1;
      if (handle) {
        handle.dispose();
        handle = null;
        setStatus('idle');
      }
    };

    const create = async () => {
      wanted = true;
      if (handle || failed || loadingGeneration === generation) return;
      const mine = generation;
      loadingGeneration = mine;
      try {
        const factory = await LOADERS[scene]();
        if (!wanted || mine !== generation) return; // torn down while loading
        const created = factory(mount, {
          reducedMotion: motionQuery.matches,
          prompt,
          reply,
          replyAsFile,
          onReady: () => {
            if (mine === generation) setStatus('ready');
          },
          onError: (err) => {
            // A frame threw or the GPU context was lost. The scene has already
            // stopped itself; free it and either restart once or fall back.
            if (mine !== generation) return;
            runtimeStops += 1;
            console.warn(`SceneStage(${scene}): the animation stopped.`, err);
            destroy();
            if (runtimeStops >= 2) {
              failed = true;
              setStatus('failed');
            } else if (inView) {
              void create();
            }
          },
        });
        if (!wanted || mine !== generation) {
          // Torn down (or stopped itself) while it was being built.
          created.dispose();
          return;
        }
        handle = created;
        sync();
      } catch (err) {
        // WebGL missing or blocked: keep the static stage, never take the page down.
        failed = true;
        console.warn(`SceneStage(${scene}): could not start the animation.`, err);
        // A scene that threw halfway through setup may have left a canvas behind.
        while (mount.firstChild) mount.removeChild(mount.firstChild);
        if (mine === generation) setStatus('failed');
      }
    };

    const near = new IntersectionObserver(
      (entries) => {
        // Several changes can arrive in one batch; the last one is the truth.
        const entry = entries[entries.length - 1];
        inView = entry.isIntersecting;
        if (inView) void create();
        sync();
      },
      { rootMargin: NEAR_MARGIN, threshold: 0 }
    );
    const far = new IntersectionObserver(
      (entries) => {
        if (!entries[entries.length - 1].isIntersecting) destroy();
      },
      { rootMargin: FAR_MARGIN, threshold: 0 }
    );
    near.observe(host);
    far.observe(host);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      sync();
    };
    document.addEventListener('visibilitychange', onVisibility);

    let frame = 0;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => handle?.resize());
    });
    resizeObserver.observe(mount);

    return () => {
      near.disconnect();
      far.disconnect();
      resizeObserver.disconnect();
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', onVisibility);
      destroy();
    };
  }, [scene, prompt, reply, replyAsFile]);

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label={label}
      className={`relative isolate aspect-[5/4] w-full overflow-hidden rounded-[28px] border border-line bg-surface ${className}`}
    >
      <div ref={mountRef} className="absolute inset-0" />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-500 ${
          status === 'ready' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <BrandMark
          size={52}
          animated={status === 'idle'}
          className="text-ink motion-reduce:[&_path]:animate-none"
        />
      </div>
    </div>
  );
};

export default SceneStage;
