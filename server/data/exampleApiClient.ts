import {
  RestClient,
  TokenStore,
  getSystemClientTokenFromHmppsAuth,
  asSystem,
} from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'

export default class ExampleApiClient extends RestClient {
  constructor(tokenStore: TokenStore) {
    super('Example API', config.apis.exampleApi, logger, (username: string) =>
      getSystemClientTokenFromHmppsAuth(config.apis.hmppsAuth, tokenStore, logger, username),
    )
  }

  getCurrentTime() {
    return this.get({ path: '/example/time' }, asSystem())
  }

  /**
   * If wanting to make a call using the User's access token
   *
   * import { asUser } from '@ministryofjustice/hmpps-rest-client'
   *
   *   getCurrentTime(token: string) {
   *     return this.get({ path: '/example/time' }, asUser(token))
   *   }
   */

  /**
   * If wanting to make a call using a System token,
   * tied to a User (i.e. for backend auditing purposes)
   *
   * import { asUser } from '@ministryofjustice/hmpps-rest-client'
   *
   *   getCurrentTime(username: string) {
   *     return this.get({ path: '/example/time' }, asSystem(username))
   *   }
   */
}
