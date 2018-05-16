# Pub Hub

![pubhub image](src/data/pubhub-small.png) 

[![Build Status](https://travis-ci.org/Pub-Hub/401-Project.svg?branch=master)](https://travis-ci.org/Pub-Hub/401-Project)
![Coverage](https://img.shields.io/badge/coverage-93.17%25-brightgreen.svg)
![Node](https://img.shields.io/badge/node-v9.11.1-blue.svg)
![npm](https://img.shields.io/badge/npm-v6.0.0-blue.svg)
![version](https://img.shields.io/badge/version-1.0.0-orange.svg)

## Overview

## Getting Started
To use the Pub Hub application, [Node.js](https://nodejs.org/en/), [npm](https://www.npmjs.com/) 
(Node Package manager), and [Mongo DB](https://docs.mongodb.com/manual/installation/)  will need
 to be locally installed.
 
To install the Pub Hub files and all dependencies, run: 

    npm install

## Architecture
This application was deployed with the following technologies.
Node.js, npm, body-parser, dotenv, express, faker, mongoose, winston, babel, superagent, http-errors, jest, eslint, JavaScript.

## Schema Structure

### User Schema
The user schema has a one to one relationship with the profile schema.  The user schema is linked to a user's profile schema. The user schema holds the following information: 
- A required and unique `username` string.
- A required and unique `email` string.
- A optional `phone` number string

**Server Endpoints for User Schema**:
- POST `/signup` - allows new users to sign up
- GET `/login` - allows existing users to log in

### Profile Schema
The profile schema has a one to one relationship with the user, and a one to many relationship with the Crawls schema. The profile schema holds the following information: 
- A required and unique `username` string (matches username in corresponding User schema)
- Array of `crawls` that contains the ids of the crawls saved to the user profile.
- Link to `User`.

**Server Endpoints for Profile Schema**:
- GET `/profiles` - returns a list of all user profiles in the database


     [ "user34932", "user9056", "user73904", "user752" ]
     
### Crawls Schema
The crawls schema has a one to many relationship with a user's profile (many crawls per profile), and a one to many relationship with the `Stops` schema (many stops per crawl) The crawls schema holds the following information: 
- Array of `stops` that contains the ids of the stops that make up the crawl.
- A `votes` field that holds a number denoting the amount of times the crawl has been "liked"/"favorited". 

**Server Endpoints for Crawls Schema**:
- GET `/crawls` - returns all the saved crawls in the database
- GET `/crawls/<username>` - returns all saved crawls on a user's profile
- GET `/crawls/<username>/<crawl-id>` - returns a single crawl from the user's profile
- GET `/crawls/votes/<crawl-id>` - returns the total number of votes on a crawl
- PUT `/crawls/<username>/<crawl-id>` - saves a crawl to the user's profile
- PUT `/crawls/votes/<crawl-id>` - adds a vote to a crawl
- DELETE `/crawls/<crawl-id>` - deletes a single crawl from the database (and removes linked crawl on the user's profile)

TODO: ((need example code blocks!!!))

#### Stops Schema
The stops schema has a many to many relationship with the Crawls schema. The stop schema holds the following information: 
- ID of crawl schema it is linked to.
- A `votes` field that holds a number denoting the amount of times the stop has been "liked"/"favorited". 
- The following fields are required and take in a 'String' type: `locationName`, `address`, `latitude`, and `longitude`.

**Server Endpoints for Crawls Schema**:
- PUT `/stops/votes/<stop-id>` - adds a vote to a stop
- GET `/stops/votes/<stop-id>` - returns the total number of votes for a single stop
- DELETE `/stops/<stop-id>` - deletes a single stop from the database (and removes stop from the parent crawl)

TODO: ((need example code blocks!!!))

## Using PubHub
`app.get('<url>/search/<latitude>/<longitude>/<price-range>/<max-stops>')`

This will return an array of objects holding the names and addresses of the generated pub crawl:
 
     [
        { "name": "Bandits Bar",
          "address": "159 Denny Way, Seattle" },
          
        { "name": "Sherri's @ City Center",
          "address": "Seattle" },
          
        { "name": "Plaza Garibaldi",
          "address": "129 1st Avenue North, Seattle" },
          
        { "name": "Uptown China Restaurant",
          "address": "200, 4805, Queen Anne Avenue North, Seattle" },
          
        { "routeId": "5afa370d1116fdb6bc886cfb" }
     ]
 
 The last item in the array is the id of the generated crawl, that the user can then choose to save to their profile.
 
    app.put('<url>/crawls/pubhubUser38492/5afa370d1116fdb6bc886cfb')
 
 This will save the crawl to the user's profile and return the updated crawl with the updated profile id.
 
    { 
        "stops": [ "5afa370d1116fdb6bc594xsb",
                   "5afa370d1116fdb6bc594xsd",
                   "5afa370d1116fdb6bc594xsh",
                   "5afa370d1116fdb6bc594xse" ], 
        "votes": 0,
        "_id": "5afa093fc110aaaac51631eb",
        "__v": 0 
    }
 
 The user's profile will now have the crawl id of the newly-saved crawl.
 
     { 
         "crawls": [ "5afa370d1116fdb6bc886cfb" ],
         "user": "5afa093fc110aaaac51631io"
         "username": "pubhubUser38492"
         "_id": "5afa093fc110aaaac51631eb",
         "__v": 0
     }

## Change Log
- 05-14-2018  9:20am  repo created 
- 05-14-2018  9:43am  first commit, scaffolding
- 05-14-2018 11:00am  continued scaffolding project
- 05-14-2018  2:00pm  schema and middleware added
- 05-14-2018  3:30pm  updated readme and package.json
- 05-14-2018  3:50pm  Google API integration added and tested.

## Testing
Testing is run through jest. To test, run

    npm run dbon
    npm test

After testing, run:

    npm run dboff

## Credits and Collaborations

Collaborators: [Sarah Geyer](https://github.com/sjgeyer), [Ryan Groesch](https://github.com/ryan-g13), [Dawn Aldrich](https://github.com/dawnaldrich), [Josh Fredrickson](https://github.com/Joshua-Fredrickson)

Special thanks to all of the Code Fellows staff.

