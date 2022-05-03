import promClient from 'prom-client'
import { createMetricsApp } from './monitoring/metricsApp'
import { createRedisClient } from './data/redisClient'
import createApp from './app'
import HmppsAuthClient from './data/hmppsAuthClient'
import TokenStore from './data/tokenStore'
import UserService from './services/userService'

promClient.collectDefaultMetrics()

const hmppsAuthClient = new HmppsAuthClient(new TokenStore(createRedisClient({ legacyMode: false })))
const userService = new UserService(hmppsAuthClient)

const app = createApp(userService)
const metricsApp = createMetricsApp()

export { app, metricsApp }
