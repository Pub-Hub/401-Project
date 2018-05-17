'use strict';

const faker = require('faker');

const loadTestUser = module.exports = {};

loadTestUser.create = (userContext, events, done) => {
  userContext.vars.username = faker.internet.userName(1);
  userContext.vars.email = faker.internet.email();
  userContext.vars.password = faker.lorem.word();

  return done();
};
