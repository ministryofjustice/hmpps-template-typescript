import express from 'express'
import createError from 'http-errors'
import { Forge } from '@ministryofjustice/hmpps-forge/core'
import { ExpressFrameworkAdapter } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import { govukComponents } from '@ministryofjustice/hmpps-forge/govuk-components'
import { mojComponents } from '@ministryofjustice/hmpps-forge/moj-components'
import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import { appInsightsMiddleware } from './utils/azureAppInsights'
import setUpCsrf from './middleware/setUpCsrf'
// TODO: Disabled these middleware as they are HMPPS Auth specific
// import authorisationMiddleware from './middleware/authorisationMiddleware'
// import setUpAuthentication from './middleware/setUpAuthentication'
// import setUpCurrentUser from './middleware/setUpCurrentUser'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'
import type { Services } from './services'
import examplePackage from './journeys/example'
import logger from './logger'

export default function createApp(services: Services): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(appInsightsMiddleware())
  app.use(setUpHealthChecks(services.applicationInfo))
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  const nunjucksEnv = nunjucksSetup(app)

  const forge = new Forge({
    frameworkAdapter: ExpressFrameworkAdapter.configure({ nunjucksEnv }),
    logger,
  })
  forge.registerGlobalComponents(govukComponents)
  forge.registerGlobalComponents(mojComponents)
  forge.registerPackage(examplePackage, {
    auditService: services.auditService,
    exampleService: services.exampleService,
  })

  // TODO: Disabled these middleware as they are HMPPS Auth specific
  // app.use(setUpAuthentication())
  // app.use(authorisationMiddleware())
  // app.use(setUpCurrentUser())
  app.use(setUpCsrf())

  app.use(forge.getRouter() as express.Router)

  app.use((_req, _res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
