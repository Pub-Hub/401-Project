'use strict';

// relationship: many to many for USERS and STOPS

import mongoose from 'mongoose';

const crawlSchema = mongoose.Schema({
  stops: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'stop',
    },
  ],
  votes: {
    type: Number,
    default: 0,
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profile',
  },
});

export default mongoose.model('crawl', crawlSchema);
