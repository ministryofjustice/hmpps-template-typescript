import { DataTelemetry, EnvelopeTelemetry } from 'applicationinsights/out/Declarations/Contracts'
import { Contracts } from 'applicationinsights'
import {
  addUserDataToRequests,
  ContextObject,
  ignoredDependenciesProcessor,
  ignoredRequestsProcessor,
} from './azureAppInsights'
import { HmppsUser, PrisonUser } from '../interfaces/hmppsUser'

const exampleUser = {
  username: 'test-user',
  authSource: 'nomis',
} as HmppsUser

const createEnvelope = (properties: Record<string, string | boolean>, baseType = 'RequestData') =>
  ({
    data: {
      baseType,
      baseData: { properties },
    } as DataTelemetry,
  }) as EnvelopeTelemetry

const createContext = (user: HmppsUser) =>
  ({
    'http.ServerRequest': {
      res: {
        locals: {
          user,
        },
      },
    },
  }) as ContextObject

const context = createContext(exampleUser)

describe('azureAppInsights', () => {
  describe('addUserDataToRequests', () => {
    it('adds user data to properties when present', () => {
      const envelope = createEnvelope({ other: 'things' })

      addUserDataToRequests(envelope, context)

      expect(envelope.data.baseData.properties).toStrictEqual({
        username: exampleUser.username,
        authSource: exampleUser.authSource,
        other: 'things',
      })
    })

    it('adds activeCaseLoadId to properties for a prison user with this set', () => {
      const envelope = createEnvelope({ other: 'things' })

      addUserDataToRequests(envelope, createContext({ ...exampleUser, activeCaseLoadId: 'MDI' } as PrisonUser))

      expect(envelope.data.baseData.properties).toStrictEqual({
        username: exampleUser.username,
        authSource: exampleUser.authSource,
        activeCaseLoadId: 'MDI',
        other: 'things',
      })
    })

    it.each(['delius', 'external', 'azuread'])('handles %s users', (authSource: 'delius' | 'external' | 'azuread') => {
      const envelope = createEnvelope({ other: 'things' })

      addUserDataToRequests(envelope, createContext({ ...exampleUser, authSource }))

      expect(envelope.data.baseData.properties).toStrictEqual({
        username: exampleUser.username,
        authSource,
        other: 'things',
      })
    })

    it('handles absent user data', () => {
      const envelope = createEnvelope({ other: 'things' })

      addUserDataToRequests(envelope, createContext(undefined))

      expect(envelope.data.baseData.properties).toStrictEqual({ other: 'things' })
    })

    it('returns true when not RequestData type', () => {
      const envelope = createEnvelope({}, 'NOT_REQUEST_DATA')

      const response = addUserDataToRequests(envelope, context)

      expect(response).toStrictEqual(true)
    })

    it('handles when no properties have been set', () => {
      const envelope = createEnvelope(undefined)

      addUserDataToRequests(envelope, context)

      expect(envelope.data.baseData.properties).toStrictEqual(exampleUser)
    })

    it('handles missing user details', () => {
      const envelope = createEnvelope({ other: 'things' })

      addUserDataToRequests(envelope, {
        'http.ServerRequest': {},
      } as ContextObject)

      expect(envelope.data.baseData.properties).toEqual({
        other: 'things',
      })
    })
  })

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
