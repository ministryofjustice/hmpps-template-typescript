import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import ExampleService from '../services/exampleService'
import ExampleApiClient from '../data/exampleApiClient'
import { Page } from '../journeys/example/types'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../services/exampleService')

describe('routes', () => {
  let app: Express
  let auditService: jest.Mocked<AuditService>
  let exampleService: jest.Mocked<ExampleService>

  beforeEach(() => {
    jest.resetAllMocks()
    auditService = jest.mocked(new AuditService({} as never))
    exampleService = jest.mocked(new ExampleService({} as ExampleApiClient))
    app = appWithAllRoutes({ services: { auditService, exampleService } })
  })

  it('should render the Forge journey when the example API succeeds', async () => {
    // Arrange
    auditService.logPageView.mockResolvedValue(undefined)
    exampleService.getCurrentTime.mockResolvedValue('2025-01-01T12:00:00.000')

    // Act
    const response = await request(app).get('/')

    // Assert
    expect(response.status).toBe(200)
    expect(response.text).toContain('This site is under construction...')
    expect(response.text).toContain('The time is currently 2025-01-01T12:00:00.000')
    expect(auditService.logPageView).toHaveBeenCalledWith(Page.EXAMPLE_PAGE, {
      who: user.username,
      correlationId: undefined,
    })
  })

  it('should render an error when the example API fails', async () => {
    // Arrange
    exampleService.getCurrentTime.mockRejectedValue(new Error('Some problem calling external api!'))

    // Act
    const response = await request(app).get('/')

    // Assert
    expect(response.status).toBe(500)
  })

  it('should audit the search and redirect when a search term is submitted', async () => {
    // Arrange
    const searchTerm = '12345'

    // Act
    const response = await request(app).post('/perform-search').send({ searchTerm })

    // Assert
    expect(response.status).toBe(302)
    expect(response.headers.location).toBe('/')
    expect(auditService.logAuditEvent).toHaveBeenCalledWith({
      correlationId: '4d0fd4da-ecc1-454d-8308-cdee6b8b91f7',
      details: { build: 'abc123', userRoles: [] },
      subjectId: searchTerm,
      subjectType: 'SEARCH_TERM',
      what: Page.SEARCH_OFFENDERS,
      who: user.username,
    })
  })
})
