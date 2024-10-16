# hmpps-template-typescript

[![repo standards badge](https://img.shields.io/badge/endpoint.svg?&style=flat&logo=github&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-template-kotlin)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-report/hmpps-template-kotlin "Link to report")
[![Docker Repository on ghcr](https://img.shields.io/badge/ghcr.io-repository-2496ED.svg?logo=docker)](https://ghcr.io/ministryofjustice/hmpps-template-kotlin)
[![API docs](https://img.shields.io/badge/API_docs_-view-85EA2D.svg?logo=swagger)](https://hmpps-template-kotlin-dev.hmpps.service.justice.gov.uk/webjars/swagger-ui/index.html?configUrl=/v3/api-docs)

Template github repo used for new Typescript based projects.

# Instructions

If this is a HMPPS project then the project will be created as part of bootstrapping -
see [dps-project-bootstrap](https://github.com/ministryofjustice/dps-project-bootstrap). You are able to specify a
template application using the `github_template_repo` attribute to clone without the need to manually do this yourself
within GitHub.

This project is community managed by the mojdt `#typescript` slack channel.
Please raise any questions or queries there. Contributions welcome!

Our security policy is located [here](https://github.com/ministryofjustice/hmpps-template-typescript/security/policy).

## Creating a Cloud Platform namespace

When deploying to a new namespace, you may wish to use the
[templates project namespace](https://github.com/ministryofjustice/cloud-platform-environments/tree/main/namespaces/live.cloud-platform.service.justice.gov.uk/hmpps-templates-dev)
as the basis for your new namespace. This namespace contains both the kotlin and typescript template projects, 
which is the usual way that projects are setup.

Copy this folder and update all the existing namespace references to correspond to the environment to which you're deploying.

If you only need the typescript configuration then remove all kotlin references.

To ensure the correct github teams can approve releases, you will need to make changes to the configuration in `resources/service-account-github` where the appropriate team names will need to be added (based on [lines 98-100](https://github.com/ministryofjustice/cloud-platform-environments/blob/main/namespaces/live.cloud-platform.service.justice.gov.uk/hmpps-templates-dev/resources/serviceaccount-github.tf#L98) and the reference appended to the teams list below [line 112](https://github.com/ministryofjustice/cloud-platform-environments/blob/main/namespaces/live.cloud-platform.service.justice.gov.uk/hmpps-templates-dev/resources/serviceaccount-github.tf#L112)). Note: hmpps-sre is in this list to assist with deployment issues.

Submit a PR to the Cloud Platform team in
#ask-cloud-platform. Further instructions from the Cloud Platform team can be found in
the [Cloud Platform User Guide](https://user-guide.cloud-platform.service.justice.gov.uk/#cloud-platform-user-guide)

## Renaming from HMPPS Template Typescript - github Actions

Once the new repository is deployed. Navigate to the repository in github, and select the `Actions` tab.
Click the link to `Enable Actions on this repository`.

Find the Action workflow named: `rename-project-create-pr` and click `Run workflow`. This workflow will
execute the `rename-project.bash` and create Pull Request for you to review. Review the PR and merge.

Note: ideally this workflow would run automatically however due to a recent change github Actions are not
enabled by default on newly created repos. There is no way to enable Actions other then to click the button in the UI.
If this situation changes we will update this project so that the workflow is triggered during the bootstrap project.
Further reading: <https://github.community/t/workflow-isnt-enabled-in-repos-generated-from-template/136421>

The script takes six arguments:

### New project name

This should start with `hmpps-` e.g. `hmpps-prison-visits` so that it can be easily distinguished in github from
other departments projects. Try to avoid using abbreviations so that others can understand easily what your project is.

### Slack channel for release notifications

By default, release notifications are only enabled for production. The circleci configuration can be amended to send
release notifications for deployments to other environments if required. Note that if the configuration is amended,
the slack channel should then be amended to your own team's channel as `dps-releases` is strictly for production release
notifications. If the slack channel is set to something other than `dps-releases`, production release notifications
will still automatically go to `dps-releases` as well. This is configured by `releases-slack-channel` in
`.circleci/config.yml`.

### Slack channel for pipeline security notifications

Ths channel should be specific to your team and is for daily / weekly security scanning job results. It is your team's
responsibility to keep up-to-date with security issues and update your application so that these jobs pass. You will
only be notified if the jobs fail. The scan results can always be found in circleci for your project. This is
configured by `alerts-slack-channel` in `.circleci/config.yml`.

### Non production kubernetes alerts

By default Prometheus alerts are created in the application namespaces to monitor your application e.g. if your
application is crash looping, there are a significant number of errors from the ingress. Since Prometheus runs in
cloud platform AlertManager needs to be setup first with your channel. Please see
[Create your own custom alerts](https://user-guide.cloud-platform.service.justice.gov.uk/documentation/monitoring-an-app/how-to-create-alarms.html)
in the Cloud Platform user guide. Once that is setup then the `custom severity label` can be used for
`alertSeverity` in the `helm_deploy/values-*.yaml` configuration.

Normally it is worth setting up two separate labels and therefore two separate slack channels - one for your production
alerts and one for your non-production alerts. Using the same channel can mean that production alerts are sometimes
lost within non-production issues.

### Production kubernetes alerts

This is the severity label for production, determined by the `custom severity label`. See the above
#non-production-kubernetes-alerts for more information. This is configured in `helm_deploy/values-prod.yaml`.

### Product ID

This is so that we can link a component to a product and thus provide team and product information in the Developer
Portal. Refer to the developer portal at https://developer-portal.hmpps.service.justice.gov.uk/products to find your
product id. This is configured in `helm_deploy/<project_name>/values.yaml`.

## Manually branding from template app

Run the `rename-project.bash` without any arguments. This will prompt for the six required parameters and create a PR.
The script requires a recent version of `bash` to be installed, as well as GNU `sed` in the path.
