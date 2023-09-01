import FeComponentsService from './feComponentsService'
import FeComponentsClient, { Component } from '../data/feComponentsClient'

jest.mock('../data/feComponentsClient')

const token = 'some token'

describe('Components service', () => {
  let componentsClient: jest.Mocked<FeComponentsClient>
  let componentsService: FeComponentsService

  describe('getComponent', () => {
    beforeEach(() => {
      componentsClient = new FeComponentsClient() as jest.Mocked<FeComponentsClient>
      componentsService = new FeComponentsService(componentsClient)
    })

    it('Retrieves and returns requested component', async () => {
      const componentValue: Component = {
        html: '<header></header>',
        css: [],
        javascript: [],
      }

      componentsClient.getComponent.mockResolvedValue(componentValue)

      const result = await componentsService.getComponent('header', token)

      expect(result).toEqual(componentValue)
    })

    it('Propagates error', async () => {
      componentsClient.getComponent.mockRejectedValue(new Error('some error'))

      await expect(componentsService.getComponent('header', token)).rejects.toEqual(new Error('some error'))
    })
  })
})
