import 'server-only';
import type { Lead } from './validate';

export type SheetRow = Lead & {
  source: string;
  userAgent: string;
  referrer: string;
};

const TIMEOUT_MS = 8000;

async function postOnce(url: string, row: SheetRow): Promise<boolean> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      // Apps Script reads the raw body, and text/plain avoids a CORS preflight
      // it would not answer. Content is JSON regardless.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(row),
      redirect: 'follow',
      signal: ac.signal,
    });
    if (!res.ok) return false;
    const text = await res.text();
    return text.includes('"ok":true') || text.includes('"result":"ok"');
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Append the lead to the Google Sheet. Retries once, then gives up.
 *
 * Returns false rather than throwing: whether a failed write should block the
 * prompt is a product decision, and it lives in the route handler.
 */
export async function saveLead(row: SheetRow): Promise<boolean> {
  const url = process.env.SHEET_WEBHOOK_URL;
  if (!url) {
    console.error('[lead] SHEET_WEBHOOK_URL is not set — nothing was saved');
    return false;
  }

  if (await postOnce(url, row)) return true;

  await new Promise((r) => setTimeout(r, 600));
  return postOnce(url, row);
}
