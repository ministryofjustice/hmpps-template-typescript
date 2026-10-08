import crypto from 'crypto'
import express, { Router, Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import { IncomingMessage, ServerResponse } from 'http'
import config from '../config'

export default function setUpWebSecurity(): Router {
  const router = express.Router()

  // Secure code best practice - see:
  // 1. https://expressjs.com/en/advanced/best-practice-security.html,
  // 2. https://www.npmjs.com/package/helmet
  router.use((_req: Request, res: Response, next: NextFunction) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
    next()
  })

  const scriptSrc = [
    "'self'",
    (_req: IncomingMessage, res: ServerResponse) => `'nonce-${(res as Response).locals.cspNonce}'`,
  ]
  const styleSrc = [
    "'self'",
    (_req: IncomingMessage, res: ServerResponse) => `'nonce-${(res as Response).locals.cspNonce}'`,
  ]
  const fontSrc = ["'self'"]
  const imgSrc = ["'self'", 'data:']
  const connectSrc = ["'self'"]

  if (config.apis.probationApi.url) {
    scriptSrc.push(config.apis.probationApi.url)
    styleSrc.push(config.apis.probationApi.url)
    imgSrc.push(config.apis.probationApi.url)
    fontSrc.push(config.apis.probationApi.url)
    connectSrc.push(config.apis.probationApi.url)
  }

  router.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          // This nonce allows us to use scripts with the use of the `cspNonce` local, e.g (in a Nunjucks template):
          // <script nonce="{{ cspNonce }}">
          // or
          // <link href="http://example.com/" rel="stylesheet" nonce="{{ cspNonce }}">
          // This ensures only scripts we trust are loaded, and not anything injected into the
          // page by an attacker.
          scriptSrc,
          styleSrc,
          fontSrc,
          imgSrc,
          connectSrc,
          formAction: [`'self' ${config.apis.hmppsAuth.externalUrl}`],
          ...(config.production ? {} : { upgradeInsecureRequests: null }),
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  )
  return router
}
