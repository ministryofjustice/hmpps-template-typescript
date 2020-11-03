import HmppsAuthClient from '../hmppsAuthClient'

const MockedHmppsAuthClient = <jest.Mock<HmppsAuthClient>>HmppsAuthClient

jest.mock('../hmppsAuthClient')
jest.mock('redis', () => ({
  createClient: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  })),
}))

export default MockedHmppsAuthClient
