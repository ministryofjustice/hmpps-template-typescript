import { DataTelemetry, EnvelopeTelemetry } from 'applicationinsights/out/Declarations/Contracts'
import { Contracts } from 'applicationinsights'
import { ignoredDependenciesProcessor, ignoredRequestsProcessor } from './azureAppInsights'

const createEnvelope = (properties: Record<string, string | boolean>, baseType = 'RequestData') =>
  ({
    data: {
      baseType,
      baseData: { properties },
    } as DataTelemetry,
  }) as EnvelopeTelemetry

describe('azureAppInsights', () => {
  describe('ignoredRequestsProcessor', () => {
    it.each([
      ['GET /assets/some.css', false],
      ['GET /health', false],
      ['GET /ping', false],
      ['GET /info', false],
      ['GET /something-else', true],
      ['GET /something-else/random', true],
      ['GET /sandwich/health/with-something-else', true],
    ])(`Request '%s' logged by app insights when request is successful: '%s'`, (name: string, logged: boolean) => {
      const envelope = createEnvelope({}, 'RequestData')
      const requestData = new Contracts.RequestData()
      requestData.name = name
      requestData.success = true
      envelope.data.baseData = requestData
      expect(ignoredRequestsProcessor(envelope)).toBe(logged)
    })

    it.each([
      'GET /assets/some.css',
      'GET /health',
      'GET /ping',
      'GET /info',
      'GET /something-else',
      'GET /something-else/random',
      'GET /sandwich/health/with-something-else',
    ])(`Request '%s' is logged by app insights when request is not successful`, (name: string) => {
      const envelope = createEnvelope({}, 'RequestData')
      const requestData = new Contracts.RequestData()
      requestData.name = name
      requestData.success = false
      envelope.data.baseData = requestData
      expect(ignoredRequestsProcessor(envelope)).toBe(true)
    })
  })

  describe('ignoredDependenciesProcessor', () => {
    it.each([
      ['sqs.eu-west-2.amazonaws.com', false],
      ['sqs.us-east-1.amazonaws.com', false],
      ['anything.else', true],
    ])(`Dependency '%s' logged by app insights when request is successful: '%s'`, (target: string, logged: boolean) => {
      const envelope = createEnvelope({}, 'RemoteDependencyData')
      const requestData = new Contracts.RemoteDependencyData()
      requestData.target = target
      requestData.success = true
      envelope.data.baseData = requestData
      expect(ignoredDependenciesProcessor(envelope)).toBe(logged)
    })

    it.each(['sqs.eu-west-2.amazonaws.com', 'sqs.us-east-1.amazonaws.com', 'anything.else'])(
      `Dependency '%s' is logged by app insights when request is not successful`,
      (target: string) => {
        const envelope = createEnvelope({}, 'RemoteDependencyData')
        const requestData = new Contracts.RemoteDependencyData()
        requestData.target = target
        requestData.success = false
        envelope.data.baseData = requestData
        expect(ignoredDependenciesProcessor(envelope)).toBe(true)
      },
    )
  })
})
