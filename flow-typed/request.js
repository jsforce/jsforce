/* @flow */
import Stream from 'stream';

declare module 'request' {
  declare export default function request(any): Stream;
}
