export type Lead = { name: string; email: string };

export type ValidationResult =
  | { ok: true; lead: Lead }
  | { ok: false; field: 'name' | 'email' | 'form'; message: string };

// Deliberately permissive. The job here is to catch typos and obvious junk,
// not to adjudicate RFC 5322 -- a real address that fails a clever regex is a
// lost signup, which costs more than a bad row in the sheet.
const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

// A person has to load the page, get to the form and fill two fields. Even
// tapping browser autofill the instant it renders does not happen this fast,
// so anything quicker submitted the form without rendering it.
const MIN_FILL_MS = 700;

export function validateLead(input: {
  name?: unknown;
  email?: unknown;
  ak69_hp?: unknown; // honeypot checkbox
  elapsed?: unknown;
}): ValidationResult {
  // Nothing autofills a hidden checkbox, but a bot ticking everything does.
  if (input.ak69_hp === true) {
    return { ok: false, field: 'form', message: 'honeypot' };
  }

  if (typeof input.elapsed === 'number' && input.elapsed >= 0 && input.elapsed < MIN_FILL_MS) {
    return { ok: false, field: 'form', message: 'too-fast' };
  }

  const name = typeof input.name === 'string' ? input.name.trim().replace(/\s+/g, ' ') : '';
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';

  if (name.length < 2) {
    return { ok: false, field: 'name', message: 'Enter your name.' };
  }
  if (name.length > 80) {
    return { ok: false, field: 'name', message: 'That name is too long.' };
  }
  if (!EMAIL.test(email) || email.length > 254) {
    return { ok: false, field: 'email', message: 'Enter a valid email address.' };
  }

  return { ok: true, lead: { name, email } };
}
