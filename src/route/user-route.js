'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import HttpError from 'http-errors';
import basicAuthMiddleware from '../lib/basic-auth-middleware';
import User from '../model/user';
import logger from '../lib/logger';
import Profile from '../model/profile';

// TODO: create the following routes

/*
/signup/profile/:id - PUT - update user profile
*/

// signup - POST - create user
const userRouter = new Router();
const jsonParser = json();

// POST Route for signing up a new user to our DB
userRouter.post('/signup', jsonParser, (request, response, next) => {
  return User.create(request.body.username, request.body.password, request.body.email)
    .then((user) => {
      delete request.body.password;
      logger.log(logger.INFO, 'USER - creating a TOKEN HERE');
      new Profile({ username: request.body.username, user: user._id }).save();
      return user.createTokenProm();
    })
    .then((token) => {
      logger.log(logger.INFO, 'USER - 200 code and a Token');
      return response.json({ token });
    })
    .then()
    .catch(next);
});

// login - GET
userRouter.get('/login', basicAuthMiddleware, (request, response, next) => {
  if (!request.user) {
    return next(new HttpError(404, 'ERROR user not found'));
  }
  return request.user.createTokenProm()
    .then(token => response.json({ token }))
    .catch(next);
});

export default userRouter;
