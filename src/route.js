// @flow

import http from 'http';
import { Log } from './definitions';

let state = { users: [], posts: [] };

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

      if (request.method === 'GET') {
        if (url === '/') {
          response.write('users and posts');
        } else if (url === '/users.json') {
          response.write(JSON.stringify(state.users));
        } else if (url === '/posts.json') {
          response.write(JSON.stringify(state.posts));
        }
      } else if (request.method === 'POST') {
        const data = Buffer.concat(body).toString();

        if (url === '/users.json') {
          state.users.push(JSON.parse(data));
          response.writeHead(201);
        } else if (url === '/posts.json') {
          state.posts.push(JSON.parse(data));
          response.writeHead(201);
        }
      }

      response.end();
    });
});

