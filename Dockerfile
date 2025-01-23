FROM node:20-alpine3.21 AS base

ENV DIR=/app
WORKDIR $DIR

#########################
# BUILD FOR PRODUCTION
#########################

FROM base AS build

RUN apk update && apk add --no-cache dumb-init=1.2.5-r2

# Copiar los archivos de la aplicación
COPY package*.json ./
RUN npm ci && \
    rm -f .npmrc

COPY tsconfig*.json ./
COPY .swcrc ./
COPY nest-cli.json ./
COPY src src
COPY public public

RUN npm run build && \
    npm prune --production && \
    npm cache clean --force

#########################
# PRODUCTION
#########################

FROM base AS production

ENV NODE_ENV=production
ENV USER=node

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build $DIR/package*.json ./
COPY --from=build $DIR/node_modules node_modules
COPY --from=build $DIR/dist dist
COPY --from=build $DIR/public public

USER $USER
EXPOSE 3000
CMD ["dumb-init", "node", "dist/main.js"]
