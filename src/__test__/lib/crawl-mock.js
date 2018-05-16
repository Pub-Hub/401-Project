'use strict';

import faker from 'faker';
import Crawl from '../../model/crawl';
import Profile from '../../model/profile';
import { createUserMockProm, removeUserMockProm } from './user-mock';

const createCrawlMockProm = () => {
  const mock = {};
  return createUserMockProm()
    .then((userMock) => {
      mock.user = userMock;
      return new Profile({ username: userMock.user.username, user: userMock.user._id }).save();
    })
    .then((profile) => {
      mock.profile = profile;
      return new Crawl({ name: faker.lorem.words(2), profile: profile._id }).save();
    })
    .then((crawl) => {
      mock.crawl = crawl;
      return Profile.findById(mock.profile._id);
    })
    .then((profileToUpdate) => {
      profileToUpdate.crawls.push(mock.crawl._id);
      return profileToUpdate.save();
    })
    .then((updatedProfile) => {
      mock.profile = updatedProfile;
      return mock;
    });
};

const createCrawlMockNoProfileUpdateProm = () => {
  const mock = {};
  return createUserMockProm()
    .then((userMock) => {
      mock.user = userMock;
      return new Profile({ username: userMock.user.username, user: userMock.user._id }).save();
    })
    .then((profile) => {
      mock.profile = profile;
      return new Crawl({ name: faker.lorem.words(2), profile: profile._id }).save();
    })
    .then((crawl) => {
      mock.crawl = crawl;
      return mock;
    });
};

const removeCrawlMockProm = () => Promise.all([
  Crawl.remove({}),
  removeUserMockProm(),
]);

export { createCrawlMockProm, removeCrawlMockProm, createCrawlMockNoProfileUpdateProm };
