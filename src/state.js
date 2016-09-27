// @flow

import http from 'http';
import { Log } from './definitions';

let state = [];

export default (log: Log) => http.createServer((request, response) => {
  const url = request.url;
  const method = request.method;
  const body = [];

  log(`request: ${method} ${url}`);

  request
    .on('error', err => log(err))
    .on('data', chunk => body.push(chunk))
    .on('end', () => {
      response.on('error', err => log(err));

      if (['GET', 'HEAD'].includes(request.method)) {
        response.write(state.join(', '));
      } else if (request.method === 'DELETE') {
        state = [];
      } else if (request.method === 'POST') {
        const data = Buffer.concat(body).toString();
        if (data !== '') {
          state.push(data);
          response.writeHead(201);
        } else {
          response.writeHead(422);
        }
      } else {
        response.writeHead(404);
      }
      response.end();
    });
});
