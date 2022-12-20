/* istanbul ignore file */

import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'

import { createRedisClient } from '../data/redisClient'

const redisClient = createRedisClient({ legacyMode: false })

const redisStore = new RedisStore({
  sendCommand: async (...args: Array<string>) => {
    if (!redisClient.isOpen) {
      await redisClient.connect()
    }
    return redisClient.sendCommand(args)
  },
})

const rateLimiter = (opts: { windowMs: number; maxRequests: number }) =>
  rateLimit({
    windowMs: opts.windowMs,
    max: opts.maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    store: redisStore,
  })

export default rateLimiter
