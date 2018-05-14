# 401-Project

**Author**: Dawn Aldrich, Josh Fredrickson, Ryan Groesch, Sarah Geyer

**Version**: 1.0.0 

## Overview


## Getting Started
   


## Architecture

## Schema Structure

#### User Schema
The user schema has a one to one relationship with the profile schema.  The user schema is linked
 to a user's profile schema. The user schema holds the following information: 
- A unique username string which is required for this schema.
- A unique string is required for the email field.
- A optional phone number string

#### Profile Schema
The user schema has a many to many relationship.  The profile schema is linked to the crawls and 
user schemas. The profile schema holds the following information: 
- The username field information is the same information as the user schema.
- linked to the crawls schema.
- linked to the user schema.

#### Crawls Schema
The crawls schema has a many to many relationship.  The crawls schema is linked to the profile and 
stops schema. The crawls schema holds the following information: 
- This document holds an array of stops object that are referenced with in the stops schema.
- the `votes` field hold a number type denoting the amount of "liked/favorite" stop locations. 

#### Stops Schema
The stops schema has a many to many relationship.  The stops schema is linked to the profile and 
crawls schema. The stop schema holds the following information: 
- It is linked to the crawls schema
- It is linked to the profile schema
- the `votes` field hold a number type denoting the amount of "liked/favorite" crawls. 
- The following fields take in a 'String' type: location name, address, lattitude, longitude, 
streetview thumbnail, and price* 
* price is a required field. 

## Change Log 
05-14-2018  9:43am  first commit, scaffolding tests not passing


## Credits and Collaborations

Special thanks to all of the Code Fellows staff and fellow 401-d23 students.

