/**
 * Checks if a given access token is a JWT.
 *
 * @param {string} accessToken - The access token to check
 * @returns {boolean} True if the token is a valid JWT token, false otherwise.
 */
export function isJWTToken(accessToken: string): boolean {
  const parts = accessToken.split('.');
  if (parts.length !== 3) return false;

  const header = parts[0];
  try {
    JSON.parse(atob(header));
    return true;
  } catch (err) {
    return false;
  }
}
