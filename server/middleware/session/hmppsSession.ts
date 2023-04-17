import { RequestHandler } from 'express'
import session from 'express-session'
import HmppsSessionStore from './hmppsSessionStore'
import config from '../../config'

import { createClient } from 'redis'

export type RedisClient = ReturnType<typeof createClient>

export function hmppsSession(client: RedisClient): RequestHandler {
  return session({
    store: new HmppsSessionStore(client),
    cookie: { secure: config.https, sameSite: 'lax', maxAge: config.session.expiryMinutes * 60 * 1000 },
    secret: config.session.secret,
    resave: false, // redis implements touch so shouldn't need this
    saveUninitialized: false,
    rolling: true,
  })
}
