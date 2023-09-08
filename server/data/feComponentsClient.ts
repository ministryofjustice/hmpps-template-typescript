import config from '../config'
import RestClient from './restClient'

export interface Component {
  html: string
  css: string[]
  javascript: string[]
}

export type AvailableComponent = 'header' | 'footer'

export default class FeComponentsClient {
  private static restClient(token: string): RestClient {
    return new RestClient('HMPPS Components Client', config.apis.frontendComponents, token)
  }

  getComponents<T extends AvailableComponent[]>(
    components: T,
    userToken: string,
  ): Promise<Record<T[number], Component>> {
    return FeComponentsClient.restClient(userToken).get({
      path: `/components`,
      query: `component=${components.join('&component=')}`,
      headers: { 'x-user-token': userToken },
    }) as Promise<Record<T[number], Component>>
  }
}
