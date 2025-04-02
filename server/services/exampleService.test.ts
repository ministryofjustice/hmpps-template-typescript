import ExampleApiClient from '../data/exampleApiClient'
import ExampleService from './exampleService'

describe('ExampleService', () => {
  let exampleApiClient: Partial<ExampleApiClient>
  let exampleService: ExampleService

  beforeEach(() => {
    exampleApiClient = {
      getCurrentTime: jest.fn(),
    }

    exampleService = new ExampleService(exampleApiClient as ExampleApiClient)
  })

  it('should call getCurrentTime on the api client and return its result', async () => {
    const expectedTime = { time: '2025-01-01T12:00:00Z' }

    ;(exampleApiClient.getCurrentTime as jest.Mock).mockResolvedValue(expectedTime)

    const result = await exampleService.getCurrentTime()

    expect(exampleApiClient.getCurrentTime).toHaveBeenCalledTimes(1)
    expect(result).toEqual(expectedTime)
  })
})
