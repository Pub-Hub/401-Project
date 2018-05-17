'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createManyProfilesProm, removeProfilesProm } from './lib/profile-mock';
import { createUserMockProm } from './lib/user-mock';

const apiUrl = `http://localhost:${process.env.PORT}`;

beforeAll(startServer);
afterAll(stopServer);
afterEach(removeProfilesProm);

describe('profile-route.js', () => {
  test('should return array of all usernames and status 200', () => {
    let testToken;
    return createUserMockProm()
      .then((mockUser) => {
        testToken = mockUser.token;
        return createManyProfilesProm(10)
          .then(() => {
            return superagent.get(`${apiUrl}/profiles`)
              .set('Authorization', `Bearer ${testToken}`);
          });
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(10);
      });
  });
  test('should return 401 on bad token', () => {
    return createManyProfilesProm(10)
      .then(() => {
        return superagent.get(`${apiUrl}/profiles`)
          .set('Authorization', 'Bearer BADTOKEN');
      })
      .then(Promise.reject)
      .catch(err => expect(err.status).toBe(401));
  });
});
