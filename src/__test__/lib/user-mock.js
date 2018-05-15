'use strict';

import faker from 'faker';
import User from '../../model/user';
import Profile from '../../model/profile';

const createUserMockProm = () => {
  const mock = {};
  mock.request = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.lorem.words(2),
  };

  return User.create(mock.request.username, mock.request.password, mock.request.email)
    .then((user) => {
      mock.user = user;
      return user.createTokenProm();
    })
    .then((token) => {
      mock.token = token;
      return User.findById(mock.user._id);
    })
    .then((user) => {
      mock.user = user;
      return mock;
    });
};

const removeUserMockProm = () => Promise.all([
  User.remove({}),
  Profile.remove({}),
]);

export { createUserMockProm, removeUserMockProm };
