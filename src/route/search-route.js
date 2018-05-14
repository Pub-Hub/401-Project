'use strict';

import { Router } from 'express';
import HttpError from 'http-errors';
import superagent from 'superagent';
import logger from '../lib/logger';
import Stop from '../model/stop';
import Crawl from '../model/crawl';

const searchRoute = new Router();

searchRoute.get('/search/:latitude/:longitude/:price/:stops', (req, res, next) => {
  // 1. error check
  if (!req.params.latitude || !req.params.longitude || !req.params.price || !req.params.stops) {
    return next(new HttpError(400, 'SEARCH - Lat, long, price, and number of stops required'));
  }
  // 2. make API call
  let selectedResults;
  return superagent.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${req.params.latitude},${req.params.longitude}&price=${req.params.price}&rankby=distance&type=bar&key=${process.env.GOOGLE_API_KEY}`)
    // 3. create new crawl
    .then((searchResults) => {
      selectedResults = searchResults.body.results.slice(0, Number(req.params.stops));
      return new Crawl({}).save();
    })
    // 4. save stop information in individual stops
    .then((emptyCrawl) => {
      logger.log(logger.INFO, `EMPTY CRAWL ${emptyCrawl}`);
      // for (let i = 0; i < stops.length; i++) {
      //   logger.log(logger.INFO, `${i} i`);
      //   new Stop({
      //     crawl: emptyCrawl._id,
      //     latitude: stops[i].geometry.location.lat,
      //     longitude: stops[i].geometry.location.lng,
      //     locationName: stops[i].name,
      //     address: stops[i].vicinity,
      //   }).save();
      // }
      const stops = [];
      selectedResults.forEach((location) => {
        stops.push({
          crawl: emptyCrawl._id,
          latitude: location.geometry.location.lat,
          longitude: location.geometry.location.lng,
          locationName: location.name,
          address: location.vicinity,
        });
      });
      logger.log(logger.INFO, stops);
      Stop.collection.insert(stops);
      return Crawl.findById(emptyCrawl._id)
        .then((crawl) => {
          logger.log(logger.INFO, `returned crawl ${crawl}`);
          return res.json(crawl);
        });
    })
  // 5. return route to user
    .catch(next);
});

export default searchRoute;
