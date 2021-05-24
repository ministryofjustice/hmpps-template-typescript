import { Router } from 'express'
import csurf from 'csurf'
import auth from '../authentication/auth'
import tokenVerifier from '../data/tokenVerification'
import populateCurrentUser from '../middleware/populateCurrentUser'
import type UserService from '../services/userService'

const testMode = process.env.NODE_ENV === 'test'

export default function standardRouter(userService: UserService): Router {
  const router = Router({ mergeParams: true })

  router.use(auth.authenticationMiddleware(tokenVerifier))
  router.use(populateCurrentUser(userService))

  // CSRF protection
  if (!testMode) {
    router.use(csurf())
  }

  router.use((req, res, next) => {
    if (typeof req.csrfToken === 'function') {
      res.locals.csrfToken = req.csrfToken()
    }
    next()
  })

  return router
}
