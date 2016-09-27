// @flow

import 'babel-polyfill';

import { it, describe, before, after } from 'mocha';
import assert from 'assert';

import http from 'http';
import axios from 'axios';
import debug from 'debug';
import servers from '../src/index';

const log = debug('hexlet-servers');
const hostname = 'localhost';
const port = 9000;
const url = `http://${hostname}:${port}`;

const listenCallback = () => log(`server was started ${url}`);
const closeCallback = () => log('server was stopped');

describe('Servers', () => {
  describe('Welcome', () => {
    const welcome = servers.welcome(log);
    before(() => welcome.listen(port, listenCallback));
    it('should work', done => {
      http.get(url, res => {
        assert.equal(res.statusCode, 200);
        done();
      });
    });
    after(() => welcome.close(closeCallback));
  });

  describe('Echo', () => {
    const echo = servers.echo(log);
    before(() => echo.listen(port, listenCallback));
    it('should work', done => {
      const data = 'how are you doing?';
      const options = {
        hostname,
        port,
        method: 'POST',
      };
      const req = http.request(options, res => {
        assert.equal(res.statusCode, 200);
        res.setEncoding('utf8');
        res.on('data', body => {
          assert.equal(body.toString(), data);
          done();
        });
      });
      req.end(data);
    });
    after(() => echo.close(closeCallback));
  });

  describe('State', () => {
    const state = servers.state(log);
    before(() => state.listen(port, listenCallback));
    it('should work', async () => {
      const data = ['one', 'two'];
      const response1 = await axios.get(url);
      assert.equal(response1.data, '');

      const response2 = await axios.post(url, '', { validateStatus: () => true });
      assert.equal(response2.status, 422);

      const response3 = await axios.post(url, data[0]);
      assert.equal(response3.status, 201);

      const response4 = await axios.get(url);
      assert.equal(response4.status, 200);
      assert.equal(response4.data, data[0]);

      const response5 = await axios.post(url, data[1]);
      assert.equal(response5.status, 201);

      const response6 = await axios.get(url);
      assert.equal(response6.status, 200);
      assert.equal(response6.data, data.join(', '));
    });
    after(() => state.close(closeCallback));
  });

  describe('Json', () => {
    const json = servers.json(log);
    before(() => json.listen(port, listenCallback));
    it('should work', async () => {
      const data1 = { counter: 3 };
      const response1 = await axios.post(url, data1);
      assert.deepEqual(response1.data, { counter: 4 });

      const data2 = { counter: -1 };
      const response2 = await axios.post(url, data2);
      assert.deepEqual(response2.data, { counter: 0 });
    });
    after(() => json.close(closeCallback));
  });

  describe('Route', () => {
    const route = servers.route(log);
    before(() => route.listen(port, listenCallback));
    it('should work', async () => {
      const data = ['one', 'two'];
      const usersUrl = `${url}/users.json`;
      const postsUrl = `${url}/posts.json`;

      const user1 = { name: 'john' };
      const user2 = { name: 'ada' };

      const response1 = await axios.get(url);
      assert.equal(response1.data, 'users and posts');

      const response2 = await axios.get(usersUrl, user1);
      assert.deepEqual(response2.data, []);

      const response3 = await axios.post(usersUrl, user1);
      assert.equal(response3.status, 201);

      const response4 = await axios.get(usersUrl, user1);
      assert.deepEqual(response4.data, [user1]);

      const response5 = await axios.post(usersUrl, user2);
      assert.equal(response5.status, 201);

      const response6 = await axios.get(usersUrl, user2);
      assert.deepEqual(response6.data, [user1, user2]);

      const response7 = await axios.get(postsUrl, user1);
      assert.deepEqual(response7.data, []);

      const response8 = await axios.post(postsUrl, user1);
      assert.equal(response8.status, 201);

      const response9 = await axios.get(postsUrl, user1);
      assert.deepEqual(response9.data, [user1]);

      const response10 = await axios.post(postsUrl, user2);
      assert.equal(response10.status, 201);

      const response11 = await axios.get(postsUrl, user2);
      assert.deepEqual(response11.data, [user1, user2]);
    });
    after(() => route.close(closeCallback));
  });
});
