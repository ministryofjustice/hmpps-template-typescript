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

import HmppsAuthClient from './hmppsAuthClient'
import { createRedisClient } from './redisClient'
import RedisTokenStore from './tokenStore/redisTokenStore'
import InMemoryTokenStore from './tokenStore/inMemoryTokenStore'
import config from '../config'
import HmppsAuditClient from './hmppsAuditClient'
import ExampleApiClient from './exampleApiClient'

type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => {
  const tokenStore = config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore()

  return {
    applicationInfo,
    tokenStore,
    hmppsAuthClient: new HmppsAuthClient(tokenStore),
    hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
    exampleApiClient: new ExampleApiClient(tokenStore),
  }
}

export type DataAccess = ReturnType<typeof dataAccess>

export { HmppsAuthClient, RestClientBuilder, HmppsAuditClient }
