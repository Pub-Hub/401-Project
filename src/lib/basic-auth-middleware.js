'use strict';

import HttpError from 'http-errors';
import User from '../model/user';

export default (req, res, next) => {
  if (!req.headers.authorization) return next(new HttpError(400, 'Invalid Request'));
  const base64AuthHeader = req.headers.authorization.split(' ')[1];
  if (!base64AuthHeader) return next(new HttpError(400, 'Invalid Request'));
  const stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();
  const [username, password] = stringAuthHeader.split(':');
  if (!username || !password) return next(new HttpError(400, 'Invalid Request'));
  return User.findOne({ username })
    .then((user) => {
      if (!user) return next(new HttpError(400, 'Invalid Request'));
      return user.verifyPasswordProm(password)
        .then((verifiedUser) => {
          req.user = verifiedUser;
          return next();
        })
        .catch(next);
    });
};
