'use strict';

import superagent from 'superagent';
import { createCrawlMockProm, removeCrawlMockProm } from './lib/crawl-mock';
import { startServer, stopServer } from '../lib/server';
// import logger from '../lib/logger';
// import Profile from '../model/profile';

const apiUrl = `http://localhost:${process.env.PORT}`;

beforeAll(startServer);
afterEach(removeCrawlMockProm);
afterAll(stopServer);

describe('crawl-route.js tests', () => {
  describe('PUT - crawl-route adding a crawl to a profile', () => {
    test('test should return status 200', () => {
      let savedProfile;
      return createCrawlMockProm()
        .then((mock) => {
          savedProfile = mock.profile._id;
          return superagent.put(`${apiUrl}/crawls/${mock.profile.username}/${mock.crawl._id}`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then((response) => {
          expect(response.body.crawl.profile).toEqual(savedProfile);
          expect(response.status).toEqual(200);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });
  describe('PUT - targets a particular crawl and add votes', () => {
    test('test should return status 200', () => {
      return createCrawlMockProm()
        .then((mock) => {
          return superagent.put(`${apiUrl}/crawls/votes/${mock.crawl._id}`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then((response) => {
          expect(response.body.crawl.votes).toEqual(1);
          expect(response.status).toEqual(200);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });

  describe('GET - retriev a single crawl from a users profile', () => {
    test('test should return status 200', () => {
      let savedCrawl;
      return createCrawlMockProm()
        .then((mock) => {
          savedCrawl = mock.crawl._id;
          return superagent.get(`${apiUrl}/crawls/${mock.profile.username}/${mock.crawl._id}`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then((response) => {
          expect(response.body.crawl._id).toEqual(savedCrawl._id);
          expect(response.status).toEqual(200);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });

  describe('GET - retriev all crawls from a users profile', () => {
    test('test should return status 200', () => {
      return createCrawlMockProm()
        .then((mock) => {
          return superagent.get(`${apiUrl}/crawls/${mock.profile.username}`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then((response) => {
          expect(response.body.crawl).toHaveLength(1);
          expect(response.status).toEqual(200);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });

  describe('GET - retrieve a single crawl\'s votes', () => {
    test('test should return status 200', () => {
      return createCrawlMockProm()
        .then((mock) => {
          return superagent.get(`${apiUrl}/crawls/${mock.profile.username}/${mock.crawl._id}`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then((response) => {
          expect(response.body.crawl.votes).toEqual(0);
          expect(response.status).toEqual(200);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });

  describe('DELETE - delete\'s a single crawl from a users profile', () => {
    test('test should return status 204', () => {
      return createCrawlMockProm()
        .then((mock) => {
          return superagent.del(`${apiUrl}/crawls/${mock.crawl._id}`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });
});
