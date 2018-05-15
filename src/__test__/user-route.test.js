'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createUserMockProm, removeUserMockProm } from './lib/user-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('USER ROUTER', () => {
  beforeAll(startServer);
  afterEach(removeUserMockProm);
  afterAll(stopServer);

  test('POST creating a user should respond with 200 and a token if there are no errors', () => {
    return superagent.post(`${apiURL}/signup`)
      .send({
        username: 'bob',
        password: 'this is a secret',
        email: 'bob@gmail.com',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
  test('POST /signup - an incomplete request should return a 400', () => {
    return superagent.post(`${apiURL}/signup`)
      .send({
        username: 'blob',
        password: 'this is a secret thing',
        email: '',
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  describe('GET /login', () => {
    test('GET /login should get a 200 status code and a token if there are no errors', () => {
      return createUserMockProm()
        .then((mock) => {
          return superagent.get(`${apiURL}/login`)
            .auth(mock.request.username, mock.request.password);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });
    test('GET /login should get a 401 for unauthorized access', () => {
      return createUserMockProm()
        .then((mock) => {
          return superagent.get(`${apiURL}/login`)
            .auth(mock.request.username, 'seth"spassword');
        })
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(401);
        });
    });
  });
});
