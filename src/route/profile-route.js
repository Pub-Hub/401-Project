'use strict';

import { Router } from 'express';
import Profile from '../model/profile';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';

const profileRouter = new Router();

profileRouter.get('/profiles', bearerAuthMiddleware, (request, response, next) => {
  return Profile.find()
    .then((profiles) => {
      const allUsers = [];
      profiles.forEach(profile => allUsers.push(profile.username));
      return response.json(allUsers);
    })
    .catch(next);
});

export default profileRouter;
