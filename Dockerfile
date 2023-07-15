FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node certs ./certs

COPY --chown=node:node 475D864FB2AAC2D106560F09A3524187.txt ./

RUN npm ci

COPY --chown=node:node . .

USER node


FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node certs ./certs

COPY --chown=node:node 475D864FB2AAC2D106560F09A3524187.txt ./

COPY --chown=node:node . .


RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node


FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules

COPY --chown=node:node --from=build /usr/src/app/dist ./dist

COPY --chown=node:node  package*.json ./

COPY --chown=node:node certs ./certs

COPY --chown=node:node 475D864FB2AAC2D106560F09A3524187.txt ./

CMD [ "npm", "run", "start:prod" ]
