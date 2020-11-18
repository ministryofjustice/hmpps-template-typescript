# hmpps-template-typescript
Template github repo used for new Typescript based projects.

## Getting started
The easiest way to run the app is to use docker compose to create the service and all dependencies. 

`docker-compose pull`

`docker-compose up`

### Dependencies
The app requires: 
* hmpps-auth - for authentication
* redis - session store and token caching

### Runing the app for development

To start the main services excluding the example typescript template app: 

`docker-compose up`

Install dependencies using `npm install`, ensuring you are using >= `Node v12.16.x`
(Circle build/test using node:12.18.2-buster-browsers, Dockerfile using node:12-buster-slim)

And then, to build the assets and start the app with nodemon:

`npm run start:dev`

### Run linter

`npm run lint`

### Run tests

`npm run test`

### Running integration tests

For local running, start a test db, redis, and wiremock instance by:

`docker-compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with nodemon)

And then either, run tests in headless mode with:

`npm run int-test`
 
Or run tests with the cypress UI:

`npm run int-test-ui`
