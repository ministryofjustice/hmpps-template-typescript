# Change log

**November 5th 2024** - Disable 301 redirects on missing static content folders

Previously a non-existent static resource returned a 301 without the appropriate CSP response header.
Now it will return a 404 with the correct header. This was an issue flagged by ZAP

See PR [#383](https://github.com/ministryofjustice/hmpps-template-typescript/pull/383)

**October 29th 2024** - Move to node 22

Node 22 is now LTS. Notes [here](https://nodejs.org/en/blog/announcements/v22-release-announce)

See PR [#474](https://github.com/ministryofjustice/hmpps-template-typescript/pull/474)

**September 25th 2024** - Removing dependency on dotenv

Removing dependency on [dotenv](https://www.npmjs.com/package/dotenv).
Use Node's `-env-file` [mechanism](https://nodejs.org/dist/latest-v20.x/docs/api/cli.html#--env-fileconfig) instead of requiring the dotenv module.

See PR [#441](https://github.com/ministryofjustice/hmpps-template-typescript/pull/441)

**September 25th 2024** - Removing dependency on uuid

Removing dependency on [uuid](https://www.npmjs.com/package/uuid).
Use Node's `crypto.randomUUID()` instead of requiring the uuid module - there's no need if just using v4 UUIDs.

See PR [#439](https://github.com/ministryofjustice/hmpps-template-typescript/pull/439)

**September 19th 2024** - Renaming config domain

The `config.domain` property has been renamed to `config.ingressUrl` to reflect the fact that it should be set to a URL
rather than just a domain name.

See PR [#435](https://github.com/ministryofjustice/hmpps-template-typescript/pull/435)

**September 6th 2024** - Authentication and credentials tidy-up

We have recently tidied up some of the authentication process. To begin with, we added default credentials in HMPPS Auth
(PR: [hmpps-auth#1777](https://github.com/ministryofjustice/hmpps-auth/pull/1777)) to support the template project
out of the box. The necessary updates for using these credentials were made in
PR: [#412](https://github.com/ministryofjustice/hmpps-template-typescript/pull/412) and
PR: [#414](https://github.com/ministryofjustice/hmpps-template-typescript/pull/414). We also updated the documentation
to clarify the OIDC/OAuth2 process.

Additionally, we cleaned up both the authentication middleware and the user details population middleware. These changes
can be found in PR: [#413](https://github.com/ministryofjustice/hmpps-template-typescript/pull/413) and
PR: [#415](https://github.com/ministryofjustice/hmpps-template-typescript/pull/415).

As part of this change we also renamed the env var names used for configuring our client's credentials. It was felt that the previous names were confusing/misleading.

We've now renamed the client that is used to authenticate new users using the auth code oauth2 grant:

```
API_CLIENT_ID -> AUTH_CODE_CLIENT_ID
API_CLIENT_SECRET -> AUTH_CODE_CLIENT_SECRET
```

and we've renamed the client used to request tokens using the client credentials grant as follows:

```
SYSTEM_CLIENT_ID -> CLIENT_CREDS_CLIENT_ID
SYSTEM_CLIENT_SECRET -> CLIENT_CREDS_CLIENT_SECRET
```

---

**July 13th 2024** - ESBuild and asset caching improvements

We have recently introduced several enhancements to the ESBuild process to improve stability, logging, and basic type annotations. These are part of

PR: [#388](https://github.com/ministryofjustice/hmpps-template-typescript/pull/388) and PR: [#378](https://github.com/ministryofjustice/hmpps-template-typescript/pull/378)

Additionally, we have integrated a new and improved process for handling asset cache-busting. Previously, we appended a query string representing the build number or Git commit hash to our assets for cache-busting. With the recent introduction of ESBuild, we have implemented a more common asset-revving solution, using the hash of the asset in the asset's output filename, like `/assets/js/app.UG7VY7MS.js`.

In brief, this implementation creates a `manifest.json` file during the asset build process, which maps the original asset name to it's new rev'd name. We then use the assetMap filter, introduced as part of this PR, to match the original asset names to their hashed versions, like so

`<script type="module" src="{{ '/assets/js/app.js' | assetMap }}"></script>`

To see the full conversation see the #typescript slack channel

PR: [#377](https://github.com/ministryofjustice/hmpps-template-typescript/pull/377)

---

**July 11th 2024** – Remove Typescript outdated checks

We originally added these checks to the template project to try to nudge people into performing major version updates rather than solely focusing on security patches.
This has led to a lot of confusion and queries from teams asking why we're enforcing these draconian checks.
Previously we added some guidance suggesting developers remove it but this was not generally read.

Rather than add to the complexity of the rewrite script we've decided to remove these checks entirely.

PR: [#388](https://github.com/ministryofjustice/hmpps-template-typescript/pull/388)

---

**June 19th 2024** – Add ESBuild!

This is a bit of a WiP but rapidly speeds up the time to redeploy on changes. It does that by running typescript compiler in a side channel.
It's worth adopting now but there are subsequent commits and changes that will continue to be integrated to improve this.

To see the full conversation see the #typescript slack channel

PR: [#375](https://github.com/ministryofjustice/hmpps-template-typescript/pull/375)

---

**May 22nd 2024** – Remove prometheus metrics middleware and metrics app. We had discussed that very few teams actually go on to set up a dashboard to surface the information and tend to use application insights instead for the information. In addition it had also caused a memory leak and production issues (manifesting in increased 502 error rates) in at least two applications that had inherited from the template so it seems wise to remove this tooling by default.

PR: [#365](https://github.com/ministryofjustice/hmpps-template-typescript/pull/365)

---

**May 10th 2024** – Derive user details from the `authorization_code` "user" token instead of making an API call to `hmpps-manage-users-api`, thereby removing an unnecessary dependency.

PR: [#352](https://github.com/ministryofjustice/hmpps-template-typescript/pull/352)

---

**February 29th 2024** – Use same node version for outdated check and security scan. This currently defaults to node 16

PR: [#321](https://github.com/ministryofjustice/hmpps-template-typescript/pull/321)

---

**February 15th 2024** – Move over to use Debian 12 based image (bookworm)

PR: [#316](https://github.com/ministryofjustice/hmpps-template-typescript/pull/316)

---

**January 9th 2024** – Move over to Gov UK Frontend 5.0 and MoJ Frontend 2.0

Note, this removed support for IE8,9,10 etc.

PR: [#297](https://github.com/ministryofjustice/hmpps-template-typescript/pull/297)

---

**November 29th 2023** – Remove getUserRoles as an api call and add as decoded from the token #274

This is to encourage services not to make additional calls to retrieve a user's role information.
Usually roles are cached with the session meaning that the user has to log out and in again to bring in changes to roles - as user details are also cached this will not change this behaviour.

PR: [#274](https://github.com/ministryofjustice/hmpps-template-typescript/pull/274)

---

**November 29th 2023** – Use in-memory token store when developing locally

PR: [#273](https://github.com/ministryofjustice/hmpps-template-typescript/pull/273)

---

**November 6th 2023** – Add HMPPS Manage Users API to health checks

PR: [#255](https://github.com/ministryofjustice/hmpps-template-typescript/pull/255)

---

**October 27th 2023** – Update to 4.0.0 of `jwt-decode` module

This had breaking changes and required an update to the import statement

PR: [#252](https://github.com/ministryofjustice/hmpps-template-typescript/pull/252)

---

**October 27th 2023** – Update application to use node.js version 20 and npm version 10

Application updated to node 20.8 along with one minor node module tweaks

PR: [#249](https://github.com/ministryofjustice/hmpps-template-typescript/pull/249)

---

**October 25th 2023** – Replace deprecated HMPPS Auth API endpoints with calls to HMPPS Manage Users API

`/api/user/me` -> `/users/me` <br>
`/api/user/me/roles` -> `/users/me/roles`

PR: [#247](https://github.com/ministryofjustice/hmpps-template-typescript/pull/247)

---

**October 4th 2023** – Improve REST client and propagate user types into `res.locals`

The base REST client now supports GET, DELETE, PATCH, POST, PUT methods all allowing query parameters
and generic response types.

The user object built by `setUpCurrentUser` middleware is exposed in `res.locals` of request handlers
preventing the need for type assertions.

PR: [#238](https://github.com/ministryofjustice/hmpps-template-typescript/pull/238)

---

**September 28th 2023** - Add in environment name to the header

For dev and pre-prod we now display the environment name in the header to let people know that the service isn't
production. This brings the template into line with the new micro frontend components header.

---

**September 22nd 2023** - Ensure health/info endpoints are the same information as the Kotlin templates

As part of the work on the [service catalogue](https://hmpps-developer-portal.hmpps.service.justice.gov.uk/products) we are trying to ensure all services and applications present standard `/health` and `/info` endpoints. As the Kotlin template is provided with a standard set of information as part of Spring Boot, it made sense to make sure the Typrscript template was made to match. This ensures these endpoints can be processed programmatically without needing to know what format the information is being presented.

For more details ask on the `#hmpps-service-catalogue channel`.

PR: [here](https://github.com/ministryofjustice/hmpps-template-typescript/pull/231)

---

**August 3rd 2023** - Add /info endpoint and expose product ids

As part of the work on the [service catalogue](https://hmpps-developer-portal.hmpps.service.justice.gov.uk/products) we are giving all applications their own product id.
This change adds a new info endpoint to expose this id in a consistent place.

For more details ask on the `#hmpps-service-catalogue channel`.

PR: [here](https://github.com/ministryofjustice/hmpps-template-typescript/pull/212)

---

**June 9th 2023** - Do not retry POST requests by default

It's not safe to retry idempotent calls as this introduces the risk of creating multiple resources. This fix changes the default to not carry out any retries but allows switching on retrying if desired.

PR: [here](https://github.com/ministryofjustice/hmpps-template-typescript/pull/197)

---

**April 13th 2023** - Caching fix

Asset caching was only set to 20 seconds. This fix changes the default to 1 hour which has a profound effect on the number of requests the application serves.

PR: [here](https://github.com/ministryofjustice/hmpps-template-typescript/pull/178)

---

**April 4th 2023** - Remove unnecessary build step

There was an additional unnecessary build step as part of start:dev npm task. This more than doubled the start time on the initial run.

PR: [here](https://github.com/ministryofjustice/hmpps-template-typescript/pull/172)

---

**March 20th 2023** - CSP fix for redirects during POST on session timeout

Updates the Content Security Policy to fix issues when users would be stuck on pages after submitting a form after their session times out. (Lots more detail in the PR)

PR: [here](https://github.com/ministryofjustice/hmpps-template-typescript/pull/170)

---

**February 3rd 2023** - Revert multi build docker image

Multibuild docker images ended up taking a very long time after the upgrade to node 18 (1hr+). Some work needs to be done to move to support multi host builds in our circle orb, in the meantime we’ve removed this and are just building images solely for deployment.

PR: [here](https://github.com/ministryofjustice/hmpps-template-typescript/pull/149)
