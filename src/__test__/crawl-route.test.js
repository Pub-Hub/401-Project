'use strict';

import superagent from 'superagent';
import { createCrawlMockProm, removeCrawlMockProm, createCrawlMockNoProfileUpdateProm } from './lib/crawl-mock';
import { startServer, stopServer } from '../lib/server';
import Profile from '../model/profile';

const apiUrl = `http://localhost:${process.env.PORT}`;

beforeAll(startServer);
afterEach(removeCrawlMockProm);
afterAll(stopServer);

describe('crawl-route.js tests', () => {
  describe('PUT - crawl-route adding a crawl to a profile', () => {
    test('test should return status 200', () => {
      let savedProfile;
      return createCrawlMockNoProfileUpdateProm()
        .then((mock) => {
          savedProfile = mock.profile._id;
          return superagent.put(`${apiUrl}/crawls/${mock.profile.username}/${mock.crawl._id}/test`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then((response) => {
          expect(response.body.profile).toEqual(savedProfile.toString());
          expect(response.body.name).toEqual('test');
          expect(response.status).toEqual(200);
          return Profile.findById(savedProfile.toString());
        })
        .then((profile) => {
          expect(profile.crawls).toHaveLength(1);
        });
    });
    test('test should return status 401', () => {
      return createCrawlMockNoProfileUpdateProm()
        .then((mock) => {
          return superagent.put(`${apiUrl}/crawls/${mock.profile.username}/${mock.crawl._id}/test`)
            .set('Authorization', 'Bearer badID');
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(401);
        });
    });
    test('test should return status 404', () => {
      return createCrawlMockNoProfileUpdateProm()
        .then((mock) => {
          return superagent.put(`${apiUrl}/crawls/${mock.profile.username}/badID/test`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(404);
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
          expect(response.body.votes).toEqual(1);
          expect(response.status).toEqual(200);
        });
    });
    test('test should return status 401', () => {
      return createCrawlMockProm()
        .then((mock) => {
          return superagent.put(`${apiUrl}/crawls/votes/${mock.crawl._id}`)
            .set('Authorization', 'Bearer badID');
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(401);
        });
    });
    test('test should return status 404', () => {
      return createCrawlMockProm()
        .then((mock) => {
          return superagent.put(`${apiUrl}/crawls/votes/badID`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(404);
        });
    });
  });

  describe('GET - retrieve a single crawl from a users profile', () => {
    test('test should return status 200', () => {
      let savedCrawl;
      return createCrawlMockProm()
        .then((mock) => {
          savedCrawl = mock.crawl;
          return superagent.get(`${apiUrl}/crawls/${mock.profile.username}/${mock.crawl._id}`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then((response) => {
          expect(response.body._id).toEqual(savedCrawl._id.toString());
          expect(response.status).toEqual(200);
        });
    });
    test('should return status 400 if route is not on user\'s profile', () => {
      let wrongProfile;
      return createCrawlMockProm()
        .then((firstMock) => {
          wrongProfile = firstMock.profile;
          return createCrawlMockProm();
        })
        .then((secondMock) => {
          return superagent.get(`${apiUrl}/crawls/${wrongProfile.username}/${secondMock.crawl._id}`)
            .set('Authorization', `Bearer ${secondMock.user.token}`);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toBe(400);
        });
    });
    test('test should return status 401', () => {
      return createCrawlMockProm()
        .then((mock) => {
          return superagent.get(`${apiUrl}/crawls/${mock.profile.username}/${mock.crawl._id}`)
            .set('Authorization', 'Bearer badID');
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(401);
        });
    });
    test('test should return status 404', () => {
      return createCrawlMockProm()
        .then((mock) => {
          return superagent.get(`${apiUrl}/crawls/${mock.profile.username}/badID`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(404);
        });
    });
  });

  describe('GET - retrieve all crawls from a users profile', () => {
    test('test should return status 200', () => {
      return createCrawlMockProm()
        .then((mock) => {
          return superagent.get(`${apiUrl}/crawls/${mock.profile.username}`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then((response) => {
          expect(response.body).toHaveLength(1);
          expect(response.status).toEqual(200);
        });
    });
    test('GET all crawls test should return status 401', () => {
      return createCrawlMockProm()
        .then((mock) => {
          return superagent.get(`${apiUrl}/crawls/${mock.profile.username}`)
            .set('Authorization', 'Bearer badID');
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(401);
        });
    });
    test('GET all crawls test should return status 500', () => {
      return createCrawlMockProm()
        .then((mock) => {
          return superagent.get(`${apiUrl}/crawls/badID`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(500);
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
          expect(response.body.votes).toEqual(0);
          expect(response.status).toEqual(200);
        });
    });
    test('Single crawl test should return status 404', () => {
      return createCrawlMockProm()
        .then((mock) => {
          return superagent.get(`${apiUrl}/crawls/${mock.profile.username}/badID`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(404);
        });
    });
    test('Single crawl test should return status 401', () => {
      return createCrawlMockProm()
        .then((mock) => {
          return superagent.get(`${apiUrl}/crawls/${mock.profile.username}/${mock.crawl._id}`)
            .set('Authorization', 'Bearer badID');
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(401);
        });
    });
  });

  describe('DELETE - deletes a single crawl from a users profile', () => {
    test('test should return status 204', () => {
      return createCrawlMockProm()
        .then((mock) => {
          return superagent.del(`${apiUrl}/crawls/${mock.crawl._id}`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
    test('DEL test should return 404', () => {
      return createCrawlMockProm()
        .then((mock) => {
          return superagent.del(`${apiUrl}/crawls/badID`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(404);
        });
    });
    test('DEL should return status 401 ', () => {
      return createCrawlMockProm()
        .then((mock) => {
          return superagent.del(`${apiUrl}/crawls/${mock.crawl._id}`)
            .set('Authorization', 'Bearer badID');
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(401);
        });
    });
  });

  describe('GET - /crawls', () => {
    test('should return status 200 and array of all crawls in DB', () => {
      return createCrawlMockProm()
        .then((mock) => {
          return superagent.get(`${apiUrl}/crawls`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.body).toHaveLength(1);
        });
    });
    test('should return status 401 and array of all crawls in DB', () => {
      return superagent.get(`${apiUrl}/crawls`)
        .set('Authorization', 'Bearer BadID')
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(401);
        });
    });
  });

  describe('GET - a crawls total votes', () => {
    test('should return status 200 with sucess', () => {
      return createCrawlMockProm()
        .then((mock) => {
          return superagent.get(`${apiUrl}/crawls/votes/${mock.crawl._id}`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then((response) => {
          expect(response.body).toEqual('Total votes: 0');
          expect(response.status).toBe(200);
        });
    });
    test('should return status 404', () => {
      return createCrawlMockProm()
        .then((mock) => {
          return superagent.get(`${apiUrl}/crawls/votes/badID`)
            .set('Authorization', `Bearer ${mock.user.token}`);
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toBe(404);
        });
    });
    test('should return status 401', () => {
      return createCrawlMockProm()
        .then((mock) => {
          return superagent.get(`${apiUrl}/crawls/votes/${mock.crawl._id}`)
            .set('Authorization', 'Bearer badID');
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toBe(401);
        });
    });
  });
});
