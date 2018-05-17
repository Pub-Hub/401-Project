'use strict';

const HttpError = require('http-errors');

require('dotenv').config();
const GraphHopperRouting = require('graphhopper-js-api-client/src/GraphHopperRouting');
const GHInput = require('graphhopper-js-api-client/src/GHInput');

const findOptimalPath = (paths) => {
  const options = {
    key: process.env.GH_API_KEY,
    optimize: true,
    instructions: false,
    vehicle: 'foot',
  };
  const ghRouting = new GraphHopperRouting(options);
  paths.forEach((path) => {
    const { lat } = path.geometry.location;
    const { lng } = path.geometry.location;
    return ghRouting.addPoint(new GHInput(lat, lng));
  });
  return ghRouting.doRequest()
    .then((json) => {
      return json.paths[0].points_order;
    })
    .catch((err) => {
      throw new HttpError(400, `PATHFINDER - Error ${err}`);
    });
};

export default findOptimalPath;
