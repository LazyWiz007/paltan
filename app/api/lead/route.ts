import { NextRequest, NextResponse, after } from 'next/server';
import { validateLead } from '@/lib/validate';
import { saveLead } from '@/lib/sheet';
import { issueToken, GATE_COOKIE, GATE_MAX_AGE } from '@/lib/gate';

export const runtime = 'nodejs';

/**
 * He promised this prompt on video. If Google is having a bad afternoon, the
 * viewer still gets what they were promised and the lead is written to the
 * server log so it can be recovered. Flip to false to make the sheet write a
 * hard requirement instead.
 */
const OPEN_GATE_ON_SAVE_FAILURE = true;

// Best-effort throttle. Serverless instances don't share this map, which is
// fine -- it exists to blunt a script hammering one instance, not to be a
// real rate limiter.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 8;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_MAX;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: 'Too many attempts. Wait a minute and try again.' },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, field: 'form', message: 'Something went wrong. Try again.' },
      { status: 400 },
    );
  }

  const result = validateLead(body as Record<string, unknown>);
  if (!result.ok) {
    // Logged distinctly, because a spike here means real people are being
    // turned away by the bot checks rather than bots being caught by them.
    if (result.message === 'honeypot' || result.message === 'too-fast') {
      console.warn(`[lead] bot check "${result.message}" triggered ip=${ip}`);
      return NextResponse.json(
        { ok: false, field: 'form', message: 'Something went wrong. Try again.' },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { ok: false, field: result.field, message: result.message },
      { status: 400 },
    );
  }

  const { lead } = result;
  const row = {
    ...lead,
    source: 'yt-qr',
    userAgent: req.headers.get('user-agent') ?? '',
    referrer: req.headers.get('referer') ?? '',
  };

  const record = async () => {
    if (await saveLead(row)) return;
    // Recoverable from the Vercel runtime logs if the sheet ever misses one.
    console.error(`[lead] SHEET WRITE FAILED — name=${lead.name} email=${lead.email}`);
  };

  if (OPEN_GATE_ON_SAVE_FAILURE) {
    // Apps Script takes 3-10s on a cold start, and this audience arrives by QR
    // code on mobile data. Since a failed write does not change what happens
    // next, there is nothing to wait for -- the write runs after the response
    // instead, and the viewer gets their prompt in milliseconds.
    after(record);
  } else {
    // Strict mode: the write has to land before anyone gets through, so the
    // wait is the point.
    if (!(await saveLead(row))) {
      console.error(`[lead] SHEET WRITE FAILED — name=${lead.name} email=${lead.email}`);
      return NextResponse.json(
        { ok: false, field: 'form', message: "Couldn't save that. Try again in a moment." },
        { status: 502 },
      );
    }
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(GATE_COOKIE, issueToken(lead.email), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: GATE_MAX_AGE,
  });
  return res;
}
