import jwt from 'jsonwebtoken'
import { stubFor, getMatchingRequests } from './wiremock'

export interface UserToken {
  name?: string
  roles?: string[]
  authSource?: 'nomis' | 'delius'
}

function createToken(userToken: UserToken) {
  const payload = {
    name: userToken.name || 'john smith',
    user_name: 'USER1',
    scope: ['read', 'write'],
    auth_source: 'nomis',
    authorities: userToken.roles,
    jti: 'a610a10-cca6-41db-985f-e87efb303aaf',
    client_id: 'clientid',
  }

  return jwt.sign(payload, 'secret', { expiresIn: '1h' })
}

export default {
  getSignInUrl: (): Promise<string> =>
    getMatchingRequests({
      method: 'GET',
      urlPath: '/auth/oauth/authorize',
    }).then(data => {
      const { requests } = data.body
      const stateValue = requests[requests.length - 1].queryParams.state.values[0]
      return `/sign-in/callback?code=codexxxx&state=${stateValue}`
    }),

  favicon: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/favicon.ico',
      },
      response: {
        status: 200,
      },
    }),

  stubPing: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/auth/health/ping',
      },
      response: {
        status: 200,
      },
    }),

  stubSignInPage: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/auth/oauth/authorize\\?response_type=code&redirect_uri=.+?&state=.+?&client_id=clientid',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          Location: 'http://localhost:3007/sign-in/callback?code=codexxxx&state=stateyyyy',
        },
        body: '<html lang="en"><body>Dummy Sign in page<h1>Sign in</h1></body></html>',
      },
    }),

  stubSignOutPage: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/auth/sign-out.*',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
        body: '<html lang="en"><body>Dummy Sign in page<h1>Sign in</h1></body></html>',
      },
    }),

  stubManageDetailsPage: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/auth/account-details.*',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
        body: '<html><body><h1>Your account details</h1></body></html>',
      },
    }),

  token: (userToken: UserToken) =>
    stubFor({
      request: {
        method: 'POST',
        urlPattern: '/auth/oauth/token',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          Location: 'http://localhost:3007/sign-in/callback?code=codexxxx&state=stateyyyy',
        },
        jsonBody: {
          access_token: createToken(userToken),
          token_type: 'bearer',
          auth_source: userToken.authSource,
          user_name: 'USER1',
          expires_in: 599,
          scope: 'read',
          internalUser: true,
        },
      },
    }),
}
