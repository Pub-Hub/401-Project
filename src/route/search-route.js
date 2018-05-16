'use strict';

import { Router } from 'express';
import HttpError from 'http-errors';
import superagent from 'superagent';
// import logger from '../lib/logger';
import Stop from '../model/stop';
import Crawl from '../model/crawl';

const searchRoute = new Router();

searchRoute.get('/search/:latitude/:longitude/:price/:stops', (req, res, next) => {
  if (req.params.price > 4) return next(new HttpError(400, 'Max stops must be between 0-4'));
  let stops;
  let emptyCrawl;
  const stopInfo = [];
  return superagent.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${req.params.latitude},${req.params.longitude}&price=${req.params.price}&rankby=distance&type=bar&key=${process.env.GOOGLE_API_KEY}`)
    .then((searchResults) => {
      stops = searchResults.body.results.slice(0, Number(req.params.stops));
      return new Crawl({}).save();
    })
    .then((crawl) => {
      emptyCrawl = crawl;
      return Promise.all(stops.map((location) => {
        stopInfo.push({ name: location.name, address: location.vicinity });
        return new Stop({
          crawl: emptyCrawl._id,
          latitude: location.geometry.location.lat,
          longitude: location.geometry.location.lng,
          locationName: location.name,
          address: location.vicinity,
        }).save();
      }));
    })
    .then(() => {
      return Crawl.findById(emptyCrawl._id)
        .then((foundCrawl) => {
          stopInfo.push({ crawlId: foundCrawl._id });
          return res.json(stopInfo);
        });
    })
    .catch(next);
});

export default searchRoute;
