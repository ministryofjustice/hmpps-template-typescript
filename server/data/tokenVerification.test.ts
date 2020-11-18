import nock from 'nock'

import verifyToken, { VerifiableRequest } from './tokenVerification'
import config from '../config'

describe('token verification api tests', () => {
  let fakeApi

  beforeEach(() => {
    fakeApi = nock(config.apis.tokenVerification.url)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('POST requests', () => {
    describe('Token verification disabled', () => {
      beforeAll(() => {
        config.apis.tokenVerification.enabled = false
      })

      it('Token always considered valid', async () => {
        fakeApi.post('/token/verify', '').reply(200, { active: true })
        const data = await verifyToken({} as VerifiableRequest)
        expect(data).toEqual(true)
        expect(nock.isDone()).toBe(false) // assert api was not called
      })
    })

    describe('Token Verification enabled', () => {
      beforeEach(() => {
        config.apis.tokenVerification.enabled = true
      })
      it('Calls verify and parses response', async () => {
        fakeApi.post('/token/verify', '').reply(200, { active: true })
        const data = await verifyToken({ user: {}, verified: false } as VerifiableRequest)
        expect(data).toEqual(true)
        expect(nock.isDone()).toBe(true) // assert api was called
      })

      it('Calls verify and parses inactive response', async () => {
        fakeApi.post('/token/verify', '').reply(200, { active: false })
        const data = await verifyToken({ user: {}, verified: false } as VerifiableRequest)
        expect(data).toEqual(false)
      })

      it('Calls verify and parses no response', async () => {
        fakeApi.post('/token/verify', '').reply(200, {})
        const data = await verifyToken({ user: {}, verified: false } as VerifiableRequest)
        expect(data).toEqual(false)
      })

      it('Already verified', async () => {
        fakeApi.post('/token/verify', '').reply(200, {})
        const data = await verifyToken({ verified: true } as VerifiableRequest)
        expect(data).toEqual(true)
        expect(nock.isDone()).toBe(false) // assert api was not called
      })
    })
  })
})
