'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Copy } from 'lucide-react';

type Lang = 'python' | 'typescript' | 'curl' | 'langchain';

// Same endpoint, same auth shape, same model name as platform's own
// Integration section — this is the real api.quancis.space/v1 surface,
// not a simplified stand-in, so it's safe to mirror verbatim here.
const CODE_SNIPPETS: Record<Lang, string> = {
  python: `import openai

# Quancis is 100% drop-in compatible with the OpenAI SDK.
client = openai.OpenAI(
    api_key="sk-quan-...",
    base_url="https://api.quancis.space/v1",
)

response = client.chat.completions.create(
    model="kael-beta",
    messages=[
        {"role": "system", "content": "You are a helpful coding assistant."},
        {"role": "user", "content": "Refactor our distributed cache..."},
    ],
)

print(response.choices[0].message.content)`,
  typescript: `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.QUANCIS_API_KEY,
  baseURL: "https://api.quancis.space/v1",
});

const response = await client.chat.completions.create({
  model: "kael-beta",
  messages: [
    { role: "system", content: "You are a helpful coding assistant." },
    { role: "user", content: "Refactor our distributed cache..." },
  ],
});

console.log(response.choices[0].message.content);`,
  curl: `curl https://api.quancis.space/v1/chat/completions \\
  -H "Authorization: Bearer $QUANCIS_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "kael-beta",
    "messages": [
      {"role": "user", "content": "Refactor our distributed cache..."}
    ]
  }'`,
  langchain: `from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="kael-beta",
    api_key="sk-quan-...",
    base_url="https://api.quancis.space/v1",
)

llm.invoke("Refactor our distributed cache...")`,
};

const TABS: { id: Lang; label: string }[] = [
  { id: 'python', label: 'Python' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'curl', label: 'cURL' },
  { id: 'langchain', label: 'LangChain' },
];

/**
 * Kael's Integration section — the same tab-switcher pattern shipped on
 * platform's homepage (same API, same snippets), sized for a teaser
 * rather than full documentation: one endpoint, four languages, a
 * working copy button. Full request/response shapes, error handling,
 * streaming, and every parameter still live in the real docs — this
 * is "here's how little it takes to switch," not a docs replacement.
 */
export const CodeIntegration: React.FC = () => {
  const [tab, setTab] = useState<Lang>('python');
  const [copied, setCopied] = useState(false);
  const [direction, setDirection] = useState(1);

  const handleTabChange = (next: Lang) => {
    if (next === tab) return;
    const from = TABS.findIndex((t) => t.id === tab);
    const to = TABS.findIndex((t) => t.id === next);
    setDirection(to > from ? 1 : -1);
    setTab(next);
  };

  const trayRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<Lang, HTMLButtonElement | null>>({
    python: null,
    typescript: null,
    curl: null,
    langchain: null,
  });
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const positionIndicator = useCallback((id: Lang) => {
    const tray = trayRef.current;
    const btn = tabRefs.current[id];
    if (!tray || !btn) return;
    const trayRect = tray.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const trayBorderLeft = parseFloat(getComputedStyle(tray).borderLeftWidth) || 0;
    setIndicator({ left: btnRect.left - trayRect.left - trayBorderLeft, width: btnRect.width });
  }, []);

  useLayoutEffect(() => {
    positionIndicator(tab);
  }, [tab, positionIndicator]);

  useEffect(() => {
    const onResize = () => positionIndicator(tab);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [tab, positionIndicator]);

  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);
  const codeSlide = reduceMotion ? 0 : 14;
  const codeVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * codeSlide }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -codeSlide }),
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(CODE_SNIPPETS[tab])
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Clipboard write can fail (insecure context, permission denied) —
        // fail quietly rather than claiming success or throwing an
        // unhandled rejection.
      });
  };

  return (
    <div className="bg-surface rounded-[24px] p-[clamp(28px,4vw,48px)]">
      <span className="text-xs font-medium tracking-[0.14em] uppercase text-ink-3">Integration</span>
      <h2
        className="mt-3 mb-3 font-medium leading-[1.14] tracking-[-0.03em] text-ink"
        style={{ fontSize: 'clamp(1.6rem, 2.9vw, 2.25rem)' }}
      >
        Swap The Base URL.
      </h2>
      <p className="mb-1.5 text-ink-2 leading-[1.6]" style={{ fontSize: 'clamp(0.9375rem, 1.05vw, 1.0625rem)' }}>
        No custom SDK. No migration. If you already speak OpenAI, you already speak Quancis — point the SDK you
        already have at our base URL, keep your existing auth pattern, and everything downstream keeps working.
      </p>
      <code className="block mb-[clamp(26px,3.4vw,36px)] font-mono text-sm text-ink-3 break-all">
        https://api.quancis.space/v1
      </code>

      <div className="flex items-center justify-between gap-3.5 mb-4">
        <div className="overflow-x-auto [scrollbar-width:none]">
          <div
            ref={trayRef}
            role="tablist"
            aria-label="Code examples"
            className="tabbar-glass relative inline-flex gap-0.5 p-1 rounded-full whitespace-nowrap"
          >
            {indicator && (
              <div aria-hidden="true" className="tab-indicator-glass" style={{ left: indicator.left, width: indicator.width }} />
            )}
            {TABS.map((t) => (
              <button
                key={t.id}
                id={`code-tab-${t.id}`}
                ref={(el) => {
                  tabRefs.current[t.id] = el;
                }}
                role="tab"
                aria-selected={tab === t.id}
                aria-controls="code-tabpanel"
                onClick={() => handleTabChange(t.id)}
                className={`relative z-10 h-[38px] px-[18px] rounded-full text-[0.8125rem] font-medium cursor-pointer transition-colors ${
                  tab === t.id && indicator ? 'text-white' : 'text-[#6E747A] hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="btn-glass-outline flex-none h-9 px-4 rounded-full text-ink-2 text-[0.8125rem] font-medium hover:text-ink transition-colors cursor-pointer flex items-center gap-1.5"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div id="code-tabpanel" role="tabpanel" aria-labelledby={`code-tab-${tab}`} className="bg-code-bg rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.pre
            key={tab}
            custom={direction}
            variants={codeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
            className="m-0 p-[26px_24px_28px] overflow-x-auto font-mono text-[12.75px] leading-[1.78] text-code-ink"
          >
            <code>{CODE_SNIPPETS[tab]}</code>
          </motion.pre>
        </AnimatePresence>
      </div>

      <p className="mt-5 mb-0 text-sm text-ink-3 leading-[1.6]">
        This covers the shape of a request in four languages — request/response schemas, streaming, error codes, and
        every parameter live in the full docs, which this page isn&apos;t trying to replace.
      </p>
    </div>
  );
};

export default CodeIntegration;
