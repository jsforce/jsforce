import FormData from 'form-data';
import assert from 'assert';
import path from 'path';
import fs from './helper/fs';
import { isNodeJS } from './helper/env';
import { getBodySize } from '../src/util/get-body-size';

describe('HTTP body size', () => {
  if (isNodeJS()) {
    it('form data body with file stream should return undefined', () => {
      const zip = fs.createReadStream(
        path.join(__dirname, 'data/MyPackage.zip'),
      );
      const form = new FormData();

      form.append('file', zip, {
        contentType: 'application/zip',
      });

      assert.equal(getBodySize(form), undefined);
    });

    it('file stream body should return undefined', () => {
      const zip = fs.createReadStream(
        path.join(__dirname, 'data/MyPackage.zip'),
      );

      assert.equal(getBodySize(zip), undefined);
    });
  }

  it('should return "content-length" header when set', () => {
    assert.equal(
      getBodySize('test', {
        'content-length': '256',
      }),
      256,
    );
  });
});
