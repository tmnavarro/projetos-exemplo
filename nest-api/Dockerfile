FROM node:12-alpine

RUN apk update && apk add bash

WORKDIR /home/api

# Linhas ignorada pelo composer
# Pois existe override na configuração
COPY package.json ./
RUN yarn

COPY . .

CMD ["yarn", "start:dev"] 