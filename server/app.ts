import express from 'express'

import addRequestId from 'express-request-id'
import helmet from 'helmet'
import noCache from 'nocache'
import csurf from 'csurf'
import path from 'path'
import compression from 'compression'
import createError from 'http-errors'
import flash from 'connect-flash'
import passport from 'passport'
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'

import auth from './authentication/auth'
import indexRoutes from './routes'
import healthcheck from './services/healthCheck'
import nunjucksSetup from './utils/nunjucksSetup'
import config from './config'
import errorHandler from './errorHandler'
import standardRouter from './routes/standardRouter'
import authorisationMiddleware from './middleware/authorisationMiddleware'
import type UserService from './services/userService'

const version = Date.now().toString()
const production = process.env.NODE_ENV === 'production'
const testMode = process.env.NODE_ENV === 'test'
const RedisStore = connectRedis(session)

export default function createApp(userService: UserService): express.Application {
  const app = express()

  auth.init()

  app.set('json spaces', 2)

  // Configure Express for running behind proxies
  // https://expressjs.com/en/guide/behind-proxies.html
  app.set('trust proxy', true)

  // View Engine Configuration
  app.set('view engine', 'njk')

  nunjucksSetup(app, path)

  // Server Configuration
  app.set('port', process.env.PORT || 3000)

  // Secure code best practice - see:
  // 1. https://expressjs.com/en/advanced/best-practice-security.html,
  // 2. https://www.npmjs.com/package/helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          // Hash allows inline script pulled in from https://github.com/alphagov/govuk-frontend/blob/master/src/govuk/template.njk
          scriptSrc: ["'self'", 'code.jquery.com', "'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='"],
          styleSrc: ["'self'", 'code.jquery.com'],
          fontSrc: ["'self'"],
        },
      },
    })
  )

  app.use(addRequestId())

  const client = redis.createClient({
    port: config.redis.port,
    password: config.redis.password,
    host: config.redis.host,
    tls: config.redis.tls_enabled === 'true' ? {} : false,
  })

  app.use(
    session({
      store: new RedisStore({ client }),
      cookie: { secure: config.https, sameSite: 'lax', maxAge: config.session.expiryMinutes * 60 * 1000 },
      secret: config.session.secret,
      resave: false, // redis implements touch so shouldn't need this
      saveUninitialized: false,
      rolling: true,
    })
  )

  app.use(passport.initialize())
  app.use(passport.session())

  // Request Processing Configuration
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use(flash())

  // Resource Delivery Configuration
  app.use(compression())

  // Cachebusting version string
  if (production) {
    // Version only changes on reboot
    app.locals.version = version
  } else {
    // Version changes every request
    app.use((req, res, next) => {
      res.locals.version = Date.now().toString()
      return next()
    })
  }

  //  Static Resources Configuration
  const cacheControl = { maxAge: config.staticResourceCacheDuration * 1000 }
  ;[
    '/assets',
    '/assets/stylesheets',
    '/assets/js',
    '/node_modules/govuk-frontend/govuk/assets',
    '/node_modules/govuk-frontend',
    '/node_modules/@ministryofjustice/frontend/moj/assets',
    '/node_modules/@ministryofjustice/frontend',
    '/node_modules/jquery/dist',
  ].forEach(dir => {
    app.use('/assets', express.static(path.join(process.cwd(), dir), cacheControl))
  })
  ;['/node_modules/govuk_frontend_toolkit/images'].forEach(dir => {
    app.use('/assets/images/icons', express.static(path.join(process.cwd(), dir), cacheControl))
  })
  ;['/node_modules/jquery/dist/jquery.min.js'].forEach(dir => {
    app.use('/assets/js/jquery.min.js', express.static(path.join(process.cwd(), dir), cacheControl))
  })

  // Express Routing Configuration
  app.get('/health', (req, res, next) => {
    healthcheck(result => {
      if (!result.healthy) {
        res.status(503)
      }
      res.json(result)
    })
  })
  app.get('/ping', (req, res) =>
    res.send({
      status: 'UP',
    })
  )

  // GovUK Template Configuration
  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'HMPPS Typescript Template'

  app.use((req, res, next) => {
    res.locals.user = req.user
    next()
  })

  // Don't cache dynamic resources
  app.use(noCache())

  // CSRF protection
  if (!testMode) {
    app.use(csurf())
  }

  // Update a value in the cookie so that the set-cookie will be sent.
  // Only changes every minute so that it's not sent with every request.
  app.use((req, res, next) => {
    req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
    next()
  })

  app.get('/autherror', (req, res) => {
    res.status(401)
    return res.render('autherror')
  })

  app.get('/login', passport.authenticate('oauth2'))

  app.get('/login/callback', (req, res, next) =>
    passport.authenticate('oauth2', {
      successReturnToOrRedirect: req.session.returnTo || '/',
      failureRedirect: '/autherror',
    })(req, res, next)
  )

  const authLogoutUrl = `${config.apis.hmppsAuth.externalUrl}/logout?client_id=${config.apis.hmppsAuth.apiClientId}&redirect_uri=${config.domain}`

  app.use('/logout', (req, res) => {
    if (req.user) {
      req.logout()
      req.session.destroy(() => res.redirect(authLogoutUrl))
      return
    }
    res.redirect(authLogoutUrl)
  })

  app.use(authorisationMiddleware())
  app.use('/', indexRoutes(standardRouter(userService)))
  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
