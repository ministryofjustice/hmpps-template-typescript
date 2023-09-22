import healthCheck from './healthCheck'
import type { ApplicationInfo } from '../applicationInfo'
import type { HealthCheckCallback, HealthCheckService } from './healthCheck'

describe('Healthcheck', () => {
  const testAppInfo: ApplicationInfo = {
    applicationName: 'test',
    buildNumber: '1',
    gitRef: 'long ref',
    gitShortHash: 'short ref',
    branchName: 'main',
  }

  it('Healthcheck reports healthy', done => {
    const successfulChecks = [successfulCheck('check1'), successfulCheck('check2')]

    const callback: HealthCheckCallback = result => {
      expect(result).toEqual(
        expect.objectContaining({
          status: 'UP',
          components: {
            check1: {
              status: 'UP',
              details: 'some message',
            },
            check2: {
              status: 'UP',
              details: 'some message',
            },
          },
        }),
      )
      done()
    }

    healthCheck(testAppInfo, callback, successfulChecks)
  })

  it('Healthcheck reports unhealthy', done => {
    const successfulChecks = [successfulCheck('check1'), erroredCheck('check2')]

    const callback: HealthCheckCallback = result => {
      expect(result).toEqual(
        expect.objectContaining({
          status: 'DOWN',
          components: {
            check1: {
              status: 'UP',
              details: 'some message',
            },
            check2: {
              status: 'DOWN',
              details: 'some error',
            },
          },
        }),
      )
      done()
    }

    healthCheck(testAppInfo, callback, successfulChecks)
  })
})

function successfulCheck(name: string): HealthCheckService {
  return () =>
    Promise.resolve({
      name: `${name}`,
      status: 'UP',
      message: 'some message',
    })
}

function erroredCheck(name: string): HealthCheckService {
  return () =>
    Promise.resolve({
      name: `${name}`,
      status: 'DOWN',
      message: 'some error',
    })
}
