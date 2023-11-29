# hmpps-template-typescript
[![repo standards badge](https://img.shields.io/badge/dynamic/json?color=blue&style=flat&logo=github&label=MoJ%20Compliant&query=%24.result&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-template-typescript)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#hmpps-template-typescript "Link to report")
[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-template-typescript/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-template-typescript)

Template github repo used for new Typescript based projects.

# Instructions

If this is a HMPPS project then the project will be created as part of bootstrapping - 
see https://github.com/ministryofjustice/dps-project-bootstrap. You are able to specify a template application using the `github_template_repo` attribute to clone without the need to manually do this yourself within GitHub.

This bootstrap is community managed by the mojdt `#typescript` slack channel. 
Please raise any questions or queries there. Contributions welcome!

Our security policy is located [here](https://github.com/ministryofjustice/hmpps-template-typescript/security/policy). 

More information about the template project including features can be found [here](https://dsdmoj.atlassian.net/wiki/spaces/NDSS/pages/3488677932/Typescript+template+project).

## Creating a Cloud Platform namespace

When deploying to a new namespace, you may wish to use this template typescript project namespace as the basis for your new namespace:

<https://github.com/ministryofjustice/cloud-platform-environments/tree/main/namespaces/live.cloud-platform.service.justice.gov.uk/hmpps-template-typescript>

This template namespace includes an AWS elasticache setup - which is required by this template project.

Copy this folder, update all the existing namespace references, and submit a PR to the Cloud Platform team. Further instructions from the Cloud Platform team can be found here: <https://user-guide.cloud-platform.service.justice.gov.uk/#cloud-platform-user-guide>

## Renaming from HMPPS Template Typescript - github Actions

Once the new repository is deployed. Navigate to the repository in github, and select the `Actions` tab.
Click the link to `Enable Actions on this repository`.

Find the Action workflow named: `rename-project-create-pr` and click `Run workflow`.  This workflow will
execute the `rename-project.bash` and create Pull Request for you to review.  Review the PR and merge.

Note: ideally this workflow would run automatically however due to a recent change github Actions are not
enabled by default on newly created repos. There is no way to enable Actions other then to click the button in the UI.
If this situation changes we will update this project so that the workflow is triggered during the bootstrap project.
Further reading: <https://github.community/t/workflow-isnt-enabled-in-repos-generated-from-template/136421>

## Manually branding from template app
Run the `rename-project.bash` and create a PR.

The rename-project.bash script takes a single argument - the name of the project and calculates from it the project description
It then performs a search and replace and directory renames so the project is ready to be used.

## Ensuring slack notifications are raised correctly

To ensure notifications are routed to the correct slack channels, update the `alerts-slack-channel` and `releases-slack-channel` parameters in `.circle/config.yml` to an appropriate channel.

## Filling in the `productId`

To allow easy identification of an application, the product Id of the overall product should be set in `values.yaml`. The Service Catalogue contains a list of these IDs and is currently in development here https://developer-portal.hmpps.service.justice.gov.uk/products

## Dependencies

The app requires: 

* hmpps-auth - for authentication
* manage-users-api - to provide user details
* redis - session store and token caching

## Development

Follow the steps below to get the app up and running in your local environment.

### Pre-requisites

You'll need to install:

* [Node 20.x](https://nodejs.org/download/release/latest-v20.x)

If you're already using [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm), run:
`nvm install --latest-npm` at the project root to install the correct Node version automatically.

Then, install the NPM dependencies:

```shell
npm install
```

### Start the app

To start the app in dev mode, run:

```shell
npm run start:dev
```

The app will be available at http://localhost:3000. Nodemon will restart the app on file changes.

Running in dev mode uses an in-memory session store and a local user account.
To change the local user account details or roles, update the `localStrategy` in [server/authentication/auth.ts](server/authentication/auth.ts).

### Start the app with dependencies

To start the app with dependencies in Docker, run:

```shell
docker-compose up --build
```

This will start a HMPPS Auth, Manage Users API, and a Redis container. You will need to add valid client credentials to the docker-compose.yml file.

Note: this method does not support live reloading with nodemon.

### Integrate with the dev environment

To connect your local app to the services deployed in the dev environment, create a `.env` file at the root of your project:
```properties
NODE_ENV=development
ENVIRONMENT_NAME=dev
HMPPS_AUTH_ENABLED=true
HMPPS_AUTH_URL=https://sign-in-dev.hmpps.service.justice.gov.uk/auth
MANAGE_USERS_API_URL=https://manage-users-api-dev.hmpps.service.justice.gov.uk

# Replace these values with your dev client credentials
API_CLIENT_ID=clientid
API_CLIENT_SECRET=clientsecret
SYSTEM_CLIENT_ID=clientid
SYSTEM_CLIENT_SECRET=clientsecret
```

Then run
```shell
npm run start:dev
```

### Run linter

`npm run lint`

### Run tests

`npm run test`

### Running integration tests

For local running, start a test db and wiremock instance by:

`docker compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with nodemon)

And then either, run tests in headless mode with:

`npm run int-test`
 
Or run tests with the cypress UI:

`npm run int-test-ui`

## Change log

A changelog for the service is available [here](./CHANGELOG.md)


## Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`
