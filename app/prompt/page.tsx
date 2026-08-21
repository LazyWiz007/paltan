import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PROMPT_TEXT } from '@/lib/prompt';
import { GATE_COOKIE, verifyToken } from '@/lib/gate';
import CopyPrompt from '@/components/CopyPrompt';
import CourseCta from '@/components/CourseCta';

// Without this Google indexes the prompt and the gate is decorative.
export const metadata: Metadata = {
  title: 'Your prompt — Paritosh Anand',
  robots: { index: false, follow: false },
};

const STEPS = [
  'Tap Copy Prompt',
  'Open ChatGPT',
  'Paste it in',
  'Answer the questions',
  'Get your 30 ideas',
];

export default async function PromptPage() {
  const token = (await cookies()).get(GATE_COOKIE)?.value;
  if (!verifyToken(token)) redirect('/');

  return (
    <main className="relative z-10 mx-auto w-full max-w-3xl px-5 pb-20 pt-12 sm:pt-16">
      <header className="rise">
        <p className="eyebrow text-[0.6rem] text-gold">Unlocked</p>
        <h1 className="display mt-4 text-4xl text-white sm:text-5xl">
          <span className="glow-white">Here it is</span>
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-mist sm:text-base">
          Copy the whole thing, paste it into ChatGPT, and answer the thirteen questions properly.
          The detail you put in is what makes the ideas yours.
        </p>
      </header>

      {/* Steps first: they tell you what to do with the wall of text below. */}
      <ol className="mt-9 flex flex-wrap gap-2" aria-label="How to use the prompt">
        {STEPS.map((step, i) => (
          <li
            key={step}
            className="flex items-center gap-2 rounded-lg border border-white/10
                       bg-stage-2/70 px-3 py-2 text-xs text-mist"
          >
            <span className="display text-[0.7rem] text-gold">{i + 1}</span>
            {step}
          </li>
        ))}
      </ol>

      <div className="panel mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-2.5">
          <span className="eyebrow text-[0.58rem] text-mist">Paste this into ChatGPT</span>
          <span className="font-mono text-[0.65rem] text-mist/60">
            {PROMPT_TEXT.split(/\s+/).length} words
          </span>
        </div>
        <pre
          id="prompt-text"
          className="max-h-[55vh] overflow-auto px-4 py-4 font-mono text-[0.72rem]
                     leading-relaxed whitespace-pre-wrap break-words text-white/85 sm:text-[0.78rem]"
        >
          {PROMPT_TEXT}
        </pre>
      </div>

      <div className="mt-4">
        <CopyPrompt text={PROMPT_TEXT} />
      </div>

      <CourseCta />

      <footer className="mt-14 text-center text-xs text-mist/55">
        © {new Date().getFullYear()} Paritosh Anand
      </footer>
    </main>
  );
}
