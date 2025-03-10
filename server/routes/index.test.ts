import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import ExampleApi from '../services/exampleApi'

jest.mock('../services/auditService')
jest.mock('../services/exampleApi')

const auditService = new AuditService(null) as jest.Mocked<AuditService>
const exampleApi = new ExampleApi(null) as jest.Mocked<ExampleApi>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      exampleApi,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render index page', () => {
    auditService.logPageView.mockResolvedValue(null)
    exampleApi.getCurrentTime.mockResolvedValue(null)

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('This site is under construction...')
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.EXAMPLE_PAGE, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })
})
