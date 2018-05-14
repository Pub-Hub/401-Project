'use strict';

// relationships many to many for CRAWLS and Users

import mongoose from 'mongoose';
import HttpError from 'http-errors';
import Crawl from './crawl';

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
  // streetView: {
  //   type: String,
  //   required: true,
  // },
  votes: {
    type: Number,
    default: 0,
  },
  // price: {
  //   type: String,
  //   required: true,
  // },
});

function stopPreHook(done) {
  return Crawl.findById(this.crawl)
    .then((crawlFound) => {
      if (!crawlFound) throw new HttpError(404, 'Crawl not found');
      crawlFound.stops.push(this._id);
      return crawlFound.save();
    })
    .then(() => done())
    .catch(done);
}

const stopPostHook = (document, done) => {
  return Crawl.findById(document.crawl)
    .then((crawlFound) => {
      if (!crawlFound) throw new HttpError(500, 'Crawl not found');
      crawlFound.stops = crawlFound.stops.filter((stop) => {
        return stop._id.toString() !== document._id.toString();
      });
    })
    .then(() => done())
    .catch(done);
};

// event listeners
stopSchema.pre('save', stopPreHook);
stopSchema.post('remove', stopPostHook);

export default mongoose.model('stop', stopSchema);
