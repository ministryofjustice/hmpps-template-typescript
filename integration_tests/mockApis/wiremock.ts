import superagent, { type Response, type SuperAgentRequest } from 'superagent'

const url = process.env.WIREMOCK_URL ?? 'http://localhost:9091/__admin'

const stubFor = (mapping: Record<string, unknown>): SuperAgentRequest =>
  superagent.post(`${url}/mappings`).send(mapping)

const getMatchingRequests = (body: string | object) => superagent.post(`${url}/requests/find`).send(body)

const resetStubs = (): Promise<Array<Response>> =>
  Promise.all([superagent.post(`${url}/mappings/reset`), superagent.delete(`${url}/requests`)])

export { stubFor, getMatchingRequests, resetStubs }
