'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'sending' | 'flooding';

export default function UnlockForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<{ field: string; message: string } | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const mountedAt = useRef(Date.now());

  const busy = status !== 'idle';

  // Send the cursor to whatever needs fixing. This has to wait for the commit
  // that re-enables the inputs -- focus() is a no-op on a disabled element,
  // which is exactly where they are while the request is in flight.
  useEffect(() => {
    if (!error) return;
    if (error.field === 'name') nameRef.current?.focus();
    else if (error.field === 'email') emailRef.current?.focus();
  }, [error]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;

    setError(null);
    setStatus('sending');

    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      ak69_hp: data.get('ak69_hp') != null, // honeypot: ticked means bot
      elapsed: Date.now() - mountedAt.current,
    };

    let res: Response;
    try {
      res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      setStatus('idle');
      setError({ field: 'form', message: 'No connection. Check your network and try again.' });
      return;
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setStatus('idle');
      setError({
        field: body.field ?? 'form',
        message: body.message ?? 'Something went wrong. Try again.',
      });
      return;
    }

    // The one big moment: the stage floods, and the flood carries into the
    // route change so the prompt page opens already lit.
    setStatus('flooding');
    router.prefetch('/prompt');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => router.push('/prompt'), reduce ? 0 : 780);
  }

  const fieldClass = (field: string) =>
    `w-full rounded-xl border bg-stage-2/80 px-4 py-3.5 text-base text-white
     placeholder:text-mist/45 transition-colors
     ${error?.field === field ? 'border-red-400/70' : 'border-white/12 focus:border-gold/60'}`;

  return (
    <>
      {status === 'flooding' && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed left-1/2 top-1/2 z-50 h-[60vmax] w-[60vmax]
                     -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,192,30,0.85) 0%, rgba(245,163,0,0.5) 35%, transparent 70%)',
            animation: 'flood 800ms cubic-bezier(.4,0,.2,1) forwards',
          }}
        />
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-3">
        <div>
          <label htmlFor="name" className="eyebrow mb-1.5 block text-[0.62rem] text-mist">
            Your name
          </label>
          <input
            ref={nameRef}
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            enterKeyHint="next"
            placeholder="Paritosh Anand"
            disabled={busy}
            className={fieldClass('name')}
          />
        </div>

        <div>
          <label htmlFor="email" className="eyebrow mb-1.5 block text-[0.62rem] text-mist">
            Your email
          </label>
          <input
            ref={emailRef}
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            enterKeyHint="go"
            placeholder="you@example.com"
            disabled={busy}
            className={fieldClass('email')}
          />
        </div>

        {/* A checkbox, not a text field. Chrome's autofill and password
            managers fill every text input they find in a form no matter what
            it is called, which locked real people out of their own signup --
            but nothing autofills a checkbox. Bots that tick everything still
            get caught. */}
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <input id="ak69_hp" name="ak69_hp" type="checkbox" tabIndex={-1} defaultChecked={false} />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-300">
            {error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="group relative w-full overflow-hidden rounded-xl bg-gold px-6 py-4
                     font-display text-[0.82rem] font-black uppercase tracking-[0.1em] text-stage
                     transition-all hover:bg-gold-deep active:scale-[0.99]
                     disabled:cursor-wait disabled:opacity-80"
          style={{ boxShadow: '0 0 34px rgba(255,192,30,0.34), 0 0 74px rgba(245,163,0,0.16)' }}
        >
          {status === 'idle' && 'Unlock the Golden AK69 Prompt'}
          {status === 'sending' && 'Unlocking…'}
          {status === 'flooding' && 'Unlocked'}
        </button>

        <p className="pt-0.5 text-center text-xs text-mist/70">
          One email. No spam, and you can leave whenever you like.
        </p>
      </form>
    </>
  );
}
