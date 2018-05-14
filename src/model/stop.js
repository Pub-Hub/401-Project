'use strict';

// TODO: create stop Schema which has: address, lat/long, name, votes, thumbnail/streetview
// relationships many to many for CRAWLS and Users


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

export default mongoose.model('stop', profileSchema);