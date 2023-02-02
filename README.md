# PCRS Hint Service
This project is a simple Nestjs server, acts as a mediator between PCRS and 3rd-party service for hint generation, such as OpenAI.

## Installation
First, install the dependencies:

```bash
$ npm install
```
Then, create a .env file in the root directory with the template in .env-template

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentation
For more technical documentation, please visit the [Wiki](./docs/README.md)
