// the karma middleware that signs, so that the key stays out of the browser (see karma.conf.js)
const jwtAssertionUrl = process.env.SF_JWT_ASSERTION_URL ?? '';

// the consumer key of the external client app in test/package/JSforceTestSuite (see karma.conf.js)
export const jwtClientId = process.env.SF_JWT_CLIENT_ID ?? '';

export const canSignJwt = jwtAssertionUrl !== '' && jwtClientId !== '';

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
