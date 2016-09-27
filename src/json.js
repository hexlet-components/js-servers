// @flow

import http from 'http';
import { Log } from './definitions';

export default (log: Log) => http.createServer((request, response) => {
  const url = request.url;
  const body = [];

  log(`request: ${url}`);

  request
    .on('error', err => log(err))
    .on('data', chunk => body.push(chunk))
    .on('end', () => {
      response.on('error', err => log(err));
      response.setHeader('Content-Type', 'application/json');
      const b = Buffer.concat(body).toString();
      const data = JSON.parse(b);
      response.end(JSON.stringify({ counter: data.counter + 1 }));
    });
});
