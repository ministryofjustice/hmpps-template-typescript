import express, { Request } from 'express'
import promBundle, { Opts } from 'express-prom-bundle'
import UrlValueParser from 'url-value-parser'

const metricsMiddleware = promBundle({
  autoregister: false,
  buckets: [0.5, 0.75, 0.95, 0.99, 1],
  httpDurationMetricName: 'http_server_requests_seconds',
  includeMethod: true,
  includePath: true,
  normalizePath,
})

export function normalizePath(req: Request, opts: Opts) {
  const standardPath = promBundle.normalizePath(req, opts)

  // bundle all asset paths together:
  if (standardPath.match(/^\/assets\/.+/)) return '/assets/#assetPath'

  // Parameterise routes, matching either on prisonerNumber (e.g. A1234AA) or a route parameter (e.g. :prisonerNumber)
  return new UrlValueParser({ extraMasks: [/^[A-Z|0-9]+/, /^:[^/]+/] }).replacePathValues(
    req.route?.path ?? standardPath,
    '#val',
  )
}

function metricsPort(): number {
  let port = 3000
  if (process.env.PORT != null) {
    port = Number(process.env.PORT)
  }
  return port + 1
}

function createMetricsApp(): express.Application {
  const metricsApp = express()
  metricsApp.use(metricsMiddleware.metricsMiddleware)
  metricsApp.set('port', metricsPort())
  return metricsApp
}

export { metricsMiddleware, createMetricsApp }
