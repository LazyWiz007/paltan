import Image from 'next/image';

const CHECKOUT_URL =
  'https://learn.paritoshanand.com/web/checkout/68c11d92d8833032c99e2298';

export default function CourseCta() {
  return (
    <section
      className="panel mt-16 overflow-hidden p-0"
      aria-labelledby="course-heading"
    >
      <Image
        src="/introvert-to-icon.png"
        alt="Introvert to Icon — a communications course by Paritosh Anand"
        width={1920}
        height={1080}
        className="h-40 w-full object-cover object-left sm:h-52"
        sizes="(max-width: 640px) 100vw, 768px"
      />

      <div className="p-6 sm:p-8">
        <p className="eyebrow text-[0.6rem] text-gold">The course this came from</p>

        <h2 id="course-heading" className="display mt-3 text-2xl text-white sm:text-3xl">
          <span className="glow-gold text-gold">Introvert</span>{' '}
          <span className="script text-[0.7em] normal-case text-white">to</span>{' '}
          <span className="glow-white text-white">Icon</span>
        </h2>

        <p className="mt-3 max-w-lg text-sm leading-relaxed text-mist">
          Ideas are the easy half. Saying them out loud — on camera, on a stage, in the room —
          is the half that changes things. That&apos;s the whole course.
        </p>

        <a
          href={CHECKOUT_URL}
          className="mt-6 inline-flex rounded-xl border border-gold/45 px-6 py-3.5
                     font-display text-[0.74rem] font-black uppercase tracking-[0.1em]
                     text-gold transition-colors hover:bg-gold hover:text-stage"
        >
          See the course
        </a>
      </div>
    </section>
  );
}
