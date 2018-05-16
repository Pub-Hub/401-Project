'use strict';

import { Router } from 'express';
import HttpError from 'http-errors';
import Crawl from '../model/crawl';
import logger from '../lib/logger';
import Profile from '../model/profile';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';

const crawlRouter = new Router();

crawlRouter.put('/crawls/:username/:id', bearerAuthMiddleware, (request, response, next) => {
  const options = { runValidators: true, new: true };
  return Profile.findOne({ username: request.params.username })
    .then((profile) => {
      return Crawl.findByIdAndUpdate(request.params.id, { profile: profile._id }, options);
    })
    .then((updatedCrawl) => {
      logger.log(logger.INFO, `Updated crawl: ${updatedCrawl}`);
      return response.json(updatedCrawl);
    })
    .catch(next);
});

crawlRouter.put('/crawls/votes/:id', bearerAuthMiddleware, (request, response, next) => {
  let votesCounter;
  return Crawl.findById(request.params.id)
    .then((crawl) => {
      votesCounter = crawl.votes += 1;
      const options = { runValidators: true, new: true };
      return Crawl.findByIdAndUpdate(request.params.id, { votes: votesCounter }, options);
    })
    .then((updatedCrawl) => {
      logger.log(logger.INFO, `updated Crawl ${updatedCrawl}`);
      return response.json(updatedCrawl);
    })
    .catch(next);
});

crawlRouter.get('/crawls/:username/:id', bearerAuthMiddleware, (request, response, next) => {
  let profile;
  return Profile.findOne({ username: request.params.username })
    .then((returnedProfile) => {
      profile = returnedProfile;
      return Crawl.findById(request.params.id);
    })
    .then((foundCrawl) => {
      if (!profile.crawls.includes(foundCrawl._id.toString())) {
        return next(new HttpError(400, 'ERROR no crawl associated with user'));
      }
      logger.log(logger.INFO, `Found crawl: ${foundCrawl}`);
      return response.json(foundCrawl);
    });
});

crawlRouter.get('/crawls/:username', bearerAuthMiddleware, (request, response, next) => {
  return Profile.findOne({ username: request.params.username })
    .then((profile) => {
      return Crawl.find({ profile: profile._id });
    })
    .then((foundCrawls) => {
      logger.log(logger.INFO, `Found crawl: ${foundCrawls}`);
      return response.json(foundCrawls);
    })
    .catch(next);
});

crawlRouter.get('/crawls/votes/:id', bearerAuthMiddleware, (request, response, next) => {
  return Crawl.findById(request.params.id)
    .then((crawl) => {
      return response.json(`Total votes: ${crawl.votes}`);
    })
    .catch(next);
});

crawlRouter.delete('/crawls/:id', bearerAuthMiddleware, (request, response, next) => {
  return Crawl.findById(request.params.id)
    .then((crawl) => {
      return crawl.remove();
    })
    .then(() => {
      logger.log(logger.INFO, 'successful DELETE should return 204 here');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default crawlRouter;
