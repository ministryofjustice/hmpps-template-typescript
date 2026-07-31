import superagent, { SuperAgentRequest, Response } from 'superagent'

const url = 'http://localhost:9091/__admin'

/**
 * Incomplete definition of options used for creating a new stub mapping
 * https://wiremock.org/docs/standalone/admin-api-reference/#tag/Stub-Mappings/operation/createNewStubMapping
 */
interface Mapping {
  request?: {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
    queryParameters?: Record<string, { equalTo: string } | { matches: string }>
    bodyPatterns?: ({ contains: string } | { equalToJson: unknown })[]
  } & ({ url?: string } | { urlPath: string } | { urlPathPattern: string } | { urlPattern: string })
  response?: {
    status?: number
    headers?: Record<string, string>
  } & ({ jsonBody?: unknown } | { body: string } | { base64Body: string })
}

export const stubFor = (mapping: Mapping): SuperAgentRequest => superagent.post(`${url}/mappings`).send(mapping)

export const stubPing = (urlPrefix: string, httpStatus = 200): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: `${urlPrefix}/health/ping`,
    },
    response: {
      status: httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
    },
  })

/**
 * Incomplete definition of options used for searching requests
 * https://wiremock.org/docs/standalone/admin-api-reference/#tag/Requests/operation/findRequestsByCriteria
 */
type FindRequestCriteria = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
} & ({ url?: string } | { urlPath: string } | { urlPathPattern: string } | { urlPattern: string })

/**
 * Incomplete definition of requests found
 * https://wiremock.org/docs/standalone/admin-api-reference/#tag/Requests/operation/findRequestsByCriteria
 */
interface FoundRequest {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  url: string
  absoluteUrl: string
  headers: Record<string, string>
  queryParams: Record<string, { key: string; values: string[] }>
  body: string
  bodyAsBase64: string
}

export const getMatchingRequests = (body: FindRequestCriteria): Promise<FoundRequest[]> =>
  superagent
    .post(`${url}/requests/find`)
    .send(body)
    .then(data => data.body.requests)

export const resetStubs = (): Promise<Response[]> =>
  Promise.all([superagent.delete(`${url}/mappings`), superagent.delete(`${url}/requests`)])
