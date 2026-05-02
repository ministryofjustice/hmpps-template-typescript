# Stage: base image
FROM node:24-slim AS base
RUN apt-get update && apt-get install -y --no-install-recommends wget && rm -rf /var/lib/apt/lists/* && \
    groupadd --gid 2000 appgroup && \
    useradd --uid 2000 --gid appgroup --create-home appuser

WORKDIR /app

# Stage: install ALL dependencies (dev + prod) for building
FROM base AS deps
COPY package.json package-lock.json .allowed-scripts.mjs .npmrc ./
RUN --mount=type=cache,target=/npm_cache \
    npm ci --cache /npm_cache --prefer-offline --ignore-scripts

# Stage: install ONLY production dependencies
FROM base AS prod-deps
COPY package.json package-lock.json .allowed-scripts.mjs .npmrc ./
RUN --mount=type=cache,target=/npm_cache \
    npm ci --cache /npm_cache --prefer-offline --omit=dev --ignore-scripts

# Stage: development target (used by docker-compose.dev.yml)
FROM base AS development
ENV NODE_ENV=development

# Stage: build assets using full deps
FROM deps AS build
COPY . .
RUN npm run build

# Stage: production image
FROM base AS production

ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_BRANCH

RUN test -n "$BUILD_NUMBER" || (echo "BUILD_NUMBER not set" && false)
RUN test -n "$GIT_REF" || (echo "GIT_REF not set" && false)
RUN test -n "$GIT_BRANCH" || (echo "GIT_BRANCH not set" && false)

ENV BUILD_NUMBER=${BUILD_NUMBER} \
    GIT_REF=${GIT_REF} \
    GIT_BRANCH=${GIT_BRANCH} \
    NODE_ENV=production

COPY --from=build --chown=appuser:appgroup \
        /app/package.json \
        ./package.json

COPY --from=build --chown=appuser:appgroup \
        /app/dist \
        ./dist

COPY --from=prod-deps --chown=appuser:appgroup \
        /app/node_modules \
        ./node_modules

EXPOSE 3000
USER 2000

CMD [ "npm", "start" ]
