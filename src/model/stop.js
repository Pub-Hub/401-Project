'use strict';

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
  votes: {
    type: Number,
    default: 0,
  },
});

function savePreHook(done) {
  return Crawl.findById(this.crawl)
    .then((crawlFound) => {
      if (!crawlFound) throw new HttpError(404, 'Crawl not found');
      crawlFound.stops.push(this._id);
      return crawlFound.save();
    })
    .then(() => done())
    .catch(done);
}

function removePostHook(document, next) {
  Crawl.findById(document.crawl)
    .then((crawlFound) => {
      if (!crawlFound) throw new HttpError(500, 'Crawl not found');
      crawlFound.stops = crawlFound.stops.filter((stop) => {
        return stop._id.toString() !== document._id.toString();
      });
      crawlFound.save();
    })
    .then(next)
    .catch(next);
}

// event listeners
stopSchema.pre('save', savePreHook);
stopSchema.post('remove', removePostHook);

export default mongoose.model('stop', stopSchema);
