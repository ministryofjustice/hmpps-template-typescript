import type { Request } from 'express'
import { RestClient, asUser } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'

export default class TokenVerificationClient extends RestClient {
  constructor() {
    super('Token Verification API', config.apis.tokenVerification, logger)
  }

  verifyToken(request: Request) {
    const { user, verified } = request

    if (!config.apis.tokenVerification.enabled) {
      logger.debug('Token verification disabled, returning token is valid')
      return true
    }

    if (verified) {
      return true
    }

    logger.debug(`Token request for user "${user.username}'`)

    return this.post({ path: `/token/verify` }, asUser(user.token))
      .then((response: { active: boolean }) => {
        if (response && response.active) {
          request.verified = true
          return true
        }

        return false
      })
      .catch((e) => {
        logger.debug(`Token verification failed for user "${user.username}'`)
        return false
      })
  }
}
