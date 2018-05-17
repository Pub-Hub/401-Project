'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';

beforeAll(startServer);
afterAll(stopServer);

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('testing / route', () => {
  test('testing successful cowsay', () => {
    return superagent.get(apiUrl)
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });
});

describe('testing /team', () => {
  test('testing successful team response', () => {
    return superagent.get(`${apiUrl}/team`)
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });
});
