import { beforeEach, Mocked, vi, expect, it, describe } from 'vitest'
import ExampleApiClient from '../data/exampleApiClient'
import ExampleService from './exampleService'

vi.mock('../data/exampleApiClient')

describe('ExampleService', () => {
  const exampleApiClient = new ExampleApiClient(null) as Mocked<ExampleApiClient>
  let exampleService: ExampleService

  beforeEach(() => {
    exampleService = new ExampleService(exampleApiClient)
  })

  it('should call getCurrentTime on the api client and return its result', async () => {
    const expectedTime = '2025-01-01T12:00:00Z'

    exampleApiClient.getCurrentTime.mockResolvedValue(expectedTime)

    const result = await exampleService.getCurrentTime()

    expect(exampleApiClient.getCurrentTime).toHaveBeenCalledTimes(1)
    expect(result).toEqual(expectedTime)
  })
})
