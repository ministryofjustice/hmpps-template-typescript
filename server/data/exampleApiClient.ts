import { RestClient, TokenStore, getSystemClientTokenFromHmppsAuth } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'

export default class ExampleApiClient extends RestClient {
  constructor(tokenStore: TokenStore) {
    super('Example API', config.apis.exampleApi, logger, (username: string) =>
      getSystemClientTokenFromHmppsAuth(config.apis.hmppsAuth, tokenStore, logger, username),
    )
  }
}
