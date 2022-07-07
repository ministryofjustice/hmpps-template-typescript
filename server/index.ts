import promClient from 'prom-client'
import { createMetricsApp } from './monitoring/metricsApp'
import createApp from './app'
import { services } from './services'

promClient.collectDefaultMetrics()

const app = createApp(services())
const metricsApp = createMetricsApp()

export { app, metricsApp }
