// @flow

import http from 'http';
import { Log } from './definitions';

export default (log: Log) => http.createServer((request, response) => {
  const url = request.url;
  const body = [];

  log(`request: ${url}`);

  request
    .on('data', chunk => body.push(chunk))
    .on('end', () => {
      response.write('hello, world!');
      response.end();
    });
});
