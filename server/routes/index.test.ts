import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import ExampleService from '../services/exampleService'
import HmppsAuditClient from '../data/hmppsAuditClient'
import ExampleApiClient from '../data/exampleApiClient'

jest.mock('../services/auditService')
jest.mock('../services/exampleService')

const auditService = new AuditService({} as HmppsAuditClient) as jest.Mocked<AuditService>
const exampleService = new ExampleService({} as ExampleApiClient) as jest.Mocked<ExampleService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      exampleService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render index page', () => {
    auditService.logPageView.mockResolvedValue(undefined)
    exampleService.getCurrentTime.mockResolvedValue('2025-01-01T12:00:00.000')

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('This site is under construction...')
        expect(res.text).toContain('The time is currently 2025-01-01T12:00:00.000')
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.EXAMPLE_PAGE, {
          who: user.username,
          correlationId: expect.any(String),
        })
        expect(exampleService.getCurrentTime).toHaveBeenCalled()
      })
  })

  it('service errors are handled', () => {
    auditService.logPageView.mockResolvedValue(undefined)
    exampleService.getCurrentTime.mockRejectedValue(new Error('Some problem calling external api!'))

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Some problem calling external api!')
      })
  })
})

describe('GET /perform-search', () => {
  it('should render index page', () => {
    exampleService.getCurrentTime.mockResolvedValue('2025-01-01T12:00:00.000')

    return request(app)
      .get('/perform-search?searchTerm=12345')
      .expect('Content-Type', /text\/plain/)
      .expect(302)
      .expect('Location', '/')
      .expect(() => {
        expect(auditService.logAuditEvent).toHaveBeenCalledWith({
          correlationId: '4d0fd4da-ecc1-454d-8308-cdee6b8b91f7',
          details: { build: 'abc123', userRoles: [] },
          subjectId: '12345',
          subjectType: 'SEARCH_TERM',
          what: 'SEARCH_OFFENDERS',
          who: 'user1',
        })
      })
  })
})
