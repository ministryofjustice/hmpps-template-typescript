import nock from 'nock'
import config from '../config'
import HmppsAuthTokenClient from './hmppsAuthTokenClient'
import TokenStore from './tokenStore/tokenStore'
import RedisTokenStore from './tokenStore/redisTokenStore'

jest.mock('./tokenStore/redisTokenStore')

describe('HmppsAuthTokenClient', () => {
  let fakeHmppsAuthApi: nock.Scope
  let hmppsAuthTokenClient: HmppsAuthTokenClient
  let tokenStore: jest.Mocked<TokenStore>

  const username = 'Bob'
  const token = { access_token: 'token-1', expires_in: 300 }

  beforeEach(() => {
    fakeHmppsAuthApi = nock(config.apis.hmppsAuth.url)
    tokenStore = new RedisTokenStore(null) as jest.Mocked<RedisTokenStore>
    hmppsAuthTokenClient = new HmppsAuthTokenClient(tokenStore)
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('getToken', () => {
    it('should instantiate the redis client', async () => {
      tokenStore.getToken.mockResolvedValue(token.access_token)
      await hmppsAuthTokenClient.getToken(username)
    })

    it('should return token from tokenStore if one exists', async () => {
      tokenStore.getToken.mockResolvedValue(token.access_token)

      const output = await hmppsAuthTokenClient.getToken(username)

      expect(output).toEqual(token.access_token)
      expect(tokenStore.getToken).toHaveBeenCalledWith('Bob')
      expect(tokenStore.setToken).not.toHaveBeenCalled()
    })

    it('should call HMPPS Auth and return token when none is in tokenStore (with username)', async () => {
      tokenStore.getToken.mockResolvedValue(null)
      fakeHmppsAuthApi
        .post('/oauth/token', 'grant_type=client_credentials&username=Bob')
        .basicAuth({
          user: config.apis.hmppsAuth.systemClientId,
          pass: config.apis.hmppsAuth.systemClientSecret,
        })
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .reply(200, token)

      const output = await hmppsAuthTokenClient.getToken(username)

      expect(output).toEqual(token.access_token)
      expect(tokenStore.setToken).toHaveBeenCalledWith('Bob', token.access_token, token.expires_in - 60)
    })

    it('should call HMPPS Auth and return token when none is in tokenStore (without username)', async () => {
      tokenStore.getToken.mockResolvedValue(null)
      fakeHmppsAuthApi
        .post('/oauth/token', 'grant_type=client_credentials')
        .basicAuth({
          user: config.apis.hmppsAuth.systemClientId,
          pass: config.apis.hmppsAuth.systemClientSecret,
        })
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .reply(200, token)

      const output = await hmppsAuthTokenClient.getToken()

      expect(output).toEqual(token.access_token)
      expect(tokenStore.setToken).toHaveBeenCalledWith('%ANONYMOUS%', token.access_token, token.expires_in - 60)
    })
  })
})