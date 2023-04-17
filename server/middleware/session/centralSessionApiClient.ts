import RestClient from './restClient'
import { AgentConfig } from '../../config'
import { SessionData } from 'express-session'

const hardcodedApiConfig = {
  url: 'http://localhost:1234',
  timeout: { response: 5000, deadline: 5000 },
  agent: new AgentConfig(5000),
}

export default class CentralSessionApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Central Session API', hardcodedApiConfig, token)
  }

  private async get(args: object): Promise<unknown> {
    try {
      return await this.restClient.get<unknown>(args)
    } catch (error) {
      return error
    }
  }

  async getCentralSession(sid: string): Promise<SessionData> {
    return this.get<SessionData>({
      path: `/session`,
    })
  }
}
