// @flow

import http from 'http';
import { Log } from './definitions';

export default (log: Log) => http.createServer((request, response) => {
  response.end('hello, world!');
});
