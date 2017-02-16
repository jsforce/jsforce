import test from 'ava';
import { Connection } from '..';

test('create conn instance', (t) => {
  const conn = new Connection();
  t.true(conn !== null);
});
