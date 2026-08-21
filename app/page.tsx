import Image from 'next/image';
import Spotlight from '@/components/Spotlight';
import HeroStage from '@/components/HeroStage';
import CalendarWall from '@/components/CalendarWall';
import UnlockForm from '@/components/UnlockForm';

const INPUTS = [
  {
    label: 'Personality',
    body: 'Your hobbies, beliefs, routines, unpopular opinions — the things that make an idea sound like you and not like your niche.',
  },
  {
    label: 'Niche',
    body: 'What you do, what you sell, who you sell it to, and the transformation you put them through.',
  },
  {
    label: 'Goals',
    body: 'Your platforms, your content style, your credibility, and the topics you never want to touch.',
  },
];

export default function Landing() {
  return (
    <main>
      <Spotlight />

      {/* --- Hero: full frame, his face, the headline in the dark half ----- */}
      <HeroStage>
        <div className="max-w-2xl">
          <p className="eyebrow text-[0.6rem] text-gold sm:text-[0.68rem]">
            The system behind 113 pieces a week
          </p>

          <h1 className="display mt-5 text-[2.75rem] sm:text-6xl lg:text-7xl">
            <span className="glow-gold text-gold">30 content ideas</span>
            <br />
            <span className="script glow-white -ml-1 mr-2 inline-block text-[0.62em] normal-case text-white">
              that sound like
            </span>
            <span className="glow-white text-white">you</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
            Paritosh&apos;s own content prompt. It asks you thirteen questions about your
            personality, your niche and your goals — then returns a month of ideas built on his
            strategy, not generic ones your whole niche is already making.
          </p>

          <a
            href="#unlock"
            className="mt-8 inline-flex items-center gap-2.5 rounded-xl bg-gold px-6 py-4
                       font-display text-[0.78rem] font-black uppercase tracking-[0.1em] text-stage
                       transition-colors hover:bg-gold-deep"
            style={{ boxShadow: '0 0 34px rgba(255,192,30,0.34), 0 0 74px rgba(245,163,0,0.16)' }}
          >
            Unlock the Golden AK69 Prompt
          </a>

          <div className="mt-6 flex items-center gap-3">
            <Image
              src="/founder-portrait.png"
              alt=""
              width={80}
              height={80}
              className="h-11 w-11 rounded-full border border-gold/30 object-cover object-top"
            />
            <p className="text-xs leading-snug text-mist/85">
              Paritosh Anand — creator of{' '}
              <span className="font-semibold text-white">Introvert to Icon</span>
              <br />
              4,172 lives transformed, and counting.
            </p>
          </div>
        </div>
      </HeroStage>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-24">
        {/* --- The locked calendar ---------------------------------------- */}
        <section className="pt-20" aria-labelledby="wall-heading">
          <h2 id="wall-heading" className="display text-xl text-white sm:text-2xl">
            What comes back
          </h2>
          <p className="mt-2 mb-7 max-w-lg text-sm text-mist">
            One table, thirty ideas, each with a hook, the core concept, and the psychological
            reason it works.
          </p>
          <CalendarWall />
        </section>
      </div>

      {/* --- The three inputs, over the room where the work happens -------- */}
      <section className="relative overflow-hidden py-20" aria-labelledby="inputs-heading">
        <Image
          src="/founder-workshop.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(11,10,18,0.97) 0%, rgba(11,10,18,0.88) 30%, rgba(11,10,18,0.9) 70%, rgba(11,10,18,0.98) 100%)',
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-5">
          <h2 id="inputs-heading" className="display text-xl text-white sm:text-2xl">
            What it asks you for
          </h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {INPUTS.map((input) => (
              <div key={input.label} className="panel bg-stage/70 p-5 backdrop-blur-sm">
                <h3 className="eyebrow text-[0.62rem] text-gold">{input.label}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-mist">{input.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-xl text-sm text-mist/80">
            The prompt is only as good as what you put in. Answer properly and the ideas are
            yours; write &ldquo;I&apos;m a fitness coach&rdquo; and you&apos;ll get what everyone
            else gets.
          </p>
        </div>
      </section>

      {/* --- Unlock ------------------------------------------------------- */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-24">
        <section id="unlock" className="scroll-mt-8 pt-20" aria-labelledby="unlock-heading">
          <div className="panel mx-auto max-w-md p-6 sm:p-8">
            <h2 id="unlock-heading" className="display text-2xl text-white">
              <span className="glow-white">Unlock it</span>
            </h2>
            <p className="mt-2 mb-6 text-sm text-mist">
              Name and email, and the prompt is on the next page.
            </p>
            <UnlockForm />
          </div>
        </section>

        <footer className="mt-20 text-center text-xs text-mist/55">
          © {new Date().getFullYear()} Paritosh Anand
        </footer>
      </div>
    </main>
  );
}
