import type { Express } from 'express'
import request from 'supertest'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import { appWithAllRoutes, user } from './testutils/appSetup'
import ExampleService from '../services/exampleService'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../services/exampleService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>
const exampleService = new ExampleService(null) as jest.Mocked<ExampleService>

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
    auditService.logPageView.mockResolvedValue(null)
    exampleService.getCurrentTime.mockResolvedValue('2025-01-01T12:00:00.000')

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('This site is under construction...')
        expect(res.text).toContain('The time is currently 2025-01-01T12:00:00.000')
        expect(auditService.logPageView).toHaveBeenCalledWith('EXAMPLE_PAGE', {
          who: user.username,
          correlationId: expect.any(String),
          subjectType: 'NOT_APPLICABLE',
        })
        expect(exampleService.getCurrentTime).toHaveBeenCalled()
      })
  })

  it('service errors are handled', () => {
    auditService.logPageView.mockResolvedValue(null)
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
