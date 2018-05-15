'use strict';

// TODO: create the following routes
import { Router } from 'express';
import HttpError from 'http-errors';
import Crawl from '../model/crawl';
import logger from '../lib/logger';
import Profile from '../model/profile';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';

const crawlRouter = new Router();

// PUT - update a single crawl - add to profile
// crawls/:username/:id
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

// PUT - update a single crawl - findByID and add vote
// crawls/votes/:id
crawlRouter.put('/crawls/votes/:id', (request, response, next) => {
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

// crawls/:user/:id - GET - retrieves single crawl on user's profile
crawlRouter.get('/crawls/:username/:id', (request, response, next) => {
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

// /crawls/:user - GET - retrieves all crawls for single user
crawlRouter.get('/crawls/:username', (request, response, next) => {
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

// crawls/votes/:id/ - GET - retrieves total number of votes on crawl
crawlRouter.get('/crawls/votes/:id', (request, response, next) => {
  return Crawl.findById(request.params.id)
    .then((crawl) => {
      return response.json(`Total votes: ${crawl.votes}`);
    })
    .catch(next);
});

// crawls/:user/:id - DELETE - deletes a single crawl
crawlRouter.delete('/crawls/:id', (request, response, next) => {
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
/*


GET
takes in crawls and returns an array of crawls
name crawls? have user save with name
crawls associated with single user
* stretch goal pagination

DELETE
Pass in crawls:id

PUT
Create a new crawl to profile - adding pre-generated crawl
Google search creates crawl that is saved to database
User can save to their profile - pass in username and id of crawl
add object to profile array of crawls if they don't want to save - just delete from crawl

GET - retrieves single crawl on user's profile
iterates through profile array of crawls - passing in crawl id (crawl.findByID)

GET - retrieves all crawls for single user
pass in username to crawls - pull profile and go to crawls and findByID - array output

GET all votes
crawls/votes/:id
 */
