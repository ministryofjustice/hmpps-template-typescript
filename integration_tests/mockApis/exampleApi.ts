import type { SuperAgentRequest } from 'superagent'
import { stubFor, stubPing } from './wiremock'

export default {
  stubPing: (httpStatus = 200): SuperAgentRequest => stubPing('/example-api', httpStatus),

  stubExampleTime: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/example-api/example/time',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/text;charset=UTF-8' },
        body: '2025-01-01T12:00:00Z',
      },
    }),
}
