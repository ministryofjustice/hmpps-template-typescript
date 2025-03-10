import RestClient from '../data/restClient'
import config from '../config'
import { HmppsAuthClient } from '../data'

export default class ExampleApi {
  private readonly restClient = async () => {
    return new RestClient(
      'Example API - hmpps-template-kotlin',
      config.apis.exampleApi,
      await this.authClient.getSystemClientToken(),
    )
  }

  constructor(private readonly authClient: HmppsAuthClient) {}

  public async getCurrentTime() {
    return (await this.restClient()).get({
      path: '/example/time',
    })
  }
}
