'use strict';

import { createUserMockProm, removeUserMockProm } from './user-mock';
import Profile from '../../model/profile';


const createMockProfileProm = () => {
  return createUserMockProm()
    .then((mockUser) => {
      return new Profile({ username: mockUser.user.username, user: mockUser.user._id }).save();
    });
};

const createManyProfilesProm = (length) => {
  return Promise.all(new Array(length)
    .fill(0)
    .map(() => createMockProfileProm()));
};

const removeProfilesProm = () => Promise.all([
  Profile.remove({}),
  removeUserMockProm(),
]);

export { createManyProfilesProm, removeProfilesProm };
