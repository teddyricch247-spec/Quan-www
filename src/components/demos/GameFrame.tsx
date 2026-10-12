'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Download, ExternalLink, Maximize2, Play, Square } from 'lucide-react';

/**
 * The player on a demo's page. It shows the cover with a Play button, and only
 * loads the demo (three.js, WebGL context, audio) once someone presses the button, so
 * the page is fast and nothing starts making noise or grabbing the keyboard on
 * its own. Stop unloads it again and frees the GPU context.
 *
 * `children` is the cover, rendered on the server and passed in.
 * `fileHref` is the raw HTML file, also offered as "Open full screen", which is
 * the most reliable way to play on a phone (iPhone Safari cannot put an iframe
 * into fullscreen, and a touch game inside a scrolling page fights the scroll),
 * and as a download so the single file can be kept and opened offline (the
 * three.js library it loads still needs a connection).
 */
export const GameFrame: React.FC<{
  src: string;
  title: string;
  fileHref: string;
  /** 'Play' for a game, 'Try' for a simulation. */
  verb?: 'Play' | 'Try';
  children: React.ReactNode;
}> = ({ src, title, fileHref, verb = 'Play', children }) => {
  const [playing, setPlaying] = useState(false);
  // True once the demo's page has finished loading. Until then the cover stays
  // up under a "Loading" label: the demo pulls three.js from a CDN, which can
  // take a few seconds on a phone, and a bare black box looks broken.
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  // The loading cover fades out, then is removed, so a finished demo does not
  // keep an invisible full-size layer (and its filters) above the WebGL canvas.
  const [covered, setCovered] = useState(true);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setCanFullscreen(typeof document !== 'undefined' && document.fullscreenEnabled === true);
  }, []);

  // If the page has not loaded after a while, say why it might be and point at
  // the other way in, instead of leaving a spinner-less box up forever.
  useEffect(() => {
    if (!playing || loaded) {
      setSlow(false);
      return;
    }
    const t = setTimeout(() => setSlow(true), 12000);
    return () => clearTimeout(t);
  }, [playing, loaded]);

  useEffect(() => {
    if (!playing) return;
    if (!loaded) {
      setCovered(true);
      return;
    }
    const t = setTimeout(() => setCovered(false), 600);
    return () => clearTimeout(t);
  }, [playing, loaded]);

  const stop = useCallback(() => {
    setPlaying(false);
    setLoaded(false);
    setCovered(true);
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
          <>
            <iframe
              ref={frameRef}
              src={src}
              title={title}
              allow="fullscreen; autoplay"
              allowFullScreen
              onLoad={() => {
                setLoaded(true);
                frameRef.current?.focus();
              }}
              className="absolute inset-0 h-full w-full border-0 bg-[#07080b]"
            />
            {covered ? (
              <div
                aria-hidden={loaded}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  loaded ? 'pointer-events-none opacity-0' : 'opacity-100'
                }`}
              >
                <div className="absolute inset-0">{children}</div>
                <span aria-hidden="true" className="absolute inset-0 bg-black/50" />
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                  <span role="status" className="btn-pill btn-pill-glass">
                    Loading {title}…
                  </span>
                  {slow ? (
                    <span className="max-w-[38ch] text-sm leading-snug text-white/90">
                      Still loading. The demo fetches its 3D library from a public CDN, so a slow or blocked connection
                      stalls it.{' '}
                      <a href={fileHref} target="_blank" rel="noopener" className="font-medium underline underline-offset-2">
                        Try it in its own tab
                      </a>
                      .
                    </span>
                  ) : null}
                </span>
              </div>
            ) : null}
          </>
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`${verb} ${title}`}
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
                {verb} {title}
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.9375rem]">
        {playing ? (
          <button
            type="button"
            onClick={stop}
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
          className="hidden items-center gap-2 font-medium text-ink-2 transition-colors hover:text-ink cursor-pointer sm:inline-flex"
        >
          <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
          Open full screen in a new tab
        </a>
        <a
          href={fileHref}
          download={fileHref.split('/').pop()}
          className="inline-flex items-center gap-2 font-medium text-ink-2 transition-colors hover:text-ink cursor-pointer"
        >
          <Download className="h-4 w-4" strokeWidth={1.8} />
          Download the HTML file
        </a>
      </div>

      {/* On a phone the in-page player is the worse way to play: a touch game
          inside a scrolling page fights the scroll, and iPhone Safari cannot
          put an iframe into fullscreen. So say so, and make the better way a
          proper button rather than a grey line. */}
      <div className="mt-4 sm:hidden">
        <a href={fileHref} target="_blank" rel="noopener" className="btn-pill btn-pill-dark w-full justify-center">
          <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
          Open full screen
        </a>
        <p className="mt-2 text-center text-sm text-ink-3">Best on a phone: it fills the screen and scrolling cannot interfere.</p>
      </div>
    </div>
  );
};

export default GameFrame;
