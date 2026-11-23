import { createSign } from 'crypto';
import fs from 'fs';

// the key file that scripts/org-setup.mjs writes from SF_OAUTH2_JWT_KEY
const jwtKeyFile = 'jwtKey.txt';

export const canSignJwt = fs.existsSync(jwtKeyFile);

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
