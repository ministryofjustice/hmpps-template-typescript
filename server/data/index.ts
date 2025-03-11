/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'

const applicationInfo = applicationInfoSupplier()
initialiseAppInsights()
buildAppInsightsClient(applicationInfo)

import { createRedisClient } from './redisClient'
import RedisTokenStore from './tokenStore/redisTokenStore'
import InMemoryTokenStore from './tokenStore/inMemoryTokenStore'
import config from '../config'
import HmppsAuditClient from './hmppsAuditClient'
import ExampleApiClient from './exampleApiClient'
import HmppsAuthTokenClient from './hmppsAuthTokenClient'

export const dataAccess = () => {
  const tokenStore = config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore()
  const hmppsAuthTokenClient = new HmppsAuthTokenClient(tokenStore)

  return {
    applicationInfo,
    hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
    exampleApiClient: new ExampleApiClient(hmppsAuthTokenClient),
  }
}

export type DataAccess = ReturnType<typeof dataAccess>

export { ExampleApiClient, HmppsAuditClient }
