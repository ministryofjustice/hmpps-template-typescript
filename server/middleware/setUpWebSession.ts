import { v4 as uuidv4 } from 'uuid'
import { hmppsSession } from 'hmpps-central-session'
import session from 'express-session'
import RedisStore from 'connect-redis'
import express, { Router } from 'express'
import { createRedisClient } from '../data/redisClient'
import config from '../config'
import logger from '../../logger'

export default function setUpWebSession(): Router {
  const client = createRedisClient()
  client.connect().catch((err: Error) => logger.error(`Error connecting to Redis`, err))

  const router = express.Router()

  router.use(
    hmppsSession(client, {
      https: config.https,
      session: { secret: config.session.secret },
      sharedSession: {
        host: config.sharedRedis.host,
        password: '',
        port: config.sharedRedis.port,
        tls_enabled: 'false',
      },
    }),
  )

  // Update a value in the cookie so that the set-cookie will be sent.
  // Only changes every minute so that it's not sent with every request.
  router.use((req, res, next) => {
    req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
    next()
  })

  router.use((req, res, next) => {
    const headerName = 'X-Request-Id'
    const oldValue = req.get(headerName)
    const id = oldValue === undefined ? uuidv4() : oldValue

    res.set(headerName, id)
    req.id = id

    next()
  })

  return router
}
