# hmpps-template-typescript
Template github repo used for new Typescript based projects.

# Instructions

If this is a HMPPS project then the project will be created as part of bootstrapping - 
see https://github.com/ministryofjustice/dps-project-bootstrap.

This bootstrap is community managed by the mojdt `#typescript` slack channel. 
Please raise any questions or queries there. Contributions welcome!

Our security policy is located [here](https://github.com/ministryofjustice/hmpps-template-typescript/security/policy). 

More information about the template project including features can be found [here](https://dsdmoj.atlassian.net/wiki/spaces/NDSS/pages/3488677932/Typescript+template+project).

## Creating a CloudPlatform namespace

When deploying to a new namespace, you may wish to use this template typescript project namespace as the basis for your new namespace:

<https://github.com/ministryofjustice/cloud-platform-environments/tree/main/namespaces/live-1.cloud-platform.service.justice.gov.uk/hmpps-template-typescript>

This template namespace includes an AWS elasticache setup - which is required by this template project.

Copy this folder, update all the existing namespace references, and submit a PR to the CloudPlatform team. Further instructions from the CloudPlatform team can be found here: <https://user-guide.cloud-platform.service.justice.gov.uk/#cloud-platform-user-guide>

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

## Running the app
The easiest way to run the app is to use docker compose to create the service and all dependencies. 

`docker-compose pull`

`docker-compose up`

### Dependencies
The app requires: 
* hmpps-auth - for authentication
* redis - session store and token caching

### Running the app for development

To start the main services excluding the example typescript template app: 

`docker-compose up --scale=app=0`

Install dependencies using `npm install`, ensuring you are using >= `Node v14.x`

And then, to build the assets and start the app with nodemon:

`npm run start:dev`

### Run linter

`npm run lint`

### Run tests

`npm run test`

### Running integration tests

For local running, start a test db, redis, and wiremock instance by:

`docker-compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with nodemon)

And then either, run tests in headless mode with:

`npm run int-test`
 
Or run tests with the cypress UI:

`npm run int-test-ui`


### Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`
