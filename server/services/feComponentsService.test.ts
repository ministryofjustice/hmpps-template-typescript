import FeComponentsService from './feComponentsService'
import FeComponentsClient, { AvailableComponent, Component } from '../data/feComponentsClient'

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
      const componentValue: Record<AvailableComponent, Component> = {
        header: {
          html: '<header></header>',
          css: [],
          javascript: [],
        },
        footer: {
          html: '<footer></footer>',
          css: [],
          javascript: [],
        },
      }

      componentsClient.getComponents.mockResolvedValue(componentValue)

      const result = await componentsService.getComponents(['header'], token)

      expect(result).toEqual(componentValue)
    })

    it('Propagates error', async () => {
      componentsClient.getComponents.mockRejectedValue(new Error('some error'))

      await expect(componentsService.getComponents(['header'], token)).rejects.toEqual(new Error('some error'))
    })
  })
})
