import type { RequestHandler } from 'express'
import pdsComponents from '@ministryofjustice/hmpps-probation-frontend-components'
import logger from '../../logger'
import config from '../config'
import setUpFrontendComponents from './setUpFrontendComponents'

jest.mock('@ministryofjustice/hmpps-probation-frontend-components', () => ({
  __esModule: true,
  default: {
    getPageComponents: jest.fn(),
  },
}))

describe('setUpFrontendComponents', () => {
  const getPageComponents = pdsComponents.getPageComponents as jest.Mock
  const middleware = jest.fn() as unknown as RequestHandler

  beforeEach(() => {
    jest.resetAllMocks()
    getPageComponents.mockReturnValue(middleware)
  })

  it('returns middleware from getPageComponents configured with probation API settings', () => {
    const result = setUpFrontendComponents()

    expect(getPageComponents).toHaveBeenCalledWith({
      pdsUrl: config.apis.probationApi.url,
      timeoutOptions: config.apis.probationApi.timeout,
      logger,
    })
    expect(result).toBe(middleware)
  })

  it('uses the COMPONENT_API_URL from config for pdsUrl', () => {
    setUpFrontendComponents()

    expect(getPageComponents.mock.calls[0][0].pdsUrl).toBe(
      'https://probation-frontend-components-dev.hmpps.service.justice.gov.uk',
    )
  })
})
