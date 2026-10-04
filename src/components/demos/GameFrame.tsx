'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ExternalLink, Maximize2, Play, Square } from 'lucide-react';

/**
 * The player on a demo's page. It shows the cover with a Play button, and only
 * loads the demo (three.js, WebGL context, audio) once someone presses Play, so
 * the page is fast and nothing starts making noise or grabbing the keyboard on
 * its own. Stop unloads it again and frees the GPU context.
 *
 * `children` is the cover, rendered on the server and passed in.
 * `fileHref` is the raw HTML file, also offered as "Open full screen", which is
 * the most reliable way to play on a phone (iPhone Safari cannot put an iframe
 * into fullscreen, and a touch game inside a scrolling page fights the scroll).
 */
export const GameFrame: React.FC<{
  src: string;
  title: string;
  fileHref: string;
  children: React.ReactNode;
}> = ({ src, title, fileHref, children }) => {
  const [playing, setPlaying] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setCanFullscreen(typeof document !== 'undefined' && document.fullscreenEnabled === true);
  }, []);

  const goFullscreen = useCallback(() => {
    const el = frameRef.current;
    if (el && el.requestFullscreen) {
      el.requestFullscreen().catch(() => {
        /* the browser said no; "Open full screen" below still works */
      });
    }
  }, []);

  return (
    <div>
      <div className="relative aspect-[4/3] min-h-[460px] w-full overflow-hidden rounded-[20px] border border-line bg-[#07080b] sm:aspect-[16/10] sm:min-h-[400px]">
        {playing ? (
          <iframe
            ref={frameRef}
            src={src}
            title={title}
            allow="fullscreen; autoplay"
            allowFullScreen
            onLoad={() => frameRef.current?.focus()}
            className="absolute inset-0 h-full w-full border-0 bg-[#07080b]"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${title}`}
            className="group absolute inset-0 block h-full w-full cursor-pointer text-left"
          >
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.02]">
              {children}
            </div>
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),rgba(0,0,0,0)_55%)]"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="btn-pill btn-pill-glass">
                <Play className="h-4 w-4" strokeWidth={2} fill="currentColor" />
                Play {title}
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.9375rem]">
        {playing ? (
          <button
            type="button"
            onClick={() => setPlaying(false)}
            className="inline-flex items-center gap-2 font-medium text-ink-2 transition-colors hover:text-ink cursor-pointer"
          >
            <Square className="h-3.5 w-3.5" strokeWidth={2} fill="currentColor" />
            Stop
          </button>
        ) : null}
        {playing && canFullscreen ? (
          <button
            type="button"
            onClick={goFullscreen}
            className="inline-flex items-center gap-2 font-medium text-ink-2 transition-colors hover:text-ink cursor-pointer"
          >
            <Maximize2 className="h-4 w-4" strokeWidth={1.8} />
            Fullscreen
          </button>
        ) : null}
        <a
          href={fileHref}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 font-medium text-ink-2 transition-colors hover:text-ink cursor-pointer"
        >
          <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
          Open full screen in a new tab
        </a>
        <span className="text-sm text-ink-3">Best on a phone: use the full-screen tab.</span>
      </div>
    </div>
  );
};

export default GameFrame;
