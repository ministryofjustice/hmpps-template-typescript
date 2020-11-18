import passport from 'passport'
import { Strategy } from 'passport-oauth2'
import type { Request, RequestHandler } from 'express'

import config from '../config'
import generateOauthClientToken from './clientCredentials'
import type { VerifiableRequest, TokenVerifier } from '../data/tokenVerification'

passport.serializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user)
})

passport.deserializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user)
})

export type AuthenticationMiddleware = (tokenVerifier: TokenVerifier) => RequestHandler

const authenticationMiddleware: AuthenticationMiddleware = verifyToken => {
  return async (req: VerifiableRequest, res, next) => {
    if (req.isAuthenticated() && (await verifyToken(req))) {
      return next()
    }
    req.session.returnTo = req.originalUrl
    return res.redirect('/login')
  }
}

export interface UserDetails {
  username: string
  token: string
  authSource: string
}

export interface UserRequest extends Request {
  user: UserDetails
}

function init(): void {
  const strategy = new Strategy(
    {
      authorizationURL: `${config.apis.hmppsAuth.externalUrl}/oauth/authorize`,
      tokenURL: `${config.apis.hmppsAuth.url}/oauth/token`,
      clientID: config.apis.hmppsAuth.apiClientId,
      clientSecret: config.apis.hmppsAuth.apiClientSecret,
      callbackURL: `${config.domain}/login/callback`,
      state: true,
      customHeaders: { Authorization: generateOauthClientToken() },
    },
    (token, refreshToken, params, profile, done) => {
      return done(null, { token, username: params.user_name, authSource: params.auth_source })
    }
  )

  passport.use(strategy)
}

export default {
  authenticationMiddleware,
  init,
}
