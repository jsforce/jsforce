import test from 'ava';
import { Connection } from '../src/jsforce';

test('create conn instance', (t) => {
  const conn = new Connection();
  t.true(conn !== null);
});
