import express, { Express } from 'express'
import { NotFound } from 'http-errors'

import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import { Forge } from '@ministryofjustice/hmpps-forge/core'
import { createExpressRouter } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import { govukComponents } from '@ministryofjustice/hmpps-forge/govuk-components'
import { mojComponents } from '@ministryofjustice/hmpps-forge/moj-components'
import routes from '../routes'
import ExampleService from '../services/exampleService'
import type ExampleApiClient from '../data/exampleApiClient'
import type { ApplicationInfo } from '../applicationInfo'
import examplePackage from '../journeys/example'
import nunjucksSetup from '../utils/nunjucksSetup'
import errorHandler from '../errorHandler'
import type { Services } from '../services'
import { HmppsUser } from '../interfaces/hmppsUser'
import setUpWebSession from '../middleware/setUpWebSession'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../services/exampleService')

export const user: HmppsUser = {
  name: 'FIRST LAST',
  userId: 'id',
  userUuid: '11111111-1111-1111-1111-111111111111',
  token: 'token',
  username: 'user1',
  displayName: 'First Last',
  authSource: 'nomis',
  staffId: 1234,
  userRoles: [],
}

const applicationInfo: ApplicationInfo = {
  applicationName: 'hmpps-template-typescript',
  buildNumber: '123',
  gitRef: 'abc123',
  gitShortHash: 'abc',
  productId: 'DPSXYZ',
  branchName: 'main',
}

export const flashProvider = jest.fn()

function appSetup(services: Services, production: boolean, userSupplier: () => HmppsUser): Express {
  const app = express()

  app.set('view engine', 'njk')

  const nunjucksEnv = nunjucksSetup(app)

  const forge = new Forge({})
  forge.registerGlobalComponents(govukComponents)
  forge.registerGlobalComponents(mojComponents)
  forge.registerPackage(examplePackage, {
    auditService: services.auditService,
    exampleService: services.exampleService,
  })

  app.use(setUpWebSession())
  app.use((req, res, next) => {
    req.user = userSupplier() as Express.User
    req.flash = flashProvider
    res.locals = {
      user: { ...req.user } as HmppsUser,
      cspNonce: '',
      csrfToken: '',
      asset_path: '',
      applicationName: '',
      environmentName: '',
      environmentNameColour: '',
    }
    next()
  })
  app.use((req, _res, next) => {
    req.id = '4d0fd4da-ecc1-454d-8308-cdee6b8b91f7'
    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(routes(services))
  app.use(createExpressRouter(forge, { nunjucksEnv }))
  app.use((_req, _res, next) => next(new NotFound()))
  app.use(errorHandler(production))

  return app
}

export function appWithAllRoutes({
  production = false,
  services = {},
  userSupplier = () => user,
}: {
  production?: boolean
  services?: Partial<Services>
  userSupplier?: () => HmppsUser
}): Express {
  return appSetup(
    {
      applicationInfo,
      auditService: new AuditService({} as never),
      exampleService: new ExampleService({} as ExampleApiClient),
      ...services,
    },
    production,
    userSupplier,
  )
}
