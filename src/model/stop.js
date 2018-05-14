'use strict';

// relationships many to many for CRAWLS and Users

import mongoose from 'mongoose';

const stopSchema = mongoose.Schema({
  crawl: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'crawl',
  },
  locationName: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  streetView: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
  price: {
    type: String,
    required: true,
  },
});

export default mongoose.model('stop', stopSchema);
