import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'

export type AvailableComponent = 'header' | 'footer'

export default class ProbationClient extends RestClient {
  constructor() {
    super('Probation API', config.apis.frontendComponents, logger)
  }

  async getComponents<T extends AvailableComponent[]>(components: T, userToken: string) {
    console.log('rest client', this)
    console.log('config', config.apis.frontendComponents)
    console.log('user token', userToken)
    return this.get<string>({
            path: `/api/components`,
            query: `component=${components.join('&component=')}`,
            headers: { 'x-user-token': userToken }
        })
  }
}
