# Change log

**August 3rd 2023** - Add /info endpoint and expose product ids  

As part of the work on the [service catalogue](https://hmpps-developer-portal.hmpps.service.justice.gov.uk/products) we are giving all applications there own product id.
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
