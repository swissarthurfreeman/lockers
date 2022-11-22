# Lockers

## Goal

The goal of this application is to manage a set of lockers within an institution. A locker has a certain size, works with a padlock or a key and is at a certain location. Users can rent out lockers for predefined period of time. (In an academic context, it is for a semester). This application provides the functionality to automate locker rentals, manage and compute contract expirations avoiding unnecessary paperwork. 

This backend application exposes a REST api to be queried by the front end for managing lockers, contracts and localisations (see domain model). Constraints must be enforced, a locker can only be rented out by one user, a user cannot modify his contract or that of others, an admin must be able to modify his lockers, these use cases and requirements were all captured in the initial stages of the development process and have been implemented and refined since then. 

## Overview

This project uses Node.js with npm and Typescript.
To run this project please type ```npm run start``` in the same directory as ```package.json```.

## REST API

The backend exposes a REST API to be queried by the front-end. All endpoints are rest compliant in principle.

### Routes

| Endpoints             | Allowed Verbs                  | Filtering Support |
|-----------------------|--------------------------------|-------------------|
| /lockers              | GET, POST                      | yes               |
| /lockers/:id          | GET, PUT, DELETE               | no                |
| /contracts            | GET, POST                      | yes               |
| /contracts/:id        | GET, PUT, DELETE               | no                |
| /locations            | GET, POST                      | yes               |
| /locations/:id        | GET, PUT, DELETE               | no                |

### Return Objects

## Launching the mySql container

Is done via ```docker-compose up --force-recreate database``` to make sure database is dropped and modifications are all taken into account without conflicts. 
