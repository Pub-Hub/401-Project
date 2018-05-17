'use strict';

import express from 'express';
import mongoose from 'mongoose';
import cowsay from 'cowsay';
import logger from './logger';
import crawlRoutes from '../route/crawl-route';
import stopRoutes from '../route/stop-route';
import userRoutes from '../route/user-route';
import searchRoute from '../route/search-route';
import profileRoute from '../route/profile-route';
import loggerMiddleware from './logger-middleware';
import errorMiddleware from './error-middleware';

const { MessagingResponse } = require('twilio').twiml;

const app = express();
let server = null;

app.use(loggerMiddleware);
app.use(searchRoute);
app.use(stopRoutes);
app.use(profileRoute);
app.use(userRoutes);
app.use(crawlRoutes);
app.get('/', (request, response) => {
  const cowsayText = cowsay.think({ text: 'Bok bok!' });
  const cowPage = `<!DOCTYPE html><html><head><title>PubHub</title></head><body><h1>Welcome to PubHub!</h1><pre>${cowsayText}</pre></body></html>`;
  response.send(cowPage);
});

app.post('/next-stop', (request, response) => {
  const twiml = new MessagingResponse();
  twiml.message('Welcome to PubHub. Please visit our website at https://pub-hub.herokuapp.com/');
  response.writeHead(200, { 'Content-Type': 'text/xml' });
  response.end(twiml.toString());
});
app.get('/team', (req, res) => res.sendFile('/src/data/team.txt', { root: '.' }));
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
