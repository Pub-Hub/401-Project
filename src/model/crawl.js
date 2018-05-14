'use strict';

// TODO: create crawl Schema:  an array of STOPS
// relationship: many to many for USERS and STOPS


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

export default mongoose.model('profile', profileSchema);