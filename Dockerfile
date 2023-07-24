FROM node:18.17.0-alpine3.17 As build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18.17.0-alpine3.17 As run

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist .
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY ./src/bank-services/external-apis/mocked-data ./src/bank-services/external-apis/mocked-data

EXPOSE 3000:3000

CMD ["node", "main"]