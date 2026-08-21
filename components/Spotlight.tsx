'use client';

import { useEffect, useState } from 'react';

/**
 * The page's signature: a stage light you move.
 *
 * The course poster is a man stepping out of the dark into a spotlight, and
 * this page is content sitting in the dark until you unlock it. Same idea, so
 * the light is the interaction.
 *
 * The beam controls brightness only. Legibility is controlled by the blur on
 * the locked tiles, which no amount of light removes -- that is the gate.
 */
export default function Spotlight() {
  const [drifting, setDrifting] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight * 0.24;

    const paint = () => {
      raf = 0;
      document.documentElement.style.setProperty('--mx', `${x}px`);
      document.documentElement.style.setProperty('--my', `${y}px`);
    };

    const aim = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      // First real input wins; the ambient drift steps aside.
      setDrifting(false);
      if (!raf) raf = requestAnimationFrame(paint);
    };

    window.addEventListener('pointermove', aim, { passive: true });
    window.addEventListener('pointerdown', aim, { passive: true });
    return () => {
      window.removeEventListener('pointermove', aim);
      window.removeEventListener('pointerdown', aim);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        // Gold at the hot centre falling off through the rig's blue, so the
        // beam belongs to the same room as the background wash.
        background:
          'radial-gradient(38rem circle at var(--mx) var(--my), rgba(255,192,30,0.14), rgba(74,95,217,0.07) 40%, transparent 66%)',
        animation: drifting ? 'drift 14s ease-in-out infinite' : undefined,
        transition: 'opacity 300ms ease',
      }}
    />
  );
}
