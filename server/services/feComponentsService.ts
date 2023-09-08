import FeComponentsClient, { AvailableComponent, Component } from '../data/feComponentsClient'

export default class FeComponentsService {
  constructor(private readonly feComponentsClient: FeComponentsClient) {}

  async getComponents<T extends AvailableComponent[]>(
    components: T,
    token: string,
  ): Promise<Record<T[number], Component>> {
    return this.feComponentsClient.getComponents(components, token)
  }
}
