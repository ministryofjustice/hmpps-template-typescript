import nock from 'nock'

import config from '../config'
import FeComponentsClient, { Component } from './feComponentsClient'

const token = { access_token: 'token-1', expires_in: 300 }

describe('feComponentsClient', () => {
  let fakeComponentsApi: nock.Scope
  let componentsClient: FeComponentsClient

  beforeEach(() => {
    fakeComponentsApi = nock(config.apis.frontendComponents.url)
    componentsClient = new FeComponentsClient()
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('getComponents', () => {
    it('should return data from api', async () => {
      const response: { data: { header: Component } } = {
        data: {
          header: {
            html: '<header></header>',
            css: [],
            javascript: [],
          },
        },
      }

      fakeComponentsApi
        .get('/components?component=header')
        .matchHeader('x-user-token', token.access_token)
        .reply(200, response)

      const output = await componentsClient.getComponents(['header'], token.access_token)
      expect(output).toEqual(response)
    })
  })
})
