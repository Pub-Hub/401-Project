'use strict';

import mongoose from 'mongoose';

const profileSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  crawls: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'crawl',
    },
  ],
});

export default mongoose.model('profile', profileSchema);
