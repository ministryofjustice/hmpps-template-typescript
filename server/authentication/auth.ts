import passport, { Strategy } from 'passport'
import { Strategy as OAuth2Strategy } from 'passport-oauth2'
import type { RequestHandler } from 'express'
import config from '../config'
import generateOauthClientToken from './clientCredentials'
import type { TokenVerifier } from '../data/tokenVerification'
import createUserToken from '../testutils/createUserToken'

passport.serializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user)
})

passport.deserializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user as Express.User)
})

export type AuthenticationMiddleware = (tokenVerifier: TokenVerifier) => RequestHandler

const authenticationMiddleware: AuthenticationMiddleware = verifyToken => {
  return async (req, res, next) => {
    if (req.isAuthenticated() && (await verifyToken(req))) {
      return next()
    }
    req.session.returnTo = req.originalUrl
    return res.redirect('/sign-in')
  }
}

function init(): void {
  const oauth2Strategy = new OAuth2Strategy(
    {
      authorizationURL: `${config.apis.hmppsAuth.externalUrl}/oauth/authorize`,
      tokenURL: `${config.apis.hmppsAuth.url}/oauth/token`,
      clientID: config.apis.hmppsAuth.apiClientId,
      clientSecret: config.apis.hmppsAuth.apiClientSecret,
      callbackURL: `${config.domain}/sign-in/callback`,
      state: true,
      customHeaders: { Authorization: generateOauthClientToken() },
    },
    (token, refreshToken, params, profile, done) => {
      return done(null, { token, username: params.user_name, authSource: params.auth_source })
    },
  )
  passport.use('oauth2', oauth2Strategy)

  const localStrategy = new (class extends Strategy {
    authenticate() {
      const payload = {
        user_name: 'user1',
        name: 'Test User',
        displayName: 'Test User',
        authorities: ['ROLE_USER'],
        authSource: 'nomis',
        active: true,
      }
      const token = createUserToken(payload)
      const roles = payload.authorities.map(authority => authority.replace(/^ROLE_/, ''))
      this.success({ token, roles, ...payload })
    }
  })()
  passport.use('local', localStrategy)
}

export default {
  authenticationMiddleware,
  init,
}
