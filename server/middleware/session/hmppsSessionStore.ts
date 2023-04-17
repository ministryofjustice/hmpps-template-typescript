import { Cookie, SessionData, Store } from 'express-session'
import { RedisClient } from '../../data/redisClient'
import RedisStore from 'connect-redis'
import CentralSessionApiClient from './centralSessionApiClient'
import { HmppsAuthClient } from '../../data'

const noop = (_err?: unknown, _data?: any) => {}

interface CentralSession {
  cookie: Cookie
  passport: Record<string, unknown>
}

interface SplitSession {
  centralSessionData: CentralSession
  localSessionData: Record<string, unknown>
}

function splitSessionData(sess: SessionData): SplitSession {
  const { cookie, passport, ...localSessionData } = sess
  return {
    centralSessionData: { cookie, passport },
    localSessionData,
  }
}

class HmppsSessionStore extends Store {
  localStore: RedisStore
  hmppsAuthClient: HmppsAuthClient

  constructor(client: RedisClient, authClient: HmppsAuthClient) {
    super()
    this.localStore = new RedisStore({ client })
    this.hmppsAuthClient = authClient
  }

  // call to both local session and central session store to pull together the session data
  async get(sid: string, cb = noop) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const [centralSessionData, localSessionData] = await Promise.all([
      new CentralSessionApiClient(token).getCentralSession(sid),
      this.localStore.get(sid, cb),
    ])
    return {
      ...centralSessionData,
      ...localSessionData,
    }
  }

  // split up the session data - the token, username, authSource (passport.user) goes in the central session data
  async set(sid: string, sess: SessionData, cb = noop) {
    return this.localStore.set(sid, sess, cb)
  }

  async touch(sid: string, sess: SessionData, cb = noop) {
    return this.localStore.touch(sid, sess, cb)
  }

  async destroy(sid: string, cb = noop) {
    return this.localStore.destroy(sid, cb)
  }

  async clear(cb = noop) {
    return this.localStore.clear(cb)
  }

  async length(cb = noop) {
    return this.localStore.clear(cb)
  }

  async all(cb = noop) {
    return this.localStore.all(cb)
  }
}

export default HmppsSessionStore
