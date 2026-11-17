import pdsComponents from '@ministryofjustice/hmpps-probation-frontend-components'
import logger from '../../logger'
import config from '../config'

export default function setUpFrontendComponents() {
  return pdsComponents.getPageComponents({
    pdsUrl: config.apis.probationApi.url,
    timeoutOptions: config.apis.probationApi.timeout,
    logger,
  })
}
