import 'server-only';
import { createHmac, timingSafeEqual } from 'crypto';

export const GATE_COOKIE = 'ak69_unlocked';
export const GATE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret(): string {
  const s = process.env.GATE_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      'GATE_SECRET is missing or too short. Generate one with: openssl rand -hex 32',
    );
  }
  return s;
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

/**
 * Mint a gate token. The email is carried so the sheet and the cookie can be
 * reconciled later if we ever need to; it is not secret, only tamper-proof.
 */
export function issueToken(email: string): string {
  const payload = `${Date.now()}.${email}`;
  return `${Buffer.from(payload).toString('base64url')}.${sign(payload)}`;
}

/** True only for a token this server signed that has not expired. */
export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;

  const dot = token.lastIndexOf('.');
  if (dot < 1) return false;

  const encoded = token.slice(0, dot);
  const given = token.slice(dot + 1);

  let payload: string;
  try {
    payload = Buffer.from(encoded, 'base64url').toString();
  } catch {
    return false;
  }

  const expected = sign(payload);
  // Compare as fixed-length digests so a length mismatch can't throw.
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const issued = Number(payload.split('.')[0]);
  if (!Number.isFinite(issued)) return false;

  return Date.now() - issued < GATE_MAX_AGE * 1000;
}
