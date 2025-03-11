import { URLSearchParams } from 'url'
import superagent from 'superagent'
import { AuthenticationClient } from '@ministryofjustice/hmpps-rest-client'
import TokenStore from './tokenStore/tokenStore'
import config from '../config'
import logger from '../../logger'

export default class HmppsAuthTokenClient implements AuthenticationClient {
  private readonly authConfig = config.apis.hmppsAuth

  constructor(private readonly tokenStore: TokenStore) {}

  async getToken(username?: string): Promise<string> {
    const key = username || '%ANONYMOUS%'
    const existingToken = await this.tokenStore.getToken(key)

    if (existingToken) {
      return existingToken
    }

    const clientToken = Buffer.from(`${this.authConfig.systemClientId}:${this.authConfig.systemClientSecret}`).toString(
      'base64',
    )

    const grantRequest = new URLSearchParams({
      grant_type: 'client_credentials',
      ...(username && { username }),
    }).toString()

    logger.info(`${grantRequest} HMPPS Auth request for client id '${this.authConfig.systemClientId}'`)

    const response = await superagent
      .post(`${this.authConfig.url}/oauth/token`)
      .set('Authorization', `Basic ${clientToken}`)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(grantRequest)
      .timeout(this.authConfig.timeout)

    const newToken = response.body.access_token
    const expiresIn = response.body.expires_in - 60

    await this.tokenStore.setToken(key, newToken, expiresIn)

    return newToken
  }
}
