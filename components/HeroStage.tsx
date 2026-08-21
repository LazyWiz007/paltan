'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

/**
 * The full-height hero.
 *
 * Both stage frames put Paritosh on the right against near-black, gold-flecked
 * space on the left -- so the headline sits in the dark half and never fights
 * his face. The frames cross-fade on their own with a slow push in, which is
 * the "it moves by itself" part; it is ambient, not a carousel, so there are
 * no controls to miss and nothing to click.
 */

const FRAMES = [
  { src: '/founder-stage-close.png', alt: 'Paritosh Anand on stage, mid-sentence' },
  { src: '/founder-stage-wide.png', alt: 'Paritosh Anand speaking under a stage light' },
] as const;

const HOLD_MS = 6500;

export default function HeroStage({ children }: { children: React.ReactNode }) {
  const [frame, setFrame] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setAnimate(true);
    const id = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), HOLD_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative flex min-h-[100svh] w-full items-end overflow-hidden sm:items-center">
      {FRAMES.map((f, i) => (
        <div
          key={f.src}
          aria-hidden={i !== frame}
          // These are 16:9 frames. Covering a tall phone viewport with one
          // crops away three quarters of the width and leaves the headline
          // sitting on his face, so on mobile the photo takes the top band
          // and the copy gets solid dark underneath. Wide screens, where the
          // aspect ratios actually agree, get the full bleed.
          className="absolute inset-x-0 top-0 h-[58%] transition-opacity duration-[1600ms]
                     ease-in-out sm:inset-0 sm:h-full"
          style={{ opacity: i === frame ? 1 : 0 }}
        >
          <Image
            src={f.src}
            alt={i === 0 ? f.alt : ''}
            fill
            priority={i === 0}
            sizes="100vw"
            // Keep his face in the frame as the crop changes shape.
            className="object-cover object-[57%_26%] sm:object-[72%_center]"
            style={
              animate
                ? {
                    animation: `kenburns 22s ease-in-out ${i * 2}s infinite alternate`,
                  }
                : undefined
            }
          />
        </div>
      ))}

      {/* Scrim. Bottom-up on a phone, where the copy sits under his face and
          the photo has to dissolve into the page ground; left-to-right on a
          wide screen, where it sits beside him. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 sm:hidden"
        style={{
          background:
            'linear-gradient(to top, var(--color-stage) 40%, rgba(11,10,18,0.92) 48%, rgba(11,10,18,0.35) 62%, rgba(11,10,18,0.12) 82%, rgba(11,10,18,0.5) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden sm:block"
        style={{
          background:
            'linear-gradient(to right, rgba(11,10,18,0.96) 0%, rgba(11,10,18,0.84) 36%, rgba(11,10,18,0.3) 64%, transparent 100%),' +
            'linear-gradient(to top, var(--color-stage) 0%, transparent 22%)',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-16 pt-24 sm:pb-24">
        {children}
      </div>

      {/* The page continues; say so, quietly. */}
      <div
        aria-hidden="true"
        className="absolute bottom-5 left-1/2 z-10 h-9 w-px -translate-x-1/2
                   bg-gradient-to-b from-transparent via-gold/60 to-transparent"
      />
    </section>
  );
}
