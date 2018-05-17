'use strict';

const faker = require('faker');

const loadTestUser = module.expoerts = {};

loadTestUser.create = (userContext, events, done) => {
  userContext.vars.username = faker.internet.userName() + Math.random().toString();
  userContext.vars.email = faker.internet.email();
  userContext.vars.password = faker.internet.password() + Math.random().toString();

  return done();
};
