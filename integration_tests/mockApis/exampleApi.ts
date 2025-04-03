import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export default {
  stubExamplePing: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/example-api/health/ping',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
      },
    }),
  stubExampleTime: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/example-api/example/time',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/text;charset=UTF-8' },
        body: '2025-01-01T12:00:00Z',
      },
    }),
}
