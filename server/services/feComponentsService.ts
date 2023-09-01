import FeComponentsClient, { AvailableComponent, Component } from '../data/feComponentsClient'

export default class FeComponentsService {
  constructor(private readonly feComponentsClient: FeComponentsClient) {}

  async getComponent(component: AvailableComponent, token: string): Promise<Component> {
    return this.feComponentsClient.getComponent(component, token)
  }
}
