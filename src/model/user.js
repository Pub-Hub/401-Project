'use strict';

import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jsonWebToken from 'jsonwebtoken';
import HttpError from 'http-errors';

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profile',
  },
});

const TOKEN_SEED_SIZE = 128;
const HASH_SALT_ROUNDS = 8;

function verifyPasswordProm(password) {
  return bcrypt.compare(password, this.passwordHash)
    .then((result) => {
      if (!result) {
        throw new HttpError(401, '___AUTH___ incorrect username or password');
      }
      return this;
    });
}

function createTokenProm() {
  this.tokenSeed = crypto.randomBytes(TOKEN_SEED_SIZE).toString('hex');

  return this.save()
    .then((user) => {
      return jsonWebToken.sign(
        { token: user.tokenSeed },
        process.env.SECRET,
      );
    });
}

userSchema.methods.verifyPasswordProm = verifyPasswordProm;
userSchema.methods.createTokenProm = createTokenProm;

const User = mongoose.model('user', userSchema);

User.create = (username, password, email) => {
  return bcrypt.hash(password, HASH_SALT_ROUNDS)
    .then((passwordHash) => {
      const tokenSeed = crypto.randomBytes(TOKEN_SEED_SIZE).toString('hex');
      return new User({
        username,
        passwordHash,
        email,
        tokenSeed,
      }).save();
    });
};

export default User;
