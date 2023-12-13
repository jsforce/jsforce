import type { Readable } from 'node:stream';
import { HttpBody } from '../types';
import is from '@sindresorhus/is';

export function getBodySize(
  body: HttpBody | undefined,
  headers: { [name: string]: string } = {},
): number | undefined {
  function isFormData(body: unknown): body is FormData {
    return is.nodeStream(body) && is.function_((body as FormData).getBoundary);
  }

  if (headers && 'content-length' in headers) {
    return Number(headers['content-length']);
  }

  if (!body) {
    return 0;
  }

  if (is.string(body)) {
    return Buffer.byteLength(body);
  }

  if (is.urlSearchParams(body)) {
    return Buffer.byteLength(body.toString());
  }

  if (is.buffer(body)) {
    return body.length;
  }

  try {
    // `getLengthSync` will throw if body has a stream:
    // https://github.com/form-data/form-data#integer-getlengthsync
    if (isFormData(body)) {
      return body.getLengthSync();
    }
  } catch {
    return undefined;
  }

  return undefined;
}

type FormData = {
  getBoundary: () => string;
  getLength: (callback: (error: Error | null, length: number) => void) => void;
} & Readable;
