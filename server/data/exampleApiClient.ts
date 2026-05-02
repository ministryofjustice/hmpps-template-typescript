import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type { Response } from 'superagent'
import config from '../config'
import logger from '../logger'

export default class ExampleApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Example API', config.apis.exampleApi, logger, authenticationClient)
  }

  /**
   * Example: Making an anonymous request with a system token
   *
   * Use this pattern to call the API with a system token that is not tied to a specific user.
   * This is useful for service-to-service authorization when no user context is required.
   *
   */
  async getCurrentTime(): Promise<string> {
    const response = await this.get<Response>({ path: '/example/time', raw: true, responseType: 'text' }, asSystem())
    const responseBody: unknown = response.body

    if (typeof response.text === 'string') {
      return response.text
    }

    if (typeof responseBody === 'string') {
      return responseBody
    }

    if (Buffer.isBuffer(responseBody)) {
      return responseBody.toString('utf8')
    }

    throw new Error('Example API returned an unsupported current time response')
  }

  /**
   * Example: Making a request with the user's own token
   *
   * Use this pattern to call the API with a user's access token.
   * This is useful when authorization depends on the user's roles and permissions.
   *
   * Example:
   * ```
   * import { asUser } from '@ministryofjustice/hmpps-rest-client'
   *
   * getCurrentTime(token: string) {
   *   return this.get({ path: '/example/time' }, asUser(token))
   * }
   * ```
   */

  /**
   * Example: Making a request with a system token for a specific user
   *
   * Use this pattern to call the API with a system token tied to a specific user.
   * This is typically used for auditing purposes to track system-initiated actions on behalf of a user.
   *
   * Example:
   * ```
   * import { asSystem } from '@ministryofjustice/hmpps-rest-client'
   *
   * getCurrentTime(username: string) {
   *   return this.get({ path: '/example/time' }, asSystem(username))
   * }
   * ```
   */
}
