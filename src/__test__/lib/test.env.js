'use strict';

require('dotenv').config();

process.env.NODE_ENV = 'development';
process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.SECRET = 'fjkdljfdklfoeiwhkvnkljf';
process.env.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
process.env.GH_API_KEY = process.env.GH_API_KEY;
