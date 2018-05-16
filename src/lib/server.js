'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
// import crawlRoutes from '../route/crawl-route';
import stopRoutes from '../route/stop-route';
import userRoutes from '../route/user-route';
import searchRoute from '../route/search-route';
import profileRoute from '../route/profile-route';
import loggerMiddleware from './logger-middleware';
import errorMiddleware from './error-middleware';

const app = express();
let server = null;

app.use(loggerMiddleware);
app.use(searchRoute);
app.use(stopRoutes);
app.use(profileRoute);
app.use(userRoutes);
// app.use(crawlRoutes);
app.get('/team', (req, res) => res.sendFile('/src/data/team-info.html', { root: '.' }));
app.all('*', (request, response) => {
  logger.log(logger.INFO, 'Returning 404 from catch-all route');
  return response.sendStatus(404);
});
app.use(errorMiddleware);

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `Server is listening on port ${process.env.PORT}`);
      });
    });
};

const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server is off');
      });
    });
};

export { startServer, stopServer };
