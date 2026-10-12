'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUp, Globe2, Sparkles } from 'lucide-react';
import { EXTERNAL, ROUTES } from '../lib/routes';

/**
 * The "Ask Anything" composer on /chat — reused from platform's homepage per
 * spec §3.4: the reasoning/web toggle icons and behavior stay identical, only
 * the surrounding page context changes.
 *
 * Quan Chat is not open to the public yet, so this box is a preview of the
 * composer, not a way in. Sending does NOT navigate anywhere and does NOT
 * clear the box: it shows a plain note under it, and what the visitor typed
 * stays where it is. (It used to send them to a holding page and throw their
 * text away.) Nothing typed here is sent anywhere or stored.
 *
 * Enter does what the send button does, Shift+Enter adds a new line, and the
 * box grows with what you type up to a limit.
 *
 * At launch: bring back an `href` prop and hand off to the app again.
 */
export const AskAnything: React.FC = () => {
  const [reasoningOn, setReasoningOn] = useState(false);
  const [webOn, setWebOn] = useState(false);
  const [notice, setNotice] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const send = () => {
    setNotice(true);
  };

  const grow = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  };

  return (
    <div className="max-w-[720px] mx-auto text-center">
      <h2
        className="m-0 mb-[clamp(34px,5vh,52px)] font-medium text-ink leading-[1.08] tracking-[-0.036em]"
        style={{ fontSize: 'clamp(2rem, 4.4vw, 3.1rem)' }}
      >
        Ask Anything.<span className="typed-cursor" aria-hidden="true" />
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="glow-box relative flex flex-col gap-3.5 p-[22px_22px_14px] bg-white border border-[#E5E5E1] rounded-[28px] text-left"
      >
        <label htmlFor="chat-prompt" className="sr-only">Your prompt</label>
        <textarea
          id="chat-prompt"
          ref={textareaRef}
          rows={1}
          placeholder="Ask Quancis Anything…"
          onInput={() => {
            grow();
            if (notice) setNotice(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              send();
            }
          }}
          className="relative z-[3] w-full border-0 outline-none resize-none bg-transparent text-[1.0625rem] leading-[1.55] text-ink p-[4px_2px] min-h-8 max-h-[220px] placeholder:text-[#9AA0A6]"
        />
        <div className="relative z-[3] flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setReasoningOn((v) => !v)}
              aria-pressed={reasoningOn}
              aria-label="Deep reasoning"
              className={`w-[38px] h-[38px] rounded-full border grid place-items-center transition-colors cursor-pointer ${
                reasoningOn
                  ? 'text-accent-chat border-accent-chat-border bg-accent-chat-soft'
                  : 'text-ink-2 border-[#E8E8E4] hover:text-ink hover:border-[#D6D6D1] hover:bg-surface'
              }`}
            >
              <Sparkles className="h-[17px] w-[17px]" strokeWidth={1.7} />
            </button>
            <button
              type="button"
              onClick={() => setWebOn((v) => !v)}
              aria-pressed={webOn}
              aria-label="Web access"
              className={`w-[38px] h-[38px] rounded-full border grid place-items-center transition-colors cursor-pointer ${
                webOn
                  ? 'text-accent-chat border-accent-chat-border bg-accent-chat-soft'
                  : 'text-ink-2 border-[#E8E8E4] hover:text-ink hover:border-[#D6D6D1] hover:bg-surface'
              }`}
            >
              <Globe2 className="h-[17px] w-[17px]" strokeWidth={1.7} />
            </button>
          </div>
          <button
            type="submit"
            aria-label="Send"
            className="flex-none w-11 h-11 rounded-full bg-ink text-white grid place-items-center hover:bg-[#2B2E32] transition-colors cursor-pointer"
          >
            <ArrowUp className="h-[18px] w-[18px]" strokeWidth={2} />
          </button>
        </div>
      </form>
      {notice ? (
        <div
          role="status"
          className="mt-4 rounded-2xl border border-line bg-surface px-5 py-4 text-left text-[0.9375rem] leading-[1.6] text-ink-2"
        >
          <p className="m-0">
            Quan Chat is not open to the public yet, so this box cannot answer. What you typed is still here, and
            nothing was sent anywhere.
          </p>
          <p className="mb-0 mt-2">
            Kael, the system behind Chat, is available today:{' '}
            <a
              href={EXTERNAL.platform}
              className="border-b border-[#D5D5D1] font-medium text-ink transition-colors hover:border-ink"
            >
              get API access
            </a>{' '}
            or{' '}
            <Link
              href={ROUTES.demo}
              className="border-b border-[#D5D5D1] font-medium text-ink transition-colors hover:border-ink"
            >
              see what Kael has built
            </Link>
            .
          </p>
        </div>
      ) : (
        <p className="mt-4 mb-0 text-sm text-ink-3">A preview of the Quan Chat composer. It is not connected to anything yet.</p>
      )}
    </div>
  );
};

export default AskAnything;
