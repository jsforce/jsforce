// the karma middleware that signs, so that the key stays out of the browser (see karma.conf.js)
const jwtAssertionUrl = process.env.SF_JWT_ASSERTION_URL ?? '';

export const canSignJwt = jwtAssertionUrl !== '';

/**
 * Sign a JWT bearer assertion with the key of SF_OAUTH2_JWT_KEY
 */
export async function signJwt(claims: object): Promise<string> {
  const res = await fetch(jwtAssertionUrl, { method: 'POST', body: JSON.stringify(claims) });
  if (!res.ok) {
    throw new Error(`cannot sign a JWT assertion: ${res.status}`);
  }
  return res.text();
}
