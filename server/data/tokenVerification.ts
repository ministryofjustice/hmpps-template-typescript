import superagent from 'superagent'
import { Request } from 'express'
import getSanitisedError from '../sanitisedError'
import config from '../config'
import logger from '../../log'

function getApiClientToken(token: string) {
  return superagent
    .post(`${config.apis.tokenVerification.url}/token/verify`)
    .auth(token, { type: 'bearer' })
    .timeout(config.apis.tokenVerification.timeout)
    .then(response => Boolean(response.body && response.body.active))
    .catch(error => {
      logger.error(getSanitisedError(error), 'Error calling tokenVerificationApi')
    })
}

export interface VerifiableRequest extends Request {
  verified?: boolean
  user: {
    username: string
    token: string
  }
}

export type TokenVerifier = (request: VerifiableRequest) => Promise<boolean | void>

const tokenVerifier: TokenVerifier = async request => {
  const { user, verified } = request

  if (!config.apis.tokenVerification.enabled) {
    logger.debug('Token verification disabled, returning token is valid')
    return true
  }

  if (verified) {
    return true
  }

  logger.debug(`token request for user "${user.username}'`)

  const result = await getApiClientToken(user.token)
  if (result) {
    request.verified = true
  }
  return result
}

export default tokenVerifier
