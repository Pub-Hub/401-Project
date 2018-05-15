'use strict';

import faker from 'faker';
import Stop from '../../model/stop';
import { createCrawlMockProm, removeCrawlMockProm } from './crawl-mock';

const createStopMockProm = () => {
  const mock = {};
  return createCrawlMockProm()
    .then((mockObject) => {
      mock.user = mockObject.user;
      mock.profile = mockObject.profile;
      mock.crawl = mockObject.crawl;
      return new Stop({
        crawl: mockObject.crawl._id,
        locationName: faker.lorem.words(3),
        latitude: faker.random.number(),
        longitude: faker.random.number(),
        address: faker.random.words(5),
      }).save();
    })
    .then((newStop) => {
      mock.stop = newStop;
      return mock;
    });
};

const removeStopMockProm = () => Promise.all([
  Stop.remove({}),
  removeCrawlMockProm(),
]);

export { createStopMockProm, removeStopMockProm };
