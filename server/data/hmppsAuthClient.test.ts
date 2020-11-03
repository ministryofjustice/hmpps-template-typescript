import nock from 'nock'
import redis from 'redis'

import config from '../config'
import HmppsAuthClient from './hmppsAuthClient'

const username = 'Bob'
const token = { access_token: 'token-1', expires_in: 300 }

jest.mock('redis', () => ({
  createClient: jest.fn().mockReturnThis(),
  on: jest.fn(),
  get: jest.fn(),
  set: jest.fn().mockImplementation((key, value, command, ttl, callback) => callback(null, null)),
}))

function givenRedisResponse(storedToken: string) {
  redis.get.mockImplementation((key, callback) => callback(null, storedToken))
}

describe('hmppsAuthClient', () => {
  let fakeHmppsAuthApi: nock.Scope
  let hmppsAuthClient: HmppsAuthClient

  beforeEach(() => {
    fakeHmppsAuthApi = nock(config.apis.hmppsAuth.url)
    hmppsAuthClient = new HmppsAuthClient()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getUser', () => {
    it('should return data from api', async () => {
      const response = { data: 'data' }

      fakeHmppsAuthApi
        .get('/api/user/me')
        .matchHeader('authorization', `Bearer ${token.access_token}`)
        .reply(200, response)

      const output = await hmppsAuthClient.getUser(token.access_token)
      expect(output).toEqual(response)
    })
  })

  describe('getUserRoles', () => {
    it('should return data from api', async () => {
      fakeHmppsAuthApi
        .get('/api/user/me/roles')
        .matchHeader('authorization', `Bearer ${token.access_token}`)
        .reply(200, [{ roleCode: 'role1' }, { roleCode: 'role2' }])

      const output = await hmppsAuthClient.getUserRoles(token.access_token)
      expect(output).toEqual(['role1', 'role2'])
    })
  })

  describe('getSystemClientToken', () => {
    it('should instantiate the redis client', async () => {
      givenRedisResponse(token.access_token)
      await hmppsAuthClient.getSystemClientToken(username)
      expect(redis.createClient).toBeCalledTimes(1)
    })

    it('should return token from redis if one exists', async () => {
      givenRedisResponse(token.access_token)
      const output = await hmppsAuthClient.getSystemClientToken(username)
      expect(output).toEqual(token.access_token)
    })

    it('should return token from HMPPS Auth with username', async () => {
      givenRedisResponse(null)

      fakeHmppsAuthApi
        .post(`/oauth/token`, 'grant_type=client_credentials&username=Bob')
        .basicAuth({ user: config.apis.hmppsAuth.systemClientId, pass: config.apis.hmppsAuth.systemClientSecret })
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .reply(200, token)

      const output = await hmppsAuthClient.getSystemClientToken(username)

      expect(output).toEqual(token.access_token)
      expect(redis.set).toBeCalledWith('Bob', token.access_token, 'EX', 240, expect.any(Function))
    })

    it('should return token from HMPPS Auth without username', async () => {
      givenRedisResponse(null)

      fakeHmppsAuthApi
        .post(`/oauth/token`, 'grant_type=client_credentials')
        .basicAuth({ user: config.apis.hmppsAuth.systemClientId, pass: config.apis.hmppsAuth.systemClientSecret })
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .reply(200, token)

      const output = await hmppsAuthClient.getSystemClientToken()

      expect(output).toEqual(token.access_token)
      expect(redis.set).toBeCalledWith('Bob', token.access_token, 'EX', 240, expect.any(Function))
    })
  })
})
