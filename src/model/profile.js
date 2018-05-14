'use strict';

// TODO: create profile Schema with relations to user Schema,  user name, phone, and
// favorites/votes??


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