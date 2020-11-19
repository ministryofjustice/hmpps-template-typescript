# Build stage 1.
ARG BUILD_NUMBER
ARG GIT_REF

FROM node:14-buster-slim as base

LABEL maintainer="HMPPS Digital Studio <info@digital.justice.gov.uk>"

ENV TZ=Europe/London
RUN ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone

RUN addgroup --gid 2000 --system appgroup && \
    adduser --uid 2000 --system appuser --gid 2000

WORKDIR /app

RUN apt-get update && \
    apt-get upgrade -y

# Build stage 2.
FROM base as build
ARG BUILD_NUMBER
ARG GIT_REF

RUN apt-get install -y make python g++

COPY . .

ENV BUILD_NUMBER ${BUILD_NUMBER:-1_0_0}
ENV GIT_REF ${GIT_REF:-dummy}

RUN CYPRESS_INSTALL_BINARY=0 npm ci --no-audit && npm run build  && \
    export BUILD_NUMBER=${BUILD_NUMBER} && \
    export GIT_REF=${GIT_REF} && \
    npm run record-build-info

# Build stage 3.
FROM base

RUN apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

COPY --from=build --chown=appuser:appgroup \
        /app/package.json \
        /app/package-lock.json \
        /app/dist \
        /app/build-info.json \
        ./

COPY --from=build --chown=appuser:appgroup \
        /app/assets ./assets

COPY --from=build --chown=appuser:appgroup \
        /app/node_modules ./node_modules

RUN npm prune --production

EXPOSE 3000
USER 2000

CMD [ "npm", "start" ]
