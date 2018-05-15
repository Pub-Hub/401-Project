'use strict';

// TODO: TDD FOR stop-route
import superagent from 'superagent';
import { createStopMockProm } from './lib/stop-mock';
import { startServer, stopServer } from '../lib/server';
import logger from '../lib/logger';
import Crawl from '../model/crawl';

const apiUrl = `http://localhost:${process.env.PORT}`;

beforeAll(startServer);
afterAll(stopServer);
// afterEach(removeStopMockProm);

describe('stop-route.js', () => {
  describe('PUT', () => {
    test('should return status 200 and additional vote', () => {
      return createStopMockProm()
        .then((mock) => {
          return superagent.put(`${apiUrl}/stops/votes/${mock.stop._id}`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then((response) => {
          expect(response.body.votes).toEqual(1);
          expect(response.status).toEqual(200);
        });
    });
  });
  describe('DELETE', () => {
    test('should remove stop from crawl and return status 204', () => {
      let crawlIdToRemoveFrom;
      return createStopMockProm()
        .then((mock) => {
          crawlIdToRemoveFrom = mock.crawl._id;
          return superagent.del(`${apiUrl}/stops/${mock.stop._id}`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
          return Crawl.findById(crawlIdToRemoveFrom);
        })
        .then((crawl) => {
          logger.log(logger.INFO, `crawl with removed stop ${crawl}`);
          expect(crawl.stops).toHaveLength(0);
        });
    });
  });

  describe('GET VOTES', () => {
    test('should return status 200 and number of votes on stop', () => {
      return createStopMockProm()
        .then((mock) => {
          return superagent.get(`${apiUrl}/stops/votes/${mock.stop._id}`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.body).toEqual('Total votes: 0');
        });
    });
  });
});
