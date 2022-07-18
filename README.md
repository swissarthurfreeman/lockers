# Lockers

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