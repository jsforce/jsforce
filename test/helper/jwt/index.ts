import { createSign } from 'crypto';
import fs from 'fs';

// the files that scripts/org-setup.mjs writes: the key of SF_OAUTH2_JWT_KEY, and the consumer key
// of the external client app in test/package/JSforceTestSuite, which the org generates on deploy
const jwtKeyFile = 'jwtKey.txt';
const jwtClientIdFile = 'jwtClientId.txt';

export const jwtClientId = fs.existsSync(jwtClientIdFile) ? fs.readFileSync(jwtClientIdFile, 'utf8').trim() : '';

export const canSignJwt = fs.existsSync(jwtKeyFile) && jwtClientId !== '';

/**
 * Sign a JWT bearer assertion with the key of SF_OAUTH2_JWT_KEY
 */
export async function signJwt(claims: object): Promise<string> {
  const header = Buffer.from(JSON.stringify({ alg: 'RS256' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const key = await fs.promises.readFile(jwtKeyFile);
  const signature = createSign('RSA-SHA256').update(`${header}.${payload}`).sign(key).toString('base64url');
  return `${header}.${payload}.${signature}`;
}
