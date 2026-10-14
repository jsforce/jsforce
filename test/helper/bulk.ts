import assert from 'assert';
import { Connection, Schema } from 'jsforce';
import { BulkIngestBatchResult } from 'jsforce/lib/api/bulk';
import { isString } from '../util';

export async function insertAccounts<S extends Schema>(
  conn: Connection<S>,
  id: string | number,
  qty: number = 20,
): Promise<BulkIngestBatchResult> {
  const insertRecords = Array.from({ length: qty }, (_, index) => ({
    Name: `Bulk Account ${id} #${index + 1}`,
  }));
  const batchInsertRes = await conn.bulk.load(
    'Account',
    'insert',
    insertRecords,
  );

  assert.ok(Array.isArray(batchInsertRes));
  assert.ok(batchInsertRes.length === qty);
  for (const res of batchInsertRes) {
    assert.ok(isString(res.id));
    assert.ok(res.success === true);
    assert.ok(res.created === true);
  }

  return batchInsertRes;
}
