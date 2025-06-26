import { DataTelemetry, EnvelopeTelemetry } from 'applicationinsights/out/Declarations/Contracts'
import { addUserDataToRequests, ContextObject } from './azureAppInsights'

const user = {
  activeCaseLoadId: 'LII',
  username: 'test-user',
}

const createEnvelope = (properties: Record<string, string | boolean>, baseType = 'RequestData') =>
  ({
    data: {
      baseType,
      baseData: { properties },
    } as DataTelemetry,
  }) as EnvelopeTelemetry

const createContext = (username: string, activeCaseLoadId: string) =>
  ({
    'http.ServerRequest': {
      res: {
        locals: {
          user: {
            username,
            activeCaseLoadId,
          },
        },
      },
    },
  }) as ContextObject

const context = createContext(user.username, user.activeCaseLoadId)

describe('azure-appinsights', () => {
  describe('addUserDataToRequests', () => {
    it('adds user data to properties when present', () => {
      const envelope = createEnvelope({ other: 'things' })

      addUserDataToRequests(envelope, context)

      expect(envelope.data.baseData.properties).toStrictEqual({
        ...user,
        other: 'things',
      })
    })

    it('handles absent user data', () => {
      const envelope = createEnvelope({ other: 'things' })

      addUserDataToRequests(envelope, createContext(undefined, user.activeCaseLoadId))

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

      expect(envelope.data.baseData.properties).toStrictEqual(user)
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
})
