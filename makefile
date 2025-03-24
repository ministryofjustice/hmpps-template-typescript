SHELL = '/bin/bash'

## Useful to keep this the same for backend/frontend
PROJECT_NAME = hmpps-templates

## Must match name of container in Docker
SERVICE_NAME = hmpps-template-typescript

## Namespace for dev deployment
K8S_NAMESPACE_SECRETS_FILE = docker/namespace-secrets.yaml

## Compose files to stack on each other
DEV_COMPOSE_FILES = -f docker/docker-compose.base.yml -f docker/docker-compose.local.yml
REMOTE_COMPOSE_FILES = -f docker/docker-compose.base.yml -f docker/docker-compose.remote.yml
TEST_COMPOSE_FILES = -f docker/docker-compose.base.yml -f docker/docker-compose.test.yml

export COMPOSE_PROJECT_NAME=${PROJECT_NAME}

default: help

help: ## The help text you're reading.
	@grep --no-filename -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

dev-up: ## Starts/restarts a development container. A remote debugger can be attached on port 9229.
	@make install-node-modules
	docker compose down ${SERVICE_NAME}
	docker compose ${DEV_COMPOSE_FILES} up ${SERVICE_NAME} --wait

remote-up: ## Starts/restarts a development container configured to use HMPPS dev environment services. A remote debugger can be attached on port 9229.
	docker compose down ${SERVICE_NAME}
	env $$(make get-namespace-secrets) \
	docker compose ${REMOTE_COMPOSE_FILES} up ${SERVICE_NAME} --wait

down: ## Stops and removes all containers in the project.
	docker compose down

test: ## Runs the unit test suite.
	docker compose exec ${SERVICE_NAME} npm run test

e2e: ## Run the end-to-end tests locally in the Cypress app..
	@make install-node-modules
	docker compose ${TEST_COMPOSE_FILES} up ${SERVICE_NAME} --wait
	npx cypress install
	npx cypress open --e2e -c experimentalInteractiveRunEvents=true

lint: ## Runs the linter.
	docker compose exec ${SERVICE_NAME} npm run lint

lint-fix: ## Automatically fixes linting issues.
	docker compose exec ${SERVICE_NAME} npm run lint-fix

install-node-modules: ## Installs Node modules into the Docker volume.
	@docker run --rm \
	  -e CYPRESS_INSTALL_BINARY=0 \
	  -v ./package.json:/package.json \
	  -v ./package-lock.json:/package-lock.json \
	  -v ~/.npm:/npm_cache \
	  -v ${PROJECT_NAME}_node_modules:/node_modules \
	  node:22-alpine \
	  /bin/sh -c 'if [ ! -f /node_modules/.last-updated ] || [ /package.json -nt /node_modules/.last-updated ]; then \
	    echo "Running npm ci as container node_modules is outdated or missing."; \
	    npm ci --cache /npm_cache --prefer-offline; \
	    touch /node_modules/.last-updated; \
	  else \
	    echo "Container node_modules is up-to-date."; \
	  fi'

get-namespace-secrets: ## Outputs namespace/dev environment configured in the K8S_NAMESPACE_SECRETS_FILE
	@for var in $$(yq e '.env | keys | .[]' "$(K8S_NAMESPACE_SECRETS_FILE)"); do \
	  value=$$(yq e ".env.\"$$var\"" "$(K8S_NAMESPACE_SECRETS_FILE)"); \
	  echo "$$var=$$value"; \
	done

	@for secretName in $$(yq e '.namespace_secrets | keys | .[]' "$(K8S_NAMESPACE_SECRETS_FILE)"); do \
	  for envVar in $$(yq e ".namespace_secrets.\"$$secretName\" | keys | .[]" "$(K8S_NAMESPACE_SECRETS_FILE)"); do \
		secretKey=$$(yq e ".namespace_secrets.\"$$secretName\".\"$$envVar\"" "$(K8S_NAMESPACE_SECRETS_FILE)"); \
		rawValue=$$( \
		  kubectl get secret "$$secretName" -n "$$(yq e '.namespace_name' "$(K8S_NAMESPACE_SECRETS_FILE)")" -o json \
		  | jq -r ".data[\"$$secretKey\"] | select(.!=null)" \
		  | base64 -d \
		); \
		echo "$$envVar=$$rawValue"; \
	  done; \
	done

clean: ## Stops and removes all project containers. Deletes local build/cache directories.
	docker compose down
	docker volume ls -qf "dangling=true" | xargs -r docker volume rm
	npm run clean

update: ## Downloads the latest versions of container images.
	docker compose ${DEV_COMPOSE_FILES} pull
