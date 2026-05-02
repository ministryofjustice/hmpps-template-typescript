import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import ExampleApiClient from './exampleApiClient'
import config from '../config'

describe('ExampleApiClient', () => {
  let exampleApiClient: ExampleApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    exampleApiClient = new ExampleApiClient(mockAuthenticationClient)
  })

  afterEach(() => {
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('getCurrentTime', () => {
    it('should make a GET request to /example/time using system token and return the response body', async () => {
      // Arrange
      const expectedTime = '2025-01-01T12:00:00Z'

      nock(config.apis.exampleApi.url)
        .get('/example/time')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedTime, { 'Content-Type': 'text/plain' })

      // Act
      const response = await exampleApiClient.getCurrentTime()

      // Assert
      expect(response).toEqual(expectedTime)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledTimes(1)
    })
  })
})
