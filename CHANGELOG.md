# Change log

**January 9th 2024** – Move over to Gov UK Frontend 5.0 and MoJ Frontend 2.0

Note, this removed support for IE8,9,10 etc.

PR: [#297](https://github.com/ministryofjustice/hmpps-template-typescript/pull/297)

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
production.  This brings the template into line with the new micro frontend components header.

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
