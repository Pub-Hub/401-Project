'use strict';

// TODO: create the following routes

/*
/stops/:id - DELETE - deletes single stop on crawl
/stops/:id - PUT - updates a stop on a crawl (adding votes)
/stops/:id/votes - GET - retrieves total votes for a stop

*/

import { Router } from 'express';
// import HttpError from 'http-errors';
// import { json } from 'body-parser';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import Stop from '../model/stop';

const stopRouter = new Router();
// const jsonParser = json();

// PUT - adding votes
stopRouter.put('/stops/votes/:id', bearerAuthMiddleware, (request, response, next) => {
  let voteTally;
  return Stop.findById(request.params.id)
    .then((stop) => {
      voteTally = stop.votes += 1;
      const options = { runValidators: true, new: true };
      return Stop.findByIdAndUpdate(request.params.id, { votes: voteTally }, options);
    })
    .then((updatedStop) => {
      return response.json(updatedStop);
    })
    .catch(next);
});

stopRouter.delete('/stops/:id', bearerAuthMiddleware, (request, response, next) => {
  return Stop.findById(request.params.id)
    .then((stop) => {
      return stop.remove();
    })
    .then(() => response.sendStatus(204))
    .catch(next);
});

stopRouter.get('/stops/votes/:id', bearerAuthMiddleware, (request, response, next) => {
  return Stop.findById(request.params.id)
    .then((stop) => {
      return response.json(`Total votes: ${stop.votes}`);
    })
    .catch(next);
});

export default stopRouter;
