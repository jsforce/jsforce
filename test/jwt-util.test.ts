import assert from 'assert';
import { isJWTToken } from '../src/util/jwt';

describe('JWT Utils', () => {
  describe('isJWTToken', () => {
    it('should return true for valid JWT tokens', () => {
      const validJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      assert.strictEqual(isJWTToken(validJWT), true);
    });

    it('should return false for non-JWT tokens', () => {
      const nonJWT = '00Dxx0000001gT4!AQcAQH0dTHZfz8SzZpNVJtNKfCzW8YZJKg6b8PGp_5jWkRZKt6RqoVx1HdGQp6T6kCFJ8gB8QPGhQx9qysE6vq3Zc';
      assert.strictEqual(isJWTToken(nonJWT), false);
    });

    it('should return false for malformed JWT tokens', () => {
      const malformedJWT = 'not.a.jwt.token';
      assert.strictEqual(isJWTToken(malformedJWT), false);
    });

    it('should return false for empty string', () => {
      assert.strictEqual(isJWTToken(''), false);
    });

    it('should return false for tokens with invalid base64 in header', () => {
      const invalidBase64JWT = 'invalid.base64.signature';
      assert.strictEqual(isJWTToken(invalidBase64JWT), false);
    });

    it('should return false for tokens with invalid JSON in header', () => {
      const invalidJSONJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      assert.strictEqual(isJWTToken(invalidJSONJWT), false);
    });
  });
}); 
