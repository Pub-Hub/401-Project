'use strict';

import HttpError from 'http-errors';
import mongoose from 'mongoose';
import Profile from './profile';

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
  name: {
    type: String,
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profile',
  },
});

function removePostHook(document, next) {
  Profile.findById(document.profile)
    .then((profileFound) => {
      if (!profileFound) throw new HttpError(500, 'Profile not found');
      profileFound.crawls = profileFound.crawls.filter((crawl) => {
        return crawl._id.toString() !== document._id.toString();
      });
      profileFound.save();
    })
    .then(next)
    .catch(next);
}

crawlSchema.post('remove', removePostHook);

export default mongoose.model('crawl', crawlSchema);
