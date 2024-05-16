import { Router } from 'express'
import auth from '../authentication/auth'
import tokenVerifier from '../data/tokenVerification'
import populateCurrentUser from './populateCurrentUser'

export default function setUpCurrentUser(): Router {
  const router = Router({ mergeParams: true })
  router.use(auth.authenticationMiddleware(tokenVerifier))
  router.use(populateCurrentUser())
  return router
}
