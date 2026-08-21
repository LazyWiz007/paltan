'use client';

import { useEffect, useRef, useState } from 'react';

type State = 'idle' | 'copied' | 'failed';

export default function CopyPrompt({ text }: { text: string }) {
  const [state, setState] = useState<State>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    clearTimeout(timer.current);
    try {
      // Called first, with nothing awaited before it -- Safari revokes the
      // user gesture across an await and would reject the write.
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch {
      // Non-secure origins have no clipboard API at all, and some browsers
      // refuse the write outright. Select the prompt so the phone's own
      // Copy button appears -- nobody is hand-selecting 190 lines.
      const pre = document.getElementById('prompt-text');
      if (pre) {
        const range = document.createRange();
        range.selectNodeContents(pre);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        pre.scrollIntoView({ block: 'center' });
      }
      setState('failed');
    }
    timer.current = setTimeout(() => setState('idle'), 2600);
  }

  const label =
    state === 'copied'
      ? 'Copied — now open ChatGPT'
      : state === 'failed'
        ? 'Selected — press copy on your keyboard'
        : 'Copy Prompt';

  return (
    <div className="sticky bottom-4 z-30">
      <button
        type="button"
        onClick={copy}
        aria-live="polite"
        className="w-full rounded-xl bg-gold px-6 py-4 font-display text-[0.82rem] font-black
                   uppercase tracking-[0.1em] text-stage transition-colors
                   hover:bg-gold-deep active:scale-[0.99]"
        style={{ boxShadow: '0 0 34px rgba(255,192,30,0.4), 0 0 80px rgba(245,163,0,0.2)' }}
      >
        {label}
      </button>
    </div>
  );
}
