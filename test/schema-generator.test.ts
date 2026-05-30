import assert from 'assert';
import { toStringLiteral } from '../src/schema/generator';

describe('toStringLiteral', () => {
  it('wraps a plain value in single quotes', () => {
    assert.strictEqual(toStringLiteral('Closed Won'), "'Closed Won'");
  });

  it('escapes single quotes', () => {
    assert.strictEqual(toStringLiteral("O'Brien"), "'O\\'Brien'");
  });

  it('escapes backslashes', () => {
    assert.strictEqual(toStringLiteral('a\\b'), "'a\\\\b'");
  });

  it('escapes a backslash immediately followed by a single quote', () => {
    assert.strictEqual(toStringLiteral("a\\'b"), "'a\\\\\\'b'");
  });
});
