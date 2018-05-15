'use strict';

// TODO: write a get route for retreving info about the team.
import { Router } from 'express';

const teamRoute = new Router();

teamRoute.get('/team', (request, response, next) => { // eslint-disable-line
  return response.sendFile(`${__dirname}/../data/team-info.html`);
});

export default teamRoute;
