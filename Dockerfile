# Build stage 1.
# Create base image with python (required for node-gyp)
ARG BUILD_NUMBER
ARG GIT_REF

FROM node:12-buster-slim as base

LABEL maintainer="HMPPS Digital Studio <info@digital.justice.gov.uk>"

ENV TZ=Europe/London
RUN ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone

RUN addgroup --gid 2000 --system appgroup && \
    adduser --uid 2000 --system appuser --gid 2000

WORKDIR /app

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y make python

# Build stage 2.
# This stage builds our assets.
FROM base as build
ARG BUILD_NUMBER
ARG GIT_REF

RUN apt-get install -y curl wget

# Install AWS RDS Root cert
RUN mkdir /home/appuser/.postgresql \
  && curl https://s3.amazonaws.com/rds-downloads/rds-ca-2019-root.pem \
    > /app/root.cert

COPY . .

ENV BUILD_NUMBER ${BUILD_NUMBER:-1_0_0}
ENV GIT_REF ${GIT_REF:-dummy}

RUN CYPRESS_INSTALL_BINARY=0 npm ci --no-audit && npm run build  && \
    export BUILD_NUMBER=${BUILD_NUMBER} && \
    export GIT_REF=${GIT_REF} && \
    npm run record-build-info

# Build stage 3.
# This stage builds the final Docker image that we'll use in production.
FROM base

RUN apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

COPY --from=build --chown=appuser:appgroup \
        /app/package.json \
        /app/package-lock.json \
        /app/dist \
        /app/root.cert \
        /app/build-info.json \
        ./

COPY --from=build --chown=appuser:appgroup \
        /app/assets ./assets

COPY --from=build --chown=appuser:appgroup \
        /app/server/views ./server/views

RUN npm ci --only=production

EXPOSE 3000
ENV NODE_ENV='production'
USER 2000

CMD [ "npm", "start" ]
