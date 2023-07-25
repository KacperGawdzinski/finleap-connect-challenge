## A solution to the finleap connect code challenge 💻

### Technologies

| Technology | Description |
| -------- | -------- |
| NestJS     | A NodeJS framework for building server-side applications  |
| Nock     | HTTP server mocking library |
| @nestjs/axios | NestJS version of axios based on rxjs|
| Zod | TypeScript-first schema declaration and validation library |
| Jest | Unit testing framework |
| Docker | A platform for creating and managing containers |

### Start

You have two ways to start the project:
1. Use Docker:
- to build the project type: `docker build . -t finleap-challenge`
- start the application with: `docker run -p 3000:3000 finleap-connect`
2. Manually
- run `npm install` in a project's directory to install dependencies
- export an env variable NODE_ENV with `export NODE_ENV=development` in your terminal
- to start the project type `npm run start:prod` for production build or `npm run start:dev` for development


### Description

In my solution I used NestJS as a server framework to ensure that the backend is properly divided on modules, controllers and services. I did use typescript in strict mode.

There are four services in the application: RevolutApi, MonzoApi, SterlingApi and ExternalApi.

First three of them take care of fetching data and transforming it into a unified transaction type. The ExternalApi service is a source of API urls for the application. When launched with **NODE_ENV=development** it will insert mocked links into other services. If launched with **NODE_ENV=production** it would fetch data from the real API (which doesn't exist in the solution because only mocked data was supported)

I used Docker to create a multi-stage build for the application and insert mentioned NODE_ENV variable into the container.

#### Data is available at:
- localhost:3000/transactions
- localhost:3000/transactions?source=${bank}

#### Data validation
Data collected from ex. /api/revolut is validated by zod (z.parse()). If the data is not compatible with the interface then it throws an error. Otherwise, the data is valid and the program keeps running.

#### Running tests
To run tests type in terminal: `npm run test`

### My observations
- revolut-ts.json file was corrupted, with one comma missing
- metadata property in unified transaction type was said to be a string and at the same time to be an object containing a source property. I did the second version
- revolut transaction doesn't have a 'description' property so based on the value of transfer I set the description to: 'Transfer to/from <counterparty.name>
- by 'you have to be able to call those APIs using HTTP as you would do with real ones' I thought that the API should also be accessible via browser. Although technologies like Nock or Sinon are meant to mock requests on the server side. That's why in my solution mocked API is only accessible through the server.

@KacperGawdzinski
