'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import Crawl from '../model/crawl';
import Stop from '../model/stop';
import logger from '../lib/logger';

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
        logger.log(logger.INFO, `res.body ${JSON.stringify(res.body)}`);
      });
  });
});
