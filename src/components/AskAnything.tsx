'use client';

import React, { useState } from 'react';
import { ArrowUp, Globe2, Sparkles } from 'lucide-react';
import { EXTERNAL } from '../lib/routes';

export interface AskAnythingProps {
  /** Where the send button hands off to. Defaults to the Chat app,
   *  since this repo has no chat backend of its own (zero auth, zero
   *  dashboard code — spec §Part 3 intro). */
  href?: string;
}

/**
 * The "Ask Anything" composer — reused unchanged from platform's
 * homepage per spec §3.4: "this is its new home. Keep the
 * reasoning/web toggle icons and behavior identical; only the
 * surrounding page context changes." The textarea and toggles are a
 * live preview of the interaction; sending hands off to the real Quan
 * Chat app, the same way this exact component handed off to sign-in
 * on platform.
 */
export const AskAnything: React.FC<AskAnythingProps> = ({ href = EXTERNAL.appChat }) => {
  const [reasoningOn, setReasoningOn] = useState(false);
  const [webOn, setWebOn] = useState(false);

  return (
    <div className="max-w-[720px] mx-auto text-center">
      <h2
        className="m-0 mb-[clamp(34px,5vh,52px)] font-medium text-ink leading-[1.08] tracking-[-0.036em]"
        style={{ fontSize: 'clamp(2rem, 4.4vw, 3.1rem)' }}
      >
        Ask Anything.<span className="typed-cursor" />
      </h2>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="glow-box relative flex flex-col gap-3.5 p-[22px_22px_14px] bg-white border border-[#E5E5E1] rounded-[28px] text-left"
      >
        <label htmlFor="chat-prompt" className="sr-only">Your prompt</label>
        <textarea
          id="chat-prompt"
          rows={1}
          placeholder="Ask Quancis Anything…"
          className="relative z-[3] w-full border-0 outline-none resize-none bg-transparent text-[1.0625rem] leading-[1.55] text-ink p-[4px_2px] min-h-8 placeholder:text-[#9AA0A6]"
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
          <a
            href={href}
            aria-label="Send"
            className="flex-none w-11 h-11 rounded-full bg-ink text-white grid place-items-center hover:bg-[#2B2E32] transition-colors cursor-pointer"
          >
            <ArrowUp className="h-[18px] w-[18px]" strokeWidth={2} />
          </a>
        </div>
      </form>
    </div>
  );
};

export default AskAnything;
