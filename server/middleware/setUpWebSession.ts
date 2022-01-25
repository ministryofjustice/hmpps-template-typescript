import { v4 as uuidv4 } from 'uuid'
import session from 'express-session'
import connectRedis, { Client } from 'connect-redis'
import express, { Router } from 'express'
import { createRedisClient } from '../data/redisClient'
import config from '../config'

const RedisStore = connectRedis(session)

export default function setUpWebSession(): Router {
  const client = createRedisClient(true)
  client.connect()

  const router = express.Router()
  router.use(
    session({
      store: new RedisStore({ client: client as unknown as Client }),
      cookie: { secure: config.https, sameSite: 'lax', maxAge: config.session.expiryMinutes * 60 * 1000 },
      secret: config.session.secret,
      resave: false, // redis implements touch so shouldn't need this
      saveUninitialized: false,
      rolling: true,
    })
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
