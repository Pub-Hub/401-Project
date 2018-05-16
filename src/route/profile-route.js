'use strict';

import { Router } from 'express';
// import HttpError from 'http-errors';
// import logger from '../l/**/ib/logger';
import Profile from '../model/profile';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';

const profileRouter = new Router();

profileRouter.get('/profiles', bearerAuthMiddleware, (request, response, next) => {
  return Profile.find()
    .then((profiles) => {
      const allUsers = [];
      profiles.forEach(profile => allUsers.push(profile.username));
      return response.json(profiles);
    })
    .catch(next);
});

export default profileRouter;
