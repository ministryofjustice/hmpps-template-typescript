SHELL = /bin/bash

PROJECT_NAME = hmpps-template-typescript

SERVICE_NAME = ui
DEPENDENCY_SERVICES = redis hmpps-auth hmpps-template-kotlin wiremock

APP_VERSION ?= local
NODE_MODULES_LAYOUT_VERSION = standalone-layout-v1

DEV_COMPOSE_FILES = -f docker/docker-compose.base.yml -f docker/docker-compose.dev.yml
CI_COMPOSE_FILES = -f docker/docker-compose.base.yml -f docker/docker-compose.test.yml
PROD_COMPOSE_FILES = -f docker/docker-compose.base.yml -f docker/docker-compose.prod.yml

export APP_VERSION
export COMPOSE_PROJECT_NAME=${PROJECT_NAME}

default: help

help: ## The help text you're reading.
	@grep --no-filename -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

build: ## Builds the app locally.
	@npm run build

prod-build: ## Builds a production image of the app.
	@docker compose ${PROD_COMPOSE_FILES} build ${SERVICE_NAME}

prod-up: ## Starts/restarts the app in a production container.
	@docker compose ${PROD_COMPOSE_FILES} up ${SERVICE_NAME} ${DEPENDENCY_SERVICES} --wait --no-recreate

dev-build: ## Builds a development image of the app and installs Node dependencies.
	@make install-node-modules
	@docker compose ${DEV_COMPOSE_FILES} build ${SERVICE_NAME}

dev-up: ## Starts/restarts a development container. A remote debugger can be attached on port 9229.
	@make install-node-modules
	@docker compose ${DEV_COMPOSE_FILES} up ${SERVICE_NAME} ${DEPENDENCY_SERVICES} --wait --no-recreate

down: ## Stops and removes all containers in the project.
	@docker compose ${DEV_COMPOSE_FILES} down --remove-orphans

test: ## Runs the unit test suite.
	@npm run test

e2e: ## Run Playwright tests locally (dev environment must be running).
	@BASE_URL=http://localhost:3000 WIREMOCK_URL=http://localhost:9091/__admin npx playwright test --reporter=list

e2e-ui: ## Run Playwright tests with UI mode (dev environment must be running).
	@BASE_URL=http://localhost:3000 WIREMOCK_URL=http://localhost:9091/__admin npx playwright test --ui

e2e-ci: ## Run Playwright tests in Docker container (for CI).
	@make install-node-modules
	@docker compose $(CI_COMPOSE_FILES) up $(SERVICE_NAME) wiremock --wait $(if $(filter local,$(APP_VERSION)),--build) && \
	docker compose $(CI_COMPOSE_FILES) run --rm playwright

typecheck: ## Runs the typecheck.
	@npm run typecheck

lint: ## Runs the linter.
	@npm run lint

lint-fix: ## Automatically fixes linting issues.
	@npm run lint-fix

install-node-modules: ## Installs Node modules into the Docker volume.
	@docker volume create ${PROJECT_NAME}_node_modules > /dev/null 2>&1 || true
	@docker run --rm \
	  -v ./package.json:/app/package.json:ro \
	  -v ./package-lock.json:/app/package-lock.json:ro \
	  -v ./.allowed-scripts.mjs:/app/.allowed-scripts.mjs:ro \
	  -v ./.npmrc:/app/.npmrc:ro \
	  -v ~/.npm:/npm_cache \
	  -v ${PROJECT_NAME}_node_modules:/app/node_modules \
	  node:24-slim \
	  /bin/sh -c '\
	    CURRENT_HASH=$$( (cat /app/package.json /app/package-lock.json; echo "${NODE_MODULES_LAYOUT_VERSION}") | sha256sum | cut -d" " -f1); \
	    STORED_HASH=$$(cat /app/node_modules/.package-hash 2>/dev/null || echo ""); \
	    if [ "$$CURRENT_HASH" != "$$STORED_HASH" ]; then \
	      echo "Package files changed, running npm ci..."; \
	      cd /app && npm ci --cache /npm_cache --prefer-offline --ignore-scripts && \
	      echo "$$CURRENT_HASH" > /app/node_modules/.package-hash; \
	    else \
	      echo "node_modules is up-to-date."; \
	    fi'

clean: ## Stops and removes all project containers. Deletes local build/cache directories.
	@docker compose ${DEV_COMPOSE_FILES} down --remove-orphans
	@docker images -q --filter=reference="ghcr.io/ministryofjustice/*:local" | xargs -r docker rmi
	@docker volume ls -qf "dangling=true" | xargs -r docker volume rm
	@rm -rf dist node_modules test_results

update: ## Downloads the latest versions of container images.
	@docker compose ${DEV_COMPOSE_FILES} pull --ignore-buildable
