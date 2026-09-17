import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import {
  expectErrorOutcome,
  expectRedirectOutcome,
  expectRenderOutcome,
  ForgeTestClient,
  ForgeTestHarness,
  TestRequestOptions,
} from '@ministryofjustice/hmpps-forge/core/testing'
import ExampleService from '../../services/exampleService'
import examplePackage from './index'
import { Page } from './types'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../../services/exampleService')

describe('exampleJourney', () => {
  let client: ForgeTestClient
  let auditService: jest.Mocked<AuditService>
  let exampleService: jest.Mocked<ExampleService>
  let requestOptions: TestRequestOptions

  beforeEach(() => {
    jest.resetAllMocks()
    auditService = jest.mocked(AuditService.prototype)
    exampleService = jest.mocked(ExampleService.prototype)
    requestOptions = {
      session: {},
      state: {
        user: { username: 'user1', userRoles: [] },
        requestId: 'request123',
      },
    }
    client = new ForgeTestHarness()
      .registerPackage(examplePackage, {
        auditService,
        exampleService,
        applicationInfo: {
          applicationName: 'hmpps-template-typescript',
          buildNumber: '123',
          gitRef: 'abc123',
          gitShortHash: 'abc',
          productId: 'DPSXYZ',
          branchName: 'main',
        },
      })
      .createClient()
  })

  it('should load the current time and audit the page when the example API succeeds', async () => {
    // Arrange
    auditService.logPageView.mockResolvedValue(undefined)
    exampleService.getCurrentTime.mockResolvedValue('2025-01-01T12:00:00.000')

    // Act
    const result = await client.get('/', requestOptions)

    // Assert
    expectRenderOutcome(result)
    expect(result.context.data.currentTime).toBe('2025-01-01T12:00:00.000')
    expect(auditService.logPageView).toHaveBeenCalledWith(Page.EXAMPLE_PAGE, {
      who: 'user1',
      correlationId: 'request123',
    })
  })

  it('should return an error when the example API fails', async () => {
    // Arrange
    exampleService.getCurrentTime.mockRejectedValue(new Error('Some problem calling external api!'))

    // Act
    const result = await client.get('/', requestOptions)

    // Assert
    expectErrorOutcome(result)
    expect(result.error.message).toContain('Some problem calling external api!')
  })

  it('should audit the search and redirect when a search term is submitted', async () => {
    // Arrange
    const searchTerm = '12345'

    // Act
    const result = await client.post('/', { ...requestOptions, body: { searchTerm } })

    // Assert
    expectRedirectOutcome(result)
    expect(result.url).toBe('/')
    expect(auditService.logAuditEvent).toHaveBeenCalledWith({
      correlationId: 'request123',
      details: { build: 'abc123', userRoles: [] },
      subjectId: searchTerm,
      subjectType: 'SEARCH_TERM',
      what: Page.SEARCH_OFFENDERS,
      who: 'user1',
    })
  })

  it('should show a validation error without auditing when the search term is empty', async () => {
    // Arrange
    exampleService.getCurrentTime.mockResolvedValue('2025-01-01T12:00:00.000')

    // Act
    const result = await client.post('/', { ...requestOptions, body: { searchTerm: '' } })

    // Assert
    expectRenderOutcome(result)
    expect(result.getValidationErrorsByFieldCode('searchTerm')).toEqual([
      expect.objectContaining({ message: 'Enter a search term' }),
    ])
    expect(auditService.logAuditEvent).not.toHaveBeenCalled()
  })
})
