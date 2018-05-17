'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import Crawl from '../model/crawl';
import Stop from '../model/stop';

const apiUrl = `http://localhost:${process.env.PORT}`;

beforeAll(startServer);
afterAll(() => {
  Stop.remove({});
  Crawl.remove({});
  stopServer();
});

describe('testing search functionality', () => {
  test('should return crawl with 4 stops and a route id', () => {
    return superagent.get(`${apiUrl}/search/47.6182477/-122.35406/3/4`)
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(res.body).toHaveLength(5);
      });
  });
  test('should return 404 if necessary parameters are missing', () => {
    return superagent.get(`${apiUrl}/search/6/7/1`)
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(404);
      });
  });
  test('should return 400 if max price is greater than 4', () => {
    return superagent.get(`${apiUrl}/search/47.6182477/-122.35406/8/4`)
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });
  test('should return 400 if max stops is out of range', () => {
    return superagent.get(`${apiUrl}/search/47.6182477/-122.35406/3/1`)
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });
});
