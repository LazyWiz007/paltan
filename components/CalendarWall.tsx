/**
 * The 30 tiles are the actual shape of what the prompt returns: a calendar
 * split 14 aspirational / 10 educational / 6 life. The counts are information,
 * not decoration -- that split is written into the prompt itself.
 *
 * Titles are blurred at the word level. You can read the structure and see
 * that thirty real ideas exist; you cannot read them. That is the gate,
 * visible.
 */

type Bucket = 'aspirational' | 'educational' | 'life';

const IDEAS: [Bucket, string][] = [
  ['aspirational', 'The year I stopped waiting to feel ready'],
  ['aspirational', 'What nobody tells you about going first'],
  ['aspirational', 'I was the quietest person in every room'],
  ['aspirational', 'The cost of being underestimated'],
  ['aspirational', 'Why your best work goes unseen'],
  ['aspirational', 'Reading the room is a learnable skill'],
  ['aspirational', 'The moment the fear actually stopped'],
  ['aspirational', 'You are not shy, you are unpractised'],
  ['aspirational', 'What confidence looks like from inside'],
  ['aspirational', 'The version of me that never spoke up'],
  ['aspirational', 'Everyone is improvising, including them'],
  ['aspirational', 'The compliment that changed my career'],
  ['aspirational', 'Small rooms before big stages'],
  ['aspirational', 'Being liked is not the same as being heard'],

  ['educational', 'The three-beat structure for any answer'],
  ['educational', 'How to open without clearing your throat'],
  ['educational', 'Pauses do more work than words'],
  ['educational', 'Fixing filler words in one week'],
  ['educational', 'The question that restarts a dead conversation'],
  ['educational', 'How to disagree and stay in the room'],
  ['educational', 'Scripting the first fifteen seconds'],
  ['educational', 'Where to put your hands, actually'],
  ['educational', 'Turning a story into a point'],
  ['educational', 'Practising out loud without cringing'],

  ['life', 'What my morning actually looks like'],
  ['life', 'The books I reread every year'],
  ['life', 'A day of shooting, unedited'],
  ['life', 'The habit I quit and did not miss'],
  ['life', 'Dinner with people who knew me before'],
  ['life', 'What I get wrong, on repeat'],
];

const TONE: Record<Bucket, string> = {
  aspirational: 'text-gold/85 border-gold/25 bg-gold/[0.06]',
  educational: 'text-white/85 border-white/15 bg-white/[0.04]',
  life: 'text-beam-lit/85 border-beam-lit/25 bg-beam/[0.10]',
};

function Legend({ tone, count, label }: { tone: string; count: number; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className={`display text-2xl ${tone}`}>{count}</span>
      <span className="eyebrow text-[0.62rem] text-mist">{label}</span>
    </div>
  );
}

export default function CalendarWall() {
  return (
    <div className="relative">
      <div className="mb-5 flex flex-wrap items-baseline gap-x-7 gap-y-2">
        <Legend tone="text-gold" count={14} label="Aspirational" />
        <Legend tone="text-white" count={10} label="Educational" />
        <Legend tone="text-beam-lit" count={6} label="Life" />
      </div>

      {/* Nearly all of this traffic arrives by QR code, on a phone. Thirty
          tiles at two columns is fifteen rows of scrolling between the hero
          and the form, so on small screens the wall is capped and faded --
          enough to show there is a lot here, without burying the CTA. */}
      <ul
        className="grid max-h-[44vh] grid-cols-2 gap-2 overflow-hidden
                   [mask-image:linear-gradient(to_bottom,black_62%,transparent)]
                   sm:max-h-none sm:grid-cols-3 sm:[mask-image:none] lg:grid-cols-5"
        aria-label="Thirty locked content ideas"
      >
        {IDEAS.map(([bucket, title], i) => (
          <li
            key={i}
            className={`rounded-lg border px-3 py-3.5 ${TONE[bucket]}`}
            style={{ animation: `riseIn 0.5s cubic-bezier(.22,1,.36,1) ${i * 18}ms both` }}
          >
            <span className="eyebrow block text-[0.55rem] opacity-55">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span
              aria-hidden="true"
              className="mt-1.5 block text-[0.78rem] leading-snug select-none"
              style={{ filter: 'blur(4.5px)' }}
            >
              {title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
