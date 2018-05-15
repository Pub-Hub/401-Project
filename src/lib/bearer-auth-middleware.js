'use strict';

import HttpError from 'http-errors';
import jsonWebToken from 'jsonwebtoken';
import User from '../model/user';

const promisify = callback => (...args) => {
  return new Promise((resolve, reject) => {
    callback(...args, (error, data) => {
      if (error) return reject(error);
      return resolve(data);
    });
  });
};

export default (req, res, next) => {
  if (!req.headers.authorization) return next(new HttpError(400, 'BEAR AUTH: Invalid Request'));
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return next(new HttpError(400, 'BEAR AUTH: Invalid Request'));
  return promisify(jsonWebToken.verify)(token, process.env.SECRET)
    .then((decryptedData) => {
      return User.findOne({ tokenSeed: decryptedData.tokenSeed });
    })
    .then((user) => {
      if (!user) return next(new HttpError(400, 'BEAR AUTH: Invalid Request'));
      req.user = user;
      return next();
    })
    .catch(next);
};
