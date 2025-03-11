import nock from 'nock'
import { Request } from 'express'
import config from '../config'
import TokenVerificationClient from './tokenVerificationClient'

describe('token verification api tests', () => {
  let fakeApi: nock.Scope
  let tokenVerificationClient: TokenVerificationClient

  beforeEach(() => {
    fakeApi = nock(config.apis.tokenVerification.url)
    tokenVerificationClient = new TokenVerificationClient()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('POST requests', () => {
    describe('Token verification disabled', () => {
      beforeAll(() => {
        config.apis.tokenVerification.enabled = false
      })

      it('Token is always considered valid (no API call)', async () => {
        fakeApi.post('/token/verify').reply(200, { active: true })

        const data = await tokenVerificationClient.verifyToken({} as Request)
        expect(data).toEqual(true)

        expect(nock.isDone()).toBe(false) // assert api was not called
      })
    })

    describe('Token verification enabled', () => {
      beforeEach(() => {
        config.apis.tokenVerification.enabled = true
      })

      it('Calls verify endpoint and parses active response', async () => {
        fakeApi.post('/token/verify').reply(200, { active: true })

        const data = await tokenVerificationClient.verifyToken({
          user: { token: 'some_token', username: 'john.doe' },
          verified: false,
        } as Request)

        expect(data).toEqual(true)
        expect(nock.isDone()).toBe(true) // assert api was called
      })

      it('Calls verify endpoint and parses inactive response', async () => {
        fakeApi.post('/token/verify').reply(200, { active: false })

        const data = await tokenVerificationClient.verifyToken({
          user: { token: 'some_token' },
          verified: false,
        } as Request)

        expect(data).toEqual(false)
      })

      it('Calls verify endpoint and parses empty response', async () => {
        fakeApi.post('/token/verify').reply(200, {})

        const data = await tokenVerificationClient.verifyToken({
          user: { token: 'some_token' },
          verified: false,
        } as Request)

        expect(data).toEqual(false)
      })

      it('Returns early when already verified (no API call)', async () => {
        fakeApi.post('/token/verify').reply(200, {})

        const data = await tokenVerificationClient.verifyToken({
          verified: true,
        } as Request)

        expect(data).toEqual(true)
        expect(nock.isDone()).toBe(false) // assert api was not called
      })
    })
  })
})
