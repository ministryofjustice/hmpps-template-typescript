import ExampleApiClient from '../data/exampleApiClient'

export default class ExampleService {
  constructor(private readonly exampleApiClient: ExampleApiClient) {}

  getCurrentTime() {
    return this.exampleApiClient.getCurrentTime()
  }
}
