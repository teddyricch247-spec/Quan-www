'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import type { HeroCanvasProps } from './HeroCanvas';

// HeroCanvas is the only thing on the first screen that pulls in three.js, and
// it used to be bundled with the page, so every visitor (phones included)
// downloaded and parsed it before the page could react to a tap. It is now its
// own chunk, loaded only after the page has finished its first, important
// work. The hero text and the flat dark background are server-rendered and do
// not wait for it.
const HeroCanvas = dynamic(() => import('./HeroCanvas').then((m) => m.HeroCanvas), { ssr: false });

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/**
 * Mounts the 3D hero background when the browser is idle.
 *
 *  - not at all when the visitor has asked their browser to save data, or is
 *    on a 2G-class connection: the hero keeps its flat dark background, which
 *    is the same fallback HeroCanvas already uses when WebGL is missing
 *  - everyone else gets the canvas a moment after first paint, faded in
 *
 * HeroCanvas itself already pauses when the hero is off screen and draws one
 * still frame under prefers-reduced-motion.
 */
export const HeroBackdrop: React.FC<HeroCanvasProps> = (props) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    if (connection?.saveData || connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g') {
      return;
    }

    const start = () => setReady(true);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    // Safari has no requestIdleCallback.
    const timer = window.setTimeout(start, 250);
    return () => window.clearTimeout(timer);
  }, []);

  if (!ready) return null;
  return (
    <div className="hero-canvas-in absolute inset-0 -z-10">
      <HeroCanvas {...props} />
    </div>
  );
};

export default HeroBackdrop;
