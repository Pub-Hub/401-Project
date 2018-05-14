'use strict';

// TODO: create user Schema with username password hash, email, optional phone


import mongoose from 'mongoose';

const profileSchema = mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  bio: { type: String },
  avatar: { type: String },
  account: {
    type: mongoose.Schema.ObjectId,

    required: true,

    unique: true,
  },
});

export default mongoose.model('user', profileSchema);