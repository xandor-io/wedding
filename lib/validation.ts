/**
 * Strict email regex.
 *
 * Restrictive on purpose: rejects quotes, parens, whitespace, and anything
 * else that isn't a typical email character. This matters because we use the
 * email value inside an Airtable `filterByFormula` string, and Airtable's
 * formula language has no documented escape for single quotes — the only
 * safe strategy is to guarantee they're absent from the input.
 *
 * Accepts the common RFC-5322 subset used in practice: alphanumerics, plus
 * the symbols `._%+-` in the local part, and a standard domain.
 */
export const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}
