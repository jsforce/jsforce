# Migrating `jsforce` from v1 to v3

## Drop support for old node and browsers
jsforce v3 only supports node >= 18 and modern browsers (see our browserlist config for more info: https://browsersl.ist/#q=last+2+versions%2C+not+dead%2C+%3E+0.2%25).

## TypeScript type definitions

jsforce v2 was re-written in TypeScript and the npm package includes the TS types.
If you were using the `@types/jsforce` package to get v1 TS types, make sure to remove it from your project.

## Node-specific build

The `jsforce` package is intended to work on browsers and node, as such it needs to include multiple builds which increas its final size.
If your project runs on node you can use `@jsforce/jsforce-node` to reduce your bundle size, see [JSFORCE-NODE.md](./JSFORCE-NODE.md) for more info.

## Retry on network errors

All HTTP requests are now retried on network errors like `ECONNRESET`, `ECONNREFUSED`, `ETIMEDOUT`, etc.
If you had a wrapper around jsforce to retry on these you can remove them.

## Callbacks -> Promises

Most of the methods on the `Connection` class will return JavaScript promises you can `await` instead of taking callback functions.
For more info:
  * Docs: https://jsforce.github.io/document/
  * API reference: https://jsforce.github.io/jsforce/doc/

## `Query` class no longer extends `RecordStream`.

`Connection.find` and `Connection.query` methods return an instance of the `Query` class.
If you need any of the `RecordStream` methods you can call the `Query.stream` method to get a record stream.

For backwards compatibility, `Query` implements a `pipe` method so that you can still pipe records to a writable stream.

## Bulk API

`Bulk.query` returns a promise that resolves to a record stream instead (instead of just returning the stream).

`Batch.poll` emits `inProgress` event instead of `progress` when checking the its status. Payload stays the same.

`Batch.poll` emits `error` event and throws if batch state = `Failed`.
In v1 it only emitted the `error` event which made it easy to miss the server error message unless you subscribed to that event.
