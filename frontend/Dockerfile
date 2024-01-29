# syntax=docker/dockerfile:1

FROM node:14

WORKDIR /app
COPY . /app

RUN npm install

CMD [ "npm", "run", "build" ]
