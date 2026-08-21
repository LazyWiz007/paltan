import 'server-only';

/**
 * Paritosh's content-idea prompt, from his Google Doc.
 *
 * SERVER ONLY. This module must never be imported from a client component --
 * the `server-only` import above turns that mistake into a build error, which
 * is what keeps the prompt out of the browser bundle before the gate opens.
 *
 * To update: replace the text below. Nothing else needs to change.
 */
export const PROMPT_TEXT = `CONTENT IDEA GENERATOR (30-DAY CONTENT SYSTEM)
Copy everything below into ChatGPT and replace the answers with your own.

YOUR ROLE
You are a world-class content strategist.
Your job is NOT to write scripts.
Your job is to create 30 unique, high-performing content ideas that are specifically designed for MY brand.
The ideas should feel original, emotionally engaging and highly shareable.
Avoid generic topics that every creator in my niche is already making.
Every idea should have a strong psychological reason for existing.

STEP 1 — DEFINE MY BRAND
1. Is this for:
- Personal Brand
- Business
Answer:

2. Name of Brand
Answer:

3. What do I do?
(Explain in detail.)
Answer:

4. What products/services do I sell?
Answer:

5. Who is my ideal audience?
Describe them in detail.
Include:
- Age
- Profession
- Income level
- Interests
- Goals
- Biggest frustrations
- Biggest fears
- Biggest desires
- What keeps them awake at night
Answer:

6. What transformation do I provide?
Before me:
After me:

7. List my expertise.
What topics can I confidently speak about?
List everything.
Answer:

8. What makes me different?
Why should someone listen to me instead of everyone else?
Answer:

9. Tell me about ME.
This is important.
Mention things like:
- hobbies
- interests
- sports
- family
- work
- routines
- travel
- favourite books
- favourite movies
- favourite food
- personality
- beliefs
- unpopular opinions
- lifestyle
- passions
- businesses
- side projects
The more details I provide, the better.
Answer:

10. My achievements
Anything that creates credibility.
Examples:
- revenue
- awards
- followers
- clients
- experience
- certifications
- transformations
- milestones
Answer:

11. My content style
Examples:
- humorous
- educational
- cinematic
- storytelling
- direct
- emotional
- controversial
- data-driven
- documentary
- luxury
- premium
Answer:

12. Platforms
Instagram
YouTube
LinkedIn
X
TikTok
Others
Answer:

13. Any topics I never want to make content on?
Answer:

STEP 2 — BUILD MY CONTENT STRATEGY
Using all the information above, create a 30-piece content calendar.
Do NOT generate scripts.
Generate only ideas.
The ideas should be divided into the following buckets.

1. ASPIRATIONAL (14 Ideas)
Purpose:
Attract new audiences.
These ideas should create curiosity, aspiration, emotion, desire, urgency or relatability.
The audience should think:
"I want this."
"I need this."
"This person understands me."
"I should follow them."
The content should primarily attack:
- insecurities
- ambitions
- frustrations
- dreams
- identity
- misconceptions
- limiting beliefs
These ideas should be highly shareable.

2. EDUCATIONAL (10 Ideas)
Purpose:
Build trust.
Teach people.
Demonstrate expertise.
Give actionable advice.
Break down complicated concepts into simple frameworks.
Avoid generic tips.
Every educational idea should make the audience think:
"I learnt something valuable."
"This person clearly knows what they're talking about."

3. LIFE CONTENT (6 Ideas)
Purpose:
Strengthen connection.
These ideas should show my personality beyond my profession.
Include ideas around:
- work
- hobbies
- travel
- routines
- behind the scenes
- struggles
- wins
- relationships
- interests
- opinions
- fun moments
- passions
- day in the life
- lessons from everyday experiences
The audience should feel like they know me personally.

STEP 3 — OUTPUT FORMAT
Present everything inside a table.
Columns:
| Bucket | Title/Hook | Core Idea | Why It Works |
The Title/Hook should immediately grab attention.
The Core Idea should explain the concept in 2–3 sentences without writing the full script.
The Why It Works column should explain the psychological trigger behind the idea (curiosity, identity, aspiration, fear, social proof, relatability, authority, belonging, etc.).

IMPORTANT RULES
- Do NOT generate generic content.
- Do NOT recycle the same idea multiple times.
- Every idea should have a unique angle.
- Prioritize originality over trends.
- Mix storytelling, opinions, frameworks, observations, experiments, case studies, myths, mistakes, lessons and personal experiences.
- The ideas should be specific enough that I can immediately record them without needing to brainstorm further.
- If you feel important information about my brand is missing, ask me clarifying questions before generating the ideas instead of making assumptions.
- Think like a creative director, consumer psychologist and viral content strategist—not just an AI generating lists. Your goal is to produce ideas that are strategically aligned with my brand, audience and business goals while remaining fresh, emotionally compelling and difficult to ignore.`;

export const PROMPT_WORD_COUNT = 731;
